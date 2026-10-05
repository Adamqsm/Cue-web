# Cue — Website

Bilingual (English / Arabic) marketing and lead-generation site for **Cue**, a
hospitality booking and coordination platform. Built with Next.js (App Router),
Tailwind CSS, and Framer Motion.

> **Simple for guests, structured for operators.**

---

## Highlights

- **Fully bilingual (EN / AR)** with locale routing (`/en`, `/ar`) and proper
  **RTL** layout for Arabic. Language toggle is available everywhere.
- **All pages built:** Home, How It Works, Partner, About, Get Started (waitlist),
  Careers, FAQ, and a Legal center (Terms, Privacy, Cookie Policy, DPA, Legal Notice).
- **Bold, animated design** — scroll reveals, entrance animations, marquee,
  concentric-mark motif, interactive app showcase, and micro-interactions.
- **Real app screens** from the Cue concept work power the product showcase.
- **Lead capture** via a serverless API route (`/api/lead`) that proxies to the
  Cue API.
- **SEO-ready:** per-page metadata, Open Graph, `hreflang` alternates, JSON-LD
  (Organization + FAQ), `sitemap.xml`, and `robots.txt`.
- **Accessible & fast:** semantic markup, skip link, focus styles, reduced-motion
  support, mobile-first responsive layout.

---

## Getting started

```bash
npm install
cp .env.example .env.local   # optional, edit values
npm run dev                  # http://localhost:3000  → redirects to /en
```

Build for production:

```bash
npm run build
npm start
```

---

## Project structure

```
src/
├─ app/
│  ├─ [locale]/            # all localized pages (layout sets <html lang dir>)
│  │  ├─ page.tsx          # Home
│  │  ├─ how-it-works/
│  │  ├─ partner/
│  │  ├─ about/
│  │  ├─ reach-out/        # waitlist / lead form
│  │  ├─ careers/
│  │  ├─ faq/
│  │  └─ legal/            # index + terms, privacy, cookies, dpa, notice
│  ├─ api/                # form routes, each a proxy to the Cue API
│  ├─ sitemap.ts
│  └─ robots.ts
├─ components/             # Nav, Footer, BrandMark, UI + section components
├─ i18n/
│  ├─ config.ts            # locales, direction
│  ├─ dictionaries.ts
│  └─ content/{en,ar}.ts   # ALL copy lives here (edit content in one place)
├─ lib/utils.ts
└─ middleware.ts           # locale detection + redirect
```

**Editing copy:** everything is in `src/i18n/content/en.ts` and `ar.ts`. The two
files share one TypeScript shape, so both languages stay in sync.

---

## Form submissions

Every form posts to one of the site's own `/api` routes, and each route proxies
to the Cue API (Django) through `src/lib/cue-api.ts`: `/api/lead` (Get Started
and FAQ), `/api/cue-insider/claim`, `/api/partner-apply` (the partner form then
uploads its files straight to the API with the ticket it gets back),
`/api/cue-insider/event` and `/api/waitlist-count`. The API owns validation,
per-IP rate limits, storage and notification email; the routes forward the
visitor's address and map the answer onto the shapes the forms read. With
`CUE_API_BASE_URL` unset or `CUE_API_KEY` wrong, the form routes fail closed
with a 503; the event beacon still answers 204 and drops the event.

`node scripts/verify-site-routes.mjs` (with `SITE_BASE`) smoke-tests the routes
on a running site without storing anything; `--write` adds checks that do.

---

## Deploy to Vercel

1. Push this repo to GitHub.
2. Import it in Vercel (framework auto-detected as Next.js — no config needed).
3. Set environment variables (see `.env.example`: `NEXT_PUBLIC_SITE_URL`,
   `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `CUE_API_BASE_URL`, `CUE_API_KEY`).
4. Deploy. Vercel handles builds and previews automatically on every push.

---

## Brand & content notes

- Palette (v5.3 "Queue Blue"): neutral off-white/near-black ground, Queue Blue
  `#1465EB` as the restrained primary accent, and Confirm Olive `#D6E0B0` as
  the secondary accent for queue/claim/"live" moments (accent-only — buttons,
  chips, highlights). Full token tables and the decision records live in
  `docs/design-tokens-v5.md`.
- Legal copy carries over the substance of the drafted Terms faithfully and adds
  PDPL-aligned Privacy, Cookie, DPA, and Legal Notice documents. Have counsel
  review before launch.
- `NEXT_PUBLIC_SITE_URL` should be the final production domain for correct SEO tags.
