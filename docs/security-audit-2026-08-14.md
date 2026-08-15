# Cue web stack — security audit, 2026-08-14

**Scope:** `Adamqsm/Cue-web` (Next.js 14, Vercel, cue-app.net) and `Adamqsm/cue-app`
(Firebase backend, project `cue-e00d5`, region `me-central1`), with the Cue Insider
claim flow live in production and collecting name / email / phone.

Both repos were cloned fresh from GitHub for this audit (full history, all branches);
nothing was taken from prior-session notes. Findings were produced by parallel
per-dimension review and then put through an adversarial verification pass that tried
to refute each one — several were downgraded or refuted outright, and those
corrections are recorded here rather than quietly dropped.

**Live state at audit time (measured, not assumed):**

| | |
|---|---|
| `cueInsiderClaims` in production | **1 document** |
| `cueInsiderRedemptions` / `payments` / `reviews` | 0 documents |
| HyperPay | **sandbox only** — `HYPERPAY_BASE_URL` = `https://eu-test.oppwa.com`, `HYPERPAY_WEBHOOK_KEY` = the literal string `unset` |
| Resend | live (real `re_…` key in Secret Manager) |
| Deployed Firestore ruleset | `97da6377…`, **identical to repo `main`** |
| Deployed Storage ruleset | `c0ca0c70…`, **DRIFTED from repo `main`** |
| Rules test suite | 188/188 before, **205/205 after** (24 suites) |

The small production dataset is load-bearing for several decisions below: it is what
made the pseudonymisation and booking-price fixes safe to land now rather than
becoming migrations.

---

## 1. Verdict table

Severity is post-verification. "Fixed" means the change is committed on the
`security/audit-2026-08-14` branch of the relevant repo and its test/build evidence is
recorded in §3.

### 1. Secrets & credentials

| # | Check | Verdict | Sev | Evidence |
|---|---|---|---|---|
| 1.1 | Secrets in full git history (both repos, all branches) | **PASS** | — | `git rev-list --objects --all` + pickaxe for `private_key`, `BEGIN PRIVATE KEY`, `client_email`, `re_`, `AIza`, HyperPay tokens: no secret blob ever committed in either repo |
| 1.2 | `.env` / `.env.local` gitignored and never committed | **PASS** | — | `Cue-web/.gitignore:21-22` (`.env*.local`, `.env`); `git log --all -- .env .env.local` empty |
| 1.3 | Sheets SA key in Secret Manager, not plaintext env | **PASS** | — | `CUE_INSIDER_SHEETS_SA_KEY` bound as a *secret* env to `onCueInsiderClaimCreated`, `onCueInsiderClaimUpdated`, `retrySheetSync`. All 14 deployed functions checked: no secret material in plaintext `environmentVariables` |
| 1.4 | No `NEXT_PUBLIC_` on anything sensitive; no server secret in client bundle | **PASS** | — | Downloaded all 16 live JS chunks (686 KB) from www.cue-app.net and scanned. Only the Firebase web config and the Turnstile **site** key are present — both public by design. `0x4AAAAAAEQAZUEFkKGAwZqR` is 24 chars = site key, not the 35-char secret. No `SERVICE_ACCOUNT`, no `private_key`, no `TURNSTILE_SECRET`, no salt |
| 1.5 | Rotated SA key has no lingering references | **PASS** | — | `cue-insider-sheets@` has exactly **one** user-managed key (`907dd8ca…`, created 2026-08-14T16:33Z) and the Secret Manager payload carries that same `private_key_id`. Clean rotation, no stale reference anywhere |
| 1.6 | Hash salt has a public default | **FAIL → fixed** | med | `hash.ts:13` fell back to the literal `"cue-insider-v1"`, the same value printed in the repo's own `.env.example:35` |
| 1.7 | `emailHash` / `phoneHash` unsalted | **FAIL → fixed** | med | `claim-service.ts:100-101` called `sha256Hex()` directly. Jordanian mobile numbers are a ~10⁷ keyspace — an unsalted hash of one is a phone number with extra steps |
| 1.8 | Admin SDK service account has two live keys | **FAIL → needs Adam** | med | `firebase-adminsdk-fbsvc@` has **two** user-managed keys (`7d2274fd…` 2026-07-07, `ef9ff43b…` 2026-08-14), both non-expiring. Only one should be in use |

