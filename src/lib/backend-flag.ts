/**
 * Rollout switch for the Firebase → Django migration (plan §7).
 *
 *   CUE_BACKEND=firebase|django                    default for every proxied route
 *   CUE_BACKEND_WAITLIST | _EVENT | _LEAD | _CLAIM | _PARTNER
 *                                                  per-route override, same values
 *
 * Unset → firebase (today's behaviour). An unrecognised value is ignored with
 * a warning instead of thrown: a typo in the Vercel UI must not take a route
 * down, and the worst case is "still on Firebase".
 */

export type Backend = "firebase" | "django";
export type ProxiedRoute = "waitlist" | "event" | "lead" | "claim" | "partner";

/** `env` is injectable for tests; production callers use the process.env default. */
export function backendFor(
  route: ProxiedRoute,
  env: Record<string, string | undefined> = process.env
): Backend {
  return parse(env[`CUE_BACKEND_${route.toUpperCase()}`]) ?? parse(env.CUE_BACKEND) ?? "firebase";
}

function parse(value: string | undefined): Backend | null {
  const v = value?.trim().toLowerCase();
  if (!v) return null;
  if (v === "firebase" || v === "django") return v;
  console.warn(`[backend-flag] ignoring ${JSON.stringify(value)}: expected firebase|django`);
  return null;
}
