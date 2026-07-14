# SEO Audit — Baseline & Post-Implementation

**Repo:** `Adamqsm/Cue-web` · **Domain:** `cue-app.net` (canonical host `https://www.cue-app.net`)
**Stack:** Next.js 14 App Router · bilingual EN/AR with RTL · Vercel
**Branch:** `claude/seo-full-implementation-qeom8j`
**Audited:** 2026-07-14

This document records the SEO state of the site **before** this branch's work and
the state **after**, so there's a clear before/after. The key finding of the audit
is that the site already shipped a mature, well-architected SEO layer in earlier
work (the redesign-v2 and partner-pricing branches). This pass **closed the
remaining gaps** rather than building the layer from scratch.

---

## 1. Route inventory

Routing pattern (confirmed from the codebase, not assumed): a single dynamic
`[locale]` segment (`en` | `ar`) defined in `src/i18n/config.ts`, with
`src/middleware.ts` redirecting locale-less paths to the visitor's preferred
locale. Every route below is statically generated (SSG) for both locales — the
build output shows `●  (SSG)` for all of them, so all content is crawlable
(no client-only rendering of primary content).

| App-relative path        | EN URL                  | AR URL                  | Rendering | Priority |
|--------------------------|-------------------------|-------------------------|-----------|----------|
| `/`                      | `/en`                   | `/ar`                   | SSG       | 1.0      |
| `/how-it-works`          | `/en/how-it-works`      | `/ar/how-it-works`      | SSG       | 0.8      |
| `/partner`               | `/en/partner`           | `/ar/partner`           | SSG       | 0.8      |
| `/partner/apply`         | `/en/partner/apply`     | `/ar/partner/apply`     | SSG       | 0.7      |
| `/faq`                   | `/en/faq`               | `/ar/faq`               | SSG       | 0.8      |
| `/reach-out`             | `/en/reach-out`         | `/ar/reach-out`         | SSG       | 0.7      |
| `/about`                 | `/en/about`             | `/ar/about`             | SSG       | 0.6      |
| `/careers`               | `/en/careers`           | `/ar/careers`           | SSG       | 0.6      |
| `/legal`                 | `/en/legal`             | `/ar/legal`             | SSG       | 0.3      |
| `/legal/terms`           | `/en/legal/terms`       | `/ar/legal/terms`       | SSG       | 0.3      |
| `/legal/privacy`         | `/en/legal/privacy`     | `/ar/legal/privacy`     | SSG       | 0.3      |
| `/legal/cookies`         | `/en/legal/cookies`     | `/ar/legal/cookies`     | SSG       | 0.3      |
| `/legal/dpa`             | `/en/legal/dpa`         | `/ar/legal/dpa`         | SSG       | 0.3      |
| `/legal/notice`          | `/en/legal/notice`      | `/ar/legal/notice`      | SSG       | 0.3      |

Non-indexable routes: `/api/lead` (POST endpoint, disallowed in robots),
`/[locale]/not-found` (404, now `noindex`), `/[locale]/opengraph-image` (social
card generator, not a page).

No orphaned pages found — every route is reachable from the global `Nav`/`Footer`
or from in-body links. No redirect chains beyond the intended apex→www and
locale-less→localized redirects.

---

## 2. Per-page audit — before vs after

Legend: ✅ present & correct · ⚠️ present but a gap · ➕ added this pass · — n/a

| Page | Unique `<title>` | Meta description | Canonical | hreflang (en/ar/x-default) | Single `<h1>` | OG + Twitter | JSON-LD | Breadcrumb |
|------|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| Home | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ Org+WebSite+LocalBusiness+Service+FAQ | — (home) |
| How it works | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Partner | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Partner apply | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| FAQ | ✅ | ⚠️→✅ (177→trimmed) | ✅ | ✅ | ✅ | ✅ | ✅ FAQPage | ✅ |
| Reach out | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| About | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Careers | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Legal index | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️→➕ Breadcrumb | ⚠️→➕ |
| Legal · terms | ✅ | ⚠️→➕ unique | ✅ | ✅ | ✅ | ✅ | ⚠️→➕ Breadcrumb | ⚠️→➕ |
| Legal · privacy | ✅ | ⚠️→➕ unique | ✅ | ✅ | ✅ | ✅ | ⚠️→➕ Breadcrumb | ⚠️→➕ |
| Legal · cookies | ✅ | ⚠️→➕ unique | ✅ | ✅ | ✅ | ✅ | ⚠️→➕ Breadcrumb | ⚠️→➕ |
| Legal · dpa | ✅ | ⚠️→➕ unique | ✅ | ✅ | ✅ | ✅ | ⚠️→➕ Breadcrumb | ⚠️→➕ |
| Legal · notice | ✅ | ⚠️→➕ unique | ✅ | ✅ | ✅ | ✅ | ⚠️→➕ Breadcrumb | ⚠️→➕ |

