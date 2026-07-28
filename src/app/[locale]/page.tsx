import type { Metadata } from "next";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { buildMetadata, siteJsonLd } from "@/lib/seo";
import Cover from "@/components/home/Cover";
import GuideRail from "@/components/home/GuideRail";
import PhotoEssay from "@/components/home/PhotoEssay";
import ProductMoment from "@/components/home/ProductMoment";
import NightClose from "@/components/home/NightClose";

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

      {/* v4 "The White City at Night" — a front page in five moves:
          cover story · the guide · photo essay · the product · the close. */}
      <Cover locale={locale} c={dict.home.cover} />
      <GuideRail locale={locale} g={dict.home.guide} />
      <PhotoEssay e={dict.home.essay} />
      <ProductMoment locale={locale} p={dict.home.product} />
      <NightClose locale={locale} cl={dict.home.close} />
    </>
  );
}