### 2. Firestore / Storage rules

| # | Check | Verdict | Sev | Evidence |
|---|---|---|---|---|
| 2.1 | Live rules vs repo — Firestore | **PASS** | — | Pulled ruleset `97da6377…` via the Rules API; byte-identical to `firestore.rules` on `main` (SHA-256 `D490EE9F…` both sides) |
| 2.2 | Live rules vs repo — Storage | **FAIL → fixed** | med | **Drift.** Live carried a `partner-applications/{applicationId}/{allPaths=**}` block that `main` has never had. It was deployed from the stale unmerged branch `feature/partner-applications-rules` (`ee683c9`) |
| 2.3 | Cue Insider collections deny-all to clients, R **and** W | **PASS** | — | `firestore.rules:320-343` — `cueInsiderClaims`, `cueInsiderClaimIndex`, `cueInsiderRedemptions`, `mailQueue`, `mailFailures`, `sheetSyncQueue`, `cueInsiderRateLimits`, `cueInsiderStats` are all `allow read, write: if false`. Confirmed by emulator tests, not just by reading |
| 2.4 | Can a client read another user's claim by guessing a doc ID | **PASS** | — | No path reaches those collections at all; the terminal `match /{document=**}` denies. Tests assert unauthenticated *and* authenticated get/list both fail |
| 2.5 | Siblings of the `isPopular`/`isNewOnCue` bug | **FAIL → fixed** | high | The venue pin-list itself is complete. But `paymentFieldsValidOnCreate()` let the **client author the deposit price of its own booking** — bounded only by "is int, >0, ≤1 000 000" and internal consistency. See §2 below |
| 2.6 | `reviews` collection rules | **FAIL → fixed** | med | Dormant but live and permissive: world-readable (`allow read: if true`), `status` pinned on update but never on create, and update re-validated neither `rating` nor any text bound |
| 2.7 | Storage rules — anonymous write surface | **FAIL → fixed** | med | The live `partner-applications` block allowed **fully unauthenticated** `create` of any filename at any depth, ≤10 MB PDF or ≤8 MB image |
| 2.8 | `firebase.json` / `firestore.indexes.json` | **PASS** | — | Nothing that weakens posture |
| 2.9 | Rules test suite | **PASS** | — | **205/205, 0 fail, 24 suites** (was 188/188; +12 new Storage tests, +5 new booking-price tests) |

### 3. Cloud Functions