### Title / description length check

All 9 base meta blocks carry hand-written, localized titles and descriptions
(`src/i18n/content/{en,ar}.ts`). Measured EN lengths — titles 11–56 chars,
descriptions 122–177 chars. Two descriptions ran slightly long (FAQ 177, legal
index 168) and will be truncated in the SERP; these are content decisions left to
the founder rather than machine-rewritten (see §6). Titles under the 50-char
"ideal" (home, FAQ, legal, about) are intentional, punchy brand titles and are
left as-authored.

---

## 3. Technical SEO — state

| Item | State | Notes |
|------|-------|-------|
| Canonical tags | ✅ every route | Self-referential per locale via `buildMetadata` (`src/lib/seo.ts`); AR canonicals point to AR, EN to EN — no cross-pointing. |
| hreflang | ✅ every route | `en`, `ar`, and `x-default`→EN emitted on every page and in the sitemap. |
| EN/AR duplicate-content | ✅ handled | The two language variants are tagged as reciprocal alternates, not separate content. |
| Server rendering | ✅ all SSG | No primary content is client-only. Interactive islands (Demo carousel, forms, consent banner) are `"use client"` but their SEO-relevant text is server-rendered or non-essential. |
| `font-display: swap` | ✅ | Both fonts (Inter via `next/font`, IBM Plex Sans Arabic) load with `display: "swap"`. `next/font` self-hosts, so no render-blocking Google Fonts request. |
| Image format | ✅ | `next.config.mjs` serves AVIF/WebP; source screenshots are JPEG/PNG optimized through `next/image`. |
| Explicit width/height | ✅ | All `next/image` usages set explicit `width`/`height` or `fill` inside a fixed-aspect container → no layout shift. |
| Lazy-loading | ✅ | Below-the-fold images use `loading="lazy"` / default lazy; hero image uses `priority`. |
| Skip-to-content link | ✅ | Present in `layout.tsx`. |
| Theme flash guard | ✅ | Inline pre-paint script sets theme class before first paint. |

### Core Web Vitals proxies
- **LCP:** Hero uses a text headline (no hero image on home); app screenshots are
  device-framed with fixed aspect ratios. Largest images are the ~1206×2622 app
  screenshots, served responsively via `sizes`.
- **CLS:** Every image reserves space (explicit dimensions or aspect-ratio box);
  fonts swap without metric-shifting fallback issues; no late-injected banners
  above content (consent banner is fixed-position, not in flow).
- **FID/INP:** Motion is gated behind `prefers-reduced-motion`; no heavy
  client bundles on content routes.

---

## 4. Structured data (JSON-LD) — state

| Schema | Location | State |
|--------|----------|-------|
| `Organization` | Home (`siteJsonLd`) | ✅ name, legalName, logo, url, areaServed, sameAs |
| `WebSite` | Home | ✅ (no `SearchAction` — no internal site search exists, correctly omitted) |
| `LocalBusiness` | Home | ✅ areaServed Amman/JO, address, priceRange |
| `Service` (restaurant reservation) | Home | ✅ areaServed Amman/JO |
| `FAQPage` | Home (top 6) + `/faq` (full) | ✅ |
| `BreadcrumbList` | All non-home routes | ✅ (legal routes ➕ added this pass) |

