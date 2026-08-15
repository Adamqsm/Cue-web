import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { EMAIL_RE } from "@/lib/validation";
import { maskEmail, maskPhone } from "@/lib/log-redact";
import { sanitizeUtm } from "@/lib/utm";

export const runtime = "nodejs";

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
