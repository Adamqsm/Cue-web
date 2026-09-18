import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CueApiError, CueApiUnavailable, DEFAULT_TIMEOUT_MS, cueApi } from "../cue-api";

/**
 * The client is a thin wrapper around fetch, so these tests pin the wire
 * contract (plan §4.1): URL join, the two service headers, JSON body,
 * no-store, the timeout signal, and how each response shape maps onto the
 * two error classes the route handlers will switch on.
 */

const fetchMock = vi.fn();

function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function html(status: number, body = "<html>nope</html>") {
  return new Response(body, { status, headers: { "content-type": "text/html" } });
}

/** Resolve to the thrown error instead of rejecting, so assertions read flat. */
function call(path = "/leads", init?: Parameters<typeof cueApi>[1]) {
  return cueApi<unknown>(path, init).then(
    (value) => ({ value, error: null as unknown }),
    (error: unknown) => ({ value: undefined, error })
  );
}

function lastInit(index = 0): RequestInit {
  return fetchMock.mock.calls[index][1] as RequestInit;
}

beforeEach(() => {
  vi.stubGlobal("fetch", fetchMock);
  vi.stubEnv("CUE_API_BASE_URL", "https://api.example.test/api/v1/");
  vi.stubEnv("CUE_API_KEY", "k-service");
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
  fetchMock.mockReset();
});

describe("cueApi request", () => {
  it("joins base and path, sends the key + client IP headers, a JSON body, and no-store", async () => {
    fetchMock.mockResolvedValue(json(201, { ok: true, id: "L1" }));

    const out = await cueApi<{ ok: boolean; id: string }>("/leads", {
      method: "POST",
      body: { name: "Adam" },
      clientIp: "203.0.113.7",
    });

    expect(out).toEqual({ ok: true, id: "L1" });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://api.example.test/api/v1/leads");
    expect(init.method).toBe("POST");
    expect(init.headers).toEqual({
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-Cue-Api-Key": "k-service",
      "X-Cue-Client-Ip": "203.0.113.7",
    });
    expect(init.body).toBe(JSON.stringify({ name: "Adam" }));
    expect(init.cache).toBe("no-store");
    expect(init.signal).toBeInstanceOf(AbortSignal);
    expect(init.signal?.aborted).toBe(false);
  });

  it("defaults to GET with no body, no Content-Type and no X-Cue-Client-Ip", async () => {
    fetchMock.mockResolvedValue(json(200, { count: 223 }));

    await expect(cueApi("insider/waitlist-count")).resolves.toEqual({ count: 223 });

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://api.example.test/api/v1/insider/waitlist-count");
    expect(init.method).toBe("GET");
    expect(init.body).toBeUndefined();
    expect(init.headers).toEqual({ Accept: "application/json", "X-Cue-Api-Key": "k-service" });
  });

  it.each([undefined, "", "   "])(
    "omits X-Cue-Api-Key when CUE_API_KEY is %j, so public endpoints still work",
    async (value) => {
      vi.stubEnv("CUE_API_KEY", value);
      fetchMock.mockResolvedValue(json(200, { count: 50 }));

      await cueApi("/insider/waitlist-count");

      expect(lastInit().headers).toEqual({ Accept: "application/json" });
    }
  );

  it("trims the key, so a BOM-prefixed or padded Vercel value still sends a valid header", async () => {
    vi.stubEnv("CUE_API_KEY", "﻿ k-service \n");
    fetchMock.mockResolvedValue(json(200, { count: 50 }));

    await cueApi("/insider/waitlist-count");

    expect(lastInit().headers).toEqual({ Accept: "application/json", "X-Cue-Api-Key": "k-service" });
  });

  it("arms an 8 s timeout by default and honours a per-call override", async () => {
    const timeout = vi.spyOn(AbortSignal, "timeout");
    // A fresh Response per call: a body can only be read once.
    fetchMock.mockImplementation(async () => json(200, {}));

    await cueApi("/insider/waitlist-count");
    expect(timeout).toHaveBeenLastCalledWith(8_000);
    expect(DEFAULT_TIMEOUT_MS).toBe(8_000);

    // The events beacon is fire-and-forget with a 2 s budget (plan §7).
    await cueApi("/insider/events", { method: "POST", body: {}, timeoutMs: 2_000 });
    expect(timeout).toHaveBeenLastCalledWith(2_000);
    expect(lastInit(1).signal).toBe(timeout.mock.results[1].value);
  });
});