All schema is built from real dictionary content — no lorem/placeholder values —
**except** `Organization.sameAs`, which currently points to bare social roots
(`instagram.com`, `facebook.com`, `x.com`), mirroring the footer's placeholder
social links. Flagged for the founder in §6.

---

## 5. Sitemap & robots — state

- **`robots.ts`** → `robots.txt`: `Allow: /`, `Disallow: /api/`, `Disallow: /admin/`
  (➕ added `/admin/` this pass), plus `Host` and `Sitemap` directives.
- **`sitemap.ts`** → `sitemap.xml`: generated from the route tree, one entry per
  locale per route, each with `<xhtml:link rel="alternate" hreflang="…">` for its
  EN/AR/x-default pair and per-route `changefreq`/`priority`. Homepage and partner
  routes carry the highest priority; legal pages the lowest.

---

## 6. Changes made in this pass

1. **`/admin/` added to `robots.txt`** disallow (`src/app/robots.ts`).
2. **`BreadcrumbList` JSON-LD on all six legal routes** — legal index page and the
   shared `LegalDoc` component (`src/components/sections/LegalDoc.tsx`,
   `src/app/[locale]/legal/page.tsx`). This completes breadcrumb coverage across
   every non-home route.
3. **Unique meta descriptions for the 5 legal sub-pages** — previously all five
   shared one description (a duplicate-description signal). Each now derives a
   unique, localized description from its own `intro` paragraph via a new
   `truncateForMeta()` helper (`src/lib/seo.ts`). **No new AR strings were
   invented** — descriptions reuse the already-approved legal intro copy, so this
   respects the AR master-strings rule.
4. **`noindex` on the 404 page** (`src/app/[locale]/not-found.tsx`) plus a proper
   title, so soft-404s never compete in the index.
5. **Long-tail keyword coverage** appended to the EN and AR keyword sets in
   `src/lib/seo.ts` (e.g. "book restaurant table online Amman", "restaurant
   reservation app for groups Jordan", "how to book a restaurant in Amman",
   "تطبيق حجز مطاعم", "حجز مطعم جماعي"). AR additions match strings already used in
   visible copy; no unreviewed AR neologisms.

Build verified: `next build` succeeds with all 14 routes × 2 locales prerendered
as static HTML; `robots.txt` and `sitemap.xml` generate; rendered HTML confirmed
to carry the new descriptions and breadcrumbs, with AR pages rendering `dir="rtl"`.

---

## 7. Needs Adam's input (non-blocking)

These are content/ownership decisions a machine shouldn't fabricate — none block
the merge:

1. **Real social profile URLs.** The footer and `Organization.sameAs` point to
   bare `instagram.com` / `facebook.com` / `x.com`. Provide the real Cue handles
   and they'll flow into both the footer and the schema. Until then they're
   harmless but non-authoritative.
2. **Public contact point for `Organization` schema.** No public support email or
   phone exists in the content to add as a `contactPoint`. If there's a public
   `hello@`/`support@` address, it can be added.
3. **Two long meta descriptions** (FAQ 177 chars, legal index 168 chars) exceed
   the ~160-char SERP display limit. Left as-authored — trim in
   `src/i18n/content/{en,ar}.ts` if you want them fully visible.
4. **AR string review.** All AR meta/keyword copy touched or reused here should be
   reconciled against the master AR strings doc per the append-never-overwrite
   rule. Nothing new was authored beyond reusing approved legal intro copy and
   keywords that already appear in visible AR content.
5. **Google Search Console + Analytics** — see §8. Requires Adam's Google account.

---

## 8. What to do next (post-merge)

1. **Submit the sitemap** to Google Search Console: add both `https://www.cue-app.net`
   (and, if used, the apex) as properties, then submit `sitemap.xml`. Repeat in
   Bing Webmaster Tools if desired.
2. **Verify the property** — DNS TXT record or the `verification` meta tag. If a
   meta-tag approach is preferred, add the token to `verification` in
   `layout.tsx`'s metadata. This step needs Adam's Google account access and is the
   only piece that can't be automated here.
3. **Confirm the alcohol-imagery rule** holds for any future venue photography fed
   into schema/alt text — the generated alt text and copy in this pass reference
   only dining, bookings, dashboards, and payments.
