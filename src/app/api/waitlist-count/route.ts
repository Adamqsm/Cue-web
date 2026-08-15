import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";

export const runtime = "nodejs";
// A parameterless GET is prerendered at build time by default — that would
// freeze the count at whatever it was on deploy. force-dynamic keeps every
// request hitting Firestore.
export const dynamic = "force-dynamic";

/**
 * Live queue size for the homepage counter: the cueInsiderClaims total plus a
 * fixed offset covering the pre-site list. The offset is applied here, server
 * side, so the public payload is already the display number and the client
 * can't drift from it. Zero claims is a valid state — the response is then
 * just the offset, never an error.
 *
 * count() is an aggregation: one aggregate read per page load regardless of
 * list size, no document contents (and so no PII) anywhere near this route.
 */
const OFFSET = 50;

const NO_STORE = { "Cache-Control": "no-store, max-age=0" };

export async function GET() {
  try {
    const agg = await getAdminDb().collection("cueInsiderClaims").count().get();
    return NextResponse.json({ count: agg.data().count + OFFSET }, { headers: NO_STORE });
  } catch (err) {
    // Unconfigured admin or Firestore outage — the counter client falls back
    // to a safe static number, so this is a 503 the visitor never sees.
    console.error("[waitlist-count] failed:", err);
    return NextResponse.json(
      { ok: false, error: "unavailable" },
      { status: 503, headers: NO_STORE }
    );
  }
}
