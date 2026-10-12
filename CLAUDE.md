# Cue-web

## Permanent design rules

NEVER add an eyebrow pill/badge/chip above a hero or section headline (e.g. 'Launching soon · Amman'). It reads as AI-generated. This rule is permanent and has the same standing as: never use em dashes or en dashes mid-sentence.

Enforcement: `node scripts/copy-guard.mjs` (configured by `copy-guard.config.json`) fails on the pill phrases and the pill component names, in English and Arabic, anywhere in source or locale files, and on em or en dashes in user-facing copy (strings and JSX text under `src/`, SVG files under `public/`; in JSX and SVG the `&mdash;` and `&ndash;` references count as dashes too). JSX is also read as rendered text, so a phrase wrapped over two lines or joined by `{" "}` or `&nbsp;` is caught. It runs in the copy-guard GitHub Action (`.github/workflows/copy-guard.yml`, every push and pull request) and in the husky pre-commit hook (`.husky/pre-commit`). This CLAUDE.md is the only allowlisted file; `docs/` and root-level Markdown files are not scanned.

## Parent company naming
The footer parent-company line (`ownedBy` in src/i18n/content/en.ts and ar.ts)
must read "A Qasem Portal company" / "إحدى شركات Qasem Portal" (pinned by
src/i18n/__tests__/footer-parent.test.tsx).
Qasem Portal is the only name used. Never "holding company", "Qasem Capital &
Enterprise", "Qasem Enterprise Holdings", or "Qasem Portal, LLC".
