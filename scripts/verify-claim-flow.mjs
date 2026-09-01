/**
 * Cue Insider claim flow — cross-stack E2E verify (emulator).
 *
 * Runbook:
 *   1. cue-app:  firebase emulators:start --only auth,firestore,functions --project cue-e00d5
 *      (functions/.env.local must point MAIL_API_BASE / SHEETS_API_BASE at the mocks)
 *   2. cue-app/functions:  node mock-resend.cjs   (port 8964, outbox mock-resend-outbox.ndjson)
 *   3. cue-app/functions:  node mock-sheets.cjs   (port 8965, GET /__state)
 *   4. Cue-web:  npm run build && then start with:
 *        FIRESTORE_EMULATOR_HOST=127.0.0.1:8080
 *        TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA   (Cloudflare always-pass)
 *        npm start
 *   5. node scripts/verify-claim-flow.mjs
 *
 * Covers section-8 items: fresh claim → doc + email + sheet row; duplicate email
 * returns existing code path with no second doc; duplicate phone w/ different
 * email caught with NO doc and NO email (mail only follows a proven email);
 * email resends go to the ORIGINAL email; resend rate limit + max-3;
 * per-IP rate limiting; validation errors; redeem flips sheet status.
 * (Sheets outage simulation is run separately — see report.)
 */
import { initializeApp } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";

const SITE = process.env.SITE_BASE || "http://127.0.0.1:3000";
const FN_BASE = "http://127.0.0.1:5001/cue-e00d5/me-central1";
const AUTH_SIGNUP =
  "http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:signUp?key=fake-api-key";
const SHEETS_STATE = "http://127.0.0.1:8965/__state";
// Outbox written by cue-app/functions/mock-resend.cjs. Defaults to the
// sibling cue-app checkout; override if your checkouts are not side by side.
const OUTBOX =
  process.env.MOCK_RESEND_OUTBOX ||
  fileURLToPath(
    new URL("../../cue-app/functions/mock-resend-outbox.ndjson", import.meta.url),
  );

process.env.FIRESTORE_EMULATOR_HOST ??= "127.0.0.1:8080";
initializeApp({ projectId: "cue-e00d5" });
const db = getFirestore();

import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

let failures = 0;
function check(label, ok, detail = "") {
  console.log(`${ok ? "PASS " : "FAIL "} ${label}${detail ? " — " + detail : ""}`);
  if (!ok) failures++;
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function poll(label, fn, timeoutMs = 60000) {
  const start = Date.now();
  for (;;) {
    const v = await fn();
    if (v) return v;
    if (Date.now() - start > timeoutMs) {
      check(label, false, `timed out after ${timeoutMs}ms`);
      return null;
    }
    await sleep(1500);
  }
}

// Mirror of the code checksum (weights 8..1 mod 29) for response validation.
const ALPHABET = "ABCDEFGHJKMNPQRTUVWXYZ2346789";
function codeIsValid(display) {
  const m = /^CUE-([A-Z2-9]{4})-([A-Z2-9]{4})$/.exec(display);
  if (!m) return false;
  const body = m[1] + m[2];
  let sum = 0;
  for (let i = 0; i < 8; i++) {
    const idx = ALPHABET.indexOf(body[i]);
    if (idx < 0) return false;
    sum += (8 - i) * idx;
  }
  return sum % 29 === 0;
}

function outboxLines() {
  if (!existsSync(OUTBOX)) return [];
  return (
    readFileSync(OUTBOX, "utf8")
      .trim()
      .split("\n")
      .filter(Boolean)
      .map((l) => JSON.parse(l))
      // mock-resend wraps the request as {n, at, failed, auth, body:{from,to,subject,html,text}}
      .map((l) => ({ ...(l.body ?? l), _meta: { n: l.n, at: l.at } }))
  );
}

async function submit(payload, ip) {
  const res = await fetch(`${SITE}/api/cue-insider/claim`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-forwarded-for": ip,
    },
    body: JSON.stringify({ turnstileToken: "test-pass-token", ...payload }),
  });
  let json = null;
  try {
    json = await res.json();
  } catch {}
  return { status: res.status, json };
}

async function sheetState() {
  const res = await fetch(SHEETS_STATE);
  return res.json();
}
function sheetRows(state) {
  // mock exposes { grids: { "<id>/<tab>": string[][] } } or a flat grid — handle both.
  if (Array.isArray(state)) return state;
  if (state.grid) return state.grid;
  if (state.grids) return Object.values(state.grids)[0] || [];
  return [];
}