| # | Check | Verdict | Sev | Evidence |
|---|---|---|---|---|
| 3.1 | Callables validate auth | **PASS** | — | All 14 deployed functions enumerated against live Cloud Run IAM. `redeemCueInsiderCode`, `sendTestPush`, `setVenueMember`, `prepareHyperpayCheckout`, `getHyperpayStatus` all check `req.auth` first; `assignVenueOwner` requires `role == 'admin'`. The `allUsers` run-invoker binding on these is the normal Firebase callable pattern — auth is enforced in-code, not at the IAM layer |
| 3.2 | `retrySheetSync` is not publicly reachable | **PASS** | — | Live Cloud Run IAM: invoker is `1060796450499-compute@…` only, **not** `allUsers`. Same for `retryFailedMail`. This materially reduces the "spam the Sheet" risk |
| 3.3 | App Check enforcement | **FAIL → needs Adam** | med | Zero `enforceAppCheck` anywhere in `functions/src`. Not fixable in code alone — needs client attestation + console config |
| 3.4 | Rate limiting beyond Turnstile on claim submission | **PASS** | — | `claim-service.ts:104-118` — a Firestore transaction on `cueInsiderRateLimits/{ipHash}`, 5 per 10 min. It exists and is real. Its weakness (IP-keyed, so rotatable) is noted in §4 |
| 3.5 | Redemption-code entropy | **PASS** | — | `code.ts:100-120` — `crypto.randomBytes`, 29-char alphabet, 7 random chars + derived checksum, **with rejection sampling** (`LIMIT = 256 - 256 % 29`) so there is no modulo bias. Keyspace 29⁷ ≈ 1.72 × 10¹⁰. Not sequential, not time-derived, collision-checked on issue |
| 3.6 | Brute-force protection on `redeemCueInsiderCode` | **FAIL → needs Adam** | med | A failed redeem writes nothing: no counter, no lockout, no backoff. With 1 code issued the guessing risk is negligible (≈6 × 10⁻¹¹/attempt); the real cost is unbounded billed invocations. Downgraded from the initial "high" because the keyspace is genuinely large and the code is CSPRNG-derived |
| 3.7 | PII in Cloud Functions logs | **FAIL → fixed** | med | Two sites. `mail.ts:234` logged the full recipient address on send failure. And `cue-insider.ts:114` logged `indexRef.id` — which is `code_<BODY>`, i.e. **the live redemption code in plaintext**. Anyone with project Viewer could have read a working entitlement out of Cloud Logging. Only reachable on a should-be-impossible inconsistency path, but it is exactly the "no code in logs" check |
| 3.8 | PII in web logs | **FAIL → fixed** | med | `api/lead/route.ts:88` logged the **entire** submission — name, email, phone, free-text message — on every request |
| 3.9 | `retrySheetSync` retry bounds | **PASS** | low | `sheets.ts:63` `MAX_QUEUE_ATTEMPTS = 8` with exponential backoff capped at 1 h (`sheets-core.ts:103-114`); `retryFailedMail` flips to terminal `dead` at 5 attempts. Bounded, not infinite |
| 3.10 | HyperPay webhook — GCM tag verified | **PASS** | — | `hyperpay-core.ts:71-87` calls `setAuthTag()` before `final()`; a forged or tampered body throws and is rejected 401 at `hyperpay.ts:368-372` |
| 3.11 | HyperPay webhook — replay protection | **PARTIAL** | low | There is **no** nonce and no timestamp freshness window — the literal answer to the question asked is "absent". But replay is neutralised in practice: `reconcilePayment` is transactional and returns early on an already-`paid` doc (`hyperpay.ts:229`), so re-POSTing a captured envelope is a no-op. Left as-is; the whole path is dormant (webhook key is `unset`) |
| 3.12 | Webhook secret storage | **PASS** | — | `HYPERPAY_WEBHOOK_KEY` from Secret Manager, never plaintext |

### 4. Claim form / API route

| # | Check | Verdict | Sev | Evidence |
|---|---|---|---|---|
| 4.1 | Server-side re-validation | **PASS** | — | `claim/route.ts:39-51` re-validates types and enums server-side independent of the client. Verified live: `POST {"name":123}` → 422, `POST {}` → 422, both **before** any Firestore write |
| 4.2 | Google Sheets formula injection | **PASS** | — | Two independent defences: `sheets-core.ts:63-65` prefixes `'` to any value starting `= + - @ \t \r`, **and** every write uses `valueInputOption=RAW` (`sheets.ts:214,226`), under which Sheets never evaluates a formula |
| 4.3 | Resend email template injection (stored XSS) | **PASS** | — | `escapeHtml()` (`email/templates/base.ts:56`) is applied at **every** interpolation site, including the claimant's name via `s.greeting` (`base.ts:199`, `:269`) |
| 4.4 | Turnstile verified server-side | **PASS** | — | `turnstile.ts:24-33` POSTs to `challenges.cloudflare.com/turnstile/v0/siteverify` and checks `data.success === true`; `remoteip` is passed |
| 4.5 | Turnstile fail mode | **PASS** | — | `turnstile.ts:16-20` returns `unconfigured` → route 503s in production. Fails **closed**; the always-pass test secret is dev-only |
| 4.6 | Duplicate/dedup race | **PASS** | — | Not a read-then-write. `claim-service.ts:126-212` is one Firestore transaction using `txn.create()` on deterministic index doc IDs — serializable, so concurrent duplicates cannot both win |
| 4.7 | Enumeration oracle | **FAIL → accepted, documented** | med | `{status:"duplicate",variant}` vs `{status:"issued",code}` are distinguishable, and `variant:"phone"` discloses that a phone is registered even when the submitted email is not. Not "fixed": collapsing the variants breaks the user-facing copy, and each probe costs a fresh single-use Turnstile token plus the 5/10 min IP budget |
| 4.8 | Identity squatting | **FAIL → accepted, documented** | med | Nothing proves control of the email or phone before a code is issued against them. The code is only ever mailed to the address on the original claim (`claim-service.ts:155-159`), so the squatter gains nothing — but a victim's address can be burned before they claim |
| 4.9 | Unbounded email/phone length | **FAIL → fixed** | low | `name` was capped 2-120; `email`/`phone` were uncapped, and `isValidEmail` ran the regex **before** the 254 check. See the correction in §5 — this is *not* a ReDoS |
| 4.10 | HTTPS / HSTS | **PASS** | — | Apex 308s to `www`; HSTS present on every response (Vercel default). Strengthened — see 5.3 |

