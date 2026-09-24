import { NextResponse } from "next/server";
import { isLocale } from "@/i18n/config";
import { getAdminDb } from "@/lib/firebase-admin";
import {
  CLAIM_SOURCES,
  submitClaim,
  type ClaimSource,
} from "@/lib/cue-insider/claim-service";
import { verifyTurnstile } from "@/lib/cue-insider/turnstile";
import { sanitizeUtm } from "@/lib/utm";

export const runtime = "nodejs";

type ClaimPayload = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  locale?: unknown;
  source?: unknown;
  marketingConsent?: unknown;
  turnstileToken?: unknown;
  utm?: unknown;
};

function validationError(field: string) {
  return NextResponse.json({ ok: false, error: "validation", field }, { status: 422 });
}

function unavailable() {
  return NextResponse.json({ ok: false, error: "unavailable" }, { status: 503 });
}

export async function POST(request: Request) {
  let body: ClaimPayload;
  try {
    body = (await request.json()) as ClaimPayload;
  } catch {
    return validationError("body");
  }

  if (typeof body.name !== "string") return validationError("name");
  const name = body.name.trim();
  if (name.length < 2 || name.length > 120) return validationError("name");
  // `name` was already capped; email/phone were not, so an arbitrarily large
  // string reached normalisation, lower-casing and regex matching before
  // anything could reject it. Cap them here, at the edge, on the raw value.
  // 254 = RFC 5321 max address length; 32 comfortably exceeds any E.164 number
  // written with spaces, dashes and parentheses.
  if (typeof body.email !== "string" || !body.email.trim()) return validationError("email");
  if (body.email.length > 254) return validationError("email");
  if (typeof body.phone !== "string" || !body.phone.trim()) return validationError("phone");
  if (body.phone.length > 32) return validationError("phone");
  if (typeof body.locale !== "string" || !isLocale(body.locale)) return validationError("locale");
  if (
    typeof body.source !== "string" ||
    !(CLAIM_SOURCES as readonly string[]).includes(body.source)
  ) {
    return validationError("source");
  }
  if (typeof body.marketingConsent !== "boolean") return validationError("marketingConsent");

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  const token = typeof body.turnstileToken === "string" ? body.turnstileToken : undefined;
  const turnstile = await verifyTurnstile(token, ip === "unknown" ? undefined : ip);
  if (turnstile === "fail") {
    return NextResponse.json({ ok: false, error: "turnstile" }, { status: 400 });
  }
  if (turnstile === "unconfigured") return unavailable();

  let db;
  try {
    db = getAdminDb();
  } catch (err) {
    console.error("[cue-insider] admin unconfigured:", err);
    return unavailable();
  }

  try {
    const outcome = await submitClaim(db, {
      name,
      email: body.email,
      phone: body.phone,
      locale: body.locale,
      source: body.source as ClaimSource,
      marketingConsent: body.marketingConsent,
      // Attribution is best-effort: sanitized to the utm_* whitelist, never a
      // reason to reject a claim.
      utm: sanitizeUtm(body.utm),
      ip,
    });

    switch (outcome.kind) {
      case "invalid":
        return validationError(outcome.field);
      case "rate-limited":
        return NextResponse.json({ ok: false, error: "rate-limited" }, { status: 429 });
      // Duplicates never include the code — the claim endpoint must not be
      // usable to enumerate codes for other people's emails/phones.
      case "duplicate":
        return NextResponse.json({ ok: true, status: "duplicate", variant: outcome.variant });
      case "issued":
        return NextResponse.json({ ok: true, status: "issued", code: outcome.code });
    }
  } catch (err) {
    console.error("[cue-insider] claim failed:", err);
    return NextResponse.json({ ok: false, error: "server" }, { status: 500 });
  }
}
