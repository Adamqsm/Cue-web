/**
 * The application id shared by the /partner/apply form, its Storage uploads
 * and the /api/partner-apply route.
 *
 * SHAPE IS LOAD-BEARING — do not switch this to `crypto.randomUUID()`.
 * The deployed Storage rules (cue-app/storage.rules, security audit
 * 2026-08-14) gate every anonymous upload on:
 *
 *   function idOk() { return applicationId.matches('^[A-Za-z0-9]{20}$'); }
 *   match /partner-applications/{applicationId}/menu.pdf  { ... }
 *   match /partner-applications/{applicationId}/photos/{photo} { ... }
 *
 * i.e. exactly the 20-char alphanumeric shape of a Firestore auto-id, which is
 * what `doc(collection(db, ...)).id` used to mint client-side. A UUID (36
 * chars, hyphens) fails `idOk()` and every menu/photo upload would be denied.
 * So the id is still generated on the client — just without touching
 * Firestore — and the server re-checks the same shape before using it as a
 * document id.
 */

export const APPLICATION_ID_RE = /^[A-Za-z0-9]{20}$/;

/** Storage prefix every uploaded file for an application must live under. */
export function storagePrefix(applicationId: string): string {
  return `partner-applications/${applicationId}/`;
}

const ID_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const ID_LENGTH = 20;
// 248 = 4 * 62: rejecting the tail of the byte range keeps every character
// equally likely (256 is not a multiple of the alphabet size).
const REJECT_AT = 248;

/**
 * A cryptographically random 20-char alphanumeric id — the same ~119 bits of
 * entropy a Firestore auto-id carries, which is what the Storage rules lean on
 * when they accept an unauthenticated upload (an attacker cannot guess a real
 * application's path).
 */
export function newApplicationId(): string {
  const out: string[] = [];
  const buf = new Uint8Array(ID_LENGTH * 2);
  while (out.length < ID_LENGTH) {
    crypto.getRandomValues(buf);
    for (let i = 0; i < buf.length && out.length < ID_LENGTH; i++) {
      if (buf[i] < REJECT_AT) out.push(ID_ALPHABET[buf[i] % ID_ALPHABET.length]);
    }
  }
  return out.join("");
}
