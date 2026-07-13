# Cue redesign v2 — design system specification

**Scope:** visual/UX rebuild only. All copy, dictionaries, routes, and page structure stay intact. Locked by Adam: bilingual EN/AR + RTL, dark/light toggle, terracotta accent `#C86B4A`, Inter family, alcohol-free imagery. Feel: standout, interactive, minimal — very professional, very slick; polish heavy but restrained, never loud or gimmicky.

## Concept — "Precision hospitality"

The slickness comes from restraint plus interactive polish: a quiet near-monochrome ground where terracotta is used surgically; Inter pushed hard on weight and tracking contrast; one signature interactive element (the live service board) recurring across the site; an authored illustration system replacing all stock photography. Nothing decorative that doesn't encode product truth.

## Color tokens

CSS custom properties on `:root` (rgb channels for Tailwind alpha), redefined under `.dark`. Never hardcode hex in components — everything through tokens.

### Light
| Token | Value | Role |
|---|---|---|
| `--bg` | `#FAF9F7` | page ground (barely-warm off-white — not cream) |
| `--surface` | `#FFFFFF` | raised cards |
| `--surface-2` | `#F1EFEA` | sunken panels, alternate sections |
| `--content` | `#1A1713` | ink |
| `--muted` | `#6E675E` | secondary text (AA on bg + surface) |
| `--line` | `#E4E0D8` | hairlines, borders |
| `--accent` | `#C86B4A` | terracotta (locked) |
| `--accent-strong` | `#B25A3B` | hover/active |
| `--accent-deep` | `#8F4630` | text-on-wash, small accents needing AA |
| `--accent-wash` | `#F6E9E3` | tinted fills, selected states |
| `--ok` | `#3E7C5B` | "confirmed" semantic only (never decorative) |

### Dark
| Token | Value |
|---|---|
| `--bg` | `#121110` |
| `--surface` | `#1B1917` |
| `--surface-2` | `#242019` |
| `--content` | `#EDEAE4` |
| `--muted` | `#A39B8F` |
| `--line` | `#322E28` |
| `--accent` | `#D98A6A` (lifted for dark contrast) |
| `--accent-strong` | `#E39D80` |
| `--accent-deep` | `#EFB59D` |
| `--accent-wash` | `rgba(200,107,74,0.14)` |
| `--ok` | `#5FA37F` |

Semantic status colors for the service board: incoming = accent, confirmed = ok, seated = muted. These are information, not decoration.

## Typography

**Latin: Inter only** (variable, `next/font`). Kill Bricolage Grotesque and IBM Plex Mono entirely.
- Display (h1): weight 750, tracking `-0.035em`, `clamp(2.5rem, 6vw, 4.75rem)`, line-height 1.02, `text-wrap: balance`
- H2: weight 650, tracking `-0.025em`, `clamp(1.75rem, 3.2vw, 2.75rem)`
- H3/card titles: 600, `-0.015em`
- Body: 400, 16–17px, line-height 1.65, max-width ~65ch
- Labels/eyebrows: Inter 600, 11px, uppercase, tracking `0.18em`, color accent-deep (light) / accent (dark) — replaces the old mono voice
- Numerals in stats/board: `font-variant-numeric: tabular-nums`

**Arabic: IBM Plex Sans Arabic** (kept — Inter has no Arabic). In `[dir="rtl"]`: all roles swap to Plex Arabic, headings weight 700, letter-spacing 0 everywhere (never track Arabic), uppercase labels become normal-case 12px.

## Background & surface treatment

1. Base: flat `--bg` with ONE fixed ultra-subtle radial terracotta bloom top-center (≤3% alpha, larger in dark mode ≤6%).
2. Fine film grain: inline data-URI noise overlay at 2.5% opacity (3.5% dark), `pointer-events:none`, applied once on body — not per-card.
3. Section rhythm from alternating `--bg` / `--surface-2` bands separated by 1px `--line` rules — no per-section gradients.
4. Cards: `--surface`, 1px `--line` border, radius **14px** (site-wide radius scale: 8 / 14 / 22), shadow only on hover/elevation moments: `0 16px 40px -20px rgb(26 23 19 / 0.18)` (light) — shadows warm-up toward `rgba(178,90,59,.22)` only on primary CTAs.

## Interaction language (the standout layer — all GPU-only, all reduced-motion clamped)

- **Nav**: transparent over hero → on scroll gains `backdrop-blur` + bg at 85% + hairline. Links: 1.5px underline draws in from the reading edge, 220ms — `transform-origin` flips for RTL. Active route stays underlined.
- **Buttons**: primary = accent fill, on hover lifts `-1px` with warm shadow + label's trailing arrow nudges 3px (flips in RTL); secondary = 1px line, fills with `--accent-wash` on hover. Focus: 2px accent ring, 3px offset.
- **Cards**: hover = border shifts to accent at 35%, shadow fades in, translateY(-2px) max. Never scale.
- **Reveals**: framer-motion `whileInView`, 12px rise + fade, 0.5s ease-out, 60ms stagger, once-only. Content must never be hidden if JS fails.
- **Service board** (signature, homepage hero + partner page): live docket that cycles rows — a new "incoming" row slides in, its status pill morphs incoming→confirmed after a beat, covers counter ticks up (tabular-nums). 4s cycle, pausable, `prefers-reduced-motion` shows a static confirmed-state board.
- **Theme toggle**: 300ms token crossfade (background-color/color transitions on body + surfaces only — not layout properties).
- **NO**: parallax, cursor-followers, magnetic effects, marquee tickers, scale-zoom heros, scroll-jacking.

## Illustration system (replaces all stock photography)

Authored SVG, drawn from the product's own vocabulary — no external images, no photo feel. Style: **"warm technical"** — 1.5px `--content` line work + flat `--accent` / `--accent-wash` / `--surface-2` fills, rounded geometry (radius matches site scale), on-token colors via CSS vars so every illustration adapts to both themes automatically. People are abstracted (simple rounded silhouettes, warm olive skin-tone fill `#C99B7E`, no facial detail) — modern dress silhouettes, no traditional garments, no drinks anywhere near the alcohol line (coffee cups/tea only). Compositions built from simple shapes (rounded rects, circles, arcs) — no complex hand-authored path data.

Set of five, each a React component (`src/components/illustrations/`):
1. `BookingPhone` — hand holding a phone showing the Cue booking card (date/time/party chips, Confirm button)
2. `OperatorBoard` — restaurant pass with a tablet dashboard: floor dots, request queue, confirm tap
3. `GroupPlan` — three friends' chat thread coordinating a night out: venue card shared, split-payment links, checkmarks landing
4. `TableMap` — overhead venue floor map with tables filling (spot illustration)
5. `ConfirmPulse` — small spot: status pill morphing to confirmed (used in feature cards)

Integration: inline beside content at natural column widths (hero vignette, alternating feature rows, card spots) — never a gallery, never a slideshow. The existing real app screenshots (`cue-app-*.jpeg`) remain valid product truth: keep where they serve (demo section), reframed in a minimal device frame with `--line` border.

## RTL specifics

Everything directional flips: underline origins, arrow nudges, board slide-in direction, illustration mirroring where reading order matters (chat threads). Use CSS logical properties (`margin-inline-start`, `inset-inline-end`) in all new styles. Test every page in AR before calling it done.

## Accessibility floor

WCAG AA contrast on every text/ground pair (accent-on-wash uses `--accent-deep`); focus-visible everywhere; one h1 per page; landmarks intact; reduced-motion = full clamp + static board; hit targets ≥44px.