### 5. HTTP security headers

Measured live against `https://www.cue-app.net/en/claim` **before** the fix — the only
security header present was Vercel's default HSTS:

| # | Header | Before | After (verified on the built app) | Sev |
|---|---|---|---|---|
| 5.1 | `Content-Security-Policy` | **absent** | set, and proven to block off-origin script | high |
| 5.2 | `X-Frame-Options` / `frame-ancestors` | **absent — the PII claim form was iframeable** | `DENY` + `frame-ancestors 'none'` | med |
| 5.3 | `Strict-Transport-Security` | `max-age=63072000` only | `+ includeSubDomains` | low |
| 5.4 | `X-Content-Type-Options` | **absent** | `nosniff` | info |
| 5.5 | `Referrer-Policy` | **absent** | `strict-origin-when-cross-origin` | info |
| 5.6 | `Permissions-Policy` | **absent** | camera/mic/geo/payment/usb denied | info |

5.4-5.6 were downgraded to *info* by the verification pass — no concrete exploit was
demonstrable for any of them on this site. They were fixed anyway; they are free.

### 6. Dependencies

| # | Check | Verdict | Sev | Evidence |
|---|---|---|---|---|
| 6.1 | `npm audit` — Cue-web | **FAIL → partially fixed** | med | 16 vulnerabilities (8 high / 8 moderate / 0 critical) → **13 (5 high / 8 moderate)** after a non-breaking `npm audit fix` |
| 6.2 | `npm audit` — functions | **PASS** | low | No critical/high |
| 6.3 | `next@14.2.35` in repo | **PASS** | — | Pinned exactly in `package.json` and `package-lock.json` |
| 6.4 | `next@14.2.35` actually deployed to production | **PASS** | — | Verified behaviourally, not by trusting the merge: CVE-2025-29927 (middleware bypass, fixed in 14.2.25) **does not reproduce**. `GET /claim` still 307s to `/en/claim` under all four `x-middleware-subrequest` variants, so middleware ran |
| 6.5 | Flutter dependencies | **PASS** | info | Initially flagged, then refuted on verification — the two exact pins are deliberate and neither is vulnerable |

The 5 remaining highs are all in the `next` / `eslint-config-next` chain and cannot be
cleared without a framework upgrade. Worth noting for prioritisation: **4 of the 5 are
build- or dev-time only** (`eslint-config-next`, `@next/eslint-plugin-next`, `postcss`,
`glob`); `next` itself is the only one in the production runtime.

### 7. Data minimisation / GDPR

