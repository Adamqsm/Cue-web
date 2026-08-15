import { createHash } from "node:crypto";

export function sha256Hex(input: string): string {
  return createHash("sha256").update(input, "utf8").digest("hex");
}

/**
 * The pseudonymisation salt for every hashed identifier we persist.
 *
 * This used to fall back to the literal "cue-insider-v1" — a value published in
 * this repo's own .env.example — which meant an unset env var silently produced
 * hashes anyone could reverse. Two consequences, both real:
 *   - ipHash: the IPv4 space is 2^32, so a known salt makes every stored hash a
 *     lookup away from the claimant's raw IP.
 *   - emailHash / phoneHash: these were previously computed with sha256Hex()
 *     directly, i.e. UNSALTED. Jordanian mobile numbers are ~10^7 candidates —
 *     an unsalted phone hash is a phone number with extra steps.
 *
 * So: no usable default, and fail closed in production (the same shape
 * turnstile.ts already uses). The claim route maps a thrown error to 503, so a
 * misconfigured deploy refuses to collect PII instead of quietly storing
 * reversible hashes.
 */
function requireSalt(): string {
  const salt = process.env.CUE_INSIDER_IP_HASH_SALT;
  if (salt) return salt;
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "CUE_INSIDER_IP_HASH_SALT is unset — refusing to hash PII with a public default."
    );
  }
  return "dev-only-insecure-salt";
}

/**
 * Salted IP hash for rate limiting / abuse tracing without storing raw IPs.
 * The salt is a deploy-time secret, not per-record — equality must hold across
 * requests for the rate-limit window to work.
 */
export function hashIp(ip: string): string {
  return sha256Hex(`${requireSalt()}|${ip}`);
}

/**
 * Salted hash of a claimant identifier (email / E.164 phone). Used as the
 * dedupe index key, so — like hashIp — it must be deterministic across
 * requests. Domain-separated from hashIp by the "pii|" prefix so the two can
 * never collide on the same input.
 */
export function hashPii(value: string): string {
  return sha256Hex(`${requireSalt()}|pii|${value}`);
}