const run = Date.now().toString(36);
// Phone must be unique per run — the emulator keeps data between runs and
// phone dedupe would (correctly) flag a reused number as a duplicate.
const uniqueDigits = String(Date.now() % 10_000_000).padStart(7, "0");
const A = {
  name: "Verify Alpha",
  email: `verify-a-${run}@example.com`,
  phone: `+96279${uniqueDigits}`,
  locale: "en",
  source: "claim-page",
  marketingConsent: true,
};

// ---- Phase 1: fresh claim ----
console.log("\n== Phase 1: fresh claim ==");
const r1 = await submit(A, "10.1.1.1");
check("fresh claim → 200 issued", r1.status === 200 && r1.json?.status === "issued", JSON.stringify(r1.json));
check("issued code passes offline checksum", codeIsValid(r1.json?.code || ""), r1.json?.code);

const claimSnap = await poll("claim doc exists", async () => {
  const q = await db.collection("cueInsiderClaims").where("email", "==", A.email).get();
  return q.empty ? null : q.docs[0];
});
let claimId = null;
if (!claimSnap) {
  console.log("\nABORT — no claim doc; later phases depend on it.");
  process.exit(1);
}
if (claimSnap) {
  claimId = claimSnap.id;
  const c = claimSnap.data();
  check("claim doc fields", c.code === r1.json.code && c.status === "issued" && c.phone === A.phone && c.locale === "en" && c.source === "claim-page" && c.marketingConsent === true && c.emailResendCount === 0 && !!c.emailHash && !!c.phoneHash && c.ipHash === undefined && c.redeemedAt === null);
  check("raw ip not stored", JSON.stringify(c).indexOf("10.1.1.1") === -1);
  const idx = await db.collection("cueInsiderClaimIndex").get();
  const kinds = idx.docs.filter((d) => d.data().claimId === claimId).map((d) => d.data().kind).sort();
  check("3 index docs (code,email,phone)", kinds.join(",") === "code,email,phone", kinds.join(","));
}

const sent1 = await poll("mock-resend received the issued email", async () => {
  const lines = outboxLines().filter((l) => (l.to || [l.to]).toString().includes(A.email));
  return lines.length >= 1 ? lines : null;
});
if (sent1) {
  const mail = sent1[0];
  check("email contains the code", JSON.stringify(mail).includes(r1.json.code));
  check("email has html + text", !!mail.html && !!mail.text);
}
await poll("claim.emailSentAt written back", async () => {
  const c = (await db.collection("cueInsiderClaims").doc(claimId).get()).data();
  return c?.emailSentAt ? true : null;
});
const row1 = await poll("sheet row appended", async () => {
  const rows = sheetRows(await sheetState());
  return rows.find((r) => r[0] === claimId) || null;
});
if (row1) {
  check("sheet row mapping (email, code, status issued)", row1[3] === A.email && row1[5] === r1.json.code && row1[9] === "issued", JSON.stringify(row1));
}

// ---- Phase 2: duplicate email (immediately → resend rate limit) ----
console.log("\n== Phase 2: duplicate email ==");
const r2 = await submit({ ...A, source: "claim-modal" }, "10.1.1.2");
check("duplicate right after signup → duplicate/rate-limited (initial send counts toward window)", r2.status === 200 && r2.json?.status === "duplicate" && r2.json?.variant === "rate-limited", JSON.stringify(r2.json));
check("duplicate response carries NO code", !("code" in (r2.json || {})));

// age the last send, then duplicate again → real resend
await db.collection("cueInsiderClaims").doc(claimId).update({ lastEmailQueuedAt: Timestamp.fromMillis(Date.now() - 11 * 60 * 1000) });
const r3 = await submit(A, "10.1.1.2");
check("aged duplicate email → duplicate/email (resend)", r3.status === 200 && r3.json?.status === "duplicate" && r3.json?.variant === "email", JSON.stringify(r3.json));
await poll("resend email delivered (2nd outbox entry)", async () => {
  const lines = outboxLines().filter((l) => (l.to || [l.to]).toString().includes(A.email));
  return lines.length >= 2 ? lines : null;
});
const afterResend = (await db.collection("cueInsiderClaims").doc(claimId).get()).data();
check("emailResendCount incremented to 1", afterResend.emailResendCount === 1);
const countDocs = await db.collection("cueInsiderClaims").where("emailHash", "==", afterResend.emailHash).get();
check("no second claim doc for duplicate email", countDocs.size === 1);

