# Cue Insider Redemption Code — Contract for the Flutter App

Status: v1 · 2026-07-30 · owner: web/backend
Audience: Flutter team implementing claim-code redemption at app launch.
Source of truth for the algorithm: `src/lib/cue-insider/code.ts` (Cue-web). This document restates it exactly; if they ever disagree, the TypeScript module wins and this doc must be fixed.

---

## 1. Code format

```
CUE-XXXX-XXXX
```

- Display form: `CUE-` prefix + two groups of 4, uppercase, hyphen-separated.
- The **body** is the 8 characters after the prefix. The first 7 are random payload; the 8th is a checksum character.
- Canonical storage form (Firestore `cueInsiderClaims.code`) is the full display form `CUE-XXXX-XXXX`.

### Alphabet (29 characters — index order is load-bearing)

```
ABCDEFGHJKMNPQRTUVWXYZ2346789
```

Excluded on purpose: `O 0 I 1 L S 5` — these get misread when a code is read aloud or hand-typed at a restaurant table. **No valid code ever contains them.** If user input contains one after normalization, the code is invalid — but see §3: offer a forgiving mapping in the input UI, not in the validator.

## 2. Checksum (weighted mod-29, ISBN-10 style)

Let `idx(c)` be the 0-based index of character `c` in the alphabet above. For the 8-character body `b[0..7]`, position `i` (0-based) has weight `8 - i` (so payload weights are 8,7,6,5,4,3,2 and the check character has weight 1). A body is valid iff:

```
( Σ  (8 - i) × idx(b[i]) )  mod 29 == 0        for i = 0..7
```

To compute the check character during generation:

```
S = Σ (8 - i) × idx(b[i])   for i = 0..6
check = alphabet[ (29 - (S mod 29)) mod 29 ]
```

