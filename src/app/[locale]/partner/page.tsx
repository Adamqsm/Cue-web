import type { Metadata } from "next";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import PageHero from "@/components/sections/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal, { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import LocaleLink from "@/components/ui/LocaleLink";
import PhoneFrame from "@/components/ui/PhoneFrame";
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
              className="group relative overflow-hidden rounded-4xl border border-line bg-surface2/50 p-7 transition-colors hover:border-green/30"
            >
              <div className="flex items-start gap-4">
                <span className="font-display text-3xl font-semibold text-green/80">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-xl font-semibold text-content">{item.title}</h3>
                  <p className="mt-2 text-content/70">{item.body}</p>
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* Built for — dark split */}
      <section className="bg-ink text-bone">
        <div className="container-pad grid items-center gap-12 py-20 sm:py-28 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <SectionHeading
              kicker={p.builtFor.kicker}
              title={p.builtFor.title}
              body={p.builtFor.body}
              tone="paper"
            />
            <RevealGroup className="mt-8 flex flex-col gap-3">
              {p.builtFor.items.map((item) => (
                <RevealItem
                  key={item}
                  className="flex items-center gap-3 border-b border-bone/12 pb-3 text-lg text-bone/85"
                >
                  <CueMark className="h-5 w-5 shrink-0 text-green-300" />
                  {item}
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
          <Reveal delay={1} className="flex justify-center">
            <div className="animate-floaty">
              <PhoneFrame
                src="/app/dash-today.png"
                alt="Cue partner dashboard"
                width={280}
                className="rotate-3"
              />
            </div>
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
              className="relative rounded-4xl border border-line bg-bg p-7"
            >
              <span className="font-display text-5xl font-semibold text-green/25">
                {step.n}
              </span>
              <h3 className="mt-3 text-xl font-semibold text-content">{step.title}</h3>
              <p className="mt-2 text-content/70">{step.body}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* Approach */}
      <section className="container-pad pb-20 sm:pb-28">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] border border-line bg-surface2/60 p-8 sm:p-14">
            <CueMark className="pointer-events-none absolute -end-10 -top-10 h-52 w-52 text-green/10 animate-spin-slow" />
            <div className="relative max-w-3xl">
              <span className="eyebrow">{p.approach.kicker}</span>
              <h2 className="mt-4 text-3xl font-semibold leading-tight text-content sm:text-4xl">
                {p.approach.title}
              </h2>
              <p className="mt-4 text-lg text-content/70">{p.approach.body}</p>
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
