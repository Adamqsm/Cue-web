/**
 * UTM attribution, first-party only.
 *
 * The site has no third-party analytics; attribution rides on the records a
 * visitor chooses to submit (claim, partner application, lead) so campaign
 * spend can be traced in Firestore / the lead webhook. Two halves:
 *
 * - Pure helpers (sanitizeUtm, utmFromSearch, withUtm) — importable anywhere,
 *   including API routes. No browser APIs touched at module scope.
 * - Client capture (captureUtm, getUtmParams) — first-touch wins: the params
 *   on the LANDING url are held in module memory for the whole SPA session,
 *   so an internal CTA's own utm_* never overwrites the campaign that
 *   actually brought the visitor. Memory is copied into sessionStorage only
 *   after the consent gate has been accepted (same key the analytics beacons
 *   check), so declining consent never persists anything.
 */

export const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

export type UtmParams = Partial<Record<(typeof UTM_KEYS)[number], string>>;

/** Values are attribution labels, not prose — clamp hard and strip controls. */
const MAX_VALUE_LEN = 200;

const STORAGE_KEY = "cue-utm";
// Mirrors ConsentBanner / cue-insider/analytics — one consent, one key.
const CONSENT_KEY = "cue-consent";
const CONSENT_VERSION = "v1";

function cleanValue(value: unknown): string | null {
  if (typeof value !== "string") return null;
  // eslint-disable-next-line no-control-regex
  const trimmed = value.replace(/[\x00-\x1f\x7f]/g, "").trim();
  if (!trimmed) return null;
  return trimmed.slice(0, MAX_VALUE_LEN);
}

/**
 * Whitelist + clamp an untrusted utm object (client payload field, parsed
 * query, storage). Never throws, never rejects a submission — attribution is
 * best-effort by design. Returns null when nothing usable remains.
 */
export function sanitizeUtm(input: unknown): UtmParams | null {
  if (!input || typeof input !== "object" || Array.isArray(input)) return null;
  const source = input as Record<string, unknown>;
  const out: UtmParams = {};
  for (const key of UTM_KEYS) {
    const value = cleanValue(source[key]);
    if (value) out[key] = value;
  }
  return Object.keys(out).length > 0 ? out : null;
}

/** Parse utm_* out of a location.search string ("?utm_source=x&..."). */
export function utmFromSearch(search: string): UtmParams | null {
  if (!search) return null;
  let params: URLSearchParams;
  try {
    params = new URLSearchParams(search);
  } catch {
    return null;
  }
  const raw: Record<string, string> = {};
  for (const key of UTM_KEYS) {
    const value = params.get(key);
    if (value !== null) raw[key] = value;
  }
  return sanitizeUtm(raw);
}

/**
 * Tag an internal funnel link with its placement, so full-page navigations
 * into /claim and /partner/apply attribute the CTA that sent them (the modal
 * path already carries `source`). External campaign params always win over
 * these — see the first-touch rule in captureUtm.
 */
export function withUtm(href: string, content: string): string {
  const joiner = href.includes("?") ? "&" : "?";
  return `${href}${joiner}utm_source=cue-site&utm_medium=internal&utm_content=${encodeURIComponent(content)}`;
}

// ---- Client capture (no-ops on the server) --------------------------------

let captured: UtmParams | null = null;

function consented(): boolean {
  try {
    return localStorage.getItem(CONSENT_KEY) === CONSENT_VERSION;
  } catch {
    return false;
  }
}

/** Copy the in-memory params into sessionStorage once consent exists. */
function persistIfConsented(): void {
  if (!captured || !consented()) return;
  try {
    if (!sessionStorage.getItem(STORAGE_KEY)) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(captured));
    }
  } catch {
    // Storage unavailable — memory capture still covers this pageview.
  }
}

/**
 * Record the first utm_* params this session saw. Safe to call on every
 * navigation; later calls only get a chance to persist, never to overwrite.
 */
export function captureUtm(): void {
  if (typeof window === "undefined") return;
  if (captured) {
    persistIfConsented();
    return;
  }
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      captured = sanitizeUtm(JSON.parse(stored));
      if (captured) return;
    }
  } catch {
    // Fall through to the URL.
  }
  captured = utmFromSearch(window.location.search);
  persistIfConsented();
}

/** The params submissions should attach; null when the session has none. */
export function getUtmParams(): UtmParams | null {
  captureUtm();
  return captured;
}
