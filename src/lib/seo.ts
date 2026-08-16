import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { SITE_URL } from "@/lib/utils";

/** Keyword sets woven into metadata (not visible copy — read-human copy lives in the content files). */
const KEYWORDS_EN = [
  "book table Amman",
  "restaurant reservations Amman",
  "best restaurants Amman",
  "group dining Amman",
  "fine dining Amman",
  "casual dining Amman",
  "split payment restaurant Amman",
  "restaurants Abdoun",
  "restaurants Sweifieh",
  "restaurants Rainbow Street",
  "restaurants Seventh Circle",
  "restaurant booking app Jordan",
  "online restaurant reservation Jordan",
  "book restaurant table online Amman",
  "restaurant reservation app for groups Jordan",
  "how to book a restaurant in Amman",
  "restaurants in Amman Jordan",
  "swefieh village restaurants",
  "restaurant reservation system Amman",
  "Cue app",
];

const KEYWORDS_AR = [
  "مطاعم في عمّان",
  "حجز طاولة عمّان",
  "أفضل المطاعم في عمّان",
  "حجز مطعم عمّان",
  "مطاعم عبدون",
  "مطاعم الصويفية",
  "تطبيق حجز مطاعم",
  "مطاعم شارع الرينبو",
  "حجز مطعم جماعي",
  "مطاعم عمان الاردن",
  "تطبيق حجز مطاعم الاردن",
  "حجز مطعم في عمان",
  "مطاعم جبل عمان",
];

type BuildArgs = {
  locale: Locale;
  path: string; // app-relative, e.g. "" or "/faq"
  title: string;
  description: string;
  keywords?: string[];
};

/**
 * Full per-page metadata: title, description, keywords, canonical + hreflang
 * alternates, and Open Graph / Twitter cards. The OG/Twitter image is attached
 * automatically by Next from the opengraph-image route.
 */
export function buildMetadata({
  locale,
  path,
  title,
  description,
  keywords = [],
}: BuildArgs): Metadata {
  const url = `${SITE_URL}/${locale}${path}`;
  const enUrl = `${SITE_URL}/en${path}`;
  const arUrl = `${SITE_URL}/ar${path}`;
  const localeKeywords = locale === "ar" ? KEYWORDS_AR : KEYWORDS_EN;

  return {
    title: { absolute: title },
    description,
    keywords: [...keywords, ...localeKeywords],
    alternates: {
      canonical: url,
      languages: { en: enUrl, ar: arUrl, "x-default": enUrl },
    },
    openGraph: {
      type: "website",
      siteName: "Cue",
      title,
      description,
      url,
      locale: locale === "ar" ? "ar_JO" : "en_US",
      alternateLocale: locale === "ar" ? "en_US" : "ar_JO",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

/**
 * Amman as a schema.org place, shared by every node in the site graph.
 * City-centre coordinates only — Cue is a service-area business with no
 * public street address yet, so the graph carries locality-level address
 * and geo, never an invented street or phone.
 */
const AMMAN_GEO = {
  "@type": "GeoCoordinates",
  latitude: 31.9539,
  longitude: 35.9106,
};

const AMMAN_CITY = {
  "@type": "City",
  name: "Amman",
  alternateName: "عمّان",
  geo: AMMAN_GEO,
  containedInPlace: {
    "@type": "Country",
    name: "Jordan",
    alternateName: "الأردن",
  },
};

/** Organization + LocalBusiness + WebSite + reservation Service graph for the homepage. */
export function siteJsonLd(locale: Locale, dict: Dictionary) {
  const description = dict.home.meta.description;
  // Neighbourhood coverage mirrors the visible "Across Amman" section, in the
  // page's own language. Names are qualified with the city so generic ones
  // (Rainbow Street, Boulevard) can't be read as another city's.
  const neighborhoods = dict.home.neighborhoods.areas.map((name) => ({
    "@type": "Place",
    name: locale === "ar" ? `${name}، عمّان` : `${name}, Amman`,
  }));
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "Cue",
        legalName: "Cue Technologies",
        url: SITE_URL,
        logo: `${SITE_URL}/brand/logo-ink.png`,
        description,
        areaServed: AMMAN_CITY,
        knowsLanguage: ["en", "ar"],
        // sameAs deliberately omitted until real Cue profiles exist — the
        // previous values were bare social-network roots, which claim the
        // wrong entity. Add the real handles here and in footer.social.
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: "Cue",
        inLanguage: locale === "ar" ? "ar-JO" : "en-US",
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": "LocalBusiness",
        "@id": `${SITE_URL}/#localbusiness`,
        name: "Cue",
        url: `${SITE_URL}/${locale}`,
        image: `${SITE_URL}/brand/logo-ink.png`,
        description,
        priceRange: "Free for guests",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Amman",
          addressCountry: "JO",
        },
        geo: AMMAN_GEO,
        areaServed: AMMAN_CITY,
      },
      {
        "@type": "Service",
        "@id": `${SITE_URL}/#reservationservice`,
        serviceType: "Restaurant reservation service",
        name: "Cue restaurant reservations",
        description: dict.home.meta.serviceDescription,
        provider: { "@id": `${SITE_URL}/#organization` },
        areaServed: [AMMAN_CITY, ...neighborhoods],
        audience: { "@type": "Audience", audienceType: "Diners and restaurant operators in Amman" },
      },
    ],
  };
}

/** BreadcrumbList for a page. Trail items are app-relative paths (locale added here). */
export function breadcrumbJsonLd(
  locale: Locale,
  trail: { name: string; path: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}/${locale}${item.path}`,
    })),
  };
}

/** FAQPage schema — answers eligible for Google rich results. */
export function faqJsonLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

/** Small helper to render a JSON-LD <script>. */
export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data);
}

/**
 * Trim long body copy down to a search-snippet-length meta description,
 * cutting on a word boundary and dropping any dangling punctuation. Used so
 * each legal doc gets a unique description from its own intro rather than all
 * sharing one — avoiding a duplicate-description signal across the legal set.
 */
export function truncateForMeta(text: string, max = 155): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const slice = clean.slice(0, max);
  const cut = slice.slice(0, slice.lastIndexOf(" "));
  return `${cut.replace(/[\s.,;:—-]+$/, "")}…`;
}
