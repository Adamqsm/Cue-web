import { parsePhoneNumberFromString } from "libphonenumber-js";

/**
 * True for a +962 number with 8 national digits: every Jordanian mobile has 9,
 * and every 8-digit type is not a mobile (fixed line, toll-free 80, premium
 * rate 9, shared cost 85, UAN 88). This is the API's own rule for the Insider
 * claim (cue-backend is_jordan_landline), so the form can say so before a
 * round trip; the API's 422 landline-not-supported stays the authority.
 */
export function isJordanLandline(e164: string): boolean {
  const parsed = parsePhoneNumberFromString(e164);
  return parsed?.countryCallingCode === "962" && parsed.nationalNumber.length === 8;
}
