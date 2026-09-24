import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { countGet, collectionSpy } = vi.hoisted(() => ({
  countGet: vi.fn(),
  collectionSpy: vi.fn(),
}));

vi.mock("@/lib/firebase-admin", () => ({
  getAdminDb: () => ({
    collection: (name: string) => {
      collectionSpy(name);
      return { count: () => ({ get: countGet }) };
    },
  }),
}));

import { GET } from "../route";

function aggregate(count: number) {
  return { data: () => ({ count }) };
}

describe("GET /api/waitlist-count", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns the cueInsiderClaims count with the +50 offset applied server-side", async () => {
    countGet.mockResolvedValue(aggregate(173));
    const res = await GET();
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ count: 223 });
    expect(collectionSpy).toHaveBeenCalledWith("cueInsiderClaims");
    expect(res.headers.get("x-cue-backend")).toBeNull();
  });

  it("returns just the offset when there are zero claims — never 0, never an error", async () => {
    countGet.mockResolvedValue(aggregate(0));
    const res = await GET();
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ count: 50 });
  });

  it("forbids caching on success responses", async () => {
    countGet.mockResolvedValue(aggregate(7));
    const res = await GET();
    expect(res.headers.get("cache-control")).toContain("no-store");
  });

  it("maps a Firestore failure to 503 with no-store, so stale numbers can't be cached either way", async () => {
    const quiet = vi.spyOn(console, "error").mockImplementation(() => {});
    countGet.mockRejectedValue(new Error("firestore down"));
    const res = await GET();
    expect(res.status).toBe(503);
    expect(await res.json()).toEqual({ ok: false, error: "unavailable" });
    expect(res.headers.get("cache-control")).toContain("no-store");
    quiet.mockRestore();
  });
});

describe("GET /api/waitlist-count on django", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
    vi.stubEnv("CUE_BACKEND_WAITLIST", "django");
    vi.stubEnv("CUE_API_BASE_URL", "https://api.example.test/api/v1");
    vi.spyOn(console, "error").mockImplementation(() => {});
    // A distinctive Firebase answer, so a silent fall-back to Firestore could
    // never pass for the Django path (clearAllMocks keeps implementations).
    countGet.mockResolvedValue(aggregate(999));
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
    expect(res.headers.get("x-cue-backend")).toBe("django");
    expect(collectionSpy).not.toHaveBeenCalled();
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
    expect(res.headers.get("x-cue-backend")).toBe("django");
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(collectionSpy).not.toHaveBeenCalled();
  });

  it("503s without calling out when CUE_API_BASE_URL is unset", async () => {
    vi.stubEnv("CUE_API_BASE_URL", "");
    const res = await GET();
    expect(res.status).toBe(503);
    expect(await res.json()).toEqual({ ok: false, error: "unavailable" });
    expect(fetchMock).not.toHaveBeenCalled();
    expect(collectionSpy).not.toHaveBeenCalled();
  });
});
