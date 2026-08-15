/**
 * Shared validation primitives. Deliberately permissive — the site validates
 * to catch typos, not to adjudicate RFC 5322; delivery is the real test.
 */

/** The one email shape check used by the forms and by the API routes. */
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
