import { beforeEach, describe, expect, it, vi } from "vitest";

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
