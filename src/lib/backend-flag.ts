/**
 * Rollout switch for the Firebase → Django migration (plan §7).
 *
 *   CUE_BACKEND=firebase|django                    default for every proxied route
 *   CUE_BACKEND_WAITLIST | _EVENT | _LEAD | _CLAIM | _PARTNER
 *                                                  per-route override, same values
 *
 * Unset → firebase (today's behaviour). An unrecognised value at either level
 * resolves to firebase with a warning instead of throwing: a typo in the
 * Vercel UI must never take a route down, and must never leave a route on
 * Django that an operator meant to pin back to Firebase.
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
  console.warn(`[backend-flag] ${JSON.stringify(value)} is not firebase|django; using firebase`);
  return "firebase";
}

/**
 * Answer with the route's Firebase handler or its Django one. A Django answer
 * is tagged `X-Cue-Backend: django` so a smoke check can prove a flip actually
 * took effect (Vercel env changes need a redeploy, and a typo'd value quietly
 * resolves to firebase); a Firebase answer is returned untouched, which keeps
 * each route.firebase.ts verbatim.
 */
export async function answerFrom(
  route: ProxiedRoute,
  handlers: { firebase: () => Response | Promise<Response>; django: () => Promise<Response> }
): Promise<Response> {
  if (backendFor(route) !== "django") return handlers.firebase();
  const res = await handlers.django();
  res.headers.set("X-Cue-Backend", "django");
  return res;
}
