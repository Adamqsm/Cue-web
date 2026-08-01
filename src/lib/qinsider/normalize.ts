/**
 * Normalization for Qinsider claim identity fields.
 *
 * Dedupe correctness depends on these functions being the single path every
 * email/phone takes before hashing — the server route, the reconcile script,
 * and any future importer must all normalize through here.
 */

/** Accepted dialing countries: Jordan + GCC. */
export const PHONE_COUNTRIES: {
  cc: string;
  nationalLength: number;
  mobilePrefix: RegExp;
  label: string;
}[] = [
  // Mobile-range prefixes are deliberately loose (leading digit families only)
  // so carrier changes don't strand real customers.
  { cc: "962", nationalLength: 9, mobilePrefix: /^7[789]/, label: "JO" },
  { cc: "971", nationalLength: 9, mobilePrefix: /^5/, label: "AE" },
  { cc: "966", nationalLength: 9, mobilePrefix: /^5/, label: "SA" },
  { cc: "965", nationalLength: 8, mobilePrefix: /^[569]/, label: "KW" },
  { cc: "973", nationalLength: 8, mobilePrefix: /^3/, label: "BH" },
  { cc: "974", nationalLength: 8, mobilePrefix: /^[34567]/, label: "QA" },
  { cc: "968", nationalLength: 8, mobilePrefix: /^[79]/, label: "OM" },
];

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

export function isValidEmail(email: string): boolean {
  return EMAIL_RE.test(email) && email.length <= 254;
}

export type PhoneResult =
  | { ok: true; e164: string; country: string }
  | { ok: false; reason: "empty" | "invalid-characters" | "unsupported-country" | "invalid-length" | "not-mobile" };

/**
 * Normalize user phone input to E.164 for Jordan + GCC.
 *
 * Accepts: "+9627...", "009627...", "07XXXXXXXX" (Jordanian local form),
 * "7XXXXXXXX", Arabic-Indic digits, and any spacing/dash/paren formatting.
 * Numbers without an explicit country code are assumed Jordanian.
 */
export function normalizePhone(raw: string): PhoneResult {
  let s = toAsciiDigits(raw).replace(/[\s\-().]/g, "");
  if (!s) return { ok: false, reason: "empty" };
  if (s.startsWith("+")) s = s.slice(1);
  else if (s.startsWith("00")) s = s.slice(2);
  if (!/^\d+$/.test(s)) return { ok: false, reason: "invalid-characters" };

  const country = PHONE_COUNTRIES.find((c) => s.startsWith(c.cc));
  let national: string;
  let cc: string;
  if (country && s.length > country.nationalLength) {
    cc = country.cc;
    national = s.slice(country.cc.length);
  } else {
    // No recognizable country code — treat as a Jordanian national number.
    cc = "962";
    national = s.replace(/^0/, "");
    if (s.length >= 11) return { ok: false, reason: "unsupported-country" };
  }

  const spec = PHONE_COUNTRIES.find((c) => c.cc === cc)!;
  // Local convention writes a leading 0 before the national number (07x...).
  if (national.length === spec.nationalLength + 1 && national.startsWith("0")) {
    national = national.slice(1);
  }
  if (national.length !== spec.nationalLength) return { ok: false, reason: "invalid-length" };
  if (!spec.mobilePrefix.test(national)) return { ok: false, reason: "not-mobile" };

  return { ok: true, e164: `+${cc}${national}`, country: spec.label };
}
