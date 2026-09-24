import { afterEach, describe, expect, it, vi } from "vitest";
import {
  APPLICATION_ID_RE,
  newApplicationId,
  storagePrefix,
  submitApplication,
  uploadApplicationFiles,
} from "../partner-application";

// The invariant under test is not cosmetic: cue-app/storage.rules gates every
// anonymous /partner/apply upload on `applicationId.matches('^[A-Za-z0-9]{20}$')`.
// An id that drifts from that shape (a UUID, say) silently breaks menu and
// photo uploads in production with a rules denial.
describe("newApplicationId", () => {
  it("matches the shape storage.rules accepts", () => {
    for (let i = 0; i < 500; i++) {
      const id = newApplicationId();
      expect(id).toHaveLength(20);
      expect(APPLICATION_ID_RE.test(id)).toBe(true);
    }
  });

  it("does not repeat", () => {
    const ids = new Set(Array.from({ length: 2000 }, () => newApplicationId()));
    expect(ids.size).toBe(2000);
  });

  it("uses the whole alphabet", () => {
    const seen = new Set(Array.from({ length: 2000 }, () => newApplicationId()).join(""));
    expect(seen.size).toBe(62);
  });
});

describe("APPLICATION_ID_RE", () => {
  it("rejects ids the Storage rules would reject", () => {
    for (const bad of [
      "550e8400-e29b-41d4-a716-446655440000", // crypto.randomUUID()
      "short",
      "a".repeat(21),
      "abcdefghijklmnopqrs/", // path segment escape
      "abcdefghijklmnopqr.s",
      "abcdefghijklmnopqr s",
      "",
    ]) {
      expect(APPLICATION_ID_RE.test(bad)).toBe(false);
    }
  });
});

describe("storagePrefix", () => {
  it("is the prefix the form uploads under", () => {
    const id = newApplicationId();
    expect(storagePrefix(id)).toBe(`partner-applications/${id}/`);
  });
});

const ticket = { url: "https://api.example.test/api/v1/partners/applications/abc/files", token: "tok.1" };
const fetchMock = vi.fn();
const menu = new File(["%PDF-1.4"], "menu.pdf", { type: "application/pdf" });
const photos = [
  new File(["a"], "a.jpg", { type: "image/jpeg" }),
  new File(["b"], "b.png", { type: "image/png" }),
];
const reply = (status: number, body: unknown = {}) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
const refusal = (status: number, reason: string) =>
  reply(status, { code: status === 409 ? "conflict" : "invalid-argument", reason, message: "x", fields: null });

function stubFetch() {
  vi.stubGlobal("fetch", fetchMock);
  vi.spyOn(console, "error").mockImplementation(() => {});
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  fetchMock.mockReset();
});

describe("uploadApplicationFiles", () => {
  it("posts one multipart body to the ticket URL with the token header: menu once, photos repeated", async () => {
    stubFetch();
    fetchMock.mockResolvedValue(reply(200, { menu: true, photos: 2 }));
    expect(await uploadApplicationFiles(ticket, menu, photos)).toBeNull();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe(ticket.url);
    expect(init.method).toBe("POST");
    expect(init.headers).toEqual({ "X-Cue-Upload-Token": "tok.1" });
    const body = init.body as FormData;
    expect(body.getAll("menu").map((f) => (f as File).name)).toEqual(["menu.pdf"]);
    expect(body.getAll("photos").map((f) => (f as File).name)).toEqual(["a.jpg", "b.png"]);
    // No service key, no cookie: the token is the whole credential.
    expect(init.credentials).toBeUndefined();
  });

  it("sends no menu part when there is only photos", async () => {
    stubFetch();
    fetchMock.mockResolvedValue(reply(200));
    await uploadApplicationFiles(ticket, null, photos.slice(0, 1));
    const body = (fetchMock.mock.calls[0][1] as RequestInit).body as FormData;
    expect(body.has("menu")).toBe(false);
    expect(body.getAll("photos")).toHaveLength(1);
  });

  it.each([
    ["too-many-photos", 400, null, photos, "photoCount"],
    ["file-too-large", 413, menu, [], "menuSize"],
    ["file-too-large", 413, null, photos, "photoSize"],
    ["file-too-large", 413, menu, photos, "upload"],
    ["unsupported-media-type", 415, menu, [], "menuType"],
    ["unsupported-media-type", 415, null, photos, "photoType"],
    ["files-already-uploaded", 409, menu, [], "upload"],
    ["invalid-upload-token", 401, menu, [], "upload"],
  ] as const)("maps %s (%i) to the right copy key", async (reason, status, m, p, expected) => {
    stubFetch();
    fetchMock.mockResolvedValue(refusal(status, reason));
    expect(await uploadApplicationFiles(ticket, m, [...p])).toBe(expected);
  });

  it("reports a CORS/CSP refusal (fetch rejects) as upload", async () => {
    stubFetch();
    fetchMock.mockRejectedValue(new TypeError("Failed to fetch"));
    expect(await uploadApplicationFiles(ticket, menu, [])).toBe("upload");
  });
});

describe("submitApplication", () => {
  const application = { applicationId: "AbCdEfGhIjKlMnOpQrSt", consent: true };
  const created = { ok: true, applicationId: "uuid", upload: ticket };

  it("submits to the site's own route, then uploads to the ticket, and reports no file problem", async () => {
    stubFetch();
    fetchMock.mockResolvedValueOnce(reply(200, created)).mockResolvedValueOnce(reply(200, { menu: true, photos: 0 }));
    expect(await submitApplication(application, menu, [])).toEqual({ filesError: null });
    expect(fetchMock.mock.calls[0][0]).toBe("/api/partner-apply");
    expect(JSON.parse(String((fetchMock.mock.calls[0][1] as RequestInit).body))).toEqual(application);
    expect(fetchMock.mock.calls[1][0]).toBe(ticket.url);
  });

  it("makes one call and no upload when there are no files", async () => {
    stubFetch();
    fetchMock.mockResolvedValue(reply(200, created));
    expect(await submitApplication(application, null, [])).toEqual({ filesError: null });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("is still a success when the upload is refused, carrying the reason", async () => {
    stubFetch();
    fetchMock.mockResolvedValueOnce(reply(200, created)).mockResolvedValueOnce(refusal(415, "unsupported-media-type"));
    expect(await submitApplication(application, menu, [])).toEqual({ filesError: "menuType" });
  });

  it("is a success with a file note when the route stored it but gave no ticket (answered from Firebase)", async () => {
    stubFetch();
    fetchMock.mockResolvedValue(reply(200, { ok: true, applicationId: "AbCdEfGhIjKlMnOpQrSt" }));
    expect(await submitApplication(application, menu, photos)).toEqual({ filesError: "upload" });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it.each([
    [429, "rate-limited"],
    [422, "failed"],
    [409, "failed"],
    [503, "failed"],
  ] as const)("maps a %i from the route to %s and uploads nothing", async (status, expected) => {
    stubFetch();
    fetchMock.mockResolvedValue(reply(status, { ok: false }));
    expect(await submitApplication(application, menu, photos)).toBe(expected);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("lets a network failure on the submit throw, so the form shows its submit error", async () => {
    stubFetch();
    fetchMock.mockRejectedValue(new TypeError("Failed to fetch"));
    await expect(submitApplication(application, menu, [])).rejects.toThrow("Failed to fetch");
  });
});
