# Cue design tokens — v5 "Queue Blue"

Source of truth for the v5 colorway and type system. The website reads these
values from `src/app/globals.css` (CSS custom properties) exposed through
`tailwind.config.ts` as semantic roles. **This table is also the port target
for the Flutter app**: map each role to a `Color` in the app's theme, keep the
role names, and never hardcode hex per widget.

Voice of the system: friendly consumer energy in the Talabat / OpenTable
category. One confident blue used sparingly on white next to near-black ink,
with a ticket-yellow reserved for "join the queue" moments. Not luxury, not
minimal, no orange, no purple.

## Color roles — light theme

| Role            | Hex       | Usage                                                    |
| --------------- | --------- | -------------------------------------------------------- |
| bg              | `#F6F9FD` | Page ground (cool paper)                                  |
| surface         | `#FFFFFF` | Cards, panels                                             |
| surface-2       | `#E9F0FA` | Sunken bands, secondary fills (sky band)                  |
| content         | `#0B1B36` | Primary text (deep navy ink)                              |
| muted           | `#4A5D7A` | Secondary text (AA ≥ 5:1 on bg)                           |
| line            | `#D8E2F0` | Hairlines, dividers                                       |
| line-strong     | `#8294B0` | Input borders (≥ 3:1 non-text, WCAG 1.4.11)               |
| accent          | `#1465EB` | Queue blue. Brand + primary actions                       |
| accent-strong   | `#0F55CC` | Button ground / hover (white text is AA)                  |
| accent-deep     | `#0C3F9C` | Blue text on washes and bg (AA)                           |
| accent-wash     | `#E3EDFF` | Tinted blue fill (chips, icon tiles)                      |
| accent-inverse  | `#7FB0FF` | Blue accents on the navy band (AA on `#0A1B3D`)           |
| spark           | `#FFC838` | Ticket yellow. Queue/claim CTAs, live signals             |
| spark-strong    | `#F0B518` | Yellow hover                                              |
| spark-deep      | `#7A5A00` | Yellow-tinted text on washes and bg (AA)                  |
| spark-wash      | `#FFF3D1` | Tinted yellow fill                                        |
| spark-inverse   | `#FFD666` | Yellow accents on the navy band                           |
| clay            | `#5B82C4` | Slate-blue support mid-tone (illustrations)               |
| navy band       | `#0A1B3D` | Committed brand band (CSS var `--olive-band`, name kept from v3 for compatibility) |
| ok              | `#118A50` | Confirmed / success                                       |
| ok-deep         | `#0C6B3C` | Success text on washes                                    |
| error           | `#D93036` | Errors                                                    |
| error-deep      | `#A8232B` | Error text on washes                                      |
| ring            | `#0F55CC` | Focus ring                                                |

## Color roles — dark theme

| Role            | Hex       |
| --------------- | --------- |
| bg              | `#060D1C` |
| surface         | `#0C1630` |
| surface-2       | `#132043` |
| content         | `#E8EEFB` |
| muted           | `#98A7C6` |
| line            | `#1E2C4E` |
| line-strong     | `#4A5E88` |
| accent          | `#4C8DFF` |
| accent-strong   | `#6BA1FF` |
| accent-deep     | `#8AB4FF` |
| accent-wash     | `rgba(20,101,235,0.18)` |
| accent-inverse  | `#0F55CC` |
| spark           | `#FFD24D` |
| spark-strong    | `#FFDD70` |
| spark-deep      | `#FFE18A` |
| spark-wash      | `rgba(255,200,56,0.14)` |
| spark-inverse   | `#F0B518` |
| clay            | `#7A9EDB` |
| navy band       | `#08142E` |
| ok              | `#4CC98A` |
| ok-deep         | `#7BDCA9` |
| error           | `#F26D6D` |
| error-deep      | `#F79E9E` |
| ring            | `#6BA1FF` |

Dark-theme buttons flip polarity: primary buttons use `accent` fill with
near-black ink text (`#060D1C`), not white text.

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
| shadow-card  | `0 16px 40px -20px rgb(11 27 54 / 0.16)` | Lifted cards |
| shadow-cta   | `0 14px 30px -12px rgb(20 101 235 / 0.45)` | Blue CTA hover |
| shadow-spark | `0 14px 30px -12px rgb(240 181 24 / 0.45)` | Yellow CTA hover |
| ticket shadow| `4px 4px 0 0 content` | The "queue ticket" hard offset — waitlist counter + claim ticket motif |

## Motion

- Standard ease: `cubic-bezier(0.22, 1, 0.36, 1)`, 200-550ms.
- Reveal-on-scroll: 12px rise + fade, 60ms stagger, once.
- Reduced motion: full CSS clamp + framer-motion `MotionConfig reducedMotion="user"`.

## Color rules

1. Blue is the brand and the default action. Yellow is reserved for
   queue/claim/"live" moments so it stays special.
2. Washes carry chips and icon tiles; saturated fills carry buttons only.
3. Status colors (ok/error) are information, never decoration.
4. The navy band is the one full-bleed committed color moment per page.
