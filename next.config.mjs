/**
 * Security headers.
 *
 * Before this block the site shipped NO security headers at all beyond the
 * Strict-Transport-Security that Vercel adds by default — so /en/claim and
 * /ar/claim, which collect name + email + phone, were freely iframeable.
 *
 * CSP notes:
 * - `frame-ancestors 'none'` is the load-bearing one for the claim form:
 *   it blocks the clickjacking overlay attack. X-Frame-Options below is the
 *   same control for older browsers that ignore frame-ancestors.
 * - `form-action 'self'` stops an injected <form> from POSTing the claimant's
 *   name/email/phone to an attacker-controlled origin.
 * - `script-src` keeps 'unsafe-inline' deliberately. Next 14's App Router
 *   emits per-request inline bootstrap/hydration scripts, and the site's
 *   JSON-LD blocks (src/components/JsonLd.tsx, src/lib/seo.ts) are inline
 *   too. The strict alternative is a per-request nonce, which in the App
 *   Router requires reading headers() inside server components — that opts
 *   every page out of static rendering and would turn this statically
 *   generated marketing site into a fully dynamic one. Not a trade worth
 *   making for a brochure site; see docs/security-audit-2026-08-14.md for
 *   the nonce migration steps if that changes.
 *   'unsafe-eval' is NOT granted — production Next does not need it.
 * - challenges.cloudflare.com is Turnstile: the script tag injected by
 *   src/components/claim/TurnstileWidget.tsx plus the challenge iframe.
 * - connect-src covers the Firebase web SDK used by /partner/apply
 *   (Firestore + Storage + Identity Toolkit all live under googleapis.com).
 */
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://challenges.cloudflare.com https://*.googleapis.com https://*.firebaseio.com wss://*.firebaseio.com",
  "frame-src https://challenges.cloudflare.com",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "media-src 'self'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  // Legacy twin of frame-ancestors 'none' for browsers that ignore CSP 2+.
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Same-origin gets the full path; cross-origin gets only the origin — so an
  // outbound link from /en/claim never leaks the claim URL to a third party.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Nothing on this site needs these; deny them so injected script can't ask.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  },
  // Vercel already sends max-age=63072000; includeSubDomains is the addition.
  // `preload` is deliberately NOT set — submitting to the HSTS preload list is
  // effectively irreversible and is Adam's call, not a code change.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains",
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