describe("cueApi responses", () => {
  it("returns undefined for 204 without reading a body", async () => {
    const res = new Response(null, { status: 204 });
    const text = vi.spyOn(res, "text");
    fetchMock.mockResolvedValue(res);

    await expect(
      cueApi<void>("/insider/events", { method: "POST", body: {} })
    ).resolves.toBeUndefined();
    expect(text).not.toHaveBeenCalled();
  });

  it("maps a 4xx envelope to CueApiError with status, code, reason and fields verbatim", async () => {
    fetchMock.mockResolvedValue(
      json(422, {
        code: "validation",
        reason: null,
        message: "Check the highlighted fields.",
        fields: { email: ["invalid"] },
      })
    );

    const { error } = await call("/insider/claims", { method: "POST", body: {} });

    expect(error).toBeInstanceOf(CueApiError);
    const err = error as CueApiError;
    expect(err.status).toBe(422);
    expect(err.code).toBe("validation");
    expect(err.reason).toBeNull();
    expect(err.message).toBe("Check the highlighted fields.");
    expect(err.fields).toEqual({ email: ["invalid"] });
  });

  it("keeps the reason string the functions used (429 too-many-requests / rate-limited)", async () => {
    fetchMock.mockResolvedValue(
      json(429, {
        code: "too-many-requests",
        reason: "rate-limited",
        message: "Slow down",
        fields: null,
      })
    );

    const { error } = await call();

    expect(error).toBeInstanceOf(CueApiError);
    expect((error as CueApiError).status).toBe(429);
    expect((error as CueApiError).reason).toBe("rate-limited");
  });

  it("normalises a sparse or mistyped envelope instead of passing junk to the routes", async () => {
    // Missing message falls back to the code; non-string reason and
    // non-object (or array) fields become null.
    fetchMock.mockResolvedValueOnce(json(400, { code: "invalid-argument", message: "" }));
    let { error } = await call();
    expect(error).toBeInstanceOf(CueApiError);
    expect((error as CueApiError).message).toBe("invalid-argument");
    expect((error as CueApiError).reason).toBeNull();
    expect((error as CueApiError).fields).toBeNull();

    fetchMock.mockResolvedValueOnce(
      json(422, { code: "validation", reason: 7, message: "x", fields: ["email"] })
    );
    ({ error } = await call());
    expect(error).toBeInstanceOf(CueApiError);
    expect((error as CueApiError).reason).toBeNull();
    expect((error as CueApiError).fields).toBeNull();
  });

  it.each([
    ["HTML", html(404)],
    ["a bare string", json(404, "nope")],
    ["an array", json(404, ["nope"])],
    ["null", json(404, null)],
    ["an empty code", json(404, { code: "", message: "x" })],
    ["DRF's default {detail}", json(404, { detail: "Not found." })],
  ])("treats a 4xx whose body is %s (not the envelope) as unavailable", async (_label, res) => {
    fetchMock.mockResolvedValue(res);

    const { error } = await call();

    expect(error).toBeInstanceOf(CueApiUnavailable);
    expect(error).not.toBeInstanceOf(CueApiError);
    expect((error as CueApiUnavailable).status).toBe(404);
  });

  it("treats every 5xx as unavailable, even one carrying the envelope, and surfaces its code", async () => {
    fetchMock.mockResolvedValue(
      json(503, { code: "internal", reason: "redis-down", message: "Redis down", fields: null })
    );

    const { error } = await call();

    expect(error).toBeInstanceOf(CueApiUnavailable);
    expect(error).not.toBeInstanceOf(CueApiError);
    expect((error as CueApiUnavailable).status).toBe(503);
    expect((error as Error).message).toContain("503 internal/redis-down");
  });

  it("treats a 401 as unavailable: a service key can only be missing, wrong or rotated", async () => {
    fetchMock.mockResolvedValue(
      json(401, { code: "unauthenticated", reason: null, message: "Bad key", fields: null })
    );

    const { error } = await call("/leads", { method: "POST", body: {} });

    expect(error).toBeInstanceOf(CueApiUnavailable);
    expect(error).not.toBeInstanceOf(CueApiError);
    expect((error as CueApiUnavailable).status).toBe(401);
    expect((error as Error).message).toContain("401 unauthenticated");
  });

  it.each([
    ["malformed JSON", html(200, "<html>ok?</html>")],
    ["an empty body", new Response("", { status: 200 })],
  ])("treats a 2xx with %s as unavailable rather than returning garbage", async (_label, res) => {
    fetchMock.mockResolvedValue(res);

    const { error } = await call();

    expect(error).toBeInstanceOf(CueApiUnavailable);
    expect((error as CueApiUnavailable).status).toBe(200);
  });
});

describe("cueApi failure modes", () => {
  it.each([undefined, "", "   "])(
    "fails closed without calling fetch when CUE_API_BASE_URL is %j",
    async (value) => {
      vi.stubEnv("CUE_API_BASE_URL", value);

      const { error } = await call();

      expect(error).toBeInstanceOf(CueApiUnavailable);
      expect((error as CueApiUnavailable).status).toBeNull();
      expect(fetchMock).not.toHaveBeenCalled();
    }
  );

  it("wraps a network failure as unavailable and keeps the original error as cause", async () => {
    const boom = new TypeError("fetch failed", { cause: new Error("connect ECONNREFUSED") });
    fetchMock.mockRejectedValue(boom);

    const { error } = await call();

    expect(error).toBeInstanceOf(CueApiUnavailable);
    expect((error as CueApiUnavailable).status).toBeNull();
    expect((error as Error).cause).toBe(boom);
    expect((error as Error).message).toBe("GET /leads: fetch failed (connect ECONNREFUSED)");
  });

  it("falls back to the cause's code when undici hands over an empty-message AggregateError", async () => {
    const cause = Object.assign(new AggregateError([new Error("::1"), new Error("127.0.0.1")], ""), {
      code: "ECONNREFUSED",
    });
    fetchMock.mockRejectedValue(new TypeError("fetch failed", { cause }));

    const { error } = await call();

    expect((error as Error).message).toBe("GET /leads: fetch failed (ECONNREFUSED)");
  });

  it("aborts through the signal after timeoutMs and reports a timeout", async () => {
    fetchMock.mockImplementation(
      (_url: string, init: RequestInit) =>
        new Promise((_resolve, reject) => {
          init.signal!.addEventListener("abort", () => reject(init.signal!.reason));
        })
    );

    const { error } = await call("/slow", { timeoutMs: 20 });

    expect(error).toBeInstanceOf(CueApiUnavailable);
    expect((error as Error).message).toMatch(/timed out after 20 ms/);
    expect((error as CueApiUnavailable).status).toBeNull();
  });
});