Because 29 is prime and every weight is nonzero mod 29, this catches **100% of single-character errors and 100% of adjacent transpositions** (verified exhaustively in the web repo's test suite). Reject bad checksums **offline** — no network call needed.

### Dart reference implementation

```dart
const String kCodeAlphabet = 'ABCDEFGHJKMNPQRTUVWXYZ2346789';

/// Returns the canonical body (8 chars) if [raw] is a structurally valid
/// code, or null if it fails length/alphabet/checksum checks.
String? normalizeAndValidateCueInsiderCode(String raw) {
  var s = raw.toUpperCase().replaceAll(RegExp(r'[\s-]'), '');
  if (s.startsWith('CUE')) s = s.substring(3);
  if (s.length != 8) return null;
  var sum = 0;
  for (var i = 0; i < 8; i++) {
    final idx = kCodeAlphabet.indexOf(s[i]);
    if (idx < 0) return null;
    sum += (8 - i) * idx;
  }
  return (sum % 29 == 0) ? s : null;
}

String formatCueInsiderCode(String body) =>
    'CUE-${body.substring(0, 4)}-${body.substring(4, 8)}';
```

## 3. Input handling rules (app side)

- Accept any of: `CUE-ABCD-EFGH`, `cue-abcd-efgh`, `ABCDEFGH`, `ABCD EFGH`, with any spacing/hyphenation. Normalize: uppercase → strip spaces and hyphens → strip leading `CUE`.
- Recommended UX forgiveness (before validation): map `O→Q`? **No.** Do not guess-map ambiguous glyphs — the excluded set means a typed `O`, `0`, `I`, `1`, `L`, `S`, `5` is always a misreading, but of *which* character is ambiguous (`0`/`O` could be `Q` or `D`…). Show "check the highlighted character" UX instead. Validation itself is strict.
- Arabic-Indic digits: users typing on Arabic keyboards may enter `٢٣٤٦٧٨٩` — map Arabic-Indic (U+0660–0669) and Extended Arabic-Indic (U+06F0–06F9) digits to ASCII before validation.
- Reject locally on invalid checksum with the `invalid-checksum` message; only call the backend for codes that pass offline validation.

## 4. Redemption API

Callable Cloud Function (Firebase Functions v2, region **me-central1**, project `cue-e00d5`):

```
redeemCueInsiderCode({ code: string })
```

- **Auth required** — called with a signed-in Firebase user. Unauthenticated calls are rejected (`unauthenticated`).
- `code` may be in any accepted input form; the server re-normalizes and re-validates.

### Success response

```jsonc
{
  "status": "redeemed",
  "code": "CUE-ABCD-EFGH",           // canonical display form
  "entitlement": {
    "product": "cue-insider",
    "months": 3,
    "startsAt": "2026-08-14T18:03:22.512Z",  // == redeemedAt (server time, ISO-8601 UTC)
    "endsAt": "2026-11-14T18:03:22.512Z"     // startsAt + 3 calendar months
  },
  "alreadyRedeemed": false            // true when this same uid re-calls with the same code
}
```

The entitlement window starts **at redemption**, not at signup and not at app launch. `endsAt` adds 3 calendar months (e.g. Nov 30 + 3mo → Feb 28/29 clamping on shorter months).

### Idempotency

- **Same uid, same code, called again** → success with the *original* entitlement window and `alreadyRedeemed: true`. Safe to retry on timeout.
- **Same uid, different (valid, unredeemed) code** → `failed-precondition` / `already-redeemed` (one entitlement per person; a uid cannot stack codes).
- **Different uid, code already redeemed** → `failed-precondition` / `already-redeemed`.

### Error contract

Errors are `HttpsError`s. `details.reason` is the stable machine-readable key — switch on it, not on the message:

| `code` (HttpsError)   | `details.reason`    | When                                                            |
| --------------------- | ------------------- | --------------------------------------------------------------- |
| `unauthenticated`     | —                   | No auth context                                                 |
| `invalid-argument`    | `invalid-checksum`  | Body fails length/alphabet/checksum (server-side re-check)      |
| `not-found`           | `not-found`         | Checksum-valid code that was never issued                       |
| `failed-precondition` | `already-redeemed`  | Code already redeemed (by anyone), or this uid already redeemed a different code |
| `failed-precondition` | `void`              | Code administratively voided                                    |
| `internal`            | —                   | Unexpected server error — safe to retry (idempotent)            |

Messages are English developer strings; localize user-facing copy in the app (suggested string keys: `cue_insider_redeem_error_invalid`, `_notFound`, `_alreadyRedeemed`, `_void`, `_generic`).

## 5. Firestore facts the app may rely on

- Codes live in `cueInsiderClaims/{claimId}` with `status: 'issued' | 'redeemed' | 'void'`. **Clients have zero read/write access** to `cueInsiderClaims`, `cueInsiderClaimIndex`, and `cueInsiderRedemptions` — all interaction is through the callable. Do not attempt direct reads; they will be denied by rules.
- Redemption is transactional: `status → 'redeemed'`, `redeemedAt` (server timestamp), `redeemedByUid` are set atomically, plus a `cueInsiderRedemptions/{uid}` doc that enforces one-entitlement-per-person and answers idempotent retries.
- A code is issued exactly once, at claim time, and is persisted before the claimant is ever shown or emailed it — any code that passes checksum but is `not-found` is a typo or a fabrication, never a "not yet synced" state.

## 6. Test vectors

Valid (generated by the reference implementation):

| Input (any form accepted)   | Canonical      |
| --------------------------- | -------------- |
| `CUE-AAAA-AAAA`             | `CUE-AAAA-AAAA` |
| `cue bbbb bbb3`             | `CUE-BBBB-BBB3` |
| `23467893`                  | `CUE-2346-7893` |

Invalid:

| Input             | Reason                                     |
| ----------------- | ------------------------------------------ |
| `CUE-AAAA-AAAG`   | `invalid-checksum` (check char must be A)  |
| `CUE-AAAA-AAG`    | `invalid-length`                           |
| `CUE-AAA0-AAAG`   | `invalid-characters` (`0` not in alphabet) |
| `CUE-ABCD-EFGH`   | `invalid-checksum`                         |

> **Correction 2026-07-31:** the vectors originally published here (`CUE-AAAA-AAAG`, `CUE-BBBB-BBBN`, `2346789Y` as valid; `CUE-AAAA-AAAA` as invalid) did **not** match the reference implementation — per §2, `checksumChar("AAAAAAA") = A`, `checksumChar("BBBBBBB") = 3`, `checksumChar("2346789") = 3`. Per the header rule ("the TypeScript module wins"), the tables above were regenerated from `code.ts` and verified independently by the Functions port (`cue-app/functions/test-cue-insider-core.mjs`).

(The web test suite regenerates these vectors from `code.ts` — see `src/lib/cue-insider/__tests__/code.test.ts`.)
