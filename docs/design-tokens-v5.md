# Cue design tokens — v5.1 "Queue Blue" on neutral ground

Source of truth for the v5.1 colorway and type system. The website reads these
values from `src/app/globals.css` (CSS custom properties) exposed through
`tailwind.config.ts` as semantic roles. **This table is also the port target
for the Flutter app**: map each role to a `Color` in the app's theme, keep the
role names, and never hardcode hex per widget.

Voice of the system: friendly consumer energy in the Talabat / OpenTable
category, grounded on true neutrals. Blue is a restrained accent (actions,
active states, small highlights). Confirm green is the secondary accent for
queue/claim/"live" moments. The navy band is the one deliberate full-bleed
brand block per page. Not luxury, not minimal, no orange, no purple, no
yellow.

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

## Secondary-accent candidates considered (v5.1 decision record)

| Candidate | Fill | Deep (text) | Verdict |
| --- | --- | --- | --- |
| **Confirm Green** (chosen) | `#34D399` | `#047857` | Classic pair with blue-on-neutral; carries the product's key beat ("table secured"); category precedent (TheFork, Careem) and the palette dataset's own "calendar blue + available green" booking pairing |
| Raspberry | `#E7386E` | `#B01A4E` | Boldest consumer energy (Foodpanda-adjacent); rejected as louder than the brand's friendly-trustworthy tone, and reads adjacent to error red |
| Teal | `#0D9488` | `#0F766E` | Calm and clean; rejected as too close to blue to create a real second voice |

Swapping candidates later = the `--spark-*` values in `globals.css` (both
themes), the two shadow tokens, plus two literal hexes (the Positioning
motif's dot group, the OG-image dot) — everything else flows from tokens.

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
| spark           | `#34D399` | Confirm green. Queue/claim CTAs, live signals, the ticket |
| spark-strong    | `#10B981` | Green hover                                               |
| spark-deep      | `#047857` | Green-tinted text on washes and bg (AA)                   |
| spark-wash      | `#D7F5E7` | Tinted green fill (live pill, tiles)                      |
| spark-inverse   | `#5EEAB0` | Green accents on the navy band                            |
| clay            | `#64748B` | Neutral slate support mid-tone (illustrations)            |
| navy band       | `#0A1B3D` | Committed brand band (CSS var `--olive-band`, name kept from v3 for compatibility) |
| ok              | `#0D9458` | Confirmed / success (aligned to the spark family)         |
| ok-deep         | `#066E41` | Success text on washes                                    |
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
| spark           | `#3DDC97` |
| spark-strong    | `#5EEAB0` |
| spark-deep      | `#86EFC0` |
| spark-wash      | `rgba(52,211,153,0.13)` |
| spark-inverse   | `#10B981` |
| clay            | `#8B98AB` |
| navy band       | `#08142E` |
| ok              | `#4CC98A` |
| ok-deep         | `#7BDCA9` |
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
| shadow-spark | `0 14px 30px -12px rgb(16 185 129 / 0.4)` | Green CTA hover |
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
3. Green is reserved for queue/claim/live/confirmed moments so it stays
   meaningful (spark and ok are one family).
4. Status colors are information, never decoration.
5. The navy band is the one full-bleed committed color moment per page.
