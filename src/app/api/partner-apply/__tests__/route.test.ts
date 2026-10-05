import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { POST } from "../route";

const fetchMock = vi.fn();

const hours = Object.fromEntries(
  ["sun", "mon", "tue", "wed", "thu", "fri", "sat"].map((d) => [d, { open: "12:00", close: "23:00", closed: false }])
);

/** What ApplyForm sends. */
const application = {
  locale: "en",
  name: { en: "Beit Sitti" },
  area: { en: "Jabal Amman" },
  areaIsOther: false,
  city: "Amman",
  phone: "+962 79 123 4567",
  whatsapp: null,
  instagram: "beitsitti",
  cuisineIds: ["jordanian"],
  priceRange: 2,
  openingHours: hours,
  contactName: "Lina",
  contactRole: null,
  email: "lina@example.com",
  streetAddress: null,
  menuUrl: null,
  interestedInPrepayment: true,
  planInterest: null,
  notes: null,
  consent: true,
  applicationId: "AbCdEfGhIjKlMnOpQrSt",
  utm: { utm_source: "ig" },
};

const created = {
  applicationId: "3f6d2c1e-0b9a-4f1e-9c77-2a5b8d4e6f01",
  uploadToken: "3f6d:1uT2Xk:9c",
  uploadUrl: "https://api.example.test/api/v1/partners/applications/3f6d2c1e-0b9a-4f1e-9c77-2a5b8d4e6f01/files",
};

function post(body: unknown) {
  return POST(
    new Request("https://www.cue-app.net/api/partner-apply", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-forwarded-for": "198.51.100.4" },
      body: typeof body === "string" ? body : JSON.stringify(body),
    })
  );
}

const reply = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
const envelope = (status: number, code: string, reason: string | null = null, fields: unknown = null) =>
  reply(status, { code, reason, message: "x", fields });
const sentInit = () => fetchMock.mock.calls[0][1] as RequestInit;

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
  vi.stubEnv("CUE_API_BASE_URL", "https://api.example.test/api/v1");
  vi.stubEnv("CUE_API_KEY", "k-service");
  vi.spyOn(console, "log").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("POST /api/partner-apply", () => {
  it("forwards the contract fields with the key and visitor IP, and hands the browser its upload ticket", async () => {
    fetchMock.mockResolvedValue(reply(201, created));
    const res = await post({
      ...application,
      status: "approved",
      source: "forged",
      menuPath: null,
      photoPaths: [],
    });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      ok: true,
      applicationId: created.applicationId,
      upload: { url: created.uploadUrl, token: created.uploadToken },
    });
    expect(fetchMock.mock.calls[0][0]).toBe("https://api.example.test/api/v1/partners/applications");
    const headers = sentInit().headers as Record<string, string>;
    expect(headers["X-Cue-Api-Key"]).toBe("k-service");
    expect(headers["X-Cue-Client-Ip"]).toBe("198.51.100.4");
    // Server-owned keys never reach the API.
    expect(JSON.parse(String(sentInit().body))).toEqual(application);
  });

  it("ignores a leftover CUE_BACKEND pin: the API is the only backend", async () => {
    vi.stubEnv("CUE_BACKEND", "firebase");
    vi.stubEnv("CUE_BACKEND_PARTNER", "firebase");
    fetchMock.mockResolvedValue(reply(201, created));
    const res = await post(application);
    expect(res.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("maps a 422 onto {error, field} from the first failing field", async () => {
    fetchMock.mockResolvedValue(envelope(422, "validation", null, { openingHours: ["Opening hours are malformed."] }));
    const res = await post(application);
    expect(res.status).toBe(422);
    expect(await res.json()).toEqual({ ok: false, error: "Opening hours are malformed.", field: "openingHours" });
  });

  it("digs the message out of a list field's per-item errors", async () => {
    fetchMock.mockResolvedValue(
      envelope(422, "validation", null, { cuisineIds: { "0": ["This value does not match the required pattern."] } })
    );
    const res = await post(application);
    expect(await res.json()).toEqual({
      ok: false,
      error: "This value does not match the required pattern.",
      field: "cuisineIds",
    });
  });

  it("files a Firebase-era body (Storage paths named) on the API like any other, without the paths", async () => {
    fetchMock.mockResolvedValue(reply(201, created));
    const res = await post({
      ...application,
      menuPath: `partner-applications/${application.applicationId}/menu.pdf`,
      photoPaths: [`partner-applications/${application.applicationId}/photos/photo-1.jpg`],
    });
    expect(res.status).toBe(200);
    expect(JSON.parse(String(sentInit().body))).toEqual(application);
  });

  it("maps a 422 without fields onto a generic message", async () => {
    fetchMock.mockResolvedValue(envelope(422, "validation"));
    const res = await post(application);
    expect(res.status).toBe(422);
    expect(await res.json()).toEqual({ ok: false, error: "Invalid application.", field: "body" });
  });

  it("maps the per-IP 429 onto rate-limited", async () => {
    fetchMock.mockResolvedValue(envelope(429, "too-many-requests", "rate-limited"));
    const res = await post(application);
    expect(res.status).toBe(429);
    expect(await res.json()).toEqual({ ok: false, error: "rate-limited" });
  });

  it("answers a replayed applicationId with a 409 that carries no upload ticket", async () => {
    fetchMock.mockResolvedValue(envelope(409, "conflict", "duplicate"));
    const res = await post(application);
    expect(res.status).toBe(409);
    expect(await res.json()).toEqual({ ok: false, error: "duplicate" });
  });

  it.each([
    ["a 401 (wrong key)", () => fetchMock.mockResolvedValue(envelope(401, "unauthenticated", "invalid-service-key"))],
    ["a 5xx", () => fetchMock.mockResolvedValue(envelope(500, "internal"))],
    ["a 201 without a token", () => fetchMock.mockResolvedValue(reply(201, { applicationId: created.applicationId }))],
    ["a network failure", () => fetchMock.mockRejectedValue(new TypeError("fetch failed"))],
  ])("fails closed with 503 on %s", async (_label, arrange) => {
    arrange();
    const res = await post(application);
    expect(res.status).toBe(503);
    expect(await res.json()).toEqual({ ok: false, error: "unavailable" });
  });

  it.each([
    ["malformed JSON", "{nope"],
    ["a JSON array", "[]"],
  ])("answers 400 without calling the API for %s", async (_label, raw) => {
    const res = await post(raw);
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ ok: false, error: "Invalid JSON" });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
