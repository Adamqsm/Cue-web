# Google Business Profile — Submission Package

> **This is content prep only.** Account creation and verification must be done by Adam,
> signed in at [business.google.com](https://business.google.com) — recommended account:
> **adam@cue-app.net** (it already owns the Search Console property, which keeps GSC + GBP
> under one roof and can ease verification). Every value below is pulled from the live site,
> the repo, or existing brand assets — the two things that don't exist yet (phone number,
> square logo/cover exports) are flagged as blockers, not invented.

**Copy-paste rule:** text inside fenced blocks is paste-ready, exactly as it should go in.

---

## 0. Blockers to resolve before starting

| # | Blocker | Why | Resolution |
|---|---|---|---|
| 1 | **No business phone number exists** — the site has no phone anywhere (only form placeholders like "+962 7X XXX XXXX"). | GBP requires a phone in the create flow and may call it during verification. | Adam provides a Jordanian number (a dedicated mobile/eSIM is ideal; your own number works). It can be **hidden from the public profile** after creation if desired — but the number entered becomes NAP ground truth, so whatever you choose here should later go on the site footer/schema too, identically formatted. |
| 2 | **Legal-entity name mismatch.** Site legal pages: "**Cue Technologies**, operating under the registered trade name 'Cue'" + footer "A **Qasem Capital & Enterprise** company." Your brief: parent "**Qasem Portal, LLC**", legal entity "**Adam Qasem Enterprise Holdings L.L.C.**". | GBP's profile never shows a legal name, but **video/document verification** will — the registration document you show must be the real one, and ideally the site's legal pages shouldn't contradict it. | Confirm which entity actually holds the JO registration. If it isn't "Cue Technologies", the legal pages (`legal.terms/privacy/dpa/notice` in both dictionaries) need a correction pass — separate task, your call. For GBP purposes: bring the *actual* registration paper; the profile name stays "Cue" regardless (see §4). |
| 3 | Square logo + 16:9 cover don't exist as files yet (§6). | GBP needs both for a complete profile. | Two quick exports from existing art — listed in §6. |

---

## 1. Business category

**Primary: `Software company`** — still the right call. Confirmed reasoning:

- **Not "Restaurant"** — that category declares Cue itself a food venue: wrong entity type, wrong
  surfaces (menus, dine-in attributes), and a suspension risk when verification shows no restaurant.
- **Not "Internet marketing service"** — that's for agencies selling marketing.
- GBP has no "reservation platform" category. The closest real-world precedent: reservation
  platforms' own HQ profiles use "Software company".

The category field is a live autocomplete — type slowly and scan what it offers:

- If a literal **"E-commerce service"** appears → add as **secondary** (optional; bookings +
  deposits flow through the platform).
- If anything like "Reservation service" genuinely appears (unlikely) → prefer it as secondary,
  keep Software company primary.
- Add nothing else. Fewer, truer categories beat many loose ones.

## 2. Business description (750-char limit)

GBP has **one** description field, single language. Recommendation: use the **English** version
in the field (brand SERP is currently EN-dominant); the Arabic version goes out the same day via
the first Post (§7) and into Services descriptions later — so AR presence starts on day one
without machine-mixing one field.

Both versions are composed from live site copy (hero subtitle, about.meta, FAQ answers, partner
positioning) with GBP's editorial rules applied — no URLs, no superlatives ("best" removed), no
promo pricing.

**English (~640 chars — fits):**

```
Cue is a restaurant reservation platform built in Amman, Jordan. Guests browse Amman's restaurants — from Abdoun to Rainbow Street — pick a date, time, and party size, and get instant confirmation in the app, with easy group bookings and split payments so everyone covers their share. Booking is free for guests. For restaurants, Cue replaces scattered DMs, phone calls, and paper books with one reservations dashboard: structured requests, fewer no-shows, and control over event nights and deposits. The platform is fully bilingual in English and Arabic, serving diners and restaurant operators across Amman.
```

**Arabic (~490 chars — for the launch post + Services; composed from approved AR site copy —
the hero subtitle, about description, and FAQ answers; review before use like any AR string):**

```
‏Cue منصّة لحجز طاولات المطاعم بُنيت في عمّان، الأردن. يتصفّح الضيوف مطاعم عمّان — من عبدون إلى شارع الرينبو — ويختارون التاريخ والوقت وعدد الأشخاص، مع تأكيدات فورية في التطبيق، وحجوزات جماعية سهلة، وتقسيم للدفعات ليدفع كلٌّ حصّته. التصفّح والحجز مجّانيان للضيوف. وللمطاعم، تستبدل Cue الرسائل والمكالمات ودفاتر الورق بلوحة تحكّم واحدة للحجوزات: طلبات منظّمة، وحالات عدم حضور أقل، وتحكّم بليالي الفعاليات والعرابين. المنصّة ثنائية اللغة بالكامل بالعربية والإنجليزية.
```

## 3. Service area (service-area business — no address shown)

