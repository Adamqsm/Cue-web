import type { Metadata } from "next";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import Masthead from "@/components/layout/Masthead";
import RuledSection from "@/components/layout/RuledSection";
import LocaleLink from "@/components/ui/LocaleLink";
import EditorialList from "@/components/ui/EditorialList";
import CtaBand from "@/components/sections/CtaBand";
import FoundingBanner from "@/components/partner/FoundingBanner";
import PricingTiers from "@/components/partner/PricingTiers";
import CommissionSection from "@/components/partner/CommissionSection";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale = isLocale(params.locale) ? params.locale : "en";
  const dict = getDictionary(locale);
  return buildMetadata({
    locale,
    path: "/partner",
    title: dict.partner.meta.title,
    description: dict.partner.meta.description,
  });
}

export default function PartnerPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = (isLocale(params.locale) ? params.locale : "en") as Locale;
  const dict = getDictionary(locale);
  const p = dict.partner;

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: "Cue", path: "" },
          { name: p.hero.eyebrow, path: "/partner" },
        ])}
      />
      <Masthead
        kicker={p.hero.eyebrow}
        title={p.hero.title}
        dek={p.hero.subtitle}
      >
        <LocaleLink href="/partner/apply" locale={locale} className="btn btn-ink text-base">
          {p.hero.primary}
        </LocaleLink>
        <LocaleLink href="/how-it-works" locale={locale} className="btn btn-outline text-base">
          {p.hero.secondary}
        </LocaleLink>
      </Masthead>

      {/* The founding offer — the page's one "JD 0" statement */}
      <FoundingBanner locale={locale} founding={p.founding} />

      {/* Why partner — ruled rows */}
      <RuledSection head={p.why.kicker}>
        <h2 className="max-w-2xl text-3xl sm:text-4xl">{p.why.title}</h2>
        <EditorialList className="mt-10" items={p.why.items} />
      </RuledSection>

      {/* Tariff table */}
      <PricingTiers locale={locale} pricing={p.pricing} />

      {/* Commission structure + add-ons */}
      <CommissionSection commission={p.commission} />

      {/* Onboarding, in order — a real sequence */}
      <RuledSection head={p.steps.kicker}>
        <h2 className="max-w-2xl text-3xl sm:text-4xl">{p.steps.title}</h2>
        <EditorialList
          className="mt-10"
          numbers
          items={p.steps.items.map((s) => ({ num: s.n, title: s.title, body: s.body }))}
        />
      </RuledSection>

      <CtaBand
        locale={locale}
        head={p.hero.eyebrow}
        title={p.cta.title}
        body={p.cta.body}
        primary={p.cta.primary}
        primaryHref="/partner/apply"
        secondary={p.cta.secondary}
        secondaryHref="/how-it-works"
      />
    </>
  );
}
