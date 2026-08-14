import { randomBytes } from "node:crypto";
import {
  FieldValue,
  Timestamp,
  type DocumentReference,
  type Firestore,
  type Transaction,
} from "firebase-admin/firestore";
import type { Locale } from "@/i18n/config";
import { generateCode } from "./code";
import { hashIp, hashPii } from "./hash";
import { isValidEmail, normalizeEmail, normalizePhone } from "./normalize";

export const CLAIM_SOURCES = ["claim-page", "claim-modal", "nav-cta"] as const;
export type ClaimSource = (typeof CLAIM_SOURCES)[number];

export const RESEND_LIMIT = 3;
export const RESEND_WINDOW_MS = 10 * 60 * 1000;
export const RESEND_RESET_MS = 24 * 60 * 60 * 1000;

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const CODE_ATTEMPTS = 5;

export type ClaimInput = {
  name: string;
  email: string;
  phone: string;
  locale: Locale;
  source: ClaimSource;
  marketingConsent: boolean;
  ip: string;
};

export type ClaimOutcome =
  | { kind: "invalid"; field: "email" | "phone" | "phone-country" }
  | { kind: "rate-limited" }
  | { kind: "duplicate"; variant: "email" | "phone" | "resend-limit" | "rate-limited" }
  | { kind: "issued"; code: string };

export type ResendDecision = "resend" | "resend-reset" | "rate-limited" | "resend-limit";

/**
 * Resend policy for a repeat submission that matches an existing claim.
 * The cap is a rolling window: once the last queued email is RESEND_RESET_MS
 * old the count starts over ("resend-reset" — callers write the count back to
 * 1 instead of incrementing). Within the window the limit check wins over the
 * spacing check; "within" the spacing window is strict (<), so a submission
 * exactly RESEND_WINDOW_MS after the last queued email may resend.
 */
export function decideResend(
  emailResendCount: number,
  lastEmailQueuedAt: Date | null,
  now: Date
): ResendDecision {
  const sinceLast = lastEmailQueuedAt ? now.getTime() - lastEmailQueuedAt.getTime() : null;
  if (sinceLast !== null && sinceLast >= RESEND_RESET_MS) return "resend-reset";
  if (emailResendCount >= RESEND_LIMIT) return "resend-limit";
  if (sinceLast !== null && sinceLast < RESEND_WINDOW_MS) return "rate-limited";
  return "resend";
}

function queueMail(
  txn: Transaction,
  ref: DocumentReference,
  args: { claimId: string; to: string; locale: Locale; reason: "issued" | "resend" }
): void {
  txn.create(ref, {
    template: "cue-insider-code",
    claimId: args.claimId,
    to: args.to,
    locale: args.locale,
    reason: args.reason,
    status: "pending",
    attempts: 0,
    createdAt: FieldValue.serverTimestamp(),
  });
}

/**
 * Rate limit + dedupe + issue, per the shared Firestore contract.
 *
 * Two transactions: the IP rate limit commits even when the main transaction
 * retries, and it keeps the main transaction read-then-write only — the Admin
 * SDK requires every read to happen before the first write.
 */