// ---- Phase 3: duplicate phone, different email ----
console.log("\n== Phase 3: duplicate phone ==");
// Age the last send so a resend WOULD be allowed by timing — the phone-only
// match must still send nothing (submitter hasn't proven the stored email).
await db.collection("cueInsiderClaims").doc(claimId).update({ lastEmailQueuedAt: Timestamp.fromMillis(Date.now() - 11 * 60 * 1000) });
const outboxBefore = outboxLines().filter((l) => (l.to || [l.to]).toString().includes(A.email)).length;
const r4 = await submit({ ...A, email: `verify-other-${run}@example.com` }, "10.1.1.3");
check("duplicate phone (new email) → duplicate/phone", r4.status === 200 && r4.json?.status === "duplicate" && r4.json?.variant === "phone", JSON.stringify(r4.json));
// Grace period for the mail pipeline, then assert the outbox did NOT grow.
await sleep(8000);
const outboxAfter = outboxLines().filter((l) => (l.to || [l.to]).toString().includes(A.email)).length;
check("phone-only match sends NO email to the original address", outboxAfter === outboxBefore, `before=${outboxBefore} after=${outboxAfter}`);
const newEmailLeaks = outboxLines().filter((l) => (l.to || [l.to]).toString().includes(`verify-other-${run}`));
check("nothing sent to the submitted (unproven) email", newEmailLeaks.length === 0);
const afterPhoneDup = (await db.collection("cueInsiderClaims").doc(claimId).get()).data();
check("resend state untouched by phone-only match", afterPhoneDup.emailResendCount === 1);
const otherDocs = await db.collection("cueInsiderClaims").where("email", "==", `verify-other-${run}@example.com`).get();
check("no claim doc for the new email", otherDocs.empty);

// ---- Phase 4: resend cap ----
console.log("\n== Phase 4: resend cap ==");
await db.collection("cueInsiderClaims").doc(claimId).update({ emailResendCount: 3, lastEmailQueuedAt: Timestamp.fromMillis(Date.now() - 11 * 60 * 1000) });
const r5 = await submit(A, "10.1.1.4");
check("resend cap → duplicate/resend-limit", r5.status === 200 && r5.json?.status === "duplicate" && r5.json?.variant === "resend-limit", JSON.stringify(r5.json));

// ---- Phase 5: validation + turnstile ----
console.log("\n== Phase 5: validation ==");
const v1 = await submit({ ...A, email: "not-an-email" }, "10.1.2.1");
check("bad email → 422 field email", v1.status === 422 && v1.json?.field === "email", JSON.stringify(v1.json));
const v2 = await submit({ ...A, email: `v2-${run}@example.com`, phone: "12345" }, "10.1.2.1");
check("bad phone → 422 field phone", v2.status === 422 && (v2.json?.field === "phone" || v2.json?.field === "phone-country"), JSON.stringify(v2.json));
const v3 = await submit({ ...A, email: `v3-${run}@example.com`, phone: "+15551234567" }, "10.1.2.1");
check("US phone → 422 phone-country", v3.status === 422 && v3.json?.field === "phone-country", JSON.stringify(v3.json));
const v4res = await fetch(`${SITE}/api/cue-insider/claim`, {
  method: "POST",
  headers: { "content-type": "application/json", "x-forwarded-for": "10.1.2.1" },
  body: JSON.stringify({ ...A, email: `v4-${run}@example.com`, phone: "+962781234567" }),
});
check("missing turnstile token → 400 turnstile", v4res.status === 400 && (await v4res.json()).error === "turnstile");

// ---- Phase 6: per-IP rate limit ----
console.log("\n== Phase 6: per-IP rate limit ==");
const IP = "10.9.9.9";
let last = null;
for (let i = 0; i < 6; i++) {
  last = await submit(
    { ...A, email: `rl-${i}-${run}@example.com`, phone: `+96279${String(2000000 + i * 7)}` },
    IP
  );
}
check("6th submission from one IP → 429", last.status === 429 && last.json?.error === "rate-limited", JSON.stringify(last.json));

// ---- Phase 7: redeem → sheet status flip ----
console.log("\n== Phase 7: redeem → sheet flip ==");
const su = await fetch(AUTH_SIGNUP, {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ email: `redeemer-${run}@example.com`, password: "test1234", returnSecureToken: true }),
});
const { idToken } = await su.json();
const redeemRes = await fetch(`${FN_BASE}/redeemCueInsiderCode`, {
  method: "POST",
  headers: { "content-type": "application/json", authorization: `Bearer ${idToken}` },
  body: JSON.stringify({ data: { code: r1.json.code } }),
});
const redeemJson = await redeemRes.json();
check("redeem via callable succeeds", redeemRes.status === 200 && redeemJson?.result?.status === "redeemed", JSON.stringify(redeemJson).slice(0, 200));
await poll("sheet status flipped to redeemed", async () => {
  const rows = sheetRows(await sheetState());
  const row = rows.find((r) => r[0] === claimId);
  return row && row[9] === "redeemed" ? row : null;
});

console.log(`\n${failures === 0 ? "ALL PASS" : failures + " FAILURES"}`);
process.exit(failures === 0 ? 0 : 1);
