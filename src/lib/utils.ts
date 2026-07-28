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
  const clean = href === "/" ? "" : href;
  return `/${locale}${clean}`;
}

/** Fill a `{n}` slot in a dictionary template string. */
export function tpl(template: string, n: number | string): string {
  return template.replace("{n}", String(n));
}

// Primary host: the apex (cue-app.net) 308-redirects to www, so www is the
// canonical host used for canonical tags, hreflang, sitemap, OG, and JSON-LD.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.cue-app.net";
