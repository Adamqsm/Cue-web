/**
 * Cue Insider redemption code — generation, formatting, and validation.
 *
 * Format: CUE-XXXX-XXXX (8 body characters; the final character is a
 * weighted mod-29 checksum over the preceding 7, so a typo can be rejected
 * offline before any network call). Because 29 is prime and the position
 * weights 8..1 are all nonzero mod 29, the checksum catches 100% of
 * single-character errors and 100% of adjacent transpositions — a Luhn
 * variant would miss ~1.7% of substitutions at this alphabet size.
 *
 * The alphabet excludes glyphs that get misread when a code is read aloud
 * or hand-typed at a restaurant table: O/0, I/1/L, S/5.
 *
 * This module is pure and dependency-free on purpose: the same algorithm is
 * specified in docs/cue-insider-code-contract.md for the Flutter app, and the
 * server route, Cloud Functions, and tests all import from here.
 */

/** 29 characters. Index order is load-bearing — the checksum depends on it. */
export const CODE_ALPHABET = "ABCDEFGHJKMNPQRTUVWXYZ2346789";

export const CODE_PREFIX = "CUE";

/** Number of random characters before the checksum character. */
export const PAYLOAD_LENGTH = 7;

const N = CODE_ALPHABET.length; // 29

/** Map for O(1) char → index lookup, and for normalizing user input. */
const CHAR_INDEX: Record<string, number> = {};
for (let i = 0; i < CODE_ALPHABET.length; i++) {
  CHAR_INDEX[CODE_ALPHABET[i]] = i;
}

/**
 * Weighted mod-29 check character (ISBN-10 style).
 *
 * The full 8-character body satisfies:
 *   sum over i of weight(i) * alphabetIndex(body[i]) ≡ 0 (mod 29)
 * where weight(i) = 8 - i for 0-based position i (payload weights 8..2,
 * check character weight 1).
 *
 * `payload` is the first 7 characters and must contain only alphabet
 * characters.
 */
export function checksumChar(payload: string): string {
  let sum = 0;
  for (let i = 0; i < payload.length; i++) {
    const codePoint = CHAR_INDEX[payload[i]];
    if (codePoint === undefined) {
      throw new Error(`Character outside code alphabet: ${payload[i]}`);
    }
    sum += (PAYLOAD_LENGTH + 1 - i) * codePoint; // weights 8,7,...,2
  }
  return CODE_ALPHABET[(N - (sum % N)) % N]; // check char has weight 1
}

/**
 * Normalize user-typed input to canonical form: uppercase, strip spaces and
 * hyphens, drop the CUE prefix if present. Returns the bare 8-character body
 * (or whatever remains — length is validated separately).
 */
export function normalizeCodeInput(raw: string): string {
  let s = raw.toUpperCase().replace(/[\s-]/g, "");
  if (s.startsWith(CODE_PREFIX)) s = s.slice(CODE_PREFIX.length);
  return s;
}

/** Render an 8-character body as the canonical display form CUE-XXXX-XXXX. */
export function formatCode(body: string): string {
  return `${CODE_PREFIX}-${body.slice(0, 4)}-${body.slice(4, 8)}`;
}

export type CodeValidation =
  | { ok: true; code: string; body: string }
  | { ok: false; reason: "invalid-length" | "invalid-characters" | "invalid-checksum" };

/**
 * Offline validation: length, alphabet membership, checksum.
 * Accepts any input formatting (with/without prefix, hyphens, case).
 */
export function validateCode(raw: string): CodeValidation {
  const body = normalizeCodeInput(raw);
  if (body.length !== PAYLOAD_LENGTH + 1) return { ok: false, reason: "invalid-length" };
  for (const ch of body) {
    if (CHAR_INDEX[ch] === undefined) return { ok: false, reason: "invalid-characters" };
  }
  const payload = body.slice(0, PAYLOAD_LENGTH);
  if (checksumChar(payload) !== body[PAYLOAD_LENGTH]) {
    return { ok: false, reason: "invalid-checksum" };
  }
  return { ok: true, code: formatCode(body), body };
}

/**
 * Generate one code from cryptographically secure random bytes.
 * `randomBytes` is injected so the same module runs in Node (crypto.randomBytes)
 * and in tests; rejection sampling removes modulo bias.
 */
export function generateCode(randomBytes: (n: number) => Uint8Array): {
  code: string;
  body: string;
} {
  const chars: string[] = [];
  // Rejection sampling: accept bytes < 232 (= 8 * 29) so each of the 29
  // characters is exactly equally likely.
  const LIMIT = 256 - (256 % N); // 232
  while (chars.length < PAYLOAD_LENGTH) {
    const batch = randomBytes(16);
    for (let i = 0; i < batch.length; i++) {
      const b = batch[i];
      if (b < LIMIT && chars.length < PAYLOAD_LENGTH) {
        chars.push(CODE_ALPHABET[b % N]);
      }
    }
  }
  const payload = chars.join("");
  const body = payload + checksumChar(payload);
  return { code: formatCode(body), body };
}
