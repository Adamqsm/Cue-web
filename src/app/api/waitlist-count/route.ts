import { NextResponse } from "next/server";
import { backendFor } from "@/lib/backend-flag";
import { cueApi } from "@/lib/cue-api";
import { GET as firebaseGET } from "./route.firebase";

export const runtime = "nodejs";
// A parameterless GET is prerendered at build time by default — that would
// freeze the count at whatever it was on deploy.
export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "no-store, max-age=0" };

/**
 * Homepage queue counter. On django the API already adds the +50 offset and
 * caches the count for 60 s itself, so the number passes through as-is and is
 * never cached again at the edge. Any failure is the same 503 the Firebase
 * handler answers; WaitlistCounter falls back to its static number.
 */
export async function GET() {
  if (backendFor("waitlist") !== "django") return firebaseGET();
  try {
    const { count } = await cueApi<{ count?: unknown }>("/insider/waitlist-count");
    if (typeof count !== "number" || !Number.isFinite(count)) {
      throw new Error(`waitlist-count: unexpected payload ${JSON.stringify(count)}`);
    }
    return NextResponse.json({ count }, { headers: NO_STORE });
  } catch (err) {
    console.error("[waitlist-count] failed:", err);
    return NextResponse.json(
      { ok: false, error: "unavailable" },
      { status: 503, headers: NO_STORE }
    );
  }
}
