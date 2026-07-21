import type { Metadata } from "next";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import PageHero from "@/components/sections/PageHero";
import Reveal, { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import LocaleLink from "@/components/ui/LocaleLink";
import ServiceBoard from "@/components/home/ServiceBoard";
import EditorialSection from "@/components/home/EditorialSection";
import EditorialList from "@/components/ui/EditorialList";
import CtaBand from "@/components/sections/CtaBand";
import FoundingBanner from "@/components/partner/FoundingBanner";
import PricingTiers from "@/components/partner/PricingTiers";
import CommissionSection from "@/components/partner/CommissionSection";
import { CueMark } from "@/components/BrandMark";

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

export default function PartnerPage({ params }: { params: { locale: string } }) {
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
      <PageHero eyebrow={p.hero.eyebrow} title={p.hero.title} subtitle={p.hero.subtitle}>
        <LocaleLink href="/partner/apply" locale={locale} className="btn btn-primary text-base">
          {p.hero.primary}
        </LocaleLink>
        <LocaleLink href="/how-it-works" locale={locale} className="btn btn-outline text-base">
          {p.hero.secondary}
        </LocaleLink>
      </PageHero>

      {/* Founding partner offer — the outreach hook */}
      <FoundingBanner locale={locale} founding={p.founding} />

      {/* Why partner — editorial rows */}
      <EditorialSection num="01" label={p.why.kicker} band="bg">
        <div className="max-w-2xl">
          <h2 className="text-[clamp(1.9rem,3.4vw,3rem)] leading-[1.08] text-content">
            {p.why.title}
          </h2>
        </div>
        <EditorialList className="mt-12" items={p.why.items} />
      </EditorialSection>

      {/* Built for — the signature board recurs (spec: hero + partner page) */}
      <EditorialSection num="02" label={p.builtFor.kicker} band="surface2">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <h2 className="text-[clamp(1.9rem,3.4vw,3rem)] leading-[1.08] text-content">
              {p.builtFor.title}
            </h2>
            <p className="mt-5 text-lg leading-[1.6] text-muted">{p.builtFor.body}</p>
            <RevealGroup className="mt-8 flex flex-col gap-3">
              {p.builtFor.items.map((item) => (
                <RevealItem
                  key={item}
                  className="flex items-center gap-3 border-b border-line pb-3 text-lg text-content/80"
                >
                  <CueMark className="h-5 w-5 shrink-0 text-accent" />
                  {item}
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
          <Reveal delay={1} className="flex justify-center">
            <ServiceBoard
              board={dict.home.hero.board}
              labels={{ play: dict.home.demo.play, pause: dict.home.demo.pause }}
            />
          </Reveal>
        </div>
      </EditorialSection>

      {/* Pricing tiers (03) */}
      <PricingTiers locale={locale} pricing={p.pricing} num="03" />

      {/* Commission structure + optional add-ons (04) */}
      <CommissionSection commission={p.commission} num="04" />

      {/* How Cue works for partners — editorial rows */}
      <EditorialSection num="05" label={p.steps.kicker} band="bg">
        <div className="max-w-2xl">
          <h2 className="text-[clamp(1.9rem,3.4vw,3rem)] leading-[1.08] text-content">
            {p.steps.title}
          </h2>
        </div>
        <EditorialList
          className="mt-12"
          items={p.steps.items.map((s) => ({ num: s.n, title: s.title, body: s.body }))}
        />
      </EditorialSection>

      {/* Approach — full-bleed olive moment */}
      <EditorialSection num="06" label={p.approach.kicker} band="olive">
        <div className="max-w-3xl">
          <h2 className="text-[clamp(1.9rem,3.6vw,3.25rem)] leading-[1.06] text-white">
            {p.approach.title}
          </h2>
          <p className="mt-5 max-w-[60ch] text-lg leading-[1.6] text-white/85">
            {p.approach.body}
          </p>
        </div>
      </EditorialSection>

      <CtaBand
        locale={locale}
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