| # | Check | Verdict | Sev | Evidence |
|---|---|---|---|---|
| 7.1 | Consent banner gates analytics | **PASS** | — | `analytics.ts:18-21` returns early unless `localStorage["cue-consent"] === "v1"`. The banner is **not** cosmetic — an initial "partial" finding here was refuted on verification |
| 7.2 | Consent banner vs the claim form itself | **PASS** | low | The claim submission is user-initiated and rests on Art. 6(1)(a)/(b), which is a different basis from the cookie consent the banner governs. `ClaimModalProvider.tsx:75-78` additionally defers the modal until consent is settled |
| 7.3 | Retention mechanism | **FAIL → needs Adam** | med | There is none. No TTL policy in `firestore.indexes.json`, no scheduled cleanup function. Claim PII lives forever in Firestore **and** in the Sheet |
| 7.4 | Retention promise vs reality | **FAIL → needs Adam** | low | The privacy policy promises "only for as long as necessary" (`en.ts:1250`, mirrored in `ar.ts`). A promise with no mechanism is the gap |
| 7.5 | `ipHash` not persisted with the claim | **PASS** | low | Verified in code: `hashIp()`'s only consumer is the rate-limit doc **ID** (`claim-service.ts:104`). It is never written into the claim document, the Sheet row, or a log line. The design decision holds. Caveat: the `cueInsiderRateLimits` docs are themselves never cleaned up, so the pseudonymised identifier persists indefinitely as a doc ID |
| 7.6 | Data-subject access/erasure path | **FAIL → needs Adam** | med | No DSR function exists in `functions/src`. Erasure would today be a manual Firestore + Sheet + `mailQueue` + `mailFailures` sweep |

### 8. Google Sheet access control

| # | Check | Verdict | Sev | Evidence |
|---|---|---|---|---|
| 8.1 | Sheet is not public / link-shared | **PASS** | — | Probed anonymously on four independent vectors — `/edit`, `/htmlview`, `/export?format=csv`, `/gviz/tq` — **all return HTTP 401**. It is not link-shared |
| 8.2 | Named-principal list | **CANNOT VERIFY → needs Adam** | — | The Drive API is **disabled** on project `cue-e00d5`, so `permissions.list` returns 403 for both Adam's own credential and the service account. Who specifically has access cannot be enumerated programmatically |

---

## 2. The one finding worth reading in full

**A client could set the price of its own booking** — `firestore.rules`,
`paymentFieldsValidOnCreate()`.

This is the same class as the `isPopular`/`isNewOnCue` bug that was fixed earlier: a
field the server's later decisions depend on, left client-writable. The venue pin-list
itself is now complete and correct — this was hiding one function further down.

The old rule constrained `prepaymentPerGuest` only to *is int, > 0, ≤ 1 000 000*, plus
internal consistency with `partySize`. Nothing tied it to any server-side value. The
in-code comment justified this with "until the events model gives venues a server-side
price to validate against" — but `bookingPolicy.depositFils` / `depositRequired` have
been on every venue document all along, and the create rule already fetched the venue
three times a few lines below.

Attack: write the booking document directly with the client SDK, naming
`prepaymentPerGuest: 1000` on a 30 JOD/head event. Every clause passes.
`prepareHyperpayCheckout` then charges what the booking says (`hyperpay.ts:110`), and
`reconcilePayment` stamps `paymentStatus: 'secured'` once collected ≥ required. The
mirror case is worse and simpler: against a venue with `depositRequired == true`, omit
the money fields entirely and the defaults give you `not_required` — a deposit-required
booking with no deposit.

It is not exploitable for real money **today** only because HyperPay is in sandbox and
no venue yet charges a deposit. It becomes a live revenue leak on the day deposits go
live, which is exactly why it is worth fixing now, while `payments` is empty and the fix
costs nothing.

Fixed by pinning the amount to the venue's own `bookingPolicy`, with 5 new tests
covering under-price, over-price, deposit-dodging, and both no-deposit-policy paths.

> **Deploy note.** This now requires a venue to carry `depositRequired: true` and a
> matching `depositFils` before any prepayment booking can be created. Before events
> ship, the Flutter client must read `venue.bookingPolicy.depositFils` instead of the
> hardcoded `kPlaceholderEventPriceFils` in
> `lib/features/venue/venue_detail_screen.dart:39`, or legitimate event bookings will be
> denied. Safe to land now: all 7 production venues have `depositRequired: false` and
> `payments` is empty.

---

## 3. Fixes applied

All on branch `security/audit-2026-08-14` in each repo. **Not pushed** — see §6.

### Cue-web — commit `c887a5d`

