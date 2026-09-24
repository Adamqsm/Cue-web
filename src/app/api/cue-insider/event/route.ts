import { NextResponse } from "next/server";
import { backendFor } from "@/lib/backend-flag";
import { cueApi } from "@/lib/cue-api";
import { POST as firebasePOST } from "./route.firebase";

export const runtime = "nodejs";

/**
 * Claim-funnel beacon: always 204, whatever happens. On django the event is
 * forwarded with a 2 s budget and awaited (a serverless function may be frozen
 * the moment it responds, so an un-awaited call could never land). Only the
 * two strings the API reads are forwarded; the API owns the allowed-event and
 * source lists and silently drops anything else.
 */
export async function POST(request: Request) {
  if (backendFor("event") !== "django") return firebasePOST(request);
  try {
    const body = (await request.json()) as {
      event?: unknown;
      source?: unknown;
      props?: { source?: unknown } | null;
    };
    const source = body.props?.source ?? body.source;
    if (typeof body.event === "string") {
      await cueApi("/insider/events", {
        method: "POST",
        body: { event: body.event, ...(typeof source === "string" && { source }) },
        timeoutMs: 2_000,
      });
    }
  } catch (err) {
    // A 401 here means CUE_API_KEY is wrong: the page must not notice, the logs must.
    console.warn("[cue-insider/event] not recorded:", err instanceof Error ? err.message : err);
  }
  return new NextResponse(null, { status: 204 });
}
