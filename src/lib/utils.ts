import type { Locale } from "@/i18n/config";

/** Join class names, dropping falsy values. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/** Prefix an app-relative href with the active locale. */
export function localizedHref(href: string, locale: Locale): string {
  if (href.startsWith("http") || href.startsWith("#") || href.startsWith("mailto:")) {
    return href;
  }
  // "/#section" means a homepage anchor: emit "/en#section", not "/en/#section"
  // (the trailing slash would bounce through a 308 before the hash applies).
  const clean = href === "/" ? "" : href.startsWith("/#") ? href.slice(1) : href;
  return `/${locale}${clean}`;
}

// Primary host: the apex (cue-app.net) 308-redirects to www, so www is the
// canonical host used for canonical tags, hreflang, sitemap, OG, and JSON-LD.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.cue-app.net";

// Restaurant sign-in lives on the Cue portal, a separate app. The portal reads
// its language from its own `cue_locale` cookie (no locale in the URL), so the
// link is the same for every locale.
export const PORTAL_URL = (
  process.env.NEXT_PUBLIC_PORTAL_URL || "https://portal.cue-app.net"
).replace(/\/+$/, "");

export const PORTAL_LOGIN_URL = `${PORTAL_URL}/login`;
