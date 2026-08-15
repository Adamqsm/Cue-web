/**
 * Log redaction helpers, shared by every route that logs a submission.
 *
 * Vercel function logs are retained and readable by everyone with access to
 * the project, so `console.log(JSON.stringify(payload))` was a standing
 * plaintext copy of every submitter's name, email, phone and free-text
 * message. These helpers keep a log line useful for debugging and
 * de-duplication without making it a PII store.
 *
 * Server-only by convention, but the module is pure — no Node or Admin SDK
 * imports — so bundling it anywhere is harmless.
 */

/** `adam@example.com` -> `a***@example.com`. */
export function maskEmail(value: string): string {
  const at = value.lastIndexOf("@");
  if (at < 1) return "***";
  return `${value.slice(0, 1)}***${value.slice(at)}`;
}

/** `+962 7 9123 4567` -> `***567`. Null passes through. */
export function maskPhone(value: string | null): string | null {
  if (!value) return null;
  const digits = value.replace(/\D/g, "");
  return digits.length <= 3 ? "***" : `***${digits.slice(-3)}`;
}
