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
- **Lead capture** via a serverless API route (`/api/lead`) with optional webhook
  forwarding.
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
│  ├─ api/lead/route.ts    # form submission handler
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

The Get Started and FAQ forms POST to `/api/lead`. By default, submissions are
validated and logged to the server console (visible in Vercel → Logs).

To capture them somewhere durable, set `LEAD_WEBHOOK_URL` to any endpoint that
accepts a JSON `POST` — e.g. a Zapier/Make webhook that appends to Google Sheets,
Airtable, or a CRM. Payload shape:

```json
{
  "receivedAt": "…", "audience": "operator|guest|talent|contact",
  "source": "reach-out|faq", "locale": "en|ar", "contactPreference": "email|call",
  "name": "…", "email": "…", "phone": "…", "establishment": "…",
  "instagram": "…", "message": "…"
}
```

Swapping in Firebase, Resend, or a database is a small change to that one file.

---

## Deploy to Vercel

1. Push this repo to GitHub.
2. Import it in Vercel (framework auto-detected as Next.js — no config needed).
3. Set environment variables (`NEXT_PUBLIC_SITE_URL`, optional `LEAD_WEBHOOK_URL`).
4. Deploy. Vercel handles builds and previews automatically on every push.

---

## Brand & content notes

- Palette: warm charcoal (`ink`), cream (`paper`), terracotta / sunset-orange
  accent (`clay`), with a deep hospitality green (`pine`) as a secondary accent —
  consistent with the Cue app concepts.
- Legal copy carries over the substance of the drafted Terms faithfully and adds
  PDPL-aligned Privacy, Cookie, DPA, and Legal Notice documents. Have counsel
  review before launch.
- `NEXT_PUBLIC_SITE_URL` should be the final production domain for correct SEO tags.
