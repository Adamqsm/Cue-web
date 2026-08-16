# SEO Audit — Amman Local Deepening (2026-08-17)

**Scope:** re-evaluate the shipped SEO layer for Amman/Jordan local relevance, on top of
[seo-audit-baseline.md](./seo-audit-baseline.md) (2026-07-14 implementation record) and
[seo-strategy-2026-07.md](./seo-strategy-2026-07.md) (keyword research + claims register).
Everything below was verified against the **live site** (curl of prod HTML + CSS), **Search
Console** (property `https://www.cue-app.net/`, read 2026-08-17, window 5/15–8/14), and
**PageSpeed Insights** (run 2026-08-17), not just the repo.

---

## 1. State of each audited dimension

| Dimension | State | Detail |
|---|---|---|
| Metadata (EN) | ✅ strong | 8 of 10 page titles carry "Amman"; descriptions localized and hand-written. Gaps fixed this pass: no "Jordan" disambiguator on home; claim page had no Amman reference; FAQ description 177 chars (truncated in SERP). |
| Metadata (AR) | ✅ strong | All mirrors use عمّان naturally. Gap fixed this pass: no الأردن disambiguator anywhere — the strategy's C07 finding (Oman/عماني collision, Ammanford/Wales collision) says titles should carry it. |
| H1s | ✅ by design | No page H1 contains "Amman" — they are settled brand copy ("Don't wait in the queue. Join the Cue."). Amman lives in hero subtitles (home, faq), H2s (neighborhoods section), and body copy. Left untouched: the subtitle/H2 layer carries the local signal without breaking the voice. |
| Schema (JSON-LD) | ⚠️ → ✅ | Org + WebSite + LocalBusiness + Service + FAQPage + Breadcrumbs all present and rendering on prod. Gaps fixed this pass: **no geo coordinates** anywhere; `Service.description` hardcoded EN on AR pages; `sameAs` pointed at bare `instagram.com`/`facebook.com`/`x.com` (claims the wrong entity — removed until real handles exist); `City.addressCountry` was schema-invalid shorthand (now proper `containedInPlace` Country); `/claim` breadcrumb missing its root item. |
| hreflang | ✅ correct | `en` / `ar` / `x-default`→EN on every route, on-page and in the sitemap. Verified in live HTML. |
| Canonicals | ✅ correct | Self-referential per locale, www host. One footgun fixed: `.env.example` declared the **apex** for `NEXT_PUBLIC_SITE_URL`, which would silently flip every canonical/hreflang/sitemap/OG URL if ever copied to a real env. One hygiene fix: 404 page inherited the homepage canonical from the layout (now explicitly none + noindex). |
| Sitemap | ✅ healthy | 30 URLs (15 routes × 2 locales), priorities already rank the Amman-target pages (home 1.0; how-it-works/partner/faq/claim 0.8; legal 0.3). Fix this pass: `lastModified` was the build timestamp for all 30 URLs on every deploy — a "everything changed, always" signal Google learns to ignore; removed. |
| robots.txt | ✅ healthy | Permissive, `/api/` + `/admin/` disallowed, sitemap + host declared. |
| Alt text | ✅ minor fix | Hero/product alts are dictionary-driven and already Amman-relevant. One fix: the how-it-works showcase alt was a **hardcoded English template**, producing mixed-language alt text on Arabic pages — now localized. |
| Internal linking | ✅ complete for current architecture | All 15 routes reachable from Nav/Footer; breadcrumbs sitewide. The home "Across Amman" neighborhood strip (8 names) is intentionally plain text — there are no neighborhood pages to link **to** yet. Real internal-linking upside arrives with the strategy's P1 neighborhood pages (see §4). |
| Core Web Vitals | ⚠️ watch | PSI mobile (en home): **Performance 80** — LCP 4.6 s lab (the hero phone screenshot), everything else clean (CLS 0, TBT 0 ms). Desktop: LCP 1.0 s. `priority` + correct `sizes` already set; no safe code fix left without touching the settled hero design (e.g. lighter source image). **No CrUX field data** (traffic below threshold) — lab-only for now. A11y 97, Best Practices 100, SEO 100. |
| Indexing (GSC) | ✅ healthy | 26 indexed / 6 not indexed — of the 6: 3 "page with redirect" (the legacy 301s working as designed), 2 "discovered, not crawled yet", 1 "crawled, not selected". Nothing to fix; re-check monthly. |
| Search performance (GSC) | 📉 the real story | Last 3 months: **6 clicks, 72 impressions, avg position 22.1, 11 distinct queries — every one brand-shaped** ("cue", "cue booking platform", "cue booking", "cue ontopo"...). **Zero impressions for any Amman or restaurant-intent query.** ~70 of 72 impressions land on the two home URLs. Jordan is the top country (3 clicks / 24 impr). Brand SERP verified from a Jordan browser: **cue-app.net ranks #1 for "cue amman restaurant booking"**. |
| Backlinks | 🔴 zero | GSC Links report: **0 external links** from 0 sites. This is the single biggest off-site gap — on-page work cannot compensate for it. |
| Google Business Profile | 🔴 none | No GBP exists for Cue. Maps queries for "cue amman" surface name-collision noise instead (a local "CUE & CAFE" coffee shop, Cue restaurants in Tel Aviv / Amsterdam / India). |

