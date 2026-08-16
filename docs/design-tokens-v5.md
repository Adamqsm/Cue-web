# Cue design tokens — v5.2 "Queue Blue" on neutral ground

Source of truth for the v5.2 colorway and type system. The website reads these
values from `src/app/globals.css` (CSS custom properties) exposed through
`tailwind.config.ts` as semantic roles. **This table is also the port target
for the Flutter app**: map each role to a `Color` in the app's theme, keep the
role names, and never hardcode hex per widget.

Voice of the system: friendly consumer energy in the Talabat / OpenTable
category, grounded on true neutrals. Blue is a restrained accent (actions,
active states, small highlights). Confirm orange is the secondary accent for
queue/claim/"live" moments — accent-only (buttons, chips, highlights), never
a ground or dominant surface; the v1 all-over terracotta treatment stays
retired. The navy band is the one deliberate full-bleed brand block per page.
Not luxury, not minimal, no purple, no yellow.

## v5.1 → v5.2 change summary

- **Confirm Green (`#34D399`/`#3DDC97`) fully replaced by Confirm Orange
  (`#F97316`/`#FB923C`) in the same `spark` role.** All spark semantics
  (queue/claim CTA, live signals, the stamped ticket, the underline swoosh,
  the OG-card dot) carry over; footprint is unchanged — accent-only.
- The `ok` status pair moves with it (`#0D9458`→`#C2410C`, dark
  `#4CC98A`→`#EA580C`) because spark and ok are one family (rule 3).
- Queue Blue primary tokens are untouched.
- Two incidental AA repairs came free with the re-derivation: the dark-theme
  white-on-`ok` glyph (was 2.09:1, now 3.56:1) and the Positioning-motif
  node on the dark theme's flipped ink band (was 2.18:1, now 3.06:1).

## v5.0 → v5.1 change summary

- Ground moved from blue-tinted "cool paper" (`#F6F9FD` / `#E9F0FA`) to true
  neutrals (`#FAFAFA` / `#F4F4F5`); ink from deep navy `#0B1B36` to
  near-black `#161A23`. Dark surfaces desaturated the same way (they were
  visibly blue: `#0C1630`, `#132043`).
- The body's blue radial "sky bloom" is gone.
- Ticket Yellow (`#FFC838`/`#FFD24D`) fully replaced by **Confirm Green**
  (`#34D399`/`#3DDC97`) in the same `spark` role. All spark semantics
  (queue/claim CTA, live signals, the stamped ticket) carry over.
- Blue washes demoted from default chip/label surfaces to interactive states
  and small tiles only; label pills are neutral bordered chips.

## Secondary-accent candidates considered (v5.2 decision record)

Same method as the v5.1 swap below: every real token pair measured (WCAG 2.x
relative luminance, both themes, washes composited over their actual
surfaces), binding text pairs at ≥4.5:1, non-text UI at ≥3:1.

