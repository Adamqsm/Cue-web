import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "../route";

const IP = "203.0.113.7";

function post(body: unknown, ip: string = IP) {
  return POST(
    new Request("https://www.cue-app.net/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-forwarded-for": ip },
      body: JSON.stringify(body),
    })
  );
}

const validLead = { name: "Lina", email: "lina@example.com", message: "Hi" };

beforeEach(() => {
  vi.spyOn(console, "log").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("POST /api/lead", () => {
  const fetchMock = vi.fn();
  const envelope = (status: number, code: string, reason: string | null = null) =>
    new Response(JSON.stringify({ code, reason, message: "x", fields: null }), {
      status,
      headers: { "content-type": "application/json" },
    });
  const created = () =>
    new Response(JSON.stringify({ ok: true, id: "0b9f1a52-6d4c-4f0e-9a2d-3c5e8f7b1d04" }), {
      status: 201,
      headers: { "content-type": "application/json" },
    });
  const sentInit = () => fetchMock.mock.calls[0][1] as RequestInit;
  const sentHeaders = () => sentInit().headers as Record<string, string>;

  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
    vi.stubEnv("CUE_API_BASE_URL", "https://api.example.test/api/v1");
    vi.stubEnv("CUE_API_KEY", "k-service");
  });

  afterEach(() => vi.unstubAllGlobals());

  it("forwards the contract fields with the key and visitor IP, and answers the legacy {ok:true}", async () => {
    fetchMock.mockResolvedValue(created());
    const res = await post(
      {
        ...validLead,
        audience: "operator",
        source: "reach-out",
        locale: "ar",
        contactPreference: "whatsapp",
        phone: "+962 79 123 4567",
        establishment: "Beit Sitti",
        instagram: "beitsitti",
        utm: { utm_source: "ig" },
        status: "approved",
        application: "x",
      },
      "198.51.100.4, 10.0.0.1"
    );
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(fetchMock.mock.calls[0][0]).toBe("https://api.example.test/api/v1/leads");
    expect(sentInit().method).toBe("POST");
    expect(sentHeaders()["X-Cue-Api-Key"]).toBe("k-service");
    expect(sentHeaders()["X-Cue-Client-Ip"]).toBe("198.51.100.4");
    expect(JSON.parse(String(sentInit().body))).toEqual({
      name: "Lina",
      email: "lina@example.com",
      message: "Hi",
      audience: "operator",
      source: "reach-out",
      locale: "ar",
      contactPreference: "whatsapp",
      phone: "+962 79 123 4567",
      establishment: "Beit Sitti",
      instagram: "beitsitti",
      utm: { utm_source: "ig" },
    });
  });

  it("ignores a leftover CUE_BACKEND pin: the API is the only backend", async () => {
    vi.stubEnv("CUE_BACKEND", "firebase");
    vi.stubEnv("CUE_BACKEND_LEAD", "firebase");
    fetchMock.mockResolvedValue(created());
    expect(await (await post(validLead)).json()).toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("sends no X-Cue-Client-Ip when the request carries no forwarded address", async () => {
    fetchMock.mockResolvedValue(created());
    await POST(
      new Request("https://www.cue-app.net/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validLead),
      })
    );
    expect(sentHeaders()["X-Cue-Client-Ip"]).toBeUndefined();
  });

  it("maps the API's 422 onto the single message the form shows", async () => {
    fetchMock.mockResolvedValue(envelope(422, "validation"));
    const res = await post({ name: "", email: "nope" });
    expect(res.status).toBe(422);
    expect(await res.json()).toEqual({ ok: false, error: "Name and a valid email are required." });
  });

  it("maps the API's per-IP 429 onto rate-limited", async () => {
    fetchMock.mockResolvedValue(envelope(429, "too-many-requests", "rate-limited"));
    const res = await post(validLead);
    expect(res.status).toBe(429);
    expect(await res.json()).toEqual({ ok: false, error: "rate-limited" });
  });

  it.each([
    ["a 401 (wrong key)", () => fetchMock.mockResolvedValue(envelope(401, "unauthenticated", "invalid-service-key"))],
    ["a 403", () => fetchMock.mockResolvedValue(envelope(403, "permission-denied"))],
    ["a 5xx", () => fetchMock.mockResolvedValue(envelope(500, "internal"))],
    ["Caddy's HTML 502", () => fetchMock.mockResolvedValue(new Response("<html>502</html>", { status: 502 }))],
    ["a network failure", () => fetchMock.mockRejectedValue(new TypeError("fetch failed"))],
  ])("fails closed with 503 on %s", async (_label, arrange) => {
    arrange();
    const res = await post(validLead);
    expect(res.status).toBe(503);
    expect(await res.json()).toEqual({ ok: false, error: "unavailable" });
  });

  it("fails closed with 503 when CUE_API_BASE_URL is unset, even outside production", async () => {
    vi.stubEnv("CUE_API_BASE_URL", "");
    const res = await post(validLead);
    expect(res.status).toBe(503);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it.each([
    ["malformed JSON", "{nope"],
    ["a JSON array", "[]"],
    ["a JSON null", "null"],
    ["a JSON number", "5"],
    ["a JSON string", '"lead"'],
  ])("answers 400 without calling the API for %s", async (_label, raw) => {
    const res = await POST(
      new Request("https://www.cue-app.net/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: raw,
      })
    );
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ ok: false, error: "Invalid JSON" });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