**Also verified in passing:** v5.4 Terracotta is live on prod (compiled CSS carries `200 107 74` = `#C86B4A`).

## 2. Reading the data honestly

- **What's working:** brand+city is won (position #1 in Jordan for brand queries), the technical
  layer is sound, indexing is healthy, both locales are fully crawlable near-parity SSG.
- **What isn't happening yet:** non-brand local demand ("restaurants in Abdoun", "مطاعم عبدون",
  "iftar buffet amman") produces **zero impressions** because the site has no pages targeting
  those queries — the home page can't rank for 30 neighborhood/occasion query families by itself.
  This matches the July strategy's core finding: demand is discovery-shaped and
  neighborhood-qualified; the home page is a brand surface.
- **Therefore:** this pass sharpens what exists (metadata precision, schema depth, hygiene) so the
  existing 30 URLs compound cleanly — but the step-change in local visibility comes from the
  strategy's P1/P2 content architecture (neighborhood + occasion pages) and from off-site signals
  (backlinks, GBP), both listed below as decisions rather than smuggled into this PR.

## 3. What this PR changes

1. **Schema deepening** (`src/lib/seo.ts`): shared `AMMAN_CITY` place (geo 31.9539 N 35.9106 E,
   `alternateName` عمّان, `containedInPlace` Jordan) used by Organization / LocalBusiness /
   Service; `LocalBusiness.geo`; `Service.areaServed` now lists the 8 visible neighborhoods as
   qualified Places in the page's own language ("Abdoun, Amman" / "عبدون، عمّان");
   `Service.description` localized (was EN-only on AR pages); `knowsLanguage: ["en","ar"]`;
   placeholder `sameAs` removed. **No street address, phone, or hours invented** — locality-level
   only, matching reality.
2. **Metadata sharpening** (both dictionaries): home title gains ", Jordan" / "، الأردن"
   (homonym disambiguation per strategy C07); home description names Abdoun + Rainbow Street;
   partner title targets "restaurant reservation system in Amman" (uncontested B2B term,
   strategy §3.5); partner-apply title and claim description gain Amman; FAQ description
   trimmed 177→~150 chars; partner hero subtitle now reads "across Amman".
3. **Keyword sets** (`src/lib/seo.ts`): +"restaurants in Amman Jordan", "swefieh village
   restaurants" (the spelling that out-ranks "sweifieh" in autocomplete), "restaurant
   reservation system Amman"; AR +"مطاعم عمان الاردن", "تطبيق حجز مطاعم الاردن",
   "حجز مطعم في عمان", "مطاعم جبل عمان".
4. **Hygiene:** localized showcase alt text; `/claim` breadcrumb root; 404 canonical removed;
   sitemap `lastModified` removed; `.env.example` canonical host corrected to www.
5. **Docs:** this audit + [seo-maintenance.md](./seo-maintenance.md) (the recurring cadence).

## 4. Deliberately NOT in this PR (decisions, not oversights)

- **Neighborhood landing pages** (`/[locale]/restaurants/abdoun` …) — the strategy's P1 and the
  single biggest content lever. Needs a public venue roster to avoid shipping thin pages (the
  exact weakness Eat App has). Trigger: venue roster goes public.
- **Per-venue pages + `Restaurant` schema** — `Restaurant` type would be wrong for Cue itself
  (Cue is a platform, not a restaurant); it belongs on future venue pages. Trigger: launch.
- **H1 rewrites** — brand voice is settled; subtitles carry the local signal.
- **Hero image slimming** (the LCP 4.6 s) — presentation-layer, v5.4 is final. Flagged, not touched.
- **`JobPosting` schema** on /careers — requires real `datePosted`/`validThrough`; not fabricating.
- **Ramadan hub** — strategy P3, build by ~Nov 2026 (before Ramadan ≈ Feb 2027).

## 5. Needs Adam directly (cannot and should not be automated)

1. **Google Business Profile** — the highest-leverage local asset we don't have. Create at
   business.google.com as a **service-area business** (Amman), category "Software company" (or
   "Internet marketing service" until a physical office/storefront exists — do NOT claim
   "Restaurant"). Needs your Google account + verification. The "CUE & CAFE" name collision on
   Maps makes owning the real profile more valuable, not less.
2. **Real social profile URLs** — schema `sameAs` is now empty by design; the footer still shows
   placeholder roots. Provide the real Instagram/Facebook/X handles (the Instagram launch-ad set
   is ready, so presumably the handle exists or is imminent) and they go into both.
3. **Backlinks (currently zero)** — realistic first targets: Jordan startup press (Jordan Times
   tech desk, ammannet, startup MENA outlets covering the launch), Qasem Group corporate site
   linking to cue-app.net, partner restaurants linking "Reserve with Cue" once live, Amman food
   bloggers/Instagram food guides, Jordan Startup/tech directories. Even 3–5 real Jordanian
   links changes the picture from zero.
4. **AR string review** — every Arabic string touched in this PR is listed in the PR body for
   review against the master-strings rule before merge.