| Candidate | Fill | Deep (text) | Verdict |
| --- | --- | --- | --- |
| **Vivid Tangerine** (chosen) | `#F97316` | `#9A3412` | The only family where **every** measured pair clears AA, including the motif node on the dark theme's flipped band (3.06:1, green shipped 2.18:1); strongest deep-text margins (6.4–7.3:1 on light grounds vs green's 4.7–5.5); crispest fill presence on neutral ground (2.69:1 vs green's 1.84); the category-canonical consumer orange (Talabat energy) while staying ~20°+ of hue from error red `#D93036` |
| Soft Tangerine | `#FB923C` | `#C2410C` | Friendliest fill with the highest ink-on-fill ratio (7.69:1), but deep-on-wash lands at 4.52:1 (no margin over the 4.5 line) and the motif node stays sub-3 (2.41:1) on the flipped band |
| Marigold | `#F59E0B` | `#92400E` | Strong numbers across the board but hue ~38–42° reads amber — too close to the retired Ticket Yellow this role deliberately moved away from |

Key measured pairs for the chosen family (light / dark):
ink on spark fill 6.21 / 8.59 · ink on spark-strong (hover) 4.89 / 11.52 ·
spark-deep on wash 6.38 / 11.23 · spark-deep on bg 7.00 / 13.35 ·
spark-inverse on navy band 10.07 / 6.52 · white glyph on ok 5.18 / 3.56 ·
ok on its 15% wash 4.17 / 4.31. Dark `spark-wash` composites to `#32221c`
over surface.

Swapping candidates later = the `--spark-*` and `--ok*` values in
`globals.css` (both themes), the light `--shadow-spark`, plus four literal
hexes (the Positioning motif's rail + two nodes, the OG-image dot in both
locale cards) — everything else flows from tokens.

### Superseded: v5.1 decision record (Confirm Green era)

| Candidate | Fill | Deep (text) | Verdict |
| --- | --- | --- | --- |
| **Confirm Green** (chosen in v5.1, replaced in v5.2) | `#34D399` | `#047857` | Classic pair with blue-on-neutral; carries the product's key beat ("table secured"); category precedent (TheFork, Careem) and the palette dataset's own "calendar blue + available green" booking pairing |
| Raspberry | `#E7386E` | `#B01A4E` | Boldest consumer energy (Foodpanda-adjacent); rejected as louder than the brand's friendly-trustworthy tone, and reads adjacent to error red |
| Teal | `#0D9488` | `#0F766E` | Calm and clean; rejected as too close to blue to create a real second voice |

## Color roles — light theme

| Role            | Hex       | Usage                                                    |
| --------------- | --------- | -------------------------------------------------------- |
| bg              | `#FAFAFA` | Page ground (neutral off-white)                           |
| surface         | `#FFFFFF` | Cards, panels                                             |
| surface-2       | `#F4F4F5` | Sunken bands, secondary fills                             |
| content         | `#161A23` | Primary text (near-black, whisper of cool)                |
| muted           | `#555D6B` | Secondary text (≥ 6:1 on bg)                              |
| line            | `#E5E7EB` | Hairlines, dividers                                       |
| line-strong     | `#7C8492` | Input borders (≥ 3:1 non-text, WCAG 1.4.11)               |
| accent          | `#1465EB` | Queue blue. Actions, active states, small highlights ONLY |
| accent-strong   | `#0F55CC` | Button ground / hover (white text is AA)                  |
| accent-deep     | `#0C3F9C` | Blue text on washes and bg (AA)                           |
| accent-wash     | `#E8F0FE` | Selected/hover states and small icon tiles; never large surfaces |
| accent-inverse  | `#7FB0FF` | Blue accents on the navy band (AA on `#0A1B3D`)           |
| spark           | `#F97316` | Confirm orange. Queue/claim CTAs, live signals, the ticket |
| spark-strong    | `#EA580C` | Orange hover                                              |
| spark-deep      | `#9A3412` | Orange-tinted text on washes and bg (AA)                  |
| spark-wash      | `#FFEDD5` | Tinted orange fill (live pill, tiles)                     |
| spark-inverse   | `#FDBA74` | Orange accents on the navy band                           |
| clay            | `#64748B` | Neutral slate support mid-tone (illustrations)            |
| navy band       | `#0A1B3D` | Committed brand band (CSS var `--olive-band`, name kept from v3 for compatibility) |
| ok              | `#C2410C` | Confirmed / success (aligned to the spark family)         |
| ok-deep         | `#7C2D12` | Success text on washes                                    |
| error           | `#D93036` | Errors                                                    |
| error-deep      | `#A8232B` | Error text on washes                                      |
| ring            | `#0F55CC` | Focus ring                                                |

Spark fills always take dark ink text (`#161A23`), never white.

## Color roles — dark theme

| Role            | Hex       |
| --------------- | --------- |
| bg              | `#0B0D12` |
| surface         | `#14161D` |
| surface-2       | `#1C1F28` |
| content         | `#ECEEF2` |
| muted           | `#9CA3AF` |
| line            | `#262A34` |
| line-strong     | `#5D6472` |
| accent          | `#4C8DFF` |
| accent-strong   | `#6BA1FF` |
| accent-deep     | `#8AB4FF` |
| accent-wash     | `rgba(20,101,235,0.16)` |
| accent-inverse  | `#0F55CC` |
| spark           | `#FB923C` |
| spark-strong    | `#FDBA74` |
| spark-deep      | `#FED7AA` |
| spark-wash      | `rgba(249,115,22,0.13)` |
| spark-inverse   | `#F97316` |
| clay            | `#8B98AB` |
| navy band       | `#08142E` |
| ok              | `#EA580C` |
| ok-deep         | `#FDBA74` |
| error           | `#F26D6D` |
| error-deep      | `#F79E9E` |
| ring            | `#6BA1FF` |

Dark-theme buttons flip polarity: primary buttons use `accent` fill with
near-black ink text (`#0B0D12`), not white text.

## Typography

| Script | Family                    | Roles                                | Notes |
| ------ | ------------------------- | ------------------------------------ | ----- |
| Latin  | Plus Jakarta Sans (variable, 200-800) | Everything: display, body, UI | Weight does hierarchy: 800 display, 700 headings, 600 buttons/labels, 400 body |
| Arabic | Cairo (variable, includes Latin subset) | Everything on RTL pages       | Never letter-spaced; taller line boxes (h1 ≈ 1.28); 700 display |
| Mono   | ui-monospace stack        | Redemption codes only                | Codes stay LTR inside RTL pages |

Both faces are self-hosted via `next/font` (the CSP allows only
`font-src 'self'`). Display sizes track tight (-0.025em) in Latin only.

## Shape & elevation

| Token        | Value  | Usage                             |
| ------------ | ------ | --------------------------------- |
| radius-chip  | 12px   | Inputs, small chips               |
| radius-card  | 18px   | Cards                             |
| radius-panel | 28px   | Large panels, bands, device frames|
| radius-full  | 9999px | Buttons and pills (full pill)     |
| shadow-card  | `0 16px 40px -20px rgb(22 26 35 / 0.14)` | Lifted cards |
| shadow-cta   | `0 14px 30px -12px rgb(20 101 235 / 0.4)` | Blue CTA hover |
| shadow-spark | `0 14px 30px -12px rgb(234 88 12 / 0.4)` | Orange CTA hover |
| ticket shadow| `4px 4px 0 0 content` | The "queue ticket" hard offset — waitlist counter + claim ticket motif |

## Motion

- Standard ease: `cubic-bezier(0.22, 1, 0.36, 1)`, 200-550ms.
- Reveal-on-scroll: 12px rise + fade, 60ms stagger, once.
- Reduced motion: full CSS clamp + framer-motion `MotionConfig reducedMotion="user"`.

## Color rules

1. Neutral first: surfaces, labels, and chrome are neutral by default.
   Color enters through actions, states, and small highlights.
2. Blue is the brand and the default action; it never carries large
   surfaces outside the navy band.
3. Orange is reserved for queue/claim/live/confirmed moments so it stays
   meaningful (spark and ok are one family). It is an accent, never a
   ground — the one lesson kept from the retired v1 terracotta.
4. Status colors are information, never decoration.
5. The navy band is the one full-bleed committed color moment per page.
