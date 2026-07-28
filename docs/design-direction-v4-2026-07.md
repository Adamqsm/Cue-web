# Cue-web redesign v4 — audit & art-direction options

*2026-07-27 · Status: awaiting direction pick. No implementation yet.*

The brief: v3 "Tonight" (PR #4) reads as AI-generated / vibe-coded / a PowerPoint deck.
This doc audits why against the five reported problems, then proposes three art directions.

---

## Part 1 — Audit

### 1. Floating pill/badge callouts near the hero — confirmed, 3 instances

`.pill-live` (marigold wash + pulsing dot, `globals.css:355`) renders in:

- `src/components/sections/HomeHero.tsx:54` — "Pre-launch · Amman" above the H1
- `src/components/home/ServiceBoard.tsx:117` — live pill in the board header
- `src/components/home/FinalCta.tsx:31` — "Pre-launch · Amman" again, centered above the closing CTA

A pulsing-dot status pill floating above a hero H1 is the single most recognizable
generated-SaaS opener of the last two years. Repeating it twice on one page makes it read
as a component the template shipped with, not a message.

### 2. Second section requires excessive scrolling — confirmed, it's scroll-jacked

`HowItWorks.tsx:96` pins the "Loop" section with `height: steps.length * 78vh` = **312vh**.
Measured live at 1280×720: the section is 2,698px — **3.75 viewports** — during which only
the active step's body text is expanded (`AnimatePresence` collapses the rest). The user
scrolls ~3 screens to read four one-line steps that would fit in half a screen.

Wider context: the homepage is **15.3 viewports / 11 numbered chapters** total. Scroll-jacked
pinning with a sparse payoff is the #1 "vibe-coded" tell.

### 3. Third page (/partner) breaks into slideshow panels — confirmed

Nav order is Home → How it works → **Partner**. Measured live: **9 stacked full-width panels
over 9.3 viewports**, each 0.6–1.35 viewports tall, alternating background slabs
(transparent → surface2 → transparent → surface2 → olive → transparent). Every panel has
identical anatomy: sticky margin numeral + uppercase kicker + `clamp()` serif h2 + body +
rows. Content even repeats slide-style — "first 12 months at JD 0" is pitched twice
(FoundingBanner and the closing CtaBand).

Root cause is structural: `EditorialSection.tsx` **is a slide master** — every section on
every page passes through it (`num`, `label`, `band` = slide number, slide kicker, slide
background). /how-it-works has the same disease (6 panels; in dark mode its ink band inverts
to a giant cream slab mid-page). Restyling won't fix this; the section grammar must go.

### 4. Palette reads as generic — confirmed, and it's measurably the AI default

v3 tokens: sand `#F2ECDF` ground, olive `#5B6A38` accent, marigold `#DF9426` spark, clay
`#B47850`, film-grain overlay, two radial gradient blooms on `body`. Perceptually: sand/bone
≈ neutral cream, desaturated olive ≈ gray-green "chrome," marigold is the lone saturated
voice ≈ "yellow accent." That's exactly the two-tone-plus-yellow reading.

The deeper problem: **warm cream field + high-contrast serif display (Fraunces) + warm
clay accent + grain is the single most common AI-generated look right now** — the
statistical mode of generated design. Fraunces + Instrument Sans is likewise one of the
most common generated font pairings. v3 didn't pick an unfortunate palette; it landed on
the default.

### 5. Generic-AI tell inventory (the full list to kill)

- Pulsing status pills ×3; uppercase tracked eyebrow on every section
- Scroll-jacked pinned section; every section animates in with the same rise/stagger ease
- Film grain overlay + fixed radial gradient blooms
- `rounded-full` buttons with translateY hover-lift + soft glow shadows; `.card` 14px-radius
  bordered surfaces with hover lift
- Numbered chapters 00–09 with sticky "editorial spine" numerals — numbering that encodes
  nothing (the sections aren't a sequence)
- Authored abstract line-art SVG spot illustrations (BookingPhone, OperatorBoard, GapMotif,
  ConfirmPulse) — the exact illustration genre generated sites use
- Alternating full-bleed color bands; identical CtaBand closer on every page
- A traction section with placeholder traction ("Real partner logos land here")
- Hero formula: serif H1 with italic accent word + subtitle + two pill buttons + trust note

**The bounce problem is also a content problem.** The site contains no actual restaurants —
every section talks *about* Cue in marketing abstractions; the only "content" is a fictional
service board, and Neighborhoods lists names that link nowhere. There is nothing to explore,
so nobody explores. Cue has real assets (seeded venues, 20 curated webps, app screenshots)
that the site never uses.

### What survives

The token architecture (semantic CSS vars, components never hardcode hex), the RTL mirroring
plumbing, next/font pipeline, SEO/JsonLd layer, forms. A re-skin is a token-values +
section-grammar change, not an i18n rebuild.

---

## Part 2 — Art-direction options

Non-negotiables shared by all three (they answer problems 1–3 + 5 regardless of pick):

1. Pills die. Pre-launch status becomes one line of set copy, if it appears at all.
2. The Loop un-pins. Four steps fit in under one viewport as a printed artifact (see options).
3. The band-deck dissolves: continuous page layout, **max one** field-color moment per page,
   sections separated by typographic rules/grid, not background slabs. `EditorialSection`'s
   numeral spine is retired.
4. Homepage cut from 11 chapters to ~5 moves, under ~8 viewports.
5. Something real to explore above the fold: actual venues/neighborhoods, not a simulation.
6. Arabic is set as an equal first-class voice (each option specs an AR pairing).

### Option A — "The Amman Ledger" (recommended)

**Idea.** Set the site in the material world of restaurant service: the reservation ledger,
the printed menu, the day sheet, the confirmation stamp. Density and tabular order do the
talking — the opposite of deck sparseness. The page is one continuous ruled paper field;
color lives in the bindings, not in section slabs.

| Role | Value |
|---|---|
| Paper (ground) | `#F0EEE4` — gray-green undertone, deliberately off the golden-cream AI zone |
| Ink | `#1A1B17` |
| Ledger green (brand field: nav, footer, covers) | `#23372B` |
| Oxblood (the stamp — sole action color) | `#7E2D21` |
| Brass (hairlines/folios only) | `#8C6D3F` |
| Dark mode | "after close": field `#14201A`, paper text `#EDEBDF`, oxblood lifts to `#C4553F` |

**Type.** EN display: **Bodoni Moda** (the classic menu didone — sharp teeth, nothing like
Fraunces's soft wonk). EN text/UI: **Libre Franklin** (newspaper workhorse; tabular figures
for times/covers/prices). AR display: **Amiri** (bookface Naskh — the menu-serif of Arabic;
alt: Markazi Text if Amiri reads too scriptural). AR text/UI: IBM Plex Sans Arabic (retained).
All next/font/google.

**Layout philosophy.** One paper page per route, sectioned by heavy rules and running heads —
no background changes. Information renders in its native format: pricing as a tariff table,
the four steps as an order ticket, neighborhoods as a two-column index with venue counts,
partner terms as ledger lines. Hero is a day-sheet: "Tonight in Amman" set as a ledger
page-header over a masthead H1, with a real browsable venue/neighborhood index directly
beneath it. **Signature:** the confirmation stamp — CTAs and confirmed states render as a
rubber-stamped "CONFIRMED / مؤكَّد," slightly rotated, ink-edged; used in at most three places.

**Reference.** Physical service ephemera: classic-hotel reservation day books, mid-century
restaurant menu typography, the maître d's stamp.

**Rationale.** It's materially rooted in what a reservation *is*, so every device (rule,
table, stamp, folio) encodes something true instead of decorating; density reads as substance
and gives people rows to actually read and explore, directly attacking the bounce; a
didone-Naskh pairing is hospitality-native rather than tech-native; and there is no pill,
gradient, card, or band anywhere in its vocabulary for a viewer to pattern-match to generated
output. Known adjacency to the "broadsheet" AI default is escaped by material specificity —
green-leather brand field, stamp semantics, tariff tables — rather than generic hairline
minimalism. Risk: can skew heritage-expensive; Franklin's briskness and real photography keep
it current.

### Option B — "Service, Printed" (Levant poster-modernism)

**Idea.** 1960s–70s Arabic print modernism — film posters, Hilmi al-Tuni / Dia al-Azzawi
book covers, golden-age Alia (Royal Jordanian) ephemera — as a flat two-ink silkscreen
system. Arabic leads; Latin follows. The most ownable and the loudest option.

| Role | Value |
|---|---|
| Paper | `#F3EEE2` |
| Ink | `#17150F` |
| Vermilion (ink no. 1) | `#D8432C` |
| Teal (ink no. 2) | `#0F5A54` |
| Overprint (their multiply) | `#123C33` |
| Dark mode | "night screening": ink field, paper text, inks stay saturated |

Two inks + black is deliberate (budget silkscreen truth) and kills accent-monogamy: color
arrives as committed flat fields and duotone imagery, never as tinted washes on neutral.
No yellow anywhere — a clean break from marigold.

**Type.** AR display: **Lalezar** (fat-face poster lettering; alt: Rakkas). AR text:
**Readex Pro**. EN display: **Bricolage Grotesque** at heavy weights (hand-cut grotesque
energy). EN text/UI: **Archivo** (+ Archivo Narrow for data rows). All next/font/google.

**Layout philosophy.** Poster-grid pages: a bold bilingual masthead, then broadsheet columns
that sit side-by-side rather than stacking; hard 2px rules, zero radius, buttons as printed
tickets, venue names running as marquee listing rows. One ink-field poster moment per page,
maximum. **Signature:** the mirrored bilingual masthead — every page title is an EN/AR lockup
reading inward from both edges to a center rule, celebrating the product's bilingual truth;
no other site has it.

**Reference.** Alia's 1970s identity + Arabic film-poster lettering; contemporary echo in
Amman/Beirut cultural-institution print (e.g., Darat al Funun).

**Rationale.** Unmistakably of the Levant and impossible to mistake for template output —
the aesthetic risk is the point, and it buys memorability that neutral competence never will;
Arabic-first hierarchy flips the translation-afterthought dynamic for the half of the
audience v3 treats as secondary; flat overprint is the polar opposite of glossy-card SaaS.
Risk: retro-kitsch if undisciplined — it needs large paper reserves between poster moments,
and heavy AR/EN display faces need careful size balancing. Highest reward, highest hand
required.

### Option C — "The White City at Night" (photography-led dining guide)

**Idea.** Stop pitching the app; become Amman's dining guide with the app as the action
layer. Photography-led — the one asset generated sites cannot fake is real photographs of a
real city — with a duotone treatment that makes mixed sources cohere.

| Role | Value |
|---|---|
| Limestone (ground) | `#E7E1D4` |
| Night (cool blue-black ink) | `#1F242C` |
| Bougainvillea (reserved for "bookable now") | `#C2385F` |
| Brass (sparing) | `#A47E3B` |
| Sky (washes) | `#9FB4C7` |
| Duotone recipe | Night × Limestone; dark mode inverts to night field |

Limestone + night blue + bougainvillea is drawn from Amman's actual streetscape (the white
city at dusk, magenta bougainvillea over balconies) — no generated palette lands there.

