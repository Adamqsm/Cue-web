import type { Metadata } from "next";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import PageHero from "@/components/sections/PageHero";
import Reveal from "@/components/ui/Reveal";
import ApplyForm from "@/components/partner/ApplyForm";

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const locale = isLocale(params.locale) ? params.locale : "en";
  const dict = getDictionary(locale);
  return buildMetadata({
    locale,
    path: "/partner/apply",
    title: dict.partnerApply.meta.title,
    description: dict.partnerApply.meta.description,
  });
}

export default async function PartnerApplyPage(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params;
  const locale = (isLocale(params.locale) ? params.locale : "en") as Locale;
  const dict = getDictionary(locale);
  const p = dict.partnerApply;

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: "Cue", path: "" },
          { name: dict.partner.hero.crumb, path: "/partner" },
          { name: p.hero.crumb, path: "/partner/apply" },
        ])}
      />
      <PageHero title={p.hero.title} subtitle={p.hero.subtitle} />

      <section className="container-pad pb-20 sm:pb-28">
        <Reveal delay={1} className="mx-auto max-w-3xl">
          <ApplyForm
            form={p.form}
            areas={dict.home.neighborhoods.areas}
            locale={locale}
          />
        </Reveal>
      </section>
    </>
  );
}
