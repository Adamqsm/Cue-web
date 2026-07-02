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

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://cue-app.net";
