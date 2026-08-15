import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase-admin";
import { isLocale } from "@/i18n/config";
import { EMAIL_RE } from "@/lib/validation";
import { maskEmail, maskPhone } from "@/lib/log-redact";
import { APPLICATION_ID_RE, storagePrefix } from "@/lib/partner-application";
import { consumeRateLimit } from "@/lib/rate-limit";
// The salted-IP hash and its deploy secret (CUE_INSIDER_IP_HASH_SALT) are
// shared with the claim flow deliberately: one salt to rotate, and the counter
// key never contains a raw address. The COUNTERS are separate collections.
import { hashIp } from "@/lib/cue-insider/hash";

export const runtime = "nodejs";

/**
 * Partner application intake — server-side.
 *
 * /partner/apply used to write the `partnerApplications` document straight
 * from the browser with the client SDK. That write was never permitted:
 * firestore.rules has no match block for the collection, so every setDoc()
 * fell through to the default-deny catch-all and threw "Missing or
 * insufficient permissions" — and because it sat in the same try block as the
 * /api/lead notification, the throw aborted the whole submission before the
 * webhook ever fired. Every application with Firebase env configured failed.
 *
 * The fix is not a public write rule (that would let anyone forge or flood
 * applications); it is this route. The Admin SDK bypasses rules the same way
 * Cloud Functions do — see the header of cue-app/firestore.rules — so the
 * collection stays unwritable from any client while the form keeps working.
 *
 * File uploads stay client-side: Storage rules already allow exactly the two
 * anonymous upload shapes under partner-applications/{applicationId}/ and
 * nothing else (cue-app/storage.rules, security audit 2026-08-14).
 *
 * Unauthenticated and without a Turnstile challenge, so a salted-IP rate limit
 * (@/lib/rate-limit, the counter the Cue Insider claim flow already uses)
 * gates every request before anything is written or forwarded.
 */

const DAYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const;
type DayKey = (typeof DAYS)[number];
type DayHours = { open: string; close: string; closed: false } | { closed: true };

const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;
const CUISINE_ID_RE = /^[A-Za-z0-9_-]{1,40}$/;
const PHOTO_NAME_RE = /^photos\/photo-\d{1,2}\.[A-Za-z0-9]{1,5}$/;
const MAX_PHOTOS = 6;

// Same budget as the Cue Insider claim flow (CLAIM_RATE_LIMIT): 5 per 10
// minutes per address. A venue fills this form once; anything approaching the
// cap is not a partner.
const RATE_LIMIT = { max: 5, windowMs: 10 * 60 * 1000 };

type Application = {
  locale: string;
  name: { en: string };
  area: { en: string };
  areaIsOther: boolean;
  city: string;
  phone: string;
  whatsapp: string | null;
  instagram: string | null;
  cuisineIds: string[];
  priceRange: number | null;
  openingHours: Record<DayKey, DayHours>;
  contactName: string;
  contactRole: string | null;
  email: string;
  streetAddress: string | null;
  menuUrl: string | null;
  interestedInPrepayment: boolean;
  planInterest: string | null;
  notes: string | null;
  consent: true;
  menuPath: string | null;
  photoPaths: string[];
};

/** 422 in the shape /api/lead uses — a human message, plus the offending field. */
function invalid(field: string, message: string) {
  return NextResponse.json({ ok: false, error: message, field }, { status: 422 });
}

/** Trim a required string, or return null if it is absent/blank/oversized. */
function required(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > max) return null;
  return trimmed;
}

/** Trim an optional string down to null; `false` means "present but invalid". */
function optional(value: unknown, max: number): string | null | false {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value !== "string") return false;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.length > max ? false : trimmed;
}

function localizedEn(value: unknown, max: number): string | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return required((value as { en?: unknown }).en, max);
}

