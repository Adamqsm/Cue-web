# SEO Maintenance — Recurring Cadence

Repeatable upkeep so local visibility compounds without re-auditing from scratch.
Baseline numbers live in [seo-audit-2026-08.md](./seo-audit-2026-08.md); keyword evidence in
[seo-strategy-2026-07.md](./seo-strategy-2026-07.md). Update the log at the bottom each run.

## Monthly check (~30 min, first Monday)

All Search Console reports: property `https://www.cue-app.net/` at
[search.google.com/search-console](https://search.google.com/search-console).

1. **Performance → last 3 months.** Record clicks / impressions / avg position. Look at
   **Queries**: any non-brand query appearing (anything with amman/عمان, restaurant, حجز,
   neighborhood names) is news — note it and check which page received it. Look at
   **Countries**: Jordan should stay the top row; growing US/unrelated-geo impressions with
   zero clicks usually means brand-name collision noise, not progress.
2. **Indexing → Pages.** Indexed count vs expected 30 (15 routes × 2 locales — update the
   expectation when routes ship). "Page with redirect" entries are the legacy 301s: fine.
   Investigate only if a real content URL sits in "Crawled/Discovered – currently not indexed"
   for 2+ months — usual fix is a fresh internal link to it plus Request Indexing.
3. **Links report.** External links total. It is 0 as of 2026-08; any new linking site is worth
   recording below (and thanking/reciprocating where sane).
4. **PageSpeed** — [pagespeed.web.dev](https://pagespeed.web.dev) on `/en` and `/ar`, mobile.
   Watch LCP (4.6 s lab baseline). If CrUX field data appears (enough real traffic), switch
   attention from lab to field numbers; field LCP > 2.5 s = act.
5. **Brand SERP spot-check** from a Jordan browser: `cue amman` and `تطبيق حجز مطاعم` — is
   cue-app.net #1 for the first; does anything new compete? Ignore Ammanford (Wales), Tamil
   "Amman" venues, عماني/Oman results — known homonyms, not competitors (strategy C07).
6. **New content hygiene** — any page shipped since last check must have: `buildMetadata` with
   localized title/description carrying Amman where natural, breadcrumb JSON-LD, a sitemap
   entry, and EN+AR parity. (The `Dictionary` type enforces string parity at build time.)

## Quarterly (with a monthly run)

- Re-run the **autocomplete probes** for the core families (method in strategy §9:
  `suggestqueries.google.com/complete/search?client=firefox&gl=jo&hl=en|ar&q=...`; AR responses
  arrive windows-1256 — convert before reading). Compare against §3–§4 of the strategy: new
  families = new page/metadata targets.
- Review `KEYWORDS_EN` / `KEYWORDS_AR` in `src/lib/seo.ts` against what GSC Queries actually
  shows.
- Check Eat App's Amman surface (eatapp.co/amman) for occasion pages or fixed AR canonicals —
  the two gaps Cue's content plan exploits.
- Re-read this doc; prune steps that stopped earning their time.

## Event-driven triggers (do when the event happens, not on schedule)

| Trigger | Action |
|---|---|
| **Venue roster goes public** | Build strategy P1: `/[locale]/restaurants/[neighborhood]` pages (8 neighborhoods, AR mirrors, "swefieh" spelling covered) and linkify the home "Across Amman" strip to them. Then per-venue pages with `Restaurant` schema (name, cuisine, neighborhood, geo, menu) — venue pages are where booking-intent search actually lives (strategy C04). |
| **Real social handles exist** | Add to `Organization.sameAs` in `src/lib/seo.ts` **and** `footer.social` in both dictionaries. |
| **App hits the stores** | Add `SoftwareApplication`/`MobileApplication` schema with real store URLs; revisit GBP; add store links to the site. |
| **~Nov 2026** | Build the Ramadan hub (strategy P3) — iftar/suhoor pages both languages, before the seasonal cluster wakes up. |
| **New route ships** | Metadata + breadcrumbs + sitemap entry + both locales (checklist item 6 above). |
| **GBP gets created** | Fill services (reservations, group dining, split payments), Amman service area, EN+AR descriptions; keep NAP identical to the site; add UTM `?utm_source=gbp` to the website link. |

## Automation note

The monthly check can run as a Claude scheduled agent (it needs GSC access via the browser, so
the session must be able to reach Adam's signed-in Chrome or a GSC API token). Until then it's a
30-minute manual pass with this page open. If a GSC **API** service account gets wired up, steps
1–3 become scriptable and the agent can file the log entry itself.

## Run log

| Date | Clicks/Impr (3mo) | Avg pos | Indexed | Ext. links | Notes |
|---|---|---|---|---|---|
| 2026-08-17 | 6 / 72 | 22.1 | 26 (+6 excluded, benign) | **0** | Baseline. All queries brand-shaped; zero Amman-intent impressions; PSI mobile 80 (LCP 4.6 s lab); brand SERP #1 in JO for "cue amman restaurant booking". |
| 2026-09-04 | 31 / 191 | 17.5 | 28 (+6 not indexed) | **0** | Traffic 5x the baseline, position +4.6 — still entirely brand-shaped queries (21 of them; "cue booking platform", "cue application", plus homonym noise: Israel 31 impr / 0 clicks off "cue ontopo", "cue הזמנת מקום"). Jordan stays top country (22 clicks / 72 impr). Fixed this run: social card missing on 28 of 30 URLs, `/claim`'s only sitewide internal link UTM-parameterised, ticket-label contrast under AA, `/en/legal` description over length — see "2026-09-04 findings" below. Open for Adam: hero LCP, backlinks. |

## 2026-09-04 findings

Detail behind the run-log row. Fixed items shipped in `0a60493`.

### Fixed

1. **Social card was missing on 28 of 30 URLs.** Next's `opengraph-image` file
   convention decorates only the segment holding the file, so `/en` and `/ar`
   had a card and every nested route (`/faq`, `/claim`, `/partner`, the five
   legal docs, both locales) declared `twitter:card=summary_large_image` with
   no image behind it — a blank large card on every share. `buildMetadata` now
   names the per-locale card URL explicitly. Verified: 30/30 in production.
2. **`/en/claim` + `/ar/claim` sat in "Discovered – currently not indexed"
   since 2026-07-25, never crawled.** Root cause: the sitewide footer link —
   their only internal link on 28 of 30 pages — pointed at the UTM-tagged
   duplicate, and the nav's claim CTA is a `<button>` that opens the modal, so
   the canonical URL had internal links from the homepage alone. GSC's internal
   links report agreed: 12 links total, all to `/en`, none to `/claim`. Footer
   link is now clean. **Trade-off taken:** footer-placement attribution is lost
   for organic visits that enter `/claim` from the footer; the
   `home-early-access` and `founding-banner` CTAs still tag theirs. One-line
   revert if the attribution matters more than the indexing.
3. **Ticket labels failed AA.** "NOW IN THE QUEUE" / "Your queue spot" ran at
   `opacity-70` on the terracotta ticket, which drops 10–12 px bold ink to
   3.15:1. Dimming removed; measured 4.69:1 light, 5.24:1 dark.
4. **`/en/legal` description was 168 chars** and Google was cutting the
   jurisdiction clause. Trimmed to 146 via "DPA", the footer's own label.

### Checked, no action

- **Links:** 30/30 URLs 200, no broken internal or outbound links. `/` → `/en`
  307 and the legacy aliases (`/contact`, `/privacy`, `/privacypolicy`, …) all
  301 correctly. The stale "Crawled – currently not indexed" entry is
  `/privacypolicy`, last crawled Mar 2026 — it 301s today and will migrate to
  the benign "Page with redirect" bucket on its own.
- **Sitemap** read 2026-08-29, 30/30 discovered. **Breadcrumbs** 0 invalid.
- **`/reach-out` carries the same internal-UTM pattern** (24 floating-contact
  links) but *also* has clean nav and footer links, and is indexed — so the
  pattern only broke `/claim`. Left alone deliberately.
- **`/` ranks separately from `/en`** (4 clicks / 17 impr). Expected: the root
  307s and both canonicalise to `/en`. No action.

### Open — needs Adam

- **Core Web Vitals now FAIL in the field** (CrUX has enough samples for the
  first time; GSC's own CWV report still says "not enough data"). Mobile:
  `/en` LCP **6.0 s**, `/ar` LCP **3.8 s**, INP ~355–381 ms, CLS 0. Root-caused
  from the LCP breakdown: TTFB is 10 ms and **element render delay is 1,220 ms**
  — the LCP element is the hero paragraph, and framer-motion's `rise` variant
  bakes `opacity: 0` into the server HTML, so the hero is invisible until React
  hydrates. Not a code-quality bug; a deliberate load choreography
  (copy → phones → chips) that costs LCP. Three ways out, in order of how much
  of the choreography survives: (a) animate only `y` on the hero copy and let
  it paint opaque — keeps the motion, loses the fade on that one block;
  (b) `initial={false}` on the h1/p only — copy appears instantly, phones and
  chips still stagger in; (c) leave it and accept a failing CWV assessment.
  Recommend (a). Not applied unilaterally — it changes the site's opening
  moment. Lab scores the same run: `/ar` 84 (TBT 0 ms), `/en` 57 (TBT 980 ms);
  the `/en` number looks like Lighthouse run variance, not a regression.
- **External links still 0.** Needs a real relationship, not a code change.
- **Competitive change:** OpenTable now ranks page 1 in JO for
  `حجز مطاعم عمان` (opentable.com/jordan), alongside Eat App's
  `eatapp.co/amman` at #1. The 2026-07 strategy named Eat App as the only real
  rival — that is no longer true. Google's AI Overview for the same query names
  Eat App and OpenTable as *the* ways to book in Amman, and neither is Jordanian.
- **Brand collision inside Amman:** `@cue.amman` on Instagram (18 K followers)
  is a local marketing agency. Ranks for "cue amman" alongside cue-app.net.
  cue-app.net still holds **#1** for that query in JO.