| File | Change |
|---|---|
| `next.config.mjs` | Added `headers()` with CSP, `X-Frame-Options: DENY`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`, HSTS + `includeSubDomains` |
| `src/lib/cue-insider/hash.ts` | Removed the public default salt; fail closed in production; added `hashPii()` |
| `src/lib/cue-insider/claim-service.ts` | `emailHash`/`phoneHash` now salted via `hashPii()` instead of bare `sha256Hex()` |
| `src/lib/cue-insider/normalize.ts` | Length check before the regex; exported `EMAIL_MAX_LENGTH` |
| `src/app/api/cue-insider/claim/route.ts` | Cap raw `email` at 254 and `phone` at 32 at the edge |
| `src/app/api/lead/route.ts` | Redact PII in logs (masked email/phone, lengths only); `LEAD_LOG_PII=1` opt-in restores the old behaviour; warns when no webhook is configured |
| `.env.example` | `CUE_INSIDER_IP_HASH_SALT` documented as required with no default, plus generation command and the migration caveat |
| `.gitignore` | `.env.*` (the old rules missed `.env.production` / `.env.development`) plus service-account / credential / key patterns |
| `package-lock.json` | Non-breaking `npm audit fix`: 16 → 13 advisories, 8 → 5 high |

**Verification:** `npm run build` exit 0, all routes still prerender **static** (the CSP
was deliberately designed not to force dynamic rendering). Headers confirmed on the
built server:

```
Content-Security-Policy: default-src 'self'; base-uri 'self'; object-src 'none';
  form-action 'self'; frame-ancestors 'none';
  script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com; …
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()
Strict-Transport-Security: max-age=63072000; includeSubDomains
```

And the CSP was exercised in a real browser against the built app, not just read back
off a header:

- Turnstile's dynamically-injected script → **LOADED** (the form still works)
- `https://evil.example.com/x.js` → **BLOCKED**, `script-src-elem` violation fired
- Page fully hydrated, claim form present, zero console errors

### cue-app — commits `e9c7b19`, `b98c195`

| File | Change |
|---|---|
| `storage.rules` | Brought the drifted `partner-applications` block into the repo and narrowed it: exact paths only (`menu.pdf`, `photos/photo-N.ext`), `applicationId` must match the 20-char Firestore auto-id shape, content-type and size pinned |
| `firestore.rules` | `paymentFieldsValidOnCreate()` pins the deposit to `venue.bookingPolicy.depositFils`; `reviews` closed to `allow read, write: if false` until the feature ships |
| `functions/src/mail.ts` | Added `maskEmail()`; recipient address masked in the send-failure log |
| `functions/src/cue-insider.ts` | Stopped logging `indexRef.id` (= the plaintext redemption code) on the inconsistency path; `claimId` alone is the correlator |
| `firestore-tests/storage-rules.test.mjs` | **New** — 12 tests over the partner-applications block |
| `firestore-tests/booking-rules.test.mjs` | 5 new tests for the booking-price pin |
| `firestore-tests/package.json` | Test script now boots the Storage emulator too |
| `.gitignore` | Root ignore file had **no** secret rules while `RUNBOOK.md` and `functions/ONBOARDING.md` both tell the operator to place a service-account JSON here. Added env / SA / key patterns (`functions/.gitignore` already covered its own subtree) |

**Verification:** both rules files compile clean against Google's own rules compiler
(read-only `projects:test` — creates and releases nothing), and the suite is
**205/205, 0 fail**.

### One fix attempted and deliberately reverted

The new Storage rules were first written with `resource == null` on `create` to make
overwriting an existing upload impossible. The emulator showed this **denied the
legitimate first upload as well**, which would have broken `/partner/apply` outright. It
was reverted: a guard that blocks the real flow is worse than the risk it addresses. The
residual — an overwrite is accepted as a `create` — is bounded by `applicationId` being
a 20-char Firestore auto-id (~119 bits), so an attacker cannot find a real application's
path. This is pinned by a deliberately-named `KNOWN:` test so it stays visible instead
of being quietly assumed away.

---

## 4. Corrections to findings

Reported so the record is accurate rather than uniformly alarming.

- **"ReDoS in the email regex" — not a ReDoS.** One verification pass upgraded this to
  *high*, citing quadratic backtracking. Measured instead of argued: `EMAIL_RE` is
  **linear**. 600 KB matches in ~15 ms and scales linearly, because `[^\s@]` excludes
  `@`, so the `+` quantifiers cannot overlap across the separator and the classic
  nested-quantifier blowup cannot occur. The real defect was only that an unbounded
  string reached the matcher at all, and that the length check was ordered after it.
  Fixed as a **low**.