/** Rebuild openingHours from scratch — never persist the client's own object. */
function parseHours(value: unknown): Record<DayKey, DayHours> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const source = value as Record<string, unknown>;
  const out = {} as Record<DayKey, DayHours>;
  for (const day of DAYS) {
    const raw = source[day];
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
    const entry = raw as { open?: unknown; close?: unknown; closed?: unknown };
    if (entry.closed === true) {
      out[day] = { closed: true };
      continue;
    }
    if (typeof entry.open !== "string" || !TIME_RE.test(entry.open)) return null;
    if (typeof entry.close !== "string" || !TIME_RE.test(entry.close)) return null;
    out[day] = { open: entry.open, close: entry.close, closed: false };
  }
  return out;
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    const parsed = await request.json();
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("not an object");
    body = parsed as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  // -- Identity ------------------------------------------------------------
  // The id also becomes the Firestore document id and the Storage path
  // segment the uploads already used, so it is shape-checked against the same
  // pattern storage.rules enforces before it is interpolated anywhere.
  const applicationId = typeof body.applicationId === "string" ? body.applicationId : "";
  if (!APPLICATION_ID_RE.test(applicationId)) {
    return invalid("applicationId", "A valid applicationId is required.");
  }

  // -- Required text -------------------------------------------------------
  const venueName = localizedEn(body.name, 120);
  if (!venueName) return invalid("name", "Venue name is required.");

  const area = localizedEn(body.area, 120);
  if (!area) return invalid("area", "Area is required.");

  const contactName = required(body.contactName, 120);
  if (!contactName) return invalid("contactName", "Contact name is required.");

  const phone = required(body.phone, 32);
  if (!phone) return invalid("phone", "A phone number is required.");

  const email = required(body.email, 254);
  if (!email || !EMAIL_RE.test(email)) return invalid("email", "A valid email is required.");

  const city = required(body.city, 80) ?? "Amman";
  const locale = typeof body.locale === "string" && isLocale(body.locale) ? body.locale : "en";

  // -- Cuisines ------------------------------------------------------------
  if (!Array.isArray(body.cuisineIds) || body.cuisineIds.length === 0) {
    return invalid("cuisineIds", "Select at least one cuisine.");
  }
  if (body.cuisineIds.length > 30) return invalid("cuisineIds", "Too many cuisines.");
  const cuisineIds: string[] = [];
  for (const id of body.cuisineIds) {
    if (typeof id !== "string" || !CUISINE_ID_RE.test(id)) {
      return invalid("cuisineIds", "Invalid cuisine id.");
    }
    if (!cuisineIds.includes(id)) cuisineIds.push(id);
  }

  // -- Hours ---------------------------------------------------------------
  const openingHours = parseHours(body.openingHours);
  if (!openingHours) return invalid("openingHours", "Opening hours are malformed.");

  // -- Optional text -------------------------------------------------------
  const whatsapp = optional(body.whatsapp, 200);
  if (whatsapp === false) return invalid("whatsapp", "WhatsApp link is too long.");
  const instagram = optional(body.instagram, 120);
  if (instagram === false) return invalid("instagram", "Instagram handle is too long.");
  const contactRole = optional(body.contactRole, 80);
  if (contactRole === false) return invalid("contactRole", "Role is too long.");
  const streetAddress = optional(body.streetAddress, 200);
  if (streetAddress === false) return invalid("streetAddress", "Address is too long.");
  const menuUrl = optional(body.menuUrl, 500);
  if (menuUrl === false) return invalid("menuUrl", "Menu link is too long.");
  const planInterest = optional(body.planInterest, 60);
  if (planInterest === false) return invalid("planInterest", "Plan is too long.");
  const notes = optional(body.notes, 2000);
  if (notes === false) return invalid("notes", "Notes are too long.");

  // -- Scalars -------------------------------------------------------------
  let priceRange: number | null = null;
  if (body.priceRange !== null && body.priceRange !== undefined && body.priceRange !== "") {
    const n = Number(body.priceRange);
    if (!Number.isFinite(n) || n < 0 || n > 1_000_000) {
      return invalid("priceRange", "Price range is out of range.");
    }
    priceRange = n;
  }
  const areaIsOther = body.areaIsOther === true;
  const interestedInPrepayment = body.interestedInPrepayment === true;
  if (body.consent !== true) return invalid("consent", "Consent is required.");

  // -- Storage paths -------------------------------------------------------
  // Paths are client-supplied (the browser did the upload), so they are pinned
  // to this application's own prefix — a submission cannot make its document
  // point at another application's menu or at an unrelated object.
  const prefix = storagePrefix(applicationId);
  let menuPath: string | null = null;
  if (body.menuPath !== null && body.menuPath !== undefined && body.menuPath !== "") {
    if (typeof body.menuPath !== "string" || body.menuPath !== `${prefix}menu.pdf`) {
      return invalid("menuPath", "Invalid menu path.");
    }
    menuPath = body.menuPath;
  }
  const photoPaths: string[] = [];
  if (body.photoPaths !== null && body.photoPaths !== undefined) {
    if (!Array.isArray(body.photoPaths) || body.photoPaths.length > MAX_PHOTOS) {
      return invalid("photoPaths", "Invalid photo paths.");
    }
    for (const p of body.photoPaths) {
      if (typeof p !== "string" || !p.startsWith(prefix) || !PHOTO_NAME_RE.test(p.slice(prefix.length))) {
        return invalid("photoPaths", "Invalid photo path.");
      }
      photoPaths.push(p);
    }
  }

  // Rebuilt field-by-field: nothing the client sent reaches Firestore except
  // the values validated above. `status` and `source` are server-owned so a
  // submission cannot self-approve or forge its provenance.
  const application: Application = {
    locale,
    name: { en: venueName },
    area: { en: area },
    areaIsOther,
    city,
    phone,
    whatsapp,
    instagram,
    cuisineIds,
    priceRange,
    openingHours,
    contactName,
    contactRole,
    email,
    streetAddress,
    menuUrl,
    interestedInPrepayment,
    planInterest,
    notes,
    consent: true,
    menuPath,
    photoPaths,
  };

  // 1) Rate limit, before anything is persisted or forwarded. This is an
  //    unauthenticated endpoint with no Turnstile in front of it, so the IP
  //    budget is the only thing between the open internet and a write.
  //
  //    Fails CLOSED: if the Admin SDK is unconfigured we cannot count, and an
  //    endpoint we cannot count is not one to leave open — the caller gets a
  //    503 rather than an unmetered path to the webhook. (hashIp also throws
  //    in production when CUE_INSIDER_IP_HASH_SALT is unset, by design.)
  let db;
  try {
    db = getAdminDb();
  } catch (err) {
    console.error("[partner-apply] admin unconfigured:", err);
    return NextResponse.json({ ok: false, error: "unavailable" }, { status: 503 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  try {
    const limited = await consumeRateLimit(
      db,
      "partnerApplyRateLimits",
      hashIp(ip),
      RATE_LIMIT
    );
    if (limited) {
      console.warn("[partner-apply] rate limited:", JSON.stringify({ applicationId }));
      return NextResponse.json({ ok: false, error: "rate-limited" }, { status: 429 });
    }
  } catch (err) {
    console.error("[partner-apply] rate limit check failed:", err);
    return NextResponse.json({ ok: false, error: "unavailable" }, { status: 503 });
  }

  // 2) Persist. Isolated so a Firestore outage still lets the webhook carry
  //    the submission — the "runs in both modes" resilience the client flow
  //    was reaching for.
  let firestoreOk = false;
  try {
    // create(), not set(): a replayed applicationId must not overwrite an
    // application already under review.
    await db
      .collection("partnerApplications")
      .doc(applicationId)
      .create({
        ...application,
        status: "new",
        source: "partner-apply-web",
        createdAt: FieldValue.serverTimestamp(),
      });
    firestoreOk = true;
  } catch (err) {
    console.error("[partner-apply] firestore write failed:", err);
  }

  // 3) Notify through the same webhook destination /api/lead forwards to, in
  //    the lead shape that destination already understands.
  const webhook = process.env.LEAD_WEBHOOK_URL;
  let webhookOk = false;
  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receivedAt: new Date().toISOString(),
          audience: "operator",
          source: "partner-apply",
          locale,
          name: contactName,
          email,
          phone,
          establishment: venueName,
          instagram,
          applicationId,
          message: `Partner application ${applicationId}: ${JSON.stringify(application)}`,
        }),
        // A hung webhook must not stall a request whose Firestore write has
        // already landed — the applicant would see an error for a submission
        // we actually have.
        signal: AbortSignal.timeout(8_000),
      });
      webhookOk = res.ok;
      if (!res.ok) {
        console.error("[partner-apply] webhook rejected:", res.status);
      }
    } catch (err) {
      console.error("[partner-apply] webhook forward failed:", err);
    }
  }

  // 4) Log — redacted, same policy as /api/lead. The application itself lives
  //    in Firestore; the log line only has to say that it arrived.
  console.log(
    "[partner-apply] received:",
    JSON.stringify({
      applicationId,
      locale,
      area,
      cuisineCount: cuisineIds.length,
      email: maskEmail(email),
      phone: maskPhone(phone),
      venueChars: venueName.length,
      menu: menuPath ? "upload" : menuUrl ? "link" : null,
      photoCount: photoPaths.length,
      firestoreOk,
      webhookOk,
    })
  );

  if (!firestoreOk && !webhookOk) {
    console.error(
      "[partner-apply] submission lost — no destination accepted it. Check " +
        "FIREBASE_SERVICE_ACCOUNT_JSON (or FIRESTORE_EMULATOR_HOST in dev) and " +
        "LEAD_WEBHOOK_URL."
    );
    return NextResponse.json({ ok: false, error: "server" }, { status: 502 });
  }

  return NextResponse.json({ ok: true, applicationId });
}
