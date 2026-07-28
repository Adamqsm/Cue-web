import type { Metadata } from "next";
import {
  Newsreader,
  El_Messiri,
  IBM_Plex_Sans,
  IBM_Plex_Sans_Arabic,
} from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";
import { locales, isLocale, localeDirection, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { SITE_URL } from "@/lib/utils";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import MotionProvider from "@/components/MotionProvider";
import ConsentBanner from "@/components/ConsentBanner";
import DuoFilter from "@/components/ui/DuoFilter";

// v4 "The White City at Night" — news-serif display (Newsreader) with a
// cross-script Plex utility family. Arabic display is El Messiri: a tall,
// modernised Naskh that carries mastheads the way Newsreader does in Latin.
const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
  // Variable face: full wght range plus the optical-size axis — text cuts
  // for deks and pull-quotes, display cuts at masthead sizes.
  axes: ["opsz"],
  // Next 14's font table has no override metrics for Newsreader — skip the
  // automatic fallback adjust and name the fallback stack explicitly.
  adjustFontFallback: false,
  fallback: ["Georgia", "serif"],
});

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const elMessiri = El_Messiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-arabic-display",
  display: "swap",
  adjustFontFallback: false,
  fallback: ["Tahoma", "sans-serif"],
});

const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-arabic",
  display: "swap",
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale = isLocale(params.locale) ? params.locale : "en";
  const dict = getDictionary(locale);
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: dict.home.meta.title,
      template: `%s · Cue`,
    },
    description: dict.home.meta.description,
    applicationName: "Cue",
    alternates: {
      canonical: `/${locale}`,
      languages: { en: "/en", ar: "/ar" },
    },
    openGraph: {
      type: "website",
      siteName: "Cue",
      title: dict.home.meta.title,
      description: dict.home.meta.description,
      locale: locale === "ar" ? "ar_JO" : "en_US",
      url: `${SITE_URL}/${locale}`,
    },
    twitter: {
      card: "summary_large_image",
      title: dict.home.meta.title,
      description: dict.home.meta.description,
    },
    icons: {
      icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    },
  };
}

// Set the theme class before paint to avoid a flash of the wrong mode.
const themeScript = `(function(){try{var t=localStorage.getItem('cue-theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(d)document.documentElement.classList.add('dark');}catch(e){}})();`;

// The three user-facing policies the consent gate references — selected by
// href (order-stable in both locales), passed as a slim payload so the
// client banner doesn't serialize the whole dictionary.
const CONSENT_POLICY_HREFS = ["/legal/terms", "/legal/privacy", "/legal/cookies"];
function consentPolicies(dict: ReturnType<typeof getDictionary>) {
  return dict.legal.index.docs
    .filter((d) => CONSENT_POLICY_HREFS.includes(d.href))
    .map(({ href, title }) => ({ href, title }));
}

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dir = localeDirection[locale];
  const dict = getDictionary(locale);

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      {/* Font-variable classes live on <body>, not <html>: the no-flash script
          writes the `dark` class onto <html>, and keeping <html> free of any
          React-managed className stops hydration from reconciling it away
          (which stripped the theme class and caused a light-mode flash). */}
      <body
        className={`${newsreader.variable} ${plexSans.variable} ${elMessiri.variable} ${plexArabic.variable} min-h-screen antialiased`}
      >
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {/* Reveal SSRs framer-motion's hidden initial state as inline
            styles — without JS, force everything visible (spec: content must
            never be hidden if JS fails). */}
        <noscript>
          <style>{`[style*="opacity"]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <DuoFilter />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:start-4 focus:z-[100] focus:rounded-chip focus:bg-content focus:px-4 focus:py-2 focus:text-bg"
        >
          {dict.common.skipToContent}
        </a>
        <MotionProvider>
          <Nav locale={locale} dict={dict} />
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Footer locale={locale} dict={dict} />
        </MotionProvider>
        <ConsentBanner
          locale={locale}
          content={dict.consent}
          policies={consentPolicies(dict)}
        />
      </body>
    </html>
  );
}
