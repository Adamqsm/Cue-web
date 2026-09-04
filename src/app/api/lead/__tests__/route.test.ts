import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Timestamp } from "firebase-admin/firestore";

/**
 * Route tests for the /api/lead IP rate limit.
 *
 * The limiter itself is covered by src/lib/__tests__/rate-limit.test.ts; what
 * matters here is the wiring — its own counter collection, hashed keys, the
 * budget, where in the handler it runs, and the fail-closed/fail-open split.
 */

const { getAdminDb, adminThrows, store, transactionThrows, writeFile } = vi.hoisted(() => ({
  getAdminDb: vi.fn(),
  adminThrows: { value: false },
  transactionThrows: { value: false },
  store: new Map<string, { count: number; windowStart: Timestamp }>(),
  writeFile: vi.fn(),
}));

vi.mock("@/lib/firebase-admin", () => ({
  getAdminDb: () => {
    if (adminThrows.value) throw new Error("Firebase Admin unconfigured");
    return getAdminDb();
  },
}));

// The dev-mode branch of the route appends to data/leads.json; keep the suite
// off the filesystem.
vi.mock("fs", () => ({
  promises: {
    mkdir: vi.fn().mockResolvedValue(undefined),
    readFile: vi.fn().mockRejectedValue(new Error("ENOENT")),
    writeFile,
  },
}));

/** Same in-memory Firestore stand-in the rate-limit unit test uses. */
function makeDb() {
  return {
    collection: (collection: string) => ({
      doc: (key: string) => ({ path: `${collection}/${key}` }),
    }),
    runTransaction: async <T>(fn: (txn: unknown) => Promise<T>): Promise<T> => {
      if (transactionThrows.value) throw new Error("firestore down");
      return fn({
        get: async (ref: { path: string }) => {
          const data = store.get(ref.path);
          return { exists: data !== undefined, data: () => data };
        },
        set: (ref: { path: string }, value: { count: number; windowStart: Timestamp }) =>
          store.set(ref.path, value),
        update: (ref: { path: string }) => {
          const current = store.get(ref.path);
          if (current) store.set(ref.path, { ...current, count: current.count + 1 });
        },
      });
    },
  };
}

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

const keys = () => Array.from(store.keys());

beforeEach(() => {
  vi.clearAllMocks();
  store.clear();
  adminThrows.value = false;
  transactionThrows.value = false;
  getAdminDb.mockImplementation(makeDb);
  // hashIp is used for real; without a salt it throws in production.
  vi.stubEnv("CUE_INSIDER_IP_HASH_SALT", "test-salt");
  vi.stubEnv("LEAD_WEBHOOK_URL", "");
  vi.spyOn(console, "log").mockImplementation(() => {});
  vi.spyOn(console, "warn").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("POST /api/lead rate limiting", () => {
  it("accepts 5 submissions from one address, then 429s the 6th", async () => {
    for (let i = 0; i < 5; i++) {
      const res = await post(validLead);
      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({ ok: true });
    }
    const blocked = await post(validLead);
    expect(blocked.status).toBe(429);
    expect(await blocked.json()).toEqual({ ok: false, error: "rate-limited" });
  });

  it("counts against its own collection, never the claim or partner-apply budget", async () => {
    await post(validLead);
    expect(keys()).toHaveLength(1);
    expect(keys()[0].startsWith("leadRateLimits/")).toBe(true);
  });

  it("keys on a salted hash, so the raw IP is never a document id", async () => {
    await post(validLead);
    const key = keys()[0].split("/")[1];
    expect(key).not.toContain(IP);
    expect(key).toMatch(/^[0-9a-f]{64}$/);
  });

  it("gives a different address its own budget", async () => {
    for (let i = 0; i < 6; i++) await post(validLead);
    const other = await post(validLead, "198.51.100.4");
    expect(other.status).toBe(200);
    expect(keys()).toHaveLength(2);
  });

  it("uses the first entry of a multi-hop x-forwarded-for", async () => {
    await post(validLead, `${IP}, 70.41.3.18, 150.172.238.178`);
    const viaProxies = keys();
    store.clear();
    await post(validLead, IP);
    expect(keys()).toEqual(viaProxies);
  });

  it("starts a fresh window once ten minutes have lapsed", async () => {
    for (let i = 0; i < 5; i++) await post(validLead);
    const key = keys()[0];
    store.set(key, {
      count: 5,
      windowStart: Timestamp.fromMillis(Date.now() - 10 * 60 * 1000 - 1),
    });
    expect((await post(validLead)).status).toBe(200);
    expect(store.get(key)!.count).toBe(1);
  });

  it("does not spend budget on submissions that fail validation", async () => {
    const invalid = await post({ name: "", email: "not-an-email" });
    expect(invalid.status).toBe(422);
    expect(store.size).toBe(0);
  });

  it("does not spend budget on a malformed body", async () => {
    const res = await POST(
      new Request("https://www.cue-app.net/api/lead", {
        method: "POST",
        headers: { "x-forwarded-for": IP },
        body: "{ not json",
      })
    );
    expect(res.status).toBe(400);
    expect(store.size).toBe(0);
  });

  it("blocks before the webhook forward, so a limited caller reaches no destination", async () => {
    vi.stubEnv("LEAD_WEBHOOK_URL", "https://hooks.example.com/catch");
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("ok"));
    for (let i = 0; i < 5; i++) await post(validLead);
    expect(fetchSpy).toHaveBeenCalledTimes(5);
    expect((await post(validLead)).status).toBe(429);
    expect(fetchSpy).toHaveBeenCalledTimes(5);
    expect(writeFile).toHaveBeenCalledTimes(5);
  });

  it("does not re-extend a rejected caller window", async () => {
    for (let i = 0; i < 5; i++) await post(validLead);
    const before = store.get(keys()[0])!;
    await post(validLead);
    await post(validLead);
    const after = store.get(keys()[0])!;
    expect(after.count).toBe(5);
    expect(after.windowStart.toMillis()).toBe(before.windowStart.toMillis());
  });
});

describe("POST /api/lead when the counter is unavailable", () => {
  it("fails closed with 503 in production if the Admin SDK is unconfigured", async () => {
    vi.stubEnv("NODE_ENV", "production");
    adminThrows.value = true;
    const res = await post(validLead);
    expect(res.status).toBe(503);
    expect(await res.json()).toEqual({ ok: false, error: "unavailable" });
  });

  it("fails closed with 503 in production if the counter transaction throws", async () => {
    vi.stubEnv("NODE_ENV", "production");
    transactionThrows.value = true;
    expect((await post(validLead)).status).toBe(503);
  });

  it("fails closed with 503 in production if the hash salt is unset", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("CUE_INSIDER_IP_HASH_SALT", "");
    expect((await post(validLead)).status).toBe(503);
  });

  it("fails open outside production, so the no-Firebase fallback keeps capturing leads", async () => {
    adminThrows.value = true;
    const res = await post(validLead);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
  });

  it("fails open outside production when the counter transaction throws", async () => {
    transactionThrows.value = true;
    expect((await post(validLead)).status).toBe(200);
  });
});