In the create flow, answer **"No"** to *"Do you want to add a location customers can visit?"* —
Cue is a **service-area business**; no storefront address is listed or shown publicly. This
matches the schema (locality-level `PostalAddress`, no street) shipped in PR #21.

Service areas (GBP allows up to 20; its picker only accepts places its index knows — add
whatever resolves, skip what doesn't; city-level coverage already includes every neighborhood):

1. **Amman, Jordan** ← the one that matters; add first
2. Abdoun, Amman
3. Sweifieh, Amman *(if not found, try "Swefieh")*
4. Jabal Amman, Amman
5. Shmeisani, Amman
6. Jabal Al Weibdeh, Amman *(site copy says "Al Weibdeh")*
7. Dabouq, Amman
8. Seventh Circle *(a landmark — likely won't resolve; skip if absent)*
9. Rainbow Street *(a street — likely won't resolve; skip if absent)*

These are exactly the 8 neighborhoods in the site's `Service.areaServed` schema (PR #21), so
GBP and structured data tell the same story. Do **not** add other cities — the platform serves
Amman.

## 4. NAP — name, phone, website (+ cross-check against the codebase)

**Business name:**

```
Cue
```

- This is the guideline-correct choice, and it's defensible: the legal notice on the site says
  Cue Technologies operates "under the registered trade name **'Cue'**", and the schema
  `Organization.name` is `Cue`. GBP's rules require the real-world name **without descriptors**.
- **The collision question** (the audit found "CUE & CAFE" in Amman plus Cue-named restaurants
  in Tel Aviv/Amsterdam/India on Maps): do **not** solve it with a keyword suffix like
  "Cue – Restaurant Reservations" — added descriptors violate GBP's name policy and are a
  common hard-suspension trigger, which costs far more than the collision. Category +
  description + service area do the disambiguating.
- Acceptable fallback **only if** Google's duplicate-detection or support flow forces a
  distinction: **"Cue App"** (evidenced by the domain cue-app.net and real user queries "cue
  app"/"cue application" in Search Console). Never the descriptor form.

**Phone:** ⛔ **none exists — blocker #1.** Enter the number Adam designates; format Jordan
national `07x xxx xxxx` (GBP stores it E.164 `+9627xxxxxxxx`). Whatever is entered here becomes
the canonical business number → afterwards it should be added to the site footer and
`LocalBusiness.telephone` in `src/lib/seo.ts` **identically**, so NAP stays consistent (that
schema field is currently — deliberately — absent).

**Website:**

```
https://www.cue-app.net/?utm_source=gbp&utm_medium=organic
```

- `www` is the canonical host (apex 308-redirects; all schema/canonicals use www).
- The root URL locale-negotiates (EN/AR visitors each land on their language) and the
  middleware **preserves query strings** through that redirect (verified in
  `src/middleware.ts` — `nextUrl.clone()` keeps `search`), so the UTM survives into analytics.

**Codebase cross-check (as of PR #21):** `Organization.name` = "Cue" ✓ matches. `sameAs` =
removed (placeholders gone) ✓ nothing to contradict — when real social handles exist, add them
to GBP's social-links section **and** `src/lib/seo.ts` + `footer.social` in the same pass.
`LocalBusiness.address` = Amman/JO locality-only ✓ matches the no-storefront setting.
`LocalBusiness.telephone` = absent ✓ consistent until blocker #1 is resolved. Email: no public
address exists on the site; the GBP **account** is adam@cue-app.net (not displayed publicly).

## 5. Website link + attributes + hours

- **Attributes** (available set varies by category — enable what appears):
  - *From the business* → **Identifies as family-owned**: only if you want it public (true —
    "A Qasem Capital & Enterprise company"); optional.
  - **Online appointments / Online booking: Yes** — the product *is* online booking.
  - *Service options* → **Online service: Yes**; anything "onsite/in-store": **No**.
- **Opening date:** GBP supports future dates — when the launch date is fixed, set it (this also
  unlocks the "Recently opened" treatment around launch). Until then leave empty.
- **Hours:** leave **unset** for now. An online platform with no staffed support line shouldn't
  claim hours it can't answer; "Open 24 hours" is defensible once in-app booking is live —
  revisit at launch (also noted in `docs/seo-maintenance.md` event triggers).

## 6. Photos & logo checklist (GBP specs vs. what exists)

| Slot | GBP spec | Asset | Status |
|---|---|---|---|
| **Logo** | Square, 720×720 px (min 250×250), JPG/PNG | `public/brand/logo-terra.png` (or `logo-ink`) is **3961×2729 — not square** | 🛠 **Create:** pad the mark to a 720×720 canvas on a solid brand ground (paper `#FAFAFA` or ink `#161A23` with the cream mark). 5-minute export. |
| **Cover** | 16:9, 1024×576 min (1920×1080 ideal) | None exists. Nearest real art: the live OG card (1200×630, brand-correct, both locales) at `https://www.cue-app.net/en/opengraph-image` | 🛠 **Create:** ideal is a 1920×1080 export of the hero art. **Day-one stopgap:** download the OG card and center-crop to 16:9 — it's real brand material. |
| Photo 1–3 | ≥720 px shorter side | **Instagram launch ads** (1080×1350 ✓): `output/instagram-ads/ad-1-instant-reservations.png`, `ad-2-table-selection.png`, `ad-4-bilingual.png` | ✅ exist — use these three (skip ad-3 prepayment while HyperPay creds are pending, skip ad-5 if the Insider window might close, ad-6 optional) |
| Photo 4–6 (optional) | ≥720 px | App screenshots `public/images/cue-app-guest-reservation-confirmed.jpeg`, `cue-app-guest-booking-request.jpeg`, `cue-app-guest-payment-split.jpeg` (1206×2622 — very tall; GBP accepts but crops previews) | ✅ usable as-is; the ad versions frame the same screens better. ⚠ Only these three `guest-*` files are guest screens — the other four in `public/images/` are partner-dashboard shots with stale filenames; don't upload those as "app" photos. |

Upload order matters for first impressions: logo → cover → the 3 ads.

## 7. First GBP Post — launch announcement (publish the day the listing goes live)

Post type: **"What's new"** (or "Offer" — but Offer posts push GBP's coupon UI; "What's new"
with a Sign-up button fits the Insider claim better). Both texts below are built from the live
hero/claim copy. Button: **Sign up** →

```
https://www.cue-app.net/claim?utm_source=gbp&utm_medium=post&utm_campaign=insider_launch
```

**English:**

```
Don't wait in the queue. Join the Cue.

Cue is bringing restaurant reservations to Amman — instant confirmations, easy group bookings, and split payments so nobody fronts the whole bill. Free for guests, built for Amman's dining scene from Abdoun to Rainbow Street, fully bilingual in English and Arabic.

Before launch: claim 3 months of Cue Insider membership free. One code per person — it arrives by email now and activates in the app when Cue goes live in Amman.
```

**Arabic (from the AR hero + claim copy; same review rule as all AR strings):**

```
‏لا تنتظر في الطابور. انضم إلى Cue.

‏Cue تجلب حجوزات المطاعم إلى عمّان — تأكيدات فورية، وحجوزات جماعية سهلة، وتقسيم للدفعات كي لا يدفع أحد الفاتورة كاملة. مجّانية للضيوف، ومبنيّة لمشهد المطاعم في عمّان من عبدون إلى شارع الرينبو، وثنائية اللغة بالكامل بالعربية والإنجليزية.

‏قبل الإطلاق: احصل على ٣ أشهر مجانية من عضوية Cue Insider. رمز واحد لكل شخص — يصلك بالبريد الآن ويُفعَّل في التطبيق عند انطلاق Cue في عمّان.
```

(GBP posts are single-field; publish the EN post first, then the AR text as a second post the
same day — two posts on day one is fine and starts the posting cadence.)

## 8. Step-by-step submission checklist

1. **Resolve blocker #1** (phone) and have the **registration document** matching the real
   legal entity (blocker #2) scanned/ready.
2. Sign in at **business.google.com/create** with **adam@cue-app.net**.
3. **Business name:** paste `Cue` (§4). If Google suggests claiming an existing "CUE"-named
   profile, decline — those are the collision venues, not Cue.
4. **Category:** type `Software company`, select it (§1 — scan autocomplete for the optional
   secondary; secondaries can also be added later under *Edit profile → About*).
5. **"Do you want to add a location customers can visit?"** → **No** (§3).
6. **Service areas:** add `Amman, Jordan` first, then the neighborhoods that resolve (§3 list).
7. **Contact info:** phone from blocker #1; website URL from §4 (with the UTM).
8. **Verification.** For a service-area business with no storefront expect **video
   verification** (screen-record/live: business registration document, proof you control the
   business — signing into adam@cue-app.net on the cue-app.net domain and the Search Console
   property is exactly the kind of evidence reviewers accept). Phone/email/postcard are
   sometimes offered instead — take email if offered (domain match). Verification can take up
   to ~5 business days to review; the profile stays hidden until it passes.
9. **Complete the profile** (Edit profile → About): paste the EN description (§2), set
   attributes (§5), leave hours unset, add Opening date if the launch date is fixed.
10. **Photos:** upload logo → cover → 3 ads (§6).
11. **Posts:** publish the EN launch post, then the AR post (§7).
12. **Services** (optional, do when convenient): add "Restaurant reservations", "Group
    bookings", "Split payments", "Venue dashboard" as service items — descriptions can reuse
    §2 sentence-by-sentence, AR included.
13. **After it's live:** paste the final phone number into the site footer +
    `LocalBusiness.telephone` (one small PR — keeps NAP identical everywhere); add the GBP
    listing check to the monthly pass in `docs/seo-maintenance.md` (review responses, photo
    freshness, Q&A); when social handles exist, add them to GBP + schema + footer in one pass.

---

*Prepared 2026-08-17 from live site copy, `src/lib/seo.ts` (PR #21 state), `public/brand`,
`public/images`, and the Instagram launch-ad set. Nothing here was invented: the phone number
and legal-entity confirmation are yours to supply; every quoted string traces to shipped or
in-review site content.*
