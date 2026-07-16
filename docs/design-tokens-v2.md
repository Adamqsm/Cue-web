# Cue — Design Tokens v3 (Total Reinvention)

**Status:** Direction proposal for gut-check. No component code until this is approved.
**Supersedes:** `docs/redesign-v2-spec.md` (the "Precision hospitality" build testers called *boring*).
**Locked constraints (non-negotiable):** bilingual EN/AR + RTL parity, alcohol-free imagery site-wide, dark/light.
**Everything else is on the table.**

---

## 0. Why the current site tested as "boring" — the diagnosis we're designing against

The v2 spec's own words were *"restrained, never loud, never gimmicky."* That instinct produced a site that is tasteful and **inert**:

- One accent (terracotta) used "surgically" → nothing ever sings.
- Sections are a vertical stack of centered headings + card grids → the eye predicts every next screen.
- Motion is 100% `fade-in-on-scroll` (12px rise) → the *only* trick, and it's the trick every template ships.
- Inter everywhere → zero typographic personality.

The fix is **not** more effects. It's a **point of view**: a warm, editorial, alive narrative with a real color idea, a real typeface with character, and motion that carries *meaning* (booking state) rather than decoration.

---

## 1. Concept — **"Tonight"**

The homepage is not a feature brochure. It's **one night of service in Amman, unfolding as you scroll** — a warm editorial spread, part magazine, part live operations board. The product truth (a request coming in, getting confirmed, the floor filling up) *is* the content and the motion.

