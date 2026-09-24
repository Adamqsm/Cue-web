import { NextResponse } from "next/server";
import { answerFrom } from "@/lib/backend-flag";
import { cueApi } from "@/lib/cue-api";
import { POST as firebasePOST } from "./route.firebase";

export const runtime = "nodejs";

export async function POST(request: Request) {
  return answerFrom("event", { firebase: () => firebasePOST(request), django: () => djangoPOST(request) });
}

/**
 * Claim-funnel beacon: always 204, whatever happens. The event is forwarded
 * with a 2 s budget and awaited (a serverless function may be frozen the
 * moment it responds, so an un-awaited call could never land). Only the two
 * strings the API reads are forwarded; the API owns the allowed-event and
 * source lists and silently drops anything else.
 *
 * X-Cue-Event says whether the API took it (`forwarded`) or not (`dropped`),
 * so a smoke check can catch a wrong CUE_API_KEY that the 204 hides. The
 * beacon ignores response headers; the reason stays in the server log.
 */
async function djangoPOST(request: Request) {
  let outcome = "dropped";
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
      outcome = "forwarded";
    }
  } catch (err) {
    // A 401 here means CUE_API_KEY is wrong: the page must not notice, the logs must.
    console.warn("[cue-insider/event] not recorded:", err instanceof Error ? err.message : err);
  }
  return new NextResponse(null, { status: 204, headers: { "X-Cue-Event": outcome } });
}
