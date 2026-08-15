import { NextRequest, NextResponse } from "next/server";
import { locales, defaultLocale } from "./i18n/config";

// Legacy slugs still linked in the wild → their real routes. Matched with or
// without a locale prefix; the visitor's locale is preserved in the redirect.
const legacyMap: Record<string, string> = {
  "/contact": "/reach-out",
  "/career": "/careers",
  "/dpa": "/legal/dpa",
  "/privacy": "/legal/privacy",
  "/privacypolicy": "/legal/privacy",
  "/terms": "/legal/terms",
  "/cookies": "/legal/cookies",
  "/notice": "/legal/notice",
};

function getLocale(request: NextRequest): string {
  const header = request.headers.get("accept-language");
  if (header) {
    const preferred = header
      .split(",")
      .map((part) => part.split(";")[0].trim().slice(0, 2).toLowerCase());
    for (const code of preferred) {
      if ((locales as readonly string[]).includes(code)) return code;
    }
  }
  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  let localePrefix: string | undefined;
  let path = pathname;
  for (const locale of locales) {
    if (pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)) {
      localePrefix = locale;
      path = pathname.slice(locale.length + 1) || "/";
      break;
    }
  }

  const mapped = legacyMap[path];
  if (mapped) {
    const url = request.nextUrl.clone();
    url.pathname = `/${localePrefix ?? getLocale(request)}${mapped}`;
    return NextResponse.redirect(url, 301);
  }

  if (localePrefix) return;

  const url = request.nextUrl.clone();
  url.pathname = `/${getLocale(request)}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Skip Next internals, api, and files with an extension (assets)
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
