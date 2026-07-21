import type { Metadata } from "next";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import PageHero from "@/components/sections/PageHero";
import LocaleLink from "@/components/ui/LocaleLink";
import FeatureShowcase from "@/components/sections/FeatureShowcase";
import CtaBand from "@/components/sections/CtaBand";
import EditorialSection from "@/components/home/EditorialSection";
import EditorialList from "@/components/ui/EditorialList";

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

      {/* The booking loop — editorial rows */}
      <EditorialSection num="01" label={h.loop.kicker} band="bg">
        <div className="max-w-2xl">
          <h2 className="text-[clamp(1.9rem,3.4vw,3rem)] leading-[1.08] text-content">
            {h.loop.title}
          </h2>
        </div>
        <EditorialList
          className="mt-12"
          items={h.loop.steps.map((s) => ({ num: s.n, title: s.title, body: s.body }))}
        />
      </EditorialSection>

      {/* For guests */}
      <EditorialSection num="02" label={h.guest.kicker} band="surface2">
        <div className="max-w-2xl">
          <h2 className="text-[clamp(1.9rem,3.4vw,3rem)] leading-[1.08] text-content">
            {h.guest.title}
          </h2>
          <p className="mt-5 text-lg leading-[1.6] text-muted">{h.guest.body}</p>
        </div>
        <div className="mt-10">
          <FeatureShowcase features={h.guest.features} variant="light" />
        </div>
      </EditorialSection>

      {/* For operators — inverse ink band */}
      <EditorialSection num="03" label={h.operator.kicker} band="ink">
        <div className="max-w-2xl">
          <h2 className="text-[clamp(1.9rem,3.4vw,3rem)] leading-[1.08] text-bg">
            {h.operator.title}
          </h2>
          <p className="mt-5 text-lg leading-[1.6] text-bg/70">{h.operator.body}</p>
        </div>
        <div className="mt-10">
          <FeatureShowcase features={h.operator.features} variant="dark" />
        </div>
      </EditorialSection>

      {/* The thinking — principles as editorial rows */}
      <EditorialSection num="04" label={h.philosophy.kicker} band="bg">
        <div className="max-w-2xl">
          <h2 className="text-[clamp(1.9rem,3.4vw,3rem)] leading-[1.08] text-content">
            {h.philosophy.title}
          </h2>
          <p className="mt-5 text-lg leading-[1.6] text-muted">{h.philosophy.body}</p>
        </div>
        <EditorialList className="mt-12" items={h.philosophy.points} />
      </EditorialSection>

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
