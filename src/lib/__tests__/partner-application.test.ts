import { afterEach, describe, expect, it, vi } from "vitest";
import {
  APPLICATION_ID_RE,
  newApplicationId,
  storagePrefix,
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

describe("uploadApplicationFiles", () => {
  const ticket = { url: "https://api.example.test/api/v1/partners/applications/abc/files", token: "tok.1" };
  const fetchMock = vi.fn();
  const menu = new File(["%PDF-1.4"], "menu.pdf", { type: "application/pdf" });
  const photos = [
    new File(["a"], "a.jpg", { type: "image/jpeg" }),
    new File(["b"], "b.png", { type: "image/png" }),
  ];

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    fetchMock.mockReset();
  });

  function arrange(result: Response | Error) {
    vi.stubGlobal("fetch", fetchMock);
    vi.spyOn(console, "error").mockImplementation(() => {});
    if (result instanceof Error) fetchMock.mockRejectedValue(result);
    else fetchMock.mockResolvedValue(result);
  }

  it("posts one multipart body to the ticket URL with the token header: menu once, photos repeated", async () => {
    arrange(new Response(JSON.stringify({ menu: true, photos: 2 }), { status: 200 }));
    expect(await uploadApplicationFiles(ticket, menu, photos)).toBe(true);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe(ticket.url);
    expect(init.method).toBe("POST");
    expect(init.headers).toEqual({ "X-Cue-Upload-Token": "tok.1" });
    const body = init.body as FormData;
    expect((body.get("menu") as File).name).toBe("menu.pdf");
    expect(body.getAll("photos").map((f) => (f as File).name)).toEqual(["a.jpg", "b.png"]);
    // No service key, no cookie: the token is the whole credential.
    expect(init.credentials).toBeUndefined();
  });

  it("sends no menu part when there is only photos", async () => {
    arrange(new Response("{}", { status: 200 }));
    await uploadApplicationFiles(ticket, null, photos.slice(0, 1));
    const body = (fetchMock.mock.calls[0][1] as RequestInit).body as FormData;
    expect(body.has("menu")).toBe(false);
    expect(body.getAll("photos")).toHaveLength(1);
  });

  it.each([
    ["a 413 file-too-large", new Response("{}", { status: 413 })],
    ["a 409 files-already-uploaded", new Response("{}", { status: 409 })],
    ["a 401 expired token", new Response("{}", { status: 401 })],
    ["a CORS/CSP refusal", new TypeError("Failed to fetch")],
  ])("resolves false on %s", async (_label, result) => {
    arrange(result);
    expect(await uploadApplicationFiles(ticket, menu, [])).toBe(false);
  });
});
