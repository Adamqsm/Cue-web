import { NextResponse } from "next/server";
import { answerFrom } from "@/lib/backend-flag";
import { CueApiError, clientIpOf, cueApi } from "@/lib/cue-api";
import { POST as firebasePOST } from "./route.firebase";

export const runtime = "nodejs";

/** The fields POST /leads reads (contract 3.3); nothing else the browser sends is forwarded. */
const LEAD_FIELDS = [
  "name",
  "email",
  "audience",
  "source",
  "locale",
  "contactPreference",
  "phone",
  "establishment",
  "instagram",
  "message",
  "utm",
] as const;

export async function POST(request: Request) {
  return answerFrom("lead", { firebase: () => firebasePOST(request), django: () => djangoPOST(request) });
}

/**
 * Lead intake: the Reach Out and FAQ contact forms. The API owns validation
 * (with the site's own email regex), the per-IP limit, storage and the
 * notification email; this route forwards the visitor's address and maps the
 * answer back onto the shapes LeadForm and ContactForm already read. Fails
 * closed everywhere: no dev fail-open, no data/leads.json.
 */
async function djangoPOST(request: Request) {
  let body: Record<string, unknown>;
  try {
    const parsed: unknown = await request.json();
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("not an object");
    body = parsed as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  try {
    const lead = Object.fromEntries(LEAD_FIELDS.filter((k) => k in body).map((k) => [k, body[k]]));
    const { id } = await cueApi<{ ok: true; id: string }>("/leads", {
      method: "POST",
      body: lead,
      clientIp: clientIpOf(request),
    });
    console.log("[lead] stored:", id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof CueApiError && err.code === "validation") {
      return NextResponse.json(
        { ok: false, error: "Name and a valid email are required." },
        { status: 422 }
      );
    }
    if (err instanceof CueApiError && err.code === "too-many-requests") {
      return NextResponse.json({ ok: false, error: "rate-limited" }, { status: 429 });
    }
    // CueApiUnavailable (unset URL, network, timeout, 5xx, a 401 = wrong key)
    // or a 4xx this route never expects: a deployment fault, not the visitor's.
    console.error("[lead] failed:", err);
    return NextResponse.json({ ok: false, error: "unavailable" }, { status: 503 });
  }
}
