import type { Metadata } from "next";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import PageHero from "@/components/sections/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal, { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import LocaleLink from "@/components/ui/LocaleLink";
import FeatureShowcase from "@/components/sections/FeatureShowcase";
import CtaBand from "@/components/sections/CtaBand";
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
    path: "/how-it-works",
    title: dict.how.meta.title,
    description: dict.how.meta.description,
  });
}

export default function HowItWorksPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = (isLocale(params.locale) ? params.locale : "en") as Locale;
  const dict = getDictionary(locale);
  const h = dict.how;

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: "Cue", path: "" },
          { name: h.hero.eyebrow, path: "/how-it-works" },
        ])}
      />
      <PageHero
        eyebrow={h.hero.eyebrow}
        title={h.hero.title}
        subtitle={h.hero.subtitle}
      >
        <LocaleLink href="/reach-out" locale={locale} className="btn btn-primary text-base">
          {dict.common.getStarted}
        </LocaleLink>
        <LocaleLink href="/partner" locale={locale} className="btn btn-outline text-base">
          {dict.common.partnerWithCue}
        </LocaleLink>
      </PageHero>

      {/* The loop */}
      <section className="container-pad py-20 sm:py-28">
        <SectionHeading kicker={h.loop.kicker} title={h.loop.title} className="mb-14" />
        <RevealGroup className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {h.loop.steps.map((step) => (
            <RevealItem
              key={step.n}
              className="card card-hover relative overflow-hidden p-6"
            >
              <CueMark className="absolute -end-5 -top-5 h-16 w-16 text-content/[0.05]" />
              <span className="text-4xl font-[650] tabular-nums text-accent-deep dark:text-accent">
                {step.n}
              </span>
              <h3 className="mt-4 text-xl font-semibold text-content">{step.title}</h3>
              <p className="mt-2 text-sm text-muted">{step.body}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* For guests */}
      <section className="container-pad pb-20 sm:pb-28">
        <SectionHeading
          kicker={h.guest.kicker}
          title={h.guest.title}
          body={h.guest.body}
          className="mb-14"
        />
        <FeatureShowcase features={h.guest.features} variant="light" />
      </section>

      {/* For operators — inverse band */}
      <section className="bg-content text-bg">
        <div className="container-pad py-20 sm:py-28">
          <SectionHeading
            kicker={h.operator.kicker}
            title={h.operator.title}
            body={h.operator.body}
            tone="paper"
            className="mb-14"
          />
          <FeatureShowcase features={h.operator.features} variant="dark" />
        </div>
      </section>

      {/* Philosophy */}
      <section className="container-pad py-20 sm:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <SectionHeading kicker={h.philosophy.kicker} title={h.philosophy.title} body={h.philosophy.body} />
          <RevealGroup className="flex flex-col gap-6">
            {h.philosophy.points.map((p, i) => (
              <RevealItem
                key={p.title}
                className="flex gap-5 border-s-2 border-accent/40 ps-5"
              >
                <div>
                  <h3 className="text-xl font-semibold text-content">{p.title}</h3>
                  <p className="mt-2 text-muted">{p.body}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <CtaBand
        locale={locale}
        title={h.cta.title}
        body={h.cta.body}
        primary={h.cta.primary}
        primaryHref="/partner"
        secondary={h.cta.secondary}
        secondaryHref="/reach-out"
      />
    </>
  );
}
