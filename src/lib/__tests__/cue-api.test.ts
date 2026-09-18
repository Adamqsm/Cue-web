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

/** Resolve to the thrown error instead of rejecting, so assertions read flat. */
function call(path = "/leads", init?: Parameters<typeof cueApi>[1]) {
  return cueApi<unknown>(path, init).then(
    (value) => ({ value, error: null as unknown }),
    (error: unknown) => ({ value: undefined, error })
  );
}

beforeEach(() => {
  vi.stubGlobal("fetch", fetchMock);
  vi.stubEnv("CUE_API_BASE_URL", "https://api.example.test/api/v1/");
  vi.stubEnv("CUE_API_KEY", "k-service");
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
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

  it("omits X-Cue-Api-Key when CUE_API_KEY is unset, so public endpoints still work", async () => {
    vi.stubEnv("CUE_API_KEY", undefined);
    fetchMock.mockResolvedValue(json(200, { count: 50 }));

    await cueApi("/insider/waitlist-count");

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(init.headers).toEqual({ Accept: "application/json" });
  });

  it("exposes the 8 s default timeout", () => {
    expect(DEFAULT_TIMEOUT_MS).toBe(8_000);
  });
});

describe("cueApi responses", () => {
  it("returns undefined for 204 without reading a body", async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 204 }));
    await expect(
      cueApi<void>("/insider/events", { method: "POST", body: {} })
    ).resolves.toBeUndefined();
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

  it("treats a 4xx without the envelope (a proxy HTML page) as unavailable", async () => {
    fetchMock.mockResolvedValue(
      new Response("<html>404</html>", { status: 404, headers: { "content-type": "text/html" } })
    );

    const { error } = await call();

    expect(error).toBeInstanceOf(CueApiUnavailable);
    expect((error as CueApiUnavailable).status).toBe(404);
  });

  it("treats every 5xx as unavailable, even one carrying the envelope", async () => {
    fetchMock.mockResolvedValue(
      json(503, { code: "unavailable", reason: null, message: "Redis down", fields: null })
    );

    const { error } = await call();

    expect(error).toBeInstanceOf(CueApiUnavailable);
    expect(error).not.toBeInstanceOf(CueApiError);
    expect((error as CueApiUnavailable).status).toBe(503);
    expect((error as Error).message).toContain("unavailable");
  });

  it("treats malformed JSON on a 2xx as unavailable rather than returning garbage", async () => {
    fetchMock.mockResolvedValue(
      new Response("<html>ok?</html>", { status: 200, headers: { "content-type": "text/html" } })
    );

    const { error } = await call();

    expect(error).toBeInstanceOf(CueApiUnavailable);
    expect((error as CueApiUnavailable).status).toBe(200);
  });
});

describe("cueApi failure modes", () => {
  it("fails closed without calling fetch when CUE_API_BASE_URL is unset", async () => {
    vi.stubEnv("CUE_API_BASE_URL", "");

    const { error } = await call();

    expect(error).toBeInstanceOf(CueApiUnavailable);
    expect((error as CueApiUnavailable).status).toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("wraps a network failure as unavailable and keeps the original error as cause", async () => {
    const boom = new TypeError("fetch failed", { cause: new Error("ECONNREFUSED") });
    fetchMock.mockRejectedValue(boom);

    const { error } = await call();

    expect(error).toBeInstanceOf(CueApiUnavailable);
    expect((error as CueApiUnavailable).status).toBeNull();
    expect((error as Error).cause).toBe(boom);
    expect((error as Error).message).toContain("ECONNREFUSED");
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
