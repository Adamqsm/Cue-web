import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { getAdminDb } from "@/lib/firebase-admin";
import { EMAIL_RE } from "@/lib/validation";
import { maskEmail, maskPhone } from "@/lib/log-redact";
import { consumeRateLimit } from "@/lib/rate-limit";
// Same salted-IP hash (and the same CUE_INSIDER_IP_HASH_SALT deploy secret) as
// the claim flow and /api/partner-apply: one salt to rotate, and no counter key
// ever contains a raw address. The COUNTER is its own collection — see below.
import { hashIp } from "@/lib/cue-insider/hash";
import { sanitizeUtm } from "@/lib/utm";

export const runtime = "nodejs";

/**
 * Lead intake — the Reach Out and FAQ contact forms.
 *
 * Unauthenticated, no Turnstile, and it forwards whatever it is given to
 * LEAD_WEBHOOK_URL (a Zapier/CRM endpoint) — so until now anyone could drive
 * the site's inbox, or its Vercel log retention, as fast as they could POST.
 * A salted-IP budget now gates every submission, using the same shared helper
 * and the same 5-per-10-minute policy as the Cue Insider claim flow and
 * /api/partner-apply.
 *
 * `leadRateLimits` is its OWN collection: a contact-form message and a partner
 * application from the same address are unrelated events and must not spend
 * each other's budget. (Nothing else touches the collection, and firestore.rules
 * default-denies every unmatched path, so it is server-only — same as
 * partnerApplyRateLimits.)
 */

// Same budget as CLAIM_RATE_LIMIT and /api/partner-apply: 5 per 10 minutes per
// address. Someone reaching out twice is normal; six times in ten minutes is
// not a person filling in a form.
const RATE_LIMIT = { max: 5, windowMs: 10 * 60 * 1000 };
const RATE_LIMIT_COLLECTION = "leadRateLimits";

/**
 * Count this request against its address; return a response to send instead of
 * accepting the lead, or null to continue.
 *
 * Fails CLOSED in production and OPEN everywhere else — the split
 * hash.ts/turnstile.ts already use. In production, an endpoint we cannot count
 * is not one to leave open, so an unconfigured Admin SDK (or an unset
 * CUE_INSIDER_IP_HASH_SALT, which hashIp throws on) is a 503 rather than an
 * unmetered path to the webhook. Locally and in tests there is usually no
 * service account at all, and the form's documented fallback mode
 * (LEAD_WEBHOOK_URL only, no Firebase) has to keep working — so there we log
 * and accept.
 */
async function rateLimit(request: Request): Promise<NextResponse | null> {
  const failClosed = process.env.NODE_ENV === "production";
  const unavailable = () =>
    NextResponse.json({ ok: false, error: "unavailable" }, { status: 503 });

  let db;
  try {
    db = getAdminDb();
  } catch (err) {
    console.error("[lead] admin unconfigured, cannot rate limit:", err);
    return failClosed ? unavailable() : null;
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  try {
    const limited = await consumeRateLimit(db, RATE_LIMIT_COLLECTION, hashIp(ip), RATE_LIMIT);
    if (limited) {
      console.warn("[lead] rate limited");
      return NextResponse.json({ ok: false, error: "rate-limited" }, { status: 429 });
    }
    return null;
  } catch (err) {
    console.error("[lead] rate limit check failed:", err);
    return failClosed ? unavailable() : null;
  }
}

type LeadPayload = {
  audience?: string;
  source?: string;
  locale?: string;
  contactPreference?: string;
  name?: string;
  email?: string;
  phone?: string;
  establishment?: string;
  instagram?: string;
  message?: string;
  utm?: unknown;
};

export async function POST(request: Request) {
  let body: LeadPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  // Minimal validation — name + valid email required.
  const name = (body.name || "").trim();
  const email = (body.email || "").trim();
  if (!name || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { ok: false, error: "Name and a valid email are required." },
      { status: 422 }
    );
  }

  // Rate limit AFTER validation and before any side effect: a malformed body
  // has already been rejected with a 422 that writes and forwards nothing, and
  // the budget belongs to submissions that would otherwise reach the inbox.
  const limitResponse = await rateLimit(request);
  if (limitResponse) return limitResponse;

  const lead = {
    receivedAt: new Date().toISOString(),
    audience: body.audience ?? "unknown",
    source: body.source ?? "reach-out",
    locale: body.locale ?? "en",
    contactPreference: body.contactPreference ?? null,
    name,
    email,
    phone: (body.phone || "").trim() || null,
    establishment: (body.establishment || "").trim() || null,
    instagram: (body.instagram || "").trim() || null,
    message: (body.message || "").trim() || null,
    // Whitelisted + clamped campaign attribution; null when absent.
    utm: sanitizeUtm(body.utm),
  };

  // 1) Forward to a webhook if configured (Zapier / Make / Sheets / CRM).
  const webhook = process.env.LEAD_WEBHOOK_URL;
  if (webhook) {
    try {
      await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead),
      });
    } catch (err) {
      console.error("[lead] webhook forward failed:", err);
    }
  }

  // 2) Best-effort local persistence (works in dev / writable envs).
  if (process.env.NODE_ENV !== "production") {
    try {
      const dir = path.join(process.cwd(), "data");
      await fs.mkdir(dir, { recursive: true });
      const file = path.join(dir, "leads.json");
      let existing: unknown[] = [];
      try {
        existing = JSON.parse(await fs.readFile(file, "utf8"));
      } catch {
        existing = [];
      }
      existing.push(lead);
      await fs.writeFile(file, JSON.stringify(existing, null, 2));
    } catch (err) {
      console.error("[lead] local persist failed:", err);
    }
  }

  // 3) Always log so submissions are visible in serverless logs — but
  //    REDACTED. This line used to be JSON.stringify(lead), i.e. the full
  //    name/email/phone/message of every submitter, sitting in Vercel's log
  //    retention forever and readable by anyone on the project.
  //
  //    If LEAD_WEBHOOK_URL is unset this log is the ONLY record of a
  //    submission, so the escape hatch is explicit and opt-in rather than the
  //    default: set LEAD_LOG_PII=1 to restore full-payload logging until a
  //    webhook/CRM destination is wired up.
  if (process.env.LEAD_LOG_PII === "1") {
    console.log("[lead] captured (FULL PAYLOAD — LEAD_LOG_PII=1):", JSON.stringify(lead));
  } else {
    console.log(
      "[lead] captured:",
      JSON.stringify({
        receivedAt: lead.receivedAt,
        audience: lead.audience,
        source: lead.source,
        locale: lead.locale,
        contactPreference: lead.contactPreference,
        email: maskEmail(lead.email),
        phone: maskPhone(lead.phone),
        nameChars: lead.name.length,
        establishment: lead.establishment ? "present" : null,
        instagram: lead.instagram ? "present" : null,
        messageChars: lead.message?.length ?? 0,
        forwardedToWebhook: Boolean(webhook),
      })
    );
    if (!webhook) {
      console.warn(
        "[lead] LEAD_WEBHOOK_URL is not set — this submission was redacted in " +
          "logs and stored nowhere else. Configure LEAD_WEBHOOK_URL, or set " +
          "LEAD_LOG_PII=1 to accept full PII in logs as the capture mechanism."
      );
    }
  }

  return NextResponse.json({ ok: true });
}