- **"Consent banner is cosmetic" — refuted.** `analytics.ts:18-21` genuinely gates on
  consent. Recorded as PASS.
- **"Flutter dependencies outdated/vulnerable" — refuted.** The exact pins are
  deliberate and neither package is vulnerable.
- **`retrySheetSync` abuse — severity cut.** The initial reading assumed it was publicly
  invokable. Live Cloud Run IAM shows the invoker is the compute service account only.
- **Header findings 5.4-5.6 downgraded to info.** No concrete exploit was demonstrable;
  fixed regardless because they cost nothing.
- **Redeem brute-force downgraded high → medium.** The keyspace is 1.72 × 10¹⁰ from a
  CSPRNG with rejection sampling, and exactly one code exists. The honest risk is billed
  invocations, not code theft.

---

## 5. Two things found along the way

Neither was on the checklist; both are real.

### Every Firebase env var in Vercel is BOM-corrupted, and it silently breaks `/partner/apply`

All six `NEXT_PUBLIC_FIREBASE_*` values in the live bundle carry a leading U+FEFF:

```js
apiKey:"﻿AIzaSyAVmJUrWAKY9hyK00EaH3VjVo4pCn58-PU",
authDomain:"﻿cue-e00d5.firebaseapp.com", projectId:"﻿cue-e00d5", …
```

Proven, not inferred — the same key was sent to Google's Identity Toolkit both ways:

| Key | Result |
|---|---|
| clean | **HTTP 200** — accepted |
| BOM-prefixed (what production ships) | **HTTP 400** — rejected |

So every browser-side Firebase call from cue-app.net fails. In `ApplyForm.tsx` the
`setDoc` at :187 throws, the `catch` at :217 shows "submit failed", and — because the
`/api/lead` fallback is *after* it in the same `try` — **the lead is never forwarded
anywhere**. Partner applications are being lost silently, and any Storage uploads that
did succeed are orphaned.

This is almost certainly a Windows PowerShell artifact: `Out-File -Encoding utf8` and
`>` both write a BOM, and pasting from such a file into Vercel carries it in.

Not fixable from code — it is a Vercel dashboard change. Steps in §6.

### Anonymous sign-up is open, and each account writes a Firestore document

Discovered because one of my own probes tripped it. `accounts:signUp` with the public
web API key succeeds unauthenticated, and the gen-1 `onUserCreate` trigger then writes a
full `users/{uid}` document. That is an unauthenticated, unbounded write amplifier: a
loop can mint auth users and Firestore documents indefinitely, billed to the project.
There are already 6 anonymous accounts from earlier testing.

Mitigation is App Check on Identity Toolkit, or disabling the Anonymous provider if the
Flutter app does not rely on it — both console actions (§6).

**Audit side-effect, needs your call:** that probe created one real anonymous user,
`pGAI7FvNcXPhJYfqCYfWKcGPMKO2`, plus its `users/` document, at 2026-08-14T20:07Z. Both
are mine, both are junk, and I have not deleted them — deleting from production is your
decision, not mine. Removal:

```bash
firebase auth:delete pGAI7FvNcXPhJYfqCYfWKcGPMKO2 --project cue-e00d5
```

then delete `users/pGAI7FvNcXPhJYfqCYfWKcGPMKO2` in the Firestore console.

---

## 6. Still needs Adam

Ordered by urgency. Everything here needs a dashboard or console I do not have.

### Before you deploy the Cue-web branch — blocking

1. **Confirm `CUE_INSIDER_IP_HASH_SALT` is set in Vercel production.** The salt fix
   fails **closed**: if that variable is unset, the claim API will start returning 503
   and the claim flow goes down. Vercel → cue-website → Settings → Environment
   Variables. If it is missing, add it first (`Production`, Encrypted):
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   Setting a salt where there was none changes `emailHash`/`phoneHash` for future
   claims. With exactly **1** claim in production that is a non-issue — the one existing
   claimant could re-claim. Do it now rather than at 10 000 rows.