export async function submitClaim(db: Firestore, input: ClaimInput): Promise<ClaimOutcome> {
  const email = normalizeEmail(input.email);
  if (!isValidEmail(email)) return { kind: "invalid", field: "email" };
  const phone = normalizePhone(input.phone);
  if (!phone.ok) {
    // Distinguish "we don't serve that country" from a malformed number so
    // the form can show the supported-countries message.
    return {
      kind: "invalid",
      field: phone.reason === "unsupported-country" ? "phone-country" : "phone",
    };
  }

  // Salted (hashPii), not bare sha256: these are the dedupe index doc IDs and
  // are mirrored nowhere, but an unsalted hash of a Jordanian mobile number is
  // brute-forceable in seconds, which would make any export of this collection
  // a de-anonymisable PII set rather than a pseudonymised one.
  const emailHash = hashPii(email);
  const phoneHash = hashPii(phone.e164);
  const ipHash = hashIp(input.ip);

  const rateLimitRef = db.collection("cueInsiderRateLimits").doc(ipHash);
  const limited = await db.runTransaction(async (txn) => {
    const snap = await txn.get(rateLimitRef);
    const now = Timestamp.now();
    const data = snap.data();
    const windowStart = data?.windowStart as Timestamp | undefined;
    if (!snap.exists || !windowStart || now.toMillis() - windowStart.toMillis() >= RATE_LIMIT_WINDOW_MS) {
      txn.set(rateLimitRef, { count: 1, windowStart: now });
      return false;
    }
    if (((data?.count as number | undefined) ?? 0) >= RATE_LIMIT_MAX) return true;
    txn.update(rateLimitRef, { count: FieldValue.increment(1) });
    return false;
  });
  if (limited) return { kind: "rate-limited" };

  const indexCol = db.collection("cueInsiderClaimIndex");
  const claimsCol = db.collection("cueInsiderClaims");
  const mailCol = db.collection("mailQueue");
  const emailIdxRef = indexCol.doc(emailHash);
  const phoneIdxRef = indexCol.doc(phoneHash);

  return db.runTransaction(async (txn): Promise<ClaimOutcome> => {
    const [emailIdx, phoneIdx] = await txn.getAll(emailIdxRef, phoneIdxRef);

    // Phone-only match (submitted email differs from the stored claim's):
    // the submitter hasn't proven control of the stored address, so report
    // the duplicate without queueing mail or touching resend state.
    if (!emailIdx.exists && phoneIdx.exists) {
      return { kind: "duplicate", variant: "phone" };
    }

    if (emailIdx.exists) {
      const claimId = emailIdx.data()?.claimId as string | undefined;
      const claimSnap = claimId ? await txn.get(claimsCol.doc(claimId)) : null;
      const claim = claimSnap?.data();
      // Orphaned index (no claim doc) should be impossible; report the
      // duplicate without queueing anything.
      if (!claimSnap || !claim) return { kind: "duplicate", variant: "email" };

      const lastQueued = (claim.lastEmailQueuedAt as Timestamp | null)?.toDate() ?? null;
      const decision = decideResend(
        (claim.emailResendCount as number | undefined) ?? 0,
        lastQueued,
        new Date()
      );
      if (decision === "resend-limit") return { kind: "duplicate", variant: "resend-limit" };
      if (decision === "rate-limited") return { kind: "duplicate", variant: "rate-limited" };

      // Resends always go to the email stored on the original claim — never
      // the submitted one, and it is never echoed back to the caller.
      queueMail(txn, mailCol.doc(), {
        claimId: claimSnap.id,
        to: claim.email as string,
        locale: (claim.locale as Locale) ?? "en",
        reason: "resend",
      });
      txn.update(claimSnap.ref, {
        // A resend after the rolling window restarts the count at 1.
        emailResendCount:
          decision === "resend-reset" ? 1 : FieldValue.increment(1),
        lastEmailQueuedAt: FieldValue.serverTimestamp(),
      });
      return { kind: "duplicate", variant: "email" };
    }

    // Fresh claim — find a collision-free code while still in the read phase.
    let code: string | null = null;
    let body: string | null = null;
    let codeIdxRef: DocumentReference | null = null;
    for (let attempt = 0; attempt < CODE_ATTEMPTS; attempt++) {
      const candidate = generateCode((n) => randomBytes(n));
      const ref = indexCol.doc(`code_${candidate.body}`);
      const existing = await txn.get(ref);
      if (!existing.exists) {
        code = candidate.code;
        body = candidate.body;
        codeIdxRef = ref;
        break;
      }
    }
    if (!code || !body || !codeIdxRef) {
      throw new Error(`code generation collided ${CODE_ATTEMPTS} times`);
    }

    const claimRef = claimsCol.doc();
    txn.create(claimRef, {
      code,
      codeBody: body,
      name: input.name,
      email,
      emailHash,
      phone: phone.e164,
      phoneHash,
      locale: input.locale,
      status: "issued",
      redeemedAt: null,
      redeemedByUid: null,
      createdAt: FieldValue.serverTimestamp(),
      emailSentAt: null,
      emailResendCount: 0,
      lastEmailQueuedAt: FieldValue.serverTimestamp(),
      source: input.source,
      marketingConsent: input.marketingConsent,
    });
    const indexBase = { claimId: claimRef.id, code, createdAt: FieldValue.serverTimestamp() };
    txn.create(emailIdxRef, { kind: "email", ...indexBase });
    txn.create(phoneIdxRef, { kind: "phone", ...indexBase });
    txn.create(codeIdxRef, { kind: "code", ...indexBase });
    queueMail(txn, mailCol.doc(), {
      claimId: claimRef.id,
      to: email,
      locale: input.locale,
      reason: "issued",
    });
    return { kind: "issued", code };
  });
}
