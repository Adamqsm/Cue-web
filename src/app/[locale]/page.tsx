import type { Metadata } from "next";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { buildMetadata, siteJsonLd, faqJsonLd } from "@/lib/seo";
import HomeHero from "@/components/sections/HomeHero";
import Positioning from "@/components/home/Positioning";
import HowItWorks from "@/components/home/HowItWorks";
import Features from "@/components/home/Features";
import Demo from "@/components/home/Demo";
import Neighborhoods from "@/components/home/Neighborhoods";
import Operators from "@/components/home/Operators";
import Traction from "@/components/home/Traction";
import HomeFaq from "@/components/home/HomeFaq";
import FinalCta from "@/components/home/FinalCta";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale = (isLocale(params.locale) ? params.locale : "en") as Locale;
  const dict = getDictionary(locale);
  return buildMetadata({
    locale,
    path: "",
    title: dict.home.meta.title,
    description: dict.home.meta.description,
  });
}

export default function HomePage({ params }: { params: { locale: string } }) {
  const locale = (isLocale(params.locale) ? params.locale : "en") as Locale;
  const dict = getDictionary(locale);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(siteJsonLd(locale, dict.home.meta.description)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd(dict.faq.items.slice(0, 6))),
        }}
      />

      <HomeHero locale={locale} dict={dict} />
      <Positioning dict={dict} />
      <HowItWorks dict={dict} />
      <Features dict={dict} />
      <Demo dict={dict} />
      <Neighborhoods dict={dict} />
      <Operators locale={locale} dict={dict} />
      <Traction dict={dict} />
      <HomeFaq locale={locale} dict={dict} />
      <FinalCta locale={locale} dict={dict} />
    </>
  );
}
