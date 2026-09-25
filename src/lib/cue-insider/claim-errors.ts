import type { Dictionary } from "@/i18n/dictionaries";

export type ClaimErrorKey = keyof Dictionary["claim"]["form"]["errors"];

/** The route's 422 `field` values, to the copy key ClaimForm shows for each. */
const FIELD_ERRORS = new Map<unknown, ClaimErrorKey>([
  ["name", "name"],
  ["email", "email"],
  ["phone", "phone"],
  ["phone-country", "phoneCountry"],
]);

/**
 * Which error ClaimForm shows for a failed POST /api/cue-insider/claim (the
 * shapes that route answers on either backend). "turnstile" also tells the
 * form to reset its widget.
 */
export function claimErrorKey(status: number, body: unknown): ClaimErrorKey {
  const b = (body && typeof body === "object" ? body : {}) as { error?: unknown; field?: unknown; reason?: unknown };
  if (status === 400 && b.error === "turnstile") return "turnstile";
  if (status === 429) return "rateLimited";
  if (status === 422 && b.error === "validation") {
    if (b.field === "phone" && b.reason === "landline-not-supported") return "phoneLandline";
    return FIELD_ERRORS.get(b.field) ?? "server";
  }
  return "server";
}
