import { createHash } from "node:crypto";

export function sha256Hex(input: string): string {
  return createHash("sha256").update(input, "utf8").digest("hex");
}

/**
 * Salted IP hash for rate limiting / abuse tracing without storing raw IPs.
 * The salt is a deploy-time secret, not per-record — equality must hold across
 * requests for the rate-limit window to work.
 */
export function hashIp(ip: string): string {
  const salt = process.env.QINSIDER_IP_HASH_SALT || "qinsider-v1";
  return sha256Hex(`${salt}|${ip}`);
}
