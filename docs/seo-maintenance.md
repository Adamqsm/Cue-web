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
