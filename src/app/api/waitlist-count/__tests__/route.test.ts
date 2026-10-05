import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GET } from "../route";

describe("GET /api/waitlist-count", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
    vi.stubEnv("CUE_API_BASE_URL", "https://api.example.test/api/v1");
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  const reply = (status: number, body: unknown) =>
    new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

  it("passes the API's count through untouched (the offset is already applied) with no-store", async () => {
    fetchMock.mockResolvedValue(reply(200, { count: 223 }));
    const res = await GET();
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ count: 223 });
    expect(res.headers.get("cache-control")).toContain("no-store");
    expect(fetchMock.mock.calls[0][0]).toBe("https://api.example.test/api/v1/insider/waitlist-count");
  });

  it("ignores a leftover CUE_BACKEND pin: the API is the only backend", async () => {
    vi.stubEnv("CUE_BACKEND", "firebase");
    vi.stubEnv("CUE_BACKEND_WAITLIST", "firebase");
    fetchMock.mockResolvedValue(reply(200, { count: 223 }));
    expect(await (await GET()).json()).toEqual({ count: 223 });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it.each([
    ["a 5xx", () => fetchMock.mockResolvedValue(reply(500, { code: "internal", reason: null, message: "x", fields: null }))],
    ["a network failure", () => fetchMock.mockRejectedValue(new TypeError("fetch failed"))],
    ["a non-numeric count", () => fetchMock.mockResolvedValue(reply(200, { count: "223" }))],
    ["a body without a count", () => fetchMock.mockResolvedValue(reply(200, {}))],
  ])("maps %s to 503 unavailable with no-store", async (_label, arrange) => {
    arrange();
    const res = await GET();
    expect(res.status).toBe(503);
    expect(await res.json()).toEqual({ ok: false, error: "unavailable" });
    expect(res.headers.get("cache-control")).toContain("no-store");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("503s without calling out when CUE_API_BASE_URL is unset", async () => {
    vi.stubEnv("CUE_API_BASE_URL", "");
    const res = await GET();
    expect(res.status).toBe(503);
    expect(await res.json()).toEqual({ ok: false, error: "unavailable" });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