2. **Fix the BOM in the Firebase env vars.** Vercel → Settings → Environment Variables →
   for each of the six `NEXT_PUBLIC_FIREBASE_*` values, delete and retype it (do not
   paste from a file). Verify after redeploy:
   ```bash
   curl -s https://www.cue-app.net/en/partner/apply | grep -o '_next/static/chunks/app[^"]*page[^"]*js' | head -1
   ```
   then fetch that chunk and confirm no `﻿` precedes `AIzaSy`. Until this is fixed,
   partner applications are being lost.

### Security posture — high value

3. **Delete the older Admin SDK service-account key.** `firebase-adminsdk-fbsvc@` has two
   non-expiring user-managed keys. Establish which one Vercel's
   `FIREBASE_SERVICE_ACCOUNT_JSON` uses (decode it and read `private_key_id`), then
   delete the other in Console → IAM & Admin → Service Accounts → Keys. Candidates:
   `7d2274fdac0b16d445da7ebe4d7abbadf5d5f823` (2026-07-07) and
   `ef9ff43b5e1c2e687e416f36279e932ad833a75f` (2026-08-14).

4. **Close anonymous sign-up.** Firebase Console → Authentication → Sign-in method. If
   the Flutter app does not use anonymous auth, disable the provider. If it does, enable
   **App Check** and enforce it on Identity Toolkit + Firestore + Cloud Storage
   (Console → App Check). App Check also closes 3.3 and bounds both the redeem
   brute-force (3.6) and the anonymous Storage upload surface.

5. **Deploy the rules.** The repo is now the source of truth again, and the Storage drift
   is only closed once you deploy:
   ```bash
   firebase deploy --only firestore:rules,storage --project cue-e00d5
   ```
   Read the deploy note in §2 first — it is the one change with client-side implications.

6. **Merge or delete `feature/partner-applications-rules`.** That stale branch is what
   the live Storage rules were deployed from. It is far behind `main` (it predates Track
   C, HyperPay and Cue Insider entirely), so do **not** merge it — its content is now on
   the audit branch. Delete it so it cannot be deployed from again.

### Verify manually

7. **Google Sheet sharing (item 8).** I proved it is not link-shared — all four anonymous
   vectors return 401 — but I could not enumerate *who* has access, because the Drive API
   is disabled on the project. Open the Sheet → Share and confirm the list is exactly
   `cue-insider-sheets@cue-e00d5.iam.gserviceaccount.com` plus named humans, that General
   access is "Restricted", and that no `@qasem-group.com`-wide domain share is present.
   Leaving the Drive API disabled is a fine outcome — it is a small hardening in itself.

8. **Vercel env var encryption.** Confirm `TURNSTILE_SECRET_KEY`,
   `FIREBASE_SERVICE_ACCOUNT_JSON`, `CUE_INSIDER_IP_HASH_SALT` and `LEAD_WEBHOOK_URL` are
   marked **Encrypted** / Sensitive and are **not** `NEXT_PUBLIC_`-prefixed. I verified
   from the live bundle that none of them leak to the client, which is the outcome that
   matters — but the dashboard flag is worth eyeballing.

### Plan, don't rush

9. **Retention + DSR (7.3, 7.4, 7.6).** Decide a retention period, then implement it as a
   scheduled function that sweeps `cueInsiderClaims`, `cueInsiderClaimIndex`, `mailQueue`,
   `mailFailures` and the Sheet row, plus a documented erasure path. `mailFailures` also
   stores the recipient address (`mail.ts:131`) and needs to be in scope. The privacy
   policy already promises this; today nothing implements it.

10. **Next.js upgrade (6.1).** 5 high advisories remain and only a framework upgrade
    clears them — but note 4 of the 5 are build/dev-time only. `next` itself is the sole
    production-runtime one, and the specific advisories mostly target self-hosted /
    custom-server / Server Actions paths that Vercel mitigates. Worth doing on a branch
    with a full regression pass; not an emergency.

11. **Enumeration + squatting (4.7, 4.8).** Both are inherent to a claim flow with no
    ownership proof. The real fix is emailing a confirmation link and only issuing the
    code on click. That is a product change, not a patch — flagged for the roadmap.
