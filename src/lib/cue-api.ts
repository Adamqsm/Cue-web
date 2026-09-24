/**
 * Typed server-to-server client for the Cue Django API (plan §4.1 / §7).
 *
 * Every Next route that proxies to Django goes through here so the contract
 * lives in one place: base URL and service key from env, the two service
 * headers, an 8 s timeout, and the error envelope parsed into two error
 * classes the routes map onto their existing browser contracts:
 *
 *   CueApiError        Django answered with its envelope and a 4xx: the
 *                      request was wrong (validation, duplicate, rate limited,
 *                      turnstile…). Translate `code` / `reason` / `fields`.
 *   CueApiUnavailable  no usable answer: base URL unset, network failure,
 *                      timeout, any 5xx, a 401 (the service key is missing,
 *                      wrong or rotated: a deployment fault, never a
 *                      visitor's), or a body that is not the envelope (a
 *                      proxy's HTML 502, say). Routes fail closed: 503.
 *
 * Server-only by convention: it reads CUE_API_KEY. Next never inlines a
 * non-NEXT_PUBLIC_ variable into client bundles, so an accidental client
 * import would only produce unauthenticated calls, never leak the key.
 */

export const DEFAULT_TIMEOUT_MS = 8_000;

/** Django's flat error envelope (§4.1). `reason` values are preserved verbatim. */
export type CueApiErrorBody = {
  code: string;
  reason: string | null;
  message: string;
  /** Usually {field: [message]}; a list field's child errors nest under the item index. */
  fields: Record<string, unknown> | null;
};

export class CueApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly reason: string | null;
  readonly fields: Record<string, unknown> | null;

  constructor(status: number, body: CueApiErrorBody) {
    super(body.message);
    this.name = "CueApiError";
    this.status = status;
    this.code = body.code;
    this.reason = body.reason;
    this.fields = body.fields;
  }
}

export class CueApiUnavailable extends Error {
  /** HTTP status when the API did answer (5xx / non-envelope); null for config, network and timeout. */
  readonly status: number | null;

  constructor(message: string, status: number | null = null, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "CueApiUnavailable";
    this.status = status;
  }
}

export type CueApiInit = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  /** JSON-serialised request body; sets Content-Type. */
  body?: unknown;
  /** Visitor address, sent as X-Cue-Client-Ip. Django honours it only with a valid key. */
  clientIp?: string | null;
  timeoutMs?: number;
};

/**
 * Call `path` (relative to CUE_API_BASE_URL, e.g. "/insider/waitlist-count")
 * and return the parsed JSON body typed as T (undefined for 204).
 */
export async function cueApi<T>(path: string, init: CueApiInit = {}): Promise<T> {
  const base = process.env.CUE_API_BASE_URL?.trim().replace(/\/+$/, "");
  if (!base) throw new CueApiUnavailable("CUE_API_BASE_URL is not set");

  const method = init.method ?? "GET";
  const label = `${method} ${path}`;
  const timeoutMs = init.timeoutMs ?? DEFAULT_TIMEOUT_MS;

  const headers: Record<string, string> = { Accept: "application/json" };
  // trim() also strips U+FEFF: a BOM-prefixed Vercel value (the file-upload
  // failure this project has already hit) would otherwise make undici reject
  // the header and every call fail closed.
  const key = process.env.CUE_API_KEY?.trim();
  // fetch rejects a header value with a control or non-ASCII character in an
  // error that QUOTES the value, and that message would reach the logs. A key
  // pasted with a stray line break fails here instead, by name only.
  if (key && /[^\x21-\x7e]/.test(key)) {
    throw new CueApiUnavailable(`${label}: CUE_API_KEY holds characters a header cannot carry`);
  }
  if (key) headers["X-Cue-Api-Key"] = key;
  if (init.clientIp) headers["X-Cue-Client-Ip"] = init.clientIp;
  if (init.body !== undefined) headers["Content-Type"] = "application/json";

  let res: Response;
  let text: string;
  try {
    res = await fetch(`${base}${path.startsWith("/") ? path : `/${path}`}`, {
      method,
      headers,
      body: init.body === undefined ? undefined : JSON.stringify(init.body),
      signal: AbortSignal.timeout(timeoutMs),
      // Opt out of Next's Data Cache: every proxied call is live by design.
      cache: "no-store",
    });
    text = res.status === 204 ? "" : await res.text();
  } catch (err) {
    const why = isAbort(err) ? `timed out after ${timeoutMs} ms` : describe(err);
    throw new CueApiUnavailable(`${label}: ${why}`, null, { cause: err });
  }

  if (res.status === 204) return undefined as T;

  let data: unknown;
  let malformed = false;
  try {
    data = JSON.parse(text);
  } catch {
    malformed = true;
  }

  if (res.ok) {
    if (malformed) throw new CueApiUnavailable(`${label}: ${res.status} with malformed JSON`, res.status);
    return data as T;
  }

  const envelope = asEnvelope(data);
  if (res.status >= 500 || res.status === 401) {
    const detail = envelope ? ` ${envelope.code}${envelope.reason ? `/${envelope.reason}` : ""}` : "";
    throw new CueApiUnavailable(`${label}: ${res.status}${detail}`, res.status);
  }
  if (envelope) throw new CueApiError(res.status, envelope);
  throw new CueApiUnavailable(`${label}: ${res.status} without an error envelope`, res.status);
}

/**
 * The visitor's address for X-Cue-Client-Ip: the first X-Forwarded-For hop,
 * which Vercel overwrites with the real client address (so it cannot be
 * spoofed from outside). Null when absent; the API then counts the call
 * against the caller's own address.
 */
export function clientIpOf(request: Request): string | null {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null;
}

function asEnvelope(data: unknown): CueApiErrorBody | null {
  if (typeof data !== "object" || data === null) return null;
  const d = data as Record<string, unknown>;
  if (typeof d.code !== "string" || !d.code) return null;
  return {
    code: d.code,
    reason: typeof d.reason === "string" ? d.reason : null,
    message: typeof d.message === "string" && d.message ? d.message : d.code,
    fields:
      typeof d.fields === "object" && d.fields !== null && !Array.isArray(d.fields)
        ? (d.fields as Record<string, unknown>)
        : null,
  };
}

function isAbort(err: unknown): boolean {
  return err instanceof Error && (err.name === "TimeoutError" || err.name === "AbortError");
}

function describe(err: unknown): string {
  if (!(err instanceof Error)) return String(err);
  // undici wraps the real reason (ECONNREFUSED, ENOTFOUND…) in `cause`; on a
  // dual-stack host that is an AggregateError with an empty message, so fall
  // back to its code.
  const c = err.cause as { message?: string; code?: string } | undefined;
  const detail = c?.message || c?.code;
  return detail ? `${err.message} (${detail})` : err.message;
}
