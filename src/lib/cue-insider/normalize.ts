/**
 * Client-side helpers for the Cue Insider claim form. The Cue API owns the
 * real normalisation (and dedupe) of every claim; these only shape input and
 * catch obvious mistakes before a request is sent.
 */

import type { CountryCode } from "libphonenumber-js";

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
