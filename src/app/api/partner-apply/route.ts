import { NextResponse } from "next/server";
import { answerFrom } from "@/lib/backend-flag";
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

/** The first message in a `fields` entry: a list child's errors arrive keyed by index. */
function firstMessage(value: unknown): string | undefined {
  if (typeof value === "string") return value;
  const items = Array.isArray(value) ? value : value && typeof value === "object" ? Object.values(value) : [];
  for (const item of items) {
    const message = firstMessage(item);
    if (message) return message;
  }
  return undefined;
}

export async function POST(request: Request) {
  return answerFrom("partner", { firebase: () => firebasePOST(request), django: () => djangoPOST(request) });
}

/**
 * Partner application, first of two calls. The API validates, rate-limits,
 * stores the application and raises its lead, then answers with a 15-minute
 * upload token scoped to this one application. The browser sends the files
 * straight to `uploadUrl` with that token (Vercel caps a function body at
 * 4.5 MB; a full submission is up to 58 MB), so this route never sees a file
 * and never holds more than the metadata.
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

  // A page built before the flip still runs the Firebase flow: its files are
  // already in Firebase Storage and the body names them. Keep that application
  // whole on Firebase (alive until WEB-5) rather than store it here without
  // its files.
  if (body.menuPath || (Array.isArray(body.photoPaths) && body.photoPaths.length > 0)) {
    return firebasePOST(
      new Request(request.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-forwarded-for": request.headers.get("x-forwarded-for") ?? "",
        },
        body: JSON.stringify(body),
      })
    );
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
        const message = firstMessage(err.fields?.[field]) ?? "Invalid application.";
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
