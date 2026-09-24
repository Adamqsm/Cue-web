import { NextResponse } from "next/server";
import { backendFor } from "@/lib/backend-flag";
import { CueApiError, clientIpOf, cueApi } from "@/lib/cue-api";
import { POST as firebasePOST } from "./route.firebase";

export const runtime = "nodejs";

/** The fields POST /partners/applications reads (contract 3.5); nothing else is forwarded. */
const APPLICATION_FIELDS = [
  "applicationId",
  "name",
  "area",
  "areaIsOther",
  "city",
  "contactName",
  "contactRole",
  "phone",
  "whatsapp",
  "instagram",
  "email",
  "streetAddress",
  "locale",
  "cuisineIds",
  "priceRange",
  "openingHours",
  "menuUrl",
  "interestedInPrepayment",
  "planInterest",
  "notes",
  "consent",
  "utm",
] as const;

type Created = { applicationId?: unknown; uploadToken?: unknown; uploadUrl?: unknown };

/**
 * Partner application, first of two calls. On django the API validates,
 * rate-limits, stores the application and raises its lead, then answers with
 * a 15-minute upload token scoped to this one application. The browser sends
 * the files straight to `uploadUrl` with that token (Vercel caps a function
 * body at 4.5 MB; a full submission is up to 58 MB), so this route never sees
 * a file and never holds more than the metadata.
 */
export async function POST(request: Request) {
  if (backendFor("partner") !== "django") return firebasePOST(request);

  let body: Record<string, unknown>;
  try {
    const parsed: unknown = await request.json();
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("not an object");
    body = parsed as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  try {
    const application = Object.fromEntries(
      APPLICATION_FIELDS.filter((k) => k in body).map((k) => [k, body[k]])
    );
    const out = await cueApi<Created>("/partners/applications", {
      method: "POST",
      body: application,
      clientIp: clientIpOf(request),
    });
    const { applicationId, uploadToken, uploadUrl } = out ?? {};
    if (typeof applicationId !== "string" || typeof uploadToken !== "string" || typeof uploadUrl !== "string") {
      throw new Error("partner-apply: 201 without applicationId/uploadToken/uploadUrl");
    }
    console.log("[partner-apply] stored:", applicationId);
    return NextResponse.json({ ok: true, applicationId, upload: { url: uploadUrl, token: uploadToken } });
  } catch (err) {
    if (err instanceof CueApiError) {
      if (err.code === "validation") {
        // Same {error, field} shape the Firebase handler answers; ApplyForm
        // shows its generic failure for any non-2xx, so this is for logs/tools.
        const field = Object.keys(err.fields ?? {})[0] ?? "body";
        const message = err.fields?.[field]?.[0] ?? "Invalid application.";
        return NextResponse.json({ ok: false, error: message, field }, { status: 422 });
      }
      if (err.code === "too-many-requests") {
        return NextResponse.json({ ok: false, error: "rate-limited" }, { status: 429 });
      }
      if (err.code === "conflict") {
        // A replayed applicationId. The form mints a fresh id per attempt, so a
        // visitor never gets here; a 409 carries no upload token either way.
        return NextResponse.json({ ok: false, error: "duplicate" }, { status: 409 });
      }
    }
    console.error("[partner-apply] failed:", err);
    return NextResponse.json({ ok: false, error: "unavailable" }, { status: 503 });
  }
}
