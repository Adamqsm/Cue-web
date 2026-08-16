/**
 * Normalization for Cue Insider claim identity fields.
 *
 * Dedupe correctness depends on these functions being the single path every
 * email/phone takes before hashing — the server route, the reconcile script,
 * and any future importer must all normalize through here.
 */

import {
  ParseError,
  parsePhoneNumberWithError,
  type CountryCode,
  type PhoneNumber,
} from "libphonenumber-js";

/**
 * Country assumed for numbers typed with no dialing prefix ("0791234567" →
 * +962…). Mirrors the claim form's pre-selected country.
 */
export const DEFAULT_PHONE_COUNTRY: CountryCode = "JO";

/** Map Arabic-Indic (٠-٩) and Extended Arabic-Indic (۰-۹) digits to ASCII. */
export function toAsciiDigits(value: string): string {
  return value
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0));
}

/** Lowercase + trim. The canonical email form that gets stored and hashed. */
export function normalizeEmail(raw: string): string {
  return raw.trim().toLowerCase();
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** RFC 5321 maximum forward-path length. */
export const EMAIL_MAX_LENGTH = 254;

/**
 * Length FIRST, then the pattern. The two clauses used to be the other way
 * round, which ran the regex across the whole of whatever the caller passed
 * before the 254-cap could reject it.
 *
 * To be precise about the risk, since this is easy to overstate: EMAIL_RE is
 * NOT vulnerable to catastrophic backtracking. `[^\s@]` excludes `@`, so the
 * `+` quantifiers cannot overlap across the separator and the match is linear
 * — measured at ~15 ms for a 600 KB input, scaling linearly. The problem was
 * only that an unbounded string reached the matcher (and .toLowerCase() before
 * it) at all, which is wasted CPU per request. Checking the cheap bound first
 * makes the cost constant.
 */
export function isValidEmail(email: string): boolean {
  return email.length <= EMAIL_MAX_LENGTH && EMAIL_RE.test(email);
}

export type PhoneResult =
  | { ok: true; e164: string; country: string }
  | {
      ok: false;
      reason:
        | "empty"
        | "invalid-characters"
        | "unsupported-country"
        | "invalid-length"
        | "invalid-number";
    };

type PhoneFailureReason = Extract<PhoneResult, { ok: false }>["reason"];

function mapParseError(err: unknown): PhoneFailureReason {
  const code = err instanceof ParseError ? err.message : "";
  if (code === "INVALID_COUNTRY") return "unsupported-country";
  if (code === "TOO_SHORT" || code === "TOO_LONG") return "invalid-length";
  if (code === "NOT_A_NUMBER") return "invalid-characters";
  return "invalid-number";
}

type ParseAttempt =
  | { ok: true; phone: PhoneNumber }
  | { ok: false; reason: PhoneFailureReason };

function tryParse(input: string): ParseAttempt {
  try {
    const phone = parsePhoneNumberWithError(input, {
      defaultCountry: DEFAULT_PHONE_COUNTRY,
      // The whole input must be the number — never fish one out of free text.
      extract: false,
    });
    return phone.isValid()
      ? { ok: true, phone }
      : { ok: false, reason: "invalid-number" };
  } catch (err) {
    return { ok: false, reason: mapParseError(err) };
  }
}

function accepted(phone: PhoneNumber): PhoneResult {
  // country is undefined only for non-geographic ranges (+800, +870): valid,
  // so accepted, just with no ISO label to report.
  return { ok: true, e164: phone.number, country: phone.country ?? "" };
}

/**
 * Normalize user phone input to E.164 — any country libphonenumber knows.
 *
 * This was a hand-rolled Jordan+GCC whitelist, which hard-blocked real
 * customers elsewhere (a US +1 claim, Aug 2026). Validation is now
 * libphonenumber's isValid() for the parsed country, and the old mobile-only
 * prefix check went with it: mobile vs fixed isn't reliably distinguishable
 * worldwide (US ranges are shared), and the claim only needs a reachable,
 * dedupeable number.
 *
 * Accepts "+…"/"00…" international forms, bare international digits
 * ("9627…", "1415…"), local forms of DEFAULT_PHONE_COUNTRY ("07…", "7…"),
 * Arabic-Indic digits, and ordinary separator formatting. E.164 output is
 * byte-identical to the old implementation for every number it accepted, so
 * existing phoneHash dedupe entries keep matching.
 */
export function normalizePhone(raw: string): PhoneResult {
  const input = toAsciiDigits(raw).trim();
  if (!input) return { ok: false, reason: "empty" };
  // Letters are typos, not formatting — reject them before the parser can
  // read anything as a vanity number.
  if (/[a-z]/i.test(input)) return { ok: false, reason: "invalid-characters" };

  const direct = tryParse(input);
  if (direct.ok) return accepted(direct.phone);

  // Bare international digits ("9627…", "1415…"): not readable as a national
  // number, so retry as if the "+" had been typed. The no-prefix attempt runs
  // first so 9-digit Jordanian mobiles keep their national reading.
  if (!input.startsWith("+") && !input.startsWith("00")) {
    const prefixed = tryParse(`+${input}`);
    if (prefixed.ok) return accepted(prefixed.phone);
  }

  return { ok: false, reason: direct.reason };
}
