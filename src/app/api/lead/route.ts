import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

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
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

  // 3) Always log so submissions are visible in serverless logs.
  console.log("[lead] captured:", JSON.stringify(lead));

  return NextResponse.json({ ok: true });
}
