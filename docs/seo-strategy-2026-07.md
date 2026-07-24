# Cue SEO Strategy — Final Deliverable (2026-07-23)

Scope: www.cue-app.net (Next.js, routes `/[locale]/{,about,careers,faq,how-it-works,partner,partner/apply,reach-out,legal/*}`), EN + AR, launch market Amman, Jordan. Everything below is built exclusively from the verified claims register (C01–C28) attached in Section 8. Every number carries its source inline. Where a signal could not be quantified, it is stated qualitatively by design.

---

## 1. Executive Summary

### What changed vs. the "Eat App / OpenTable incumbency" assumption

The research began with the working assumption that Cue faces two entrenched SEO incumbents. That picture is wrong in five important ways:

1. **ReserveOut — the Jordan-founded regional pioneer (founded 2012, ~$5.3M raised per https://tracxn.com/d/companies/reserveout/__7Q7SHn1c9UTyrDem_zGL4YcFvlyQNe1wO69T693oXdk) — is dead.** Its domain resolves to nothing (www.reserveout.com NXDOMAIN, apex has no A/AAAA records, verified 2026-07-23; Wayback shows the site dead since roughly mid-2024). Google still indexes its Amman pages, so its reservation-intent demand and backlink equity are orphaned. Startup databases (Tracxn "Active", CB Insights "Alive") are stale and will mislead anyone doing a casual competitive scan. (C12)
2. **Eat App is the only serious SEO competitor — and its template is copyable, thin, and full of holes.** eatapp.co/amman runs exactly 98 programmatic subpages (21 neighborhoods + ~76 cuisine/venue-type pages) but has **zero occasion pages** — rooftop, romantic, iftar, brunch, family, outdoor all 404 (C08, C09). Its Arabic pages exist but canonicalize to the English URLs and carry generic boilerplate titles with no neighborhood name in the metadata — validated space, weakly defended (C11). Whether Eat App actually *ranks* in Jordan for booking queries is unverified (no Jordan-geo SERP evidence exists; it was absent from Bing SERPs captured for booking queries) (C08).
3. **OpenTable is present but marginal:** "As of Jul 23, 2026 there are 11 restaurants in Jordan" per its own metro page (https://www.opentable.com/metro/jordan), heavily hotel-skewed (Fairmont and Four Seasons outlets account for most listings) (C19).
4. **The real incumbent is behavior, not a platform.** Category-level demand is unformed: "restaurant booking app jordan" returns zero autocomplete suggestions at Jordan geo, "opentable amman"/"the fork amman" have no query families, "reserveout amman" is empty, and "eat app amman" corrects to "food app amman" (C13, C21). The likely default behavior (Instagram/WhatsApp/phone booking) is an inference from this absence, not a measured fact — flagged as such in the register.
5. **Demand is discovery-shaped, not transactional.** English "book a table amman"-class queries are empty or geo-trap noise at gl=jo (C01); Arabic "حجز مطعم عمان"-class queries are literally empty (C14). What exists in volume-signal terms is rich, attribute- and neighborhood-qualified discovery in both languages ("best restaurants in amman with view / for couples", "مطاعم عبدون فطور") plus a dominant Ramadan seasonal cluster (C02–C06). Reservation intent, where it appears at all, is venue-branded ("sufra restaurant amman reservation") (C04).

### Top 5 moves

1. **Ship the neighborhood landing-page architecture** — `/en/restaurants/[neighborhood]` + `/ar` mirrors for the 8 neighborhoods already listed (unlinked) on the home page, then cuisine children. This is where verified bilingual demand actually lives (C06, C26, C28) and where Eat App's template is beatable (thin pages, broken AR canonicals).
2. **Fix the redirect/visibility defects now**: 301/308 legacy paths (`/contact→/en/reach-out`, `/career→/en/careers`, `/dpa→/en/legal/dpa` — currently 307 → 404), render FAQ answers in the DOM, add og:image to subpages (C23, C28). Technical SEO is otherwise sound (C22) — the problem is coverage and visibility, not infrastructure.
3. **Own the occasion/experience gap Eat App left open**: rooftop, romantic/couples, "with a view" (the single most recurrent attribute modifier across ≥5 independent autocomplete seeds — C03), family/kids, shisha, and above all **Ramadan** (iftar buffet / suhoor pages in both languages, built well before Ramadan) (C05, C09).
4. **Build per-venue pages as the transactional surface.** Booking-intent search expresses as `{venue} amman` + reservation/menu ("sufra restaurant amman reservation" was the only Amman reservation-flavored suggestion across ~60 EN seeds; branded seeds return rich menu/reviews/number/reservation families) (C04). As the partner roster goes public, each venue page is a booking-intent landing page no generic page can replace.
5. **Define the category vocabulary for Jordan before anyone else does.** "تطبيق حجز مطاعم" autocompletes with Riyadh/Jeddah/Dubai/Kuwait/Bahrain/London variants but no Amman/Jordan variant (C18); "restaurant reservation app" has india/japan/paris variants but no Jordan (C13). The category term exists regionally — Jordan's slot is empty. Cue's brand + category pages should claim "restaurant booking app Jordan" / "تطبيق حجز مطاعم الاردن" while they are uncontested. (Caveat: autocomplete absence signals low current query mass — this is demand *creation*, not capture.)

---

## 2. Verified Market Landscape

**Eat App** (Bahrain/Dubai-based). Dual-positioned: B2B reservation-management SaaS (restaurant.eatapp.co — flat-fee, explicitly marketed *against* the marketplace model) plus a consumer discovery/booking channel live in Amman (eatapp.co/amman, iOS/Android apps) — it overlaps Cue on both guest and partner sides (C10). Its Amman SEO surface: hub titled "Book a table at the best restaurants in Amman • Eat App", H1 "Reserve at the best restaurants in Amman", 98 unique /amman/* subpages (21 neighborhoods incl. Abdoun, Al Abdali, Al Swaifyeh, Jabal Al Lweibdeh, Jabal Amman, Dabouq; ~76 cuisine/venue-type pages), directory at /amman/restaurants with 12 restaurants per page across 5 pages (Azkadenya, Blue Fig; Sufra featured) (C08, source https://eatapp.co/amman). Weaknesses verified: no occasion pages (rooftop/romantic/iftar/brunch/family/outdoor all 404 — C09); neighborhood pages carry generic non-localized titles and as few as 4 listings; AR pages canonicalize to EN URLs with boilerplate metadata (C11); no SERP-ranking evidence for Jordan exists.

**OpenTable.** Real but thin: 11 restaurants in Jordan per https://www.opentable.com/metro/jordan (fetched 2026-07-23), of which roughly 7 are Fairmont/Four Seasons hotel outlets, plus standalone fine dining (Sufra, Alee, Romero). Runs programmatic landmark pages (restaurants-near-abdoun-bridge, restaurants-near-capital-tower-amman-jordan) (C19). Ranks on **US-geo** SERPs for Amman booking queries (C20 — geo-bias flagged; Jordan SERPs unobserved).

**ReserveOut.** Defunct (full detail in §1 point 1; C12). Action item: its still-indexed Amman pages (Sufra/Fakhreldin/Wild Jordan-tier venues) represent orphaned demand and potentially reclaimable backlink targets — but note the domain is still registered (live NS/MX), so it is dormant, not dissolved.

**Resy.** Hosts real amman-jordan venue pages (e.g. resy.com/cities/amman-jordan/venues/yoshi) but on US-geo SERPs they surfaced only for queries naming Resy explicitly — not a competitor for generic Amman booking queries (C20).

**SevenRooms, TheFork, Quandoo, TABsense, Aroundtown** (from the competitors lane summary, not independently double-verified as claims): SevenRooms appears only as B2B white-label for one Amman venue; TheFork and Quandoo have no Jordan operations; TABsense (Amman HQ) is AI-POS — an integration prospect, not a competitor; Aroundtown's domain fails DNS. Treat these as lane-level observations, lower confidence than C-claims.

**The behavioral baseline.** No booking brand owns any Jordan query family (C13). The claim that Instagram/WhatsApp/phone is the incumbent channel is a **reasonable inference from platform absence, not a sourced fact** (C21) — no consumer-behavior survey exists in this evidence base.

---

## 3. EN Keyword Map by Intent Cluster

All entries below are evidenced by real Google autocomplete at Jordan geo (suggestqueries.google.com, client=firefox, gl=jo, hl=en, captured and re-verified 2026-07-23) unless another basis is stated. No volume figures exist for any keyword (no paid tools, no GSC) — treat autocomplete presence/richness as the ranking signal.

### 3.1 Transactional booking (thin — do not build generic landing pages against it)
- `book a table amman` — autocomplete returns ONLY "my indian ammanford book a table" (Ammanford, **Wales**). Zero genuine Amman demand (C01). Eat App's title targets this phrase anyway; Cue's home page already does too. Keep it as home-page title language (cheap, uncontested), but expect no query volume.
- `reserve a table amman`, `table booking amman`, `dinner reservation amman`, `restaurant reservation jordan`, `restaurant booking app jordan`, `iftar reservation amman` — all empty at gl=jo (C01). Same treatment.
- `restaurant reservation amman` — surfaces exactly one venue suggestion: **`sufra restaurant amman reservation`** (C04). This is the template: transactional demand is venue-branded.
- `reservation amman` — populated, but hotel-branded (Ritz-Carlton, St Regis, W, Fairmont…) plus `sufra amman reservation` (C01 counter-evidence). Confirms: per-venue pages can capture reservation intent; generic pages cannot.
- `{venue} amman` family — `fakhreldin restaurant amman` returns menu/reviews/photos/number/amman refinements (C04). **Per-venue pages targeting "{venue} amman" + menu + reservation are the transactional surface.**

### 3.2 Discovery (the core opportunity)
- `best restaurants in amman` — 8 genuine Amman refinements at gl=jo: with view, jordan, for date, for couples, reddit, downtown, for lunch, rainbow street (C02, corrected count; "open now" did NOT reproduce; one suggestion is the Ammanford false positive).
- `best restaurants in amman for …` — date / couples / lunch / breakfast / dinner / iftar; `… with …` — view / shisha / alcohol (C02, 9/9 reproduced).
- **"with a view" is the most recurrent attribute modifier** — surfaces organically under ≥5 independent seeds (best restaurants / restaurants in amman / restaurants amman / cafes / romantic) (C03). Runners-up: "with shisha", "for couples". A dedicated "restaurants with a view in Amman" page is the highest-confidence single content bet.
- Occasion/attribute set with autocomplete evidence (en-demand catalog): rooftop restaurants/bar amman; romantic restaurants (in) amman for couples; fine dining amman (+jordan); top 10 (luxury) restaurants in amman; new restaurants amman; cheap eats amman; family friendly restaurants amman / with play area / kids area; outdoor restaurants amman; shisha lounge amman; private dining amman; vegan restaurants amman; cafes in amman with a view / with shisha / to watch football; restaurants in amman open 24 hours; `…reddit` variants (social-proof-seeking, recurs across 4+ seeds); where to eat in amman (+downtown/breakfast/mansaf/during ramadan); best/friday brunch amman; best breakfast amman; best sushi amman; italian restaurant amman (refinements name Dabouq/Abdoun/Boulevard/7th circle); lebanese restaurant amman; best mansaf restaurant amman; new years eve amman.

### 3.3 Neighborhood (validated, granular, the architecture driver — C06)
Full Amman-specific suggestion sets at gl=jo for: `restaurants in abdoun` (+best/fancy/italian/burger), `restaurants in swefieh village` (spelling variant **swefieh outranks sweifieh** — target both), `restaurants in sweifieh amman`, `rainbow street restaurants amman`, `best restaurants jabal amman` (+cuisine refinements), `restaurants in weibdeh` (+jabal weibdeh), `abdali boulevard restaurants` (thin: 3 suggestions), `best restaurants in amman downtown` (EN downtown thinner than AR وسط البلد), `restaurants amman khalda`, plus Shmeisani/Tla' Al-Ali/Dabouq confirmed via fresh probes (AR much deeper than EN for outer neighborhoods). Disambiguation caveats: "rainbow street" alone bleeds to Reykjavik; "boulevard"/"abdali" bleed to Kuwait/Damascus — always Amman-qualify titles.

### 3.4 Occasion/seasonal — Ramadan is the strongest cluster (C05)
`iftar buffet amman` (family: ramadan buffet amman, iftar places/restaurants amman, best iftar buffet amman, ramadan buffet 2026 amman), `suhoor places amman`, `restaurants in amman open during ramadan` (leaks into the generic seed), `best restaurants for iftar in amman`. TripAdvisor forum evidence: popular iftar venues (Sufra, Olea) typically **require reservations** during Ramadan (https://www.tripadvisor.com/ShowTopic-g2625854-i29920-k13836359-Amman_Restaurants_for_Iftar-Amman_Governorate.html — "sell out" is stronger than sources support; walk-ins often possible ~8 PM). Suggestions persist 4 months post-Ramadan — durable demand. Note: bare `iftar amman` is dominated by prayer-time queries; dining intent lives in the buffet/restaurant/عروض modifiers.

### 3.5 B2B / partner
- `restaurant reservation system jordan` / `restaurant reservation system amman` — no Jordan-local competitor targets this post-ReserveOut; Eat App's B2B arm targets comparison content generally (competitors lane). Current /en/partner already targets it (site-audit catalog).
- `list your restaurant amman` — current /en/partner meta target.
- `restaurant no-show reduction` — current partner meta differentiator language.
- Evidence basis for all three: competitor targeting + Cue's own current metadata, not autocomplete demand — treat as positioning terms, not demand terms.

### 3.6 Branded / category-defining
- `cue app jordan`, `cue app amman` — zero autocomplete today; brand SERP unowned (US-geo Google shows zero cue-app.net visibility even for the exact domain — C25).
- `restaurant booking app jordan` — zero suggestions; category head-term free (C13).
- `reserveout amman` — empty autocomplete but pages still indexed; orphaned demand adjacent to Cue's positioning (C12).

---

## 4. Arabic Keyword Map

Basis: 48+ real autocomplete probes, gl=jo & hl=ar, UTF-8 percent-encoded (responses arrive as windows-1256 and were converted before reading — a hard-won methodological requirement; several early probes were invalidated by encoding mangling and re-run).

### 4.1 MSA discovery core (head terms + verified modifiers)
- `مطاعم عمان` / **`مطاعم عمان الاردن`** (the Oman-disambiguated form users actually type — use it in titles)
- `أفضل مطاعم عمان` + verified family: `الاردن` / `للعائلات` / `للمشاوي` / `وسط البلد` / `فطور` / `للعشاء` / `غير مكلفة` (inexpensive — recurs across 5+ seeds) / `الأعلى تقييمًا` (top-rated — recurs across neighborhood seeds) (C02, C05, ar-dialect catalog)
- Cuisine: `أفضل مطاعم شاورما/برجر/بروستد في عمان`, `مطاعم سوشي عمان` (pair with الاردن — sushi seeds showed Oman bleed), `مطاعم بيتزا ايطالي في عمان`
- Family/occasion: `مطاعم عائلية عمان`, `مطاعم جلسات عائلية عمان`, `مطاعم سهرات عائلية في عمان`, `مطاعم في عمان مع العاب اطفال`, `مطاعم في عمان مفتوح الآن`, `مطاعم عمان جلسات خارجيه`, `مطاعم عمان راقيه` (upscale — Cue's wedge), `مطاعم رومانسية عمان`
- **Breakfast (فطور) is the standout AR occasion**: `مطاعم فطور في عمان` (#1 suggestion), `مطاعم فطور صباحي في عمان`, plus فطور as a sub-modifier under nearly every neighborhood seed
- Ramadan seasonal: `افطار رمضان عمان` (family: بوفيه / عروض / مطاعم افطار رمضان عمان), `سحور عمان` (اماكن / بوفيه / مطاعم / عروض), `مطاعم عمان في رمضان`, `مطاعم عمان للسحور`, `عروض مطاعم عمان` (incl. العيد) (C05)
- Informational: `اسعار مطاعم عمان`

### 4.2 Neighborhoods (AR is deeper than EN — C06)
Full 10-item Amman-anchored sets for: `مطاعم عبدون` (فطور/برجر/شاورما/الأعلى تقييمًا), `مطاعم الصويفية` (فيليج / **شارع الوكالات**), `مطاعم جبل عمان` (**الدوار الثالث** — circle-level granularity, 1st/2nd/3rd circles all appear), `مطاعم شارع الرينبو` (للفطور/غير مكلفة/مفتوح الآن), `مطاعم اللويبدة`, `مطاعم العبدلي بوليفارد`, `مطاعم البوليفارد عمان`, `مطاعم خلدا` (فطور/**دوار السكر**/توصيل), `مطاعم وسط البلد عمان`, `مطاعم الشميساني`, `مطاعم تلاع العلي` (سوق السلطان), `مطاعم دابوق` (ديستريكت/فيلج spelling variants). Micro-landmarks (شارع الوكالات، دوار السكر، الدوار الثالث، سوق السلطان) belong in page copy.

### 4.3 Transactional AR — what the evidence actually says (C14 + corrected C16)
- `حجز مطعم في عمان`, `حجز مطاعم عمان`, `حجز مطعم عمان` — all empty at gl=jo (C14).
- Generic `حجز مطعم` / `حجز طاولة` autocomplete to **branded Gulf venues** (خيال، اسياخ جدة، دانك، ساروجة، برايم كت، بلانكا، قمر الرياض، plus Cairo's خوفو) — zero Amman entries (C14).
- **Important correction (C16 was refuted):** the earlier framing "the booking act is English-coded for Arabic speakers" is wrong. Arabic speakers demonstrably express booking intent natively in Arabic — noun-form `حجز طاولة`/`حجز مطعم` surfaces abundant venue-specific Arabic booking suggestions, and `تطبيق حجز مطاعم` has a full Arabic city family — it is just **not yet anchored to Amman**. The imperative `احجز طاولة`'s translation-query suggestions ("بالانجليزي") are an artifact of ESL phrase-book query shape, not of booking behavior. Strategy consequence: EN pages can own Amman transactional intent *today* (because that's where any visible Amman transactional signal lives), while AR pages own discovery **and are positioned to capture AR booking intent as it forms** — `تطبيق حجز مطاعم الاردن` and `حجز مطعم عمان` belong in AR page metadata as category-defining bets, not demand-capture plays.
- Venue-branded AR pattern: `منيو مطعم [venue]` — all 10 suggestions are named Amman-area venues. AR venue pages should carry منيو (menu) prominently.

### 4.4 MSA vs Jordanian dialect vs Arabizi — where dialect actually diverges (C15)
- **Convergence:** MSA and Jordanian dialect share the identical noun-phrase core (`مطاعم` + place). Divergence is confined to adjectives/superlatives and the ب- preposition: `حلوة` / `أحلى` / `احسن` / `زاكيه` / `بعمان` vs MSA `أفضل` / `في عمان`.
- **Google normalizes dialect toward MSA** — `أحلى مطاعم بعمان` → `احلى مطاعم عمان` (query-corrected suggestion subtypes verified). Normalization is partial, not universal: bare `مطاعم بعمان` keeps dialect suggestions (`مشهوره`, `زاكيه`) alongside normalized forms.
- **Verdict: no separate dialect landing pages.** Dialect variants (مطاعم حلوة في عمان، احلى/احسن مطاعم عمان، مطاعم بعمان زاكيه/مشهوره) belong as secondary phrasing woven into the same pages. Dialect question-forms (وين أروح / وين احلى مطاعم) show zero autocomplete demand — not a search surface.
- **Arabizi: skip entirely.** Zero suggestions across 4 seeds (ar-dialect lane).
- **Disambiguation:** عمان collides with Oman — not on the bare city name at gl=jo (which resolves Jordan-dominant), but through the adjective عماني in category queries (`فطور عمان` yields 6/10 Omani suggestions — Muscat/Salalah) (C07 corrected). Append `الاردن` in titles/H1s; autocomplete itself shows users doing this organically.

---

## 5. Google-Signal Findings

**What autocomplete showed (all gl=jo, saved + independently re-verified 2026-07-23):**
- Transactional reservation queries near-invisible for Amman in both languages (C01, C14). Discovery queries deep and attribute-rich in both (C02, C06).
- Reservation intent is venue-branded (Sufra, hotel brands) (C04).
- Ramadan is the strongest occasion cluster in both languages, durable 4 months post-season (C05).
- "with a view" is the top attribute modifier (≥5 independent seeds) (C03).
- Category vocabulary `تطبيق حجز مطاعم` established for 9 GCC/London cities, zero Jordan variant (C18); EN equivalent likewise Jordan-free (C13).
- No brand owns Jordan booking queries: opentable/thefork/reserveout/eat-app all family-less or empty (C13).

**Confirmed homonym traps (must shape titles, H1s, and rank tracking — C07):**
- EN: Ammanford (Wales) — the sole suggestion for "book a table amman"; Tamil Nadu "Amman" restaurant chains (amman mess → Madurai/Coimbatore/Erode/Singapore diaspora); "amman street salmiya" (Kuwait) and UAE amman streets; "best restaurants in jordan" → Jordan MN / Utah's Jordan Landing / Ontario / Hong Kong / Jordaan Amsterdam.
- AR: bare عمان resolves Jordan-dominant at gl=jo, but عماني (Omani) contaminates category queries (فطور عمان → Muscat/Salalah).
- Users' own disambiguators — **"amman jordan"** and **"عمان الاردن"** — recur as rich suggestion stems; use them on-page. Rank tracking must exclude Ammanford/Tamil/Oman false positives or every report will be polluted.

**What was NOT obtainable:**
- **Zero numeric volume data.** Google Trends returned HTTP 429 after one token-only response; Bing related-searches (cc=JO) was captcha-blocked (google-signals lane). All signals are qualitative by necessity.
- **No Jordan-local Google SERPs.** Google's JS wall and Bing/DDG captchas blocked direct SERP scraping; all SERP observations came through US-geo-biased WebSearch and are flagged wherever used (C17, C20, C25).
- **No Search Console** — Google indexation of either locale is unverifiable (C24, C25).
- Autocomplete emptiness is evidence of low query-prefix popularity, **not literal zero volume** (threshold effects; small-market suppression). This caveat applies to every "empty" finding above.

---

## 6. Live-Site Audit: Findings + Prioritized Fixes

**Foundation is sound (C22):** all 12 audited pages (EN+AR × home, how-it-works, faq, partner, about, reach-out) return 200 with unique localized titles/meta, self-referencing canonicals, complete en/ar/x-default hreflang on-page and in sitemap.xml (28 URLs total), robots.txt permissive (only /api/, /admin/ disallowed) with sitemap declared. Arabic pages have near-parity server-rendered text (AR/EN token ratios: home 764/885, partner 688/726, how-it-works 479/571, about 313/367 — measured via script/style-stripped extraction of curl-fetched HTML, 2026-07-23; an earlier "AR is 80% thinner" reading was a measurement artifact) (C27). **Do not spend effort "fixing" existing AR pages — spend it on new pages.**

### Fixes, in priority order

| # | Fix | Route(s) | Evidence |
|---|-----|----------|----------|
| 1 | Replace blind locale-prefix middleware behavior with a legacy-slug map: 301/308 `/contact`→`/en/reach-out`, `/career`→`/en/careers`, `/dpa`→`/en/legal/dpa`. Today these 307 to `/{detected-locale}/contact` etc., which 404 (mechanism: `src/middleware.ts` prefixes the Accept-Language locale with no mapping table — an ar-preferring browser gets `/ar/contact` → 404 too). | middleware (affects all legacy paths) | C23, C28 |
| 2 | Render all FAQ answers in the visible DOM on `/en/faq`, `/ar/faq`, and the home FAQ section. Answers currently exist only in FAQPage JSON-LD + RSC script payload; collapsed accordion items ship no answer text in HTML. (Schema is already present — this is parity hardening, not missing markup.) | `/[locale]/faq`, `/[locale]` | C28 |
| 3 | Add og:image to all subpages — currently only `/en` and `/ar` home have one. | all non-home routes | C28 |
| 4 | Linkify the home-page neighborhood section. The 8 names (Abdoun, Sweifieh, Rainbow Street, Seventh Circle, Jabal Amman, Shmeisani, Al Weibdeh, Dabouq) are plain `<span>` text today; `/en/venues` and `/en/restaurants` 404; all non-brand demand funnels into the home page. | `/[locale]` → new `/[locale]/restaurants/*` | C26 |

**Indexation status (labeled by confidence):** US-geo Google shows zero visibility for cue-app.net — site:, exact-domain, and branded queries all surface unrelated Cue-named products (confirmed, but US-geo-biased and the tool doesn't strictly honor site:; Jordan SERPs could differ) (C25). The earlier observation that Bing/DDG index the EN pages but zero /ar URLs is **unverifiable** — both engines now serve bot challenges, and it rests on one Bing-syndicated index anyway. Treat "AR pages unindexed" as an unverified hypothesis; site-side checks confirm nothing blocks AR indexation (200, no noindex, hreflang, sitemap), so any gap would be crawl lag, not a technical defect (C24). Practical move: get Search Console + Bing Webmaster Tools access — it converts this entire unknown into data.

---

## 7. Content Roadmap (priority order)

Each item lists target queries (evidence: gl=jo autocomplete unless noted).

**P0 — Fixes from §6** (redirects, FAQ DOM, og:image, linkified neighborhoods). Days, not weeks; unblocks everything else.

**P1 — 8 neighborhood pages + AR mirrors** — `/[locale]/restaurants/[slug]` for abdoun, sweifieh (cover "swefieh" spelling — it outranks "sweifieh" in autocomplete), rainbow-street, seventh-circle (site copy says "Seventh Circle" — choose slug deliberately), jabal-amman, shmeisani, weibdeh, dabouq. Targets: `restaurants in abdoun` (+best/fancy/italian/burger), `مطاعم عبدون` (+فطور/برجر/شاورما/الأعلى تقييمًا), `مطاعم الصويفية شارع الوكالات`, `مطاعم جبل عمان الدوار الثالث`, `مطاعم شارع الرينبو`, `مطاعم اللويبدة`, `مطاعم الشميساني`, `مطاعم دابوق`, etc. (C06, C26, C28). Beat Eat App's template on the two axes it's weak: localized AR titles/canonicals (theirs canonicalize to EN with boilerplate metadata — C11) and real per-neighborhood content depth (their neighborhood pages run as few as 4 listings with generic titles — C08). Always Amman-qualify: "Restaurants in Abdoun, Amman" / "مطاعم عبدون عمان الاردن".

**P2 — Occasion/experience pages (the Eat App gap — C09):**
1. Restaurants with a view in Amman / مطاعم عمان (إطلالة) — top recurrent modifier (C03)
2. Rooftop restaurants Amman (`rooftop restaurants/bar amman`, `shisha rooftop amman`; Resy's one visible Amman venue is a rooftop — competitors lane)
3. Romantic / date-night (`best restaurants in amman for date/for couples`, `مطاعم رومانسية عمان`)
4. Family (`family friendly restaurants amman`, `with play area`, `مطاعم عائلية عمان`, `مع العاب اطفال`)
5. Breakfast/brunch (`best breakfast amman`, `friday brunch amman`, `مطاعم فطور في عمان` — the standout AR occasion)
6. Shisha (`best restaurants in amman with shisha`, `shisha lounge amman`, `كافيهات عمان` family)

**P3 — Ramadan hub (build by ~Nov 2026, well before Ramadan):** `/[locale]/ramadan` or under /restaurants — iftar buffet amman, best iftar buffet amman, ramadan buffet 2026 amman, suhoor places amman, restaurants open during ramadan; AR: افطار رمضان عمان (بوفيه/عروض/مطاعم), سحور عمان (اماكن/بوفيه/عروض), مطاعم عمان للسحور (C05). Booking-pressure angle is evidenced: reservations required at popular iftar venues (TripAdvisor thread, §3.4). This is also Cue's product story — deposits for high-demand nights.

**P4 — Cuisine children under neighborhoods + citywide:** italian (refinements name Dabouq/Abdoun/Boulevard/7th circle), burger (EN+AR), sushi (+الاردن disambiguator), lebanese, shawarma/برجر/بروستد (AR), mansaf (`where to eat mansaf in amman`, `best mansaf restaurant amman` — tourist/national-dish page).

**P5 — Per-venue pages as partner roster goes public:** target `{venue} amman`, `{venue} amman reservation`, `{venue} menu / منيو مطعم {venue}` (C04 pattern; the only place transactional search demonstrably lives). Venue pages should carry menu, photos, phone, neighborhood, and the booking CTA.

**P6 — Category/brand pages:** strengthen /how-it-works and /about toward "restaurant booking app Jordan" / "تطبيق حجز مطاعم الاردن" / "restaurant reservation app" (C13, C18 whitespace — demand-creation bets, labeled as such). Partner-side: comparison/education content for "restaurant reservation system jordan" (uncontested post-ReserveOut).

---

## 8. Claims Register

| ID | Claim (abridged) | Status | Sources | Correction / caveat |
|----|------------------|--------|---------|---------------------|
| C01 | EN transactional booking queries for Amman are empty/off-target at gl=jo | **Confirmed** | suggestqueries gl=jo probes, 2026-07-23 | Nuance: `reservation amman` IS populated but hotel/venue-branded (Sufra) — per-venue pages can capture it; generic pages can't. Emptiness ≠ literal zero volume. |
| C02 | Amman demand is discovery-shaped, attribute-rich, both languages | **Confirmed** | gl=jo autocomplete EN+AR | Corrected: 8 genuine Amman refinements (not 10 — set included the seed + Ammanford false positive); "open now" did not reproduce; AR adds مول. |
| C03 | "with a view" is the most recurrent EN attribute modifier (≥5 seeds) | **Confirmed** | gl=jo capture corpus (~283 files) | The "fancy restaurants" instance was circular (seed contained the modifier); ≥5 threshold holds via other independent seeds. Runners-up: shisha, for couples. |
| C04 | Reservation intent is venue-branded; "sufra restaurant amman reservation" only reservation suggestion in EN seeds | **Confirmed** | gl=jo autocomplete; fresh probes | Precision: only after excluding Madurai-India "reserve line" noise and definitional queries; corpus was 60 files, not 55. Hotel brands dominate raw "reservation amman". |
| C05 | Ramadan is the strongest occasion cluster, both languages | **Confirmed** | gl=jo EN+AR probes; https://www.tripadvisor.com/ShowTopic-g2625854-i29920-k13836359-Amman_Restaurants_for_Iftar-Amman_Governorate.html | Soften "sell out" → "reservations required at popular venues; walk-ins often possible ~8 PM". Bare `iftar amman` = prayer-time queries. |
| C06 | Neighborhood demand is real, granular, bilingual; validates /restaurants/<neighborhood> architecture | **Confirmed** | gl=jo EN+AR neighborhood probes | Not every set is "full": EN abdali-boulevard/downtown thin (3 items); generic-name localities (Boulevard, Rainbow St, Abdali) mix Kuwait/Damascus/Reykjavik — Amman-qualify titles. AR deeper than EN for outer neighborhoods. |
| C07 | Homonym traps (Ammanford, Tamil Amman, Kuwait, Jordan-MN, Oman) shape titles + rank tracking | **Confirmed** | gl=jo probes both languages | Corrected: bare عمان at gl=jo resolves Jordan-dominant; Oman collision manifests via عماني in category queries (فطور عمان → 6/10 Omani). AR fetches require ie/oe=utf-8. |
| C08 | Eat App runs a programmatic Amman template (98 subpages, 21 neighborhoods) | **Confirmed** | https://eatapp.co/amman, /amman-restaurants, /amman/jabal-amman-restaurants | Corrected: ~76 cuisine pages (not 80+); directory is on /amman/restaurants; **"already ranks for Amman booking queries" is unverified** (absent from captured Bing SERPs; no Jordan-geo evidence). Neighborhood pages thin, generic titles. |
| C09 | Eat App has no occasion pages for Amman | **Confirmed** | https://eatapp.co/amman + direct 404 probes | Rooftop/romantic/iftar/brunch/family/outdoor all 404. Edge: afternoon-tea page exists (classified under cuisines). |
| C10 | Eat App is dual-positioned (consumer marketplace + B2B SaaS) | **Confirmed** | https://eatapp.co/amman-restaurants, https://restaurant.eatapp.co/blog/the-fork-alternatives | Their B2B marketing positions against the marketplace model even while operating a consumer channel — useful for Cue's partner messaging. |
| C11 | Eat App runs AR programmatic neighborhood pages | **Confirmed** | https://eatapp.co/ar/amman/abdoun-restaurants | Critical correction: AR pages canonicalize to EN URLs, generic boilerplate AR titles, neighborhood untranslated — space validated but only **weakly contested**. Coverage partial (sweifieh/shmeisani 404 under /ar). |
| C12 | ReserveOut is defunct; its Amman demand/backlinks orphaned | **Confirmed** | DNS/curl checks 2026-07-23; https://tracxn.com/d/companies/reserveout/__7Q7SHn1c9UTyrDem_zGL4YcFvlyQNe1wO69T693oXdk | Domain still registered (NS + MX live) — dormant, not dissolved; a relaunch/redirect is technically possible. Databases (Tracxn "Active", CB Insights "Alive") are stale. Crunchbase itself 403'd. |
| C13 | No booking brand owns Jordan query mindshare | **Confirmed** | gl=jo brand probes, 2026-07-23 | "Lone" slightly overstated (each brand query has one noise extra). Absence proves unclaimed query space, not absence of operating competitors. |
| C14 | AR transactional booking has no Jordan/Amman footprint; generic terms are Gulf-venue-branded | **Confirmed** | hl=ar gl=jo probes (cp1256-decoded) | "Exclusively GCC" imprecise: includes Cairo's خوفو and non-venue phrase queries; zero Amman entries stands. |
| C15 | MSA/dialect converge on noun phrase; dialect diverges in adjectives; no separate dialect pages | **Confirmed** | hl=ar gl=jo dialect probes | Normalization is partial (bare مطاعم بعمان keeps dialect suggestions); full-sentence dialect queries (وين أروح) diverge structurally but show zero demand. Recommendation unchanged. |
| C16 | "The booking ACT is English-coded for Arabic speakers; EN owns transactional, AR owns discovery" | **REFUTED** | suggest-msa-ehjez-tawle.json + counter-probes v16b-*.json | **Correction:** the imperative `احجز طاولة`'s translation-query suggestions are an ESL phrase-book artifact. Noun-form `حجز طاولة`/`حجز مطعم`/`تطبيق حجز مطاعم` surface abundant native-Arabic transactional suggestions — venue- and city-specific, all GCC/other cities, **none for Amman** (properly-encoded Amman probes empty; the originally cited empty probes were encoding-corrupted '???' queries and invalid as evidence). Supported reformulation: AR booking demand exists in the language generally but is not yet visible for Amman — EN can own Amman transactional intent today while AR targets discovery and positions for AR booking intent as it emerges. Not used anywhere in this strategy in its original form. |
| C17 | Arabic-script content ranks for AR restaurant queries; /ar build worthwhile | **Confirmed** | urtrips.com (→urtrips.net), rest.arbdar.com, halabazaar.com, mat3am.net, twsia.com | US-geo SERP evidence only; Jordan ranking order unverified. "Dominate" overstated — AR-localized platform pages (eatapp.co/ar, stale reserveout AR pages, AR TripAdvisor) also rank. twsia's cited page is an empty directory shell. |
| C18 | `تطبيق حجز مطاعم` has 9 GCC/London city variants, no Jordan — whitespace | **Confirmed** | suggestqueries hl=ar gl=jo, 2026-07-23 | Forced-prefix probes (…عمان/الاردن) also empty. "Whitespace Cue can define" is inference; absence ≠ zero demand; suggest endpoint's geo-localization is weak (Gulf-volume-dominant). |
| C19 | OpenTable Jordan: 11 restaurants, hotel-skewed, + landmark pages | **Confirmed** | https://www.opentable.com/metro/jordan (verbatim "As of Jul 23, 2026 there are 11 restaurants in Jordan"), /jordan/amman, landmark pages | /jordan/amman page says 10; ~7 of the roster are Fairmont/Four Seasons outlets. |
| C20 | eatapp.co/amman, OpenTable, Resy rank on US-geo SERPs for Amman booking queries | **Confirmed** | US-geo WebSearch replications | Corrected: Resy pages only surfaced for queries naming Resy. GEO-BIAS FLAG stands — Jordan SERPs unobserved and may differ (Instagram/TripAdvisor/local blogs). |
| C21 | Behavioral incumbent is Instagram/WhatsApp/phone; category demand unformed | **Confirmed** | gl=jo probes; DNS checks | The Instagram/WhatsApp/phone half is **inference from platform absence**, not a measured fact — no consumer survey exists in this evidence base. |
| C22 | cue-app.net technical SEO is sound | **Confirmed** | https://www.cue-app.net/sitemap.xml, /robots.txt, 12-route curl audit | robots.txt disallows /api/, /admin/ (harmless); sitemap has 28 URLs. Structured data/CWV/Google indexation outside audited scope. |
| C23 | Legacy /contact,/career,/dpa 307→/en/*→404; middleware blindly prefixes locale | **Confirmed** | live curl 2026-07-23; src/middleware.ts | Broader than stated: prefix is the Accept-Language-detected locale (AR browsers → /ar/contact → 404). "Still indexed in Bing/DDG" could not be re-verified (bot challenges) — fix is warranted regardless. |
| C24 | Bing/DDG index EN pages; zero /ar results; Google AR indexation unverifiable | **UNVERIFIABLE** | DDG site: queries (now captcha-walled) | Used in this document only as a labeled hypothesis. DDG is Bing-syndicated (one index, not two). Site-side checks show /ar fully indexable (200, no noindex, hreflang, sitemap) — any gap would be crawl lag. Action: get Search Console + Bing Webmaster Tools. |
| C25 | US-geo Google shows zero visibility for cue-app.net | **Confirmed** | WebSearch replications 2026-07-23; corroborating Bing exact-match zero-results | Tool doesn't strictly honor site:; reads as "no cue-app.net URL surfaced", not proof of non-indexation. Site is live and crawlable (200, permissive robots) — gap is visibility, not availability. |
| C26 | No booking-intent/neighborhood/cuisine landing pages; home neighborhoods unlinked | **Confirmed** | curl 404s (/en/venues, /en/restaurants, +alternates); home HTML href extraction; sitemap | Cosmetic: site says "Seventh Circle" and "Al Weibdeh". |
| C27 | AR pages near-parity with EN (no thinness problem); depth work → new pages | **Confirmed** | script/style-stripped token counts on 12 fetched pages, independently reproduced | AR text verified genuinely server-rendered and Arabic-script (84–87% of tokens). Earlier "80% thinner" was a measurement artifact. |
| C28 | Route mapping recommendation (redirects, FAQ DOM, og:image, 8 neighborhood pages + AR mirrors, cuisine children, venue pages) | **Confirmed** (all factual predicates) | Live curl checks; gl=jo autocomplete; eatapp.co structure | Slug nuances: cover "swefieh" spelling; choose seventh-circle/weibdeh slugs deliberately; FAQ JSON-LD already present (item is parity hardening). |

---

## 9. Methodology + Constraints

**What was used:**
- **Real Google autocomplete at Jordan geo** — `suggestqueries.google.com/complete/search?client=firefox&gl=jo` with hl=en / hl=ar; ~95+ EN seeds and 48+ AR probes plus adversarial re-verification passes (every claim above was independently re-run by two verifiers). Arabic queries required UTF-8 percent-encoding on the way in; responses arrive as **windows-1256** and must be converted before reading — several early AR probes were invalidated by encoding mangling (echoed query = "???") and re-run correctly; one refuted claim (C16) traces partly to this trap.
- **Direct curl fetches** of competitor pages (eatapp.co, opentable.com, tripadvisor threads via indexed snippets where bot-blocked) and of all cue-app.net routes, sitemap, robots.
- **DNS checks** (nslookup against 8.8.8.8/1.1.1.1) and Wayback Machine for ReserveOut's status.
- **WebSearch** for SERP observations — **US-geo-biased throughout**; every conclusion depending on it is flagged (C17, C20, C25).

**What was not available, and the consequences:**
- **No Google Search Console / Bing Webmaster Tools** → indexation status of either locale is unknown (C24 unverifiable, C25 tool-limited). First operational step of executing this strategy should be wiring both up.
- **No paid keyword tools, and Google Trends 429'd** → **zero numeric search-volume data anywhere in this document.** All demand signals are qualitative (autocomplete presence, richness, and recurrence). Prioritization is by breadth-of-suggestion-family and competitive gap, not volume.
- **No Jordan-local SERP scraping** — Google JS wall; Bing/DDG captchas. Jordan ranking order for any query is unobserved. Autocomplete at gl=jo is the closest genuine Jordan-geo signal used.
- **Known interpretive limits:** autocomplete emptiness is threshold-based, not proof of zero searches; the suggest endpoint's geo-localization is weak for Arabic (Gulf volume dominates); suggestions are volatile point-in-time observations (all dated 2026-07-23); homonym pollution (Ammanford/Wales, Tamil Nadu "Amman" venues, Kuwait's Amman Street, Oman/عماني, Jordan-the-name) was actively screened out of every demand conclusion and must be screened out of future rank tracking.
