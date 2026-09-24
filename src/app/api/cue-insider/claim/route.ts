import { NextResponse } from "next/server";
import { backendFor } from "@/lib/backend-flag";
import { CueApiError, clientIpOf, cueApi } from "@/lib/cue-api";
import { POST as firebasePOST } from "./route.firebase";

export const runtime = "nodejs";

/** The fields POST /insider/claims reads (contract 3.4); nothing else is forwarded. */
const CLAIM_FIELDS = [
  "name",
  "email",
  "phone",
  "locale",
  "source",
  "marketingConsent",
  "turnstileToken",
  "utm",
] as const;

/** Which failing field ClaimForm hears about first, in the order it shows them. */
const FIELD_ORDER = ["name", "email", "phone", "phoneCountry", "locale", "source", "marketingConsent"];

function validationError(field: string) {
  return NextResponse.json({ ok: false, error: "validation", field }, { status: 422 });
}

/** The API's camelCase field keys, back to the key ClaimForm reads ("phone-country"). */
function formField(fields: Record<string, string[]> | null): string {
  const keys = Object.keys(fields ?? {});
  const key = FIELD_ORDER.find((f) => keys.includes(f)) ?? keys[0] ?? "body";
  return key === "phoneCountry" ? "phone-country" : key;
}

/**
 * Cue Insider claim. On django the API does all of it: Turnstile (with the
 * visitor's IP), normalisation, the per-IP limit, dedupe, the code and the
 * email. This route forwards and translates, and rebuilds each 200 from known
 * keys so a duplicate can never carry a code whatever the upstream sends.
 */
export async function POST(request: Request) {
  if (backendFor("claim") !== "django") return firebasePOST(request);

  let body: Record<string, unknown>;
  try {
    const parsed: unknown = await request.json();
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("not an object");
    body = parsed as Record<string, unknown>;
  } catch {
    return validationError("body");
  }

  try {
    const claim = Object.fromEntries(CLAIM_FIELDS.filter((k) => k in body).map((k) => [k, body[k]]));
    const out = await cueApi<{ status?: unknown; code?: unknown; variant?: unknown }>(
      "/insider/claims",
      { method: "POST", body: claim, clientIp: clientIpOf(request) }
    );
    if (out?.status === "issued" && typeof out.code === "string") {
      return NextResponse.json({ ok: true, status: "issued", code: out.code });
    }
    if (out?.status === "duplicate" && typeof out.variant === "string") {
      return NextResponse.json({ ok: true, status: "duplicate", variant: out.variant });
    }
    throw new Error(`claim: unexpected 200 payload (status ${JSON.stringify(out?.status)})`);
  } catch (err) {
    if (err instanceof CueApiError) {
      if (err.code === "invalid-argument" && err.reason === "turnstile") {
        return NextResponse.json({ ok: false, error: "turnstile" }, { status: 400 });
      }
      if (err.code === "validation") return validationError(formField(err.fields));
      if (err.code === "too-many-requests") {
        return NextResponse.json({ ok: false, error: "rate-limited" }, { status: 429 });
      }
    }
    // CueApiUnavailable (incl. 503 turnstile-unconfigured, a 401 wrong key,
    // any 5xx) or an answer this route never expects: fail closed.
    console.error("[cue-insider] claim failed:", err);
    return NextResponse.json({ ok: false, error: "unavailable" }, { status: 503 });
  }
}
