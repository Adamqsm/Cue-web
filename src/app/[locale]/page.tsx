import type { Metadata } from "next";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { SITE_URL } from "@/lib/utils";
import HomeHero from "@/components/sections/HomeHero";
import Positioning from "@/components/home/Positioning";
import HowItWorks from "@/components/home/HowItWorks";
import Features from "@/components/home/Features";
import Demo from "@/components/home/Demo";
import Operators from "@/components/home/Operators";
import Traction from "@/components/home/Traction";
import HomeFaq from "@/components/home/HomeFaq";
import FinalCta from "@/components/home/FinalCta";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale = isLocale(params.locale) ? params.locale : "en";
  const dict = getDictionary(locale);
  return {
    title: dict.home.meta.title,
    description: dict.home.meta.description,
  };
}

export default function HomePage({ params }: { params: { locale: string } }) {
  const locale = (isLocale(params.locale) ? params.locale : "en") as Locale;
  const dict = getDictionary(locale);

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Cue",
    legalName: "Cue Technologies",
    url: `${SITE_URL}/${locale}`,
    logo: `${SITE_URL}/favicon.svg`,
    slogan: dict.brand.tagline,
    description: dict.home.meta.description,
    parentOrganization: {
      "@type": "Organization",
      name: "Qasem Capital & Enterprise",
    },
    areaServed: { "@type": "City", name: "Amman", addressCountry: "JO" },
    sameAs: dict.footer.social.map((s) => s.href),
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: dict.faq.items.slice(0, 6).map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <HomeHero locale={locale} dict={dict} />
      <Positioning dict={dict} />
      <HowItWorks dict={dict} />
      <Features dict={dict} />
      <Demo dict={dict} />
      <Operators locale={locale} dict={dict} />
      <Traction dict={dict} />
      <HomeFaq locale={locale} dict={dict} />
      <FinalCta locale={locale} dict={dict} />
    </>
  );
}