**Type.** EN display: **Newsreader** (optical-size news serif). AR display: **El Messiri**
(tall, elegant modernized Naskh). Text/UI both scripts: **IBM Plex Sans / IBM Plex Sans
Arabic** — one cross-script utility family. All next/font/google.

**Layout philosophy.** A magazine front page, not a funnel: lead cover-story module
(photo + headline), then mixed-density modules — a real listings rail (venue, cuisine,
neighborhood, price band), a photo essay, one inset product moment — in a varied rhythm like
a news front. Exploration is native because the content *is* the guide; neighborhood pages
become real index pages. **Signature:** the duotone night-photo treatment plus a strict
semantic — bougainvillea appears only on things you can act on now, so color literally means
availability.

**Reference.** Monocle / Wallpaper* city guides and The Infatuation's city editorial,
grounded in Amman's limestone-and-bougainvillea look.

**Rationale.** This is the direct answer to "make them stay and explore" — people linger in
guides, not in pitches, and every session spent browsing venues is pre-launch demand capture;
real photography is an authenticity moat no generated site clears; and the guide framing
gives the founding-12 venues a stage, which is also the partner sales pitch. Risk: it's a
content commitment, not just a design one — thin listings would feel hollow, so it depends
on venue data/photos (partially in hand: seeded venues, 20 curated webps) and light ongoing
editorial.

---

## Recommendation

**Option A** to ship now — it's the strongest pure-design fix, fully executable with current
content, and its index/tabular grammar already carries Option C's exploration mechanic in
embryo (the venue/neighborhood index under the day-sheet hero). If you'll commit to venue
content and photography for launch, **C** becomes the stronger play; A's ledger skeleton can
host C's photo modules later without a re-rebuild. **B** is the boldest brand statement —
right if you want Cue's site itself to be marketing, but it wants the most taste-hours.
