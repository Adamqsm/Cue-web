import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { getAdminDb } = vi.hoisted(() => ({ getAdminDb: vi.fn() }));
vi.mock("@/lib/firebase-admin", () => ({ getAdminDb }));

import { POST } from "../route";

const fetchMock = vi.fn();

const form = {
  name: "Lina Haddad",
  email: "Lina@Example.com",
  phone: "+962 79 123 4567",
  locale: "ar",
  source: "claim-modal",
  marketingConsent: true,
  turnstileToken: "tok-123",
  utm: { utm_source: "ig" },
};

function post(body: unknown, headers: Record<string, string> = { "x-forwarded-for": "198.51.100.4" }) {
  return POST(
    new Request("https://www.cue-app.net/api/cue-insider/claim", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
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
  getAdminDb.mockReset();
  vi.stubGlobal("fetch", fetchMock);
  vi.stubEnv("CUE_API_BASE_URL", "https://api.example.test/api/v1");
  vi.stubEnv("CUE_API_KEY", "k-service");
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("POST /api/cue-insider/claim on django", () => {
  beforeEach(() => vi.stubEnv("CUE_BACKEND_CLAIM", "django"));

  it("forwards the contract fields with the key and visitor IP, and adds ok:true to an issue", async () => {
    fetchMock.mockResolvedValue(reply(200, { status: "issued", code: "CUE-AB24-CD37" }));
    const res = await post({ ...form, ip: "1.2.3.4", status: "issued", code: "CUE-XXXX-XXXX" });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true, status: "issued", code: "CUE-AB24-CD37" });
    expect(fetchMock.mock.calls[0][0]).toBe("https://api.example.test/api/v1/insider/claims");
    const headers = sentInit().headers as Record<string, string>;
    expect(headers["X-Cue-Api-Key"]).toBe("k-service");
    expect(headers["X-Cue-Client-Ip"]).toBe("198.51.100.4");
    expect(res.headers.get("x-cue-backend")).toBe("django");
    // Raw values go through untouched: the API owns trimming and normalisation.
    expect(JSON.parse(String(sentInit().body))).toEqual(form);
    expect(getAdminDb).not.toHaveBeenCalled();
  });

  it.each(["email", "phone", "rate-limited", "resend-limit"])(
    "passes the %s duplicate through as a 200 with ok:true",
    async (variant) => {
      fetchMock.mockResolvedValue(reply(200, { status: "duplicate", variant }));
      const res = await post(form);
      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({ ok: true, status: "duplicate", variant });
    }
  );

  it("never lets a duplicate carry a code, even if the API sent one", async () => {
    fetchMock.mockResolvedValue(reply(200, { status: "duplicate", variant: "email", code: "CUE-AB24-CD37" }));
    const body = await (await post(form)).json();
    expect(body).toEqual({ ok: true, status: "duplicate", variant: "email" });
    expect(JSON.stringify(body)).not.toContain("CUE-");
  });

  it("gives the API longer than its own 8 s + 8 s Cloudflare budget before giving up", async () => {
    const timeout = vi.spyOn(AbortSignal, "timeout");
    fetchMock.mockResolvedValue(reply(200, { status: "issued", code: "CUE-AB24-CD37" }));
    await post(form);
    expect(timeout).toHaveBeenCalledWith(20_000);
  });

  it("maps a failed challenge to the 400 the form resets its widget on", async () => {
    fetchMock.mockResolvedValue(envelope(400, "invalid-argument", "turnstile"));
    const res = await post(form);
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ ok: false, error: "turnstile" });
  });

  it.each([
    [{ phoneCountry: ["Invalid phone number (unsupported-country)."] }, "phone-country"],
    [{ phone: ["x"] }, "phone"],
    [{ email: ["x"] }, "email"],
    [{ marketingConsent: ["x"] }, "marketingConsent"],
    [{ email: ["x"], name: ["x"] }, "name"],
    [{ somethingNew: ["x"] }, "somethingNew"],
    [null, "body"],
  ])("maps 422 fields %j to field %s", async (fields, field) => {
    fetchMock.mockResolvedValue(envelope(422, "validation", null, fields));
    const res = await post(form);
    expect(res.status).toBe(422);
    expect(await res.json()).toEqual({ ok: false, error: "validation", field });
  });

  it("maps the per-IP 429 onto rate-limited", async () => {
    fetchMock.mockResolvedValue(envelope(429, "too-many-requests", "rate-limited"));
    const res = await post(form);
    expect(res.status).toBe(429);
    expect(await res.json()).toEqual({ ok: false, error: "rate-limited" });
  });

  it.each([
    ["503 turnstile-unconfigured", () => fetchMock.mockResolvedValue(envelope(503, "unavailable", "turnstile-unconfigured"))],
    ["a 401 (wrong key)", () => fetchMock.mockResolvedValue(envelope(401, "unauthenticated", "invalid-service-key"))],
    ["a 500 (code collision)", () => fetchMock.mockResolvedValue(envelope(500, "internal"))],
    ["an unexpected 400", () => fetchMock.mockResolvedValue(envelope(400, "invalid-argument", "something-else"))],
    ["an unknown 200 status", () => fetchMock.mockResolvedValue(reply(200, { status: "queued" }))],
    ["an issue without a code", () => fetchMock.mockResolvedValue(reply(200, { status: "issued" }))],
    ["a duplicate without a variant", () => fetchMock.mockResolvedValue(reply(200, { status: "duplicate" }))],
    ["a network failure", () => fetchMock.mockRejectedValue(new TypeError("fetch failed"))],
  ])("fails closed with 503 on %s", async (_label, arrange) => {
    arrange();
    const res = await post(form);
    expect(res.status).toBe(503);
    expect(await res.json()).toEqual({ ok: false, error: "unavailable" });
  });

  it.each([
    ["malformed JSON", "{nope"],
    ["a JSON array", "[]"],
    ["a JSON null", "null"],
  ])("answers 422 body without calling the API for %s", async (_label, raw) => {
    const res = await post(raw);
    expect(res.status).toBe(422);
    expect(await res.json()).toEqual({ ok: false, error: "validation", field: "body" });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe("POST /api/cue-insider/claim with the flag unset", () => {
  it("stays on the Firebase handler and never calls the API", async () => {
    const res = await post({ ...form, name: "x" });
    expect(res.status).toBe(422);
    expect(await res.json()).toEqual({ ok: false, error: "validation", field: "name" });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
