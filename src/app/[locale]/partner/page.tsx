import type { Metadata } from "next";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import PageHero from "@/components/sections/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal, { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import LocaleLink from "@/components/ui/LocaleLink";
import ServiceBoard from "@/components/home/ServiceBoard";
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

      {/* Why */}
      <section className="container-pad py-20 sm:py-28">
        <SectionHeading kicker={p.why.kicker} title={p.why.title} className="mb-14" />
        <RevealGroup className="grid gap-6 sm:grid-cols-2">
          {p.why.items.map((item, i) => (
            <RevealItem
              key={item.title}
              className="card card-hover p-7"
            >
              <div className="flex items-start gap-4">
                <span className="text-3xl font-[650] tabular-nums tracking-[-0.025em] text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-xl font-semibold tracking-[-0.015em] text-content">{item.title}</h3>
                  <p className="mt-2 leading-[1.65] text-muted">{item.body}</p>
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* Built for — surface-2 band split */}
      <section className="border-y border-line bg-surface2">
        <div className="container-pad grid items-center gap-12 py-20 sm:py-28 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <SectionHeading
              kicker={p.builtFor.kicker}
              title={p.builtFor.title}
              body={p.builtFor.body}
            />
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
          {/* The signature board recurs here (spec: homepage hero + partner
              page) — the operator's live docket, shown rather than described. */}
          <Reveal delay={1} className="flex justify-center">
            <ServiceBoard
              board={dict.home.hero.board}
              labels={{ play: dict.home.demo.play, pause: dict.home.demo.pause }}
            />
          </Reveal>
        </div>
      </section>

      {/* Pricing tiers */}
      <PricingTiers locale={locale} pricing={p.pricing} />

      {/* Commission structure + optional add-ons */}
      <CommissionSection commission={p.commission} />

      {/* Steps */}
      <section className="container-pad py-20 sm:py-28">
        <SectionHeading kicker={p.steps.kicker} title={p.steps.title} className="mb-14" />
        <RevealGroup className="grid gap-6 md:grid-cols-3">
          {p.steps.items.map((step) => (
            <RevealItem
              key={step.n}
              className="card card-hover p-7"
            >
              <span className="text-5xl font-[650] tabular-nums tracking-[-0.025em] rtl:tracking-normal text-accent-deep dark:text-accent">
                {step.n}
              </span>
              <h3 className="mt-3 text-xl font-semibold tracking-[-0.015em] text-content">{step.title}</h3>
              <p className="mt-2 leading-[1.65] text-muted">{step.body}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* Approach */}
      <section className="container-pad pb-20 sm:pb-28">
        <Reveal>
          <div className="rounded-panel border border-line bg-surface2 p-8 sm:p-14">
            <div className="max-w-3xl">
              <span className="eyebrow">
                <span className="h-px w-6 bg-current opacity-60" />
                {p.approach.kicker}
              </span>
              <h2 className="mt-4 text-balance text-[clamp(1.75rem,3.2vw,2.75rem)] font-[650] leading-[1.1] tracking-[-0.025em] text-content">
                {p.approach.title}
              </h2>
              <p className="mt-4 max-w-[65ch] text-lg leading-[1.65] text-muted">{p.approach.body}</p>
            </div>
          </div>
        </Reveal>
      </section>

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
