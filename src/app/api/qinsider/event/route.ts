import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase-admin";
import { CLAIM_SOURCES } from "@/lib/qinsider/claim-service";

export const runtime = "nodejs";

const ALLOWED_EVENTS = new Set([
  "claim_view",
  "claim_submit",
  "claim_success",
  "claim_duplicate",
  "claim_error",
]);

/**
 * Anonymous counters only — always 204, never blocks the UI, stores no PII.
 * Only the source folds into a per-source key; the client beacon sends it
 * top-level ({event, source, locale}) but a nested props.source also counts.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      event?: unknown;
      source?: unknown;
      props?: { source?: unknown };
    };
    const event = body.event;
    if (typeof event !== "string" || !ALLOWED_EVENTS.has(event)) {
      return new NextResponse(null, { status: 204 });
    }

    const increments: Record<string, FieldValue> = { [event]: FieldValue.increment(1) };
    const source = body.props?.source ?? body.source;
    if (typeof source === "string" && (CLAIM_SOURCES as readonly string[]).includes(source)) {
      increments[`${event}__${source}`] = FieldValue.increment(1);
    }

    const day = new Date().toISOString().slice(0, 10);
    getAdminDb()
      .collection("qinsiderStats")
      .doc(day)
      .set(increments, { merge: true })
      .catch(() => {});
  } catch {
    // Malformed body or unconfigured admin — stats are best-effort.
  }
  return new NextResponse(null, { status: 204 });
}