Three feelings, blended so none dominates (the brief's "cohesion over spectacle"):

| Feeling | How it's carried | Dialed back by |
|---|---|---|
| **Warm / hospitable** | sand ground, olive brand, editorial serif, authored illustration | never maximalist — lots of negative space |
| **Fun / energetic** | marigold spark, scroll-linked motion, horizontal rails, oversized numerals | spark used only on *live* moments, not everywhere |
| **Sleek / tech-forward** | asymmetric grid, tabular data, the live board, crisp micro-interactions | no neon, no glass, no cold gradients |

The single organizing idea that ties color + motion + layout + illustration together:

> **A booking is a warm signal. It arrives glowing (marigold), it settles into place (olive).**

That one metaphor drives the palette, the status colors, the hover feedback, and the hero animation — so the interactivity reads as *one language*, not four gimmicks.

---

## 2. Color — drop terracotta, move to **Sand / Olive / Clay + a Marigold spark**

Terracotta `#C86B4A` is retired entirely. New family is warm-neutral with an energetic warm-yellow spark. The *idea*: incoming = **marigold** (energy, live), confirmed = **olive** (settled, hospitable). Status color is product truth, not decoration.

### Light (`:root`)
| Token | Hex | Role |
|---|---|---|
| `--sand` | `#F2ECDF` | page ground — warm sand, not cream, not white |
| `--bone` | `#FBF7EF` | raised surface / cards |
| `--sand-2` | `#E8E0CE` | sunken bands, alternate sections |
| `--ink` | `#232019` | primary text — warm olive-black |
| `--muted` | `#655F4E` | secondary text (AA ≥ 4.5:1 on sand + bone — verify at build) |
| `--line` | `#DCD2BE` | hairlines |
| `--line-strong` | `#9A917C` | input boundaries (≥3:1, WCAG 1.4.11) |
| `--olive` | `#5B6A38` | **primary brand accent** — confirmed / settled |
| `--olive-deep` | `#414D28` | olive text on sand/wash (AA) |
| `--olive-wash` | `#E3E4CB` | tinted olive fills, selected states |
| `--marigold` | `#DF9426` | **spark** — live, incoming, interactive highlight |
| `--marigold-deep` | `#96590F` | marigold text on sand/wash (AA) |
| `--marigold-wash` | `#F7E7C5` | tinted marigold fills, live pills |
| `--clay` | `#B47850` | earthy support — illustration mid-tone, warm depth only |
| `--ok` | `#4E6B34` | form success (reads as olive — on brand) |
| `--error` | `#B23A2C` / `--error-deep` `#8D2B20` | form failure (warm, AA on wash) |

### Dark (`.dark`)
| Token | Hex |
|---|---|
| `--sand` | `#16140E` (warm near-black) |
| `--bone` | `#1F1C14` |
| `--sand-2` | `#28241A` |
| `--ink` | `#EFE9DA` |
| `--muted` | `#A79E88` |
| `--line` | `#332E22` / `--line-strong` `#736B58` |
| `--olive` | `#9DAA6C` (lifted for dark contrast) |
| `--olive-deep` | `#B9C48C` (text on dark) |
| `--olive-wash` | `rgb(91 106 56 / 0.16)` |
| `--marigold` | `#F0B24E` |
| `--marigold-deep` | `#F5C983` |
| `--marigold-wash` | `rgb(223 148 38 / 0.15)` |
| `--clay` | `#C68A5E` |

**Contrast is a hard gate**, verified in the adversarial pass (Step 3): every text/ground pair AA (4.5:1 body, 3:1 large), olive/marigold text-on-wash always uses the `-deep` variant. Same token discipline as v2 — **components never hardcode hex**, everything through CSS vars + Tailwind semantic roles.

**The color moment (restrained):** the page ground carries one faint fixed olive bloom (≤3% light / ≤6% dark). At the "confirm" beat in the hero and in the sticky loop, a marigold→olive transition plays on the actual status token. Nowhere else does color animate. That restraint is what keeps it cohesive rather than a rave.

---

## 3. Typography — retire Inter, go **editorial**

### Latin
- **Display / headlines — `Fraunces`** (variable, `next/font/google`). A "soft serif" with real character: optical-size and a `WONK`/`SOFT` axis that gives it warmth and a little wit — editorial, alive, the opposite of Inter's neutrality. Used for h1/h2 and pull-quotes at high optical size, weight ~550–600, tight tracking.
- **Body / UI — `Instrument Sans`** (variable, `next/font/google`). Warm humanist grotesque, excellent screen legibility, pairs cleanly under Fraunces without competing. Body, labels, buttons, data.
- **Numerals / data** — `Instrument Sans` with `font-variant-numeric: tabular-nums` for the board, covers counter, targets, times.

Pairing logic: characterful serif display + quiet humanist workhorse is the classic editorial move (magazines, not SaaS). It reads *warm + confident*, which is exactly the gap in the current site.

### Arabic (verify rendering before lock — Step 2 build gate)
Fraunces and Instrument Sans have **no Arabic**, so Arabic gets its own equal-weight pairing (never a fallback afterthought):
- **Display / headlines — `Reem Kufi`** (variable, Google). Modern geometric Kufi with editorial confidence — the Arabic counterpart to Fraunces' character, without tipping into formal/classical. Confident at large sizes.
- **Body / UI — `IBM Plex Sans Arabic`** (kept from current build — proven, legible, neutral workhorse). Pairs calmly under Reem Kufi.

Arabic rules (carried from v2, they were correct): in `[dir="rtl"]` **never letter-space Arabic**, headings get a taller line-box (1.2–1.25), uppercase eyebrows become normal-case. Verified visually in AR on every page before "done." If Reem Kufi reads too display-y for our headline lengths in testing, fallback candidate is **`Rubik`** (has Arabic) — flagged, not assumed.

---

## 4. Layout grid — asymmetric editorial, with a spine

Kill the "everything centered in an 78rem column" rhythm. New system:

- **12-column grid**, `max-width` ~80rem, generous gutters.
- **A persistent margin spine** (the "table of contents of the night"): a thin left rail (flips right in RTL via logical properties) carrying the **section index** — oversized numerals `00 / 01 / 02…` in Fraunces, set in the margin like a magazine. On scroll the active section's numeral is marigold; the rest are hairline.
- **Content anchors alternate edges** — some sections pull left against the spine, some push right, one goes **full-bleed** (the "gap" moment). The eye stops predicting.
- **Oversized margin numerals** as the recurring layout motif (the "unusual rhythm," dialed back — structure, not decoration).
- Radius scale unchanged discipline: `chip 8 / card 14 / panel 22`. Spacing on an 8px base.
- Everything uses **CSS logical properties** (`margin-inline-*`, `inset-inline-*`) so the whole asymmetric system mirrors correctly in Arabic.

Mobile: the spine collapses into an inline section-number tag above each heading; alternating edges stack to a single column; horizontal rails become swipe rails. No layout idea depends on hover or wide viewports.

---

## 5. Signature interactive language — four restrained moves, one voice

All GPU-only (transform/opacity), all reduced-motion clamped, all RTL-mirrored, all degrade without JS (content never hidden).

1. **The color moment** — marigold→olive status transition on real booking state (hero board + sticky loop confirm beat). *One* idea, reused, never random.
2. **Motion with meaning:**
   - **Live service board** (kept as signature, made more alive): incoming row glows marigold, morphs to olive "confirmed," covers counter ticks (tabular). Pausable (WCAG 2.2.2), static confirmed-state under reduced-motion.
   - **Sticky-pinned "The Loop"**: the 4-step booking sequence pins and advances *with scroll position* (scroll-linked, not just fade) — the one scroll-transition centerpiece. Guest/Operator toggle swaps the narration.
   - **Scroll-tracked spine numerals** — active section numeral lights marigold.
   - **Horizontal neighborhood rail** — Amman's areas as a swipe/scroll strip (place + energy).
3. **Hover with intent** (not decoration): link underlines draw from the reading edge (RTL-flipped origin); primary buttons lift + arrow nudges (RTL-flipped); cards shift border to olive + reveal illustration detail. Never scale-zoom.
4. **Illustration** — the existing 5 authored SVGs (`BookingPhone`, `OperatorBoard`, `GroupPlan`, `TableMap`, `ConfirmPulse`) are a real asset: **recolor to the new tokens** (olive/marigold/clay line+fill), add small state motion (a share landing, a pill morphing), keep the "warm technical" abstraction — people as simple rounded silhouettes, **no traditional garments, no drinks near the alcohol line, tea/coffee only.**

**Banned (from the brief + our own diagnosis):** generic centered-hero-with-gradient-blob, templated 3-icon feature grid, fade-in-on-scroll as the *only* interaction, parallax, cursor-followers, magnetic buttons, marquee tickers, scroll-jacking, scale-zoom heroes.

---

## 6. Homepage narrative — re-sequenced, not reordered

The brief: *question what belongs above the fold at all.* We do. The fold stops being "headline + subtitle + product screenshot" and becomes the **opening spread of the night**: an editorial headline (Fraunces) + **the live board as a co-hero doing the talking** — product truth over stock value-prop copy. The pitch unfolds *as you scroll into the night*, not crammed above the fold.

| # | Section | What changed vs. current | Interactive beat |
|---|---|---|---|
| 00 | **Tonight** (opening spread) | asymmetric editorial hero; live board enlarged as co-hero; tight one-line promise, no generic subtitle wall | live board + marigold pulse |
| 01 | **The gap** (problem) | promoted up + made a **full-bleed ink moment**, short and sharp — "bookings break in the gaps" | broken-thread illustration |
| 02 | **The loop** (how it works) | from static 4-card row → **sticky scroll-advancing sequence** w/ guest·operator toggle | scroll-linked pin (centerpiece) |
| 03 | **What you get** (features) | from templated 3-icon grid → **asymmetric editorial rows**, alternating edges, illustration spots | reveal + hover detail |
| 04 | **Split the night** (group payments) | the social/fun beat, warmed up | shares-landing animation |
| 05 | **See it move** (demo) | kept; app screens in a cleaner device frame | pausable slides |
| 06 | **Across Amman** (neighborhoods) | from static chip cloud → **horizontal editorial rail** of areas | swipe/scroll rail |
| 07 | **The control room** (operators) | olive band; dashboard truth | reveal |
| 08 | **Where we're headed** (traction) | honest targets, tabular numerals | count-on-view |
| 09 | **Questions** (FAQ) | kept, restyled accordion | accordion |
| 10 | **Close** (final CTA) | warm marigold invitation | button intent |

Same content/dictionary keys, same routes — this is a **structural re-sequence + visual reinvention**, so all EN/AR copy and other pages keep working. Inner pages (How it works, Partner, About, etc.) inherit the new tokens, type, spine, and interaction language for consistency; their structure is lightly reworked, not rebuilt.

---

## 7. Accessibility & performance floor (unchanged rigor)

WCAG AA on every text/ground pair; focus-visible everywhere; one h1/page; landmarks intact; hit targets ≥44px; reduced-motion = full clamp + static board; all motion GPU-only; content visible without JS; fonts via `next/font` with `display: swap`; images sized. Verified in the Step 3 adversarial pass in **both** LTR and RTL, light and dark, mobile and desktop.

---

## 8. Open decisions flagged for the gut-check

1. **Palette:** olive-primary + marigold-spark (recommended) vs. clay-primary. Confirm the marigold spark is welcome — it's what injects "fun/energetic."
2. **Type:** Fraunces + Instrument Sans (Latin) / Reem Kufi + IBM Plex Sans Arabic (Arabic). Confirm the editorial-serif direction; Arabic display verified at build.
3. **Narrative spine ("Tonight"):** confirm the "one night unfolding" framing before it's built across 11 sections.
4. **Branch note:** the brief names `feature/redesign-total-reinvention`; the session is pinned to `claude/cue-redesign-reinvention-3yazxz`. Building on the pinned branch unless told otherwise.

---

## 9. As-built notes (post-approval build)

Direction approved (olive + marigold spark · Fraunces + Instrument Sans / Reem
Kufi + Plex Arabic · full reinvention, all pages). What shipped and where it
deviated from the proposal:

- **Token strategy:** the existing semantic roles (`accent`, `content`,
  `surface`…) were **remapped** to the new palette rather than renamed —
  `accent` → olive, neutrals → sand/ink — and a new `spark` (marigold) role +
  `clay` were added. Every inner page and form therefore inherits the
  reinvention automatically; deep work concentrated on the homepage narrative
  and shared shell.
- **Fixed olive band token** (`--olive-band`): the olive brand band commits to a
  deep olive in *both* themes (the `accent-strong` role flips light in dark
  mode, so the band needed its own value). White text, AA in both.
- **Theme robustness:** font-variable classes moved from `<html>` to `<body>`
  and `ThemeToggle` now re-asserts the stored/preferred theme on mount — fixes a
  latent hydration path that could drop the theme class (notably for
  reduced-motion users). `Reveal` renders visible immediately under reduced
  motion so content never depends on a scroll animation.
- **Alcohol-free rule — enforced:** three product screenshots contained alcohol
  (`home-screen`/`guest-home-discover` = a wine "Siddharta Nights" event card;
  `guest-venue-detail-menu` = a lit back-bar with bottles + a "Cocktails" tag).
  All three were removed, the unused `public/app/*.png` export set (older copies)
  was deleted, and the affected slots were repointed to clean UI screens — the
  How-It-Works guest showcase is now three honest steps (request → split
  prepayment → confirmed) on alcohol-free screens, in EN + AR.
- **Inner pages:** carry the new tokens, type, spark, and editorial headings but
  keep their existing section structure (the homepage is the flagship
  re-sequence). Verified rendering in EN/AR × light/dark.
