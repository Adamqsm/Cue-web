import type { Metadata } from "next";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import Masthead from "@/components/layout/Masthead";
import RuledSection from "@/components/layout/RuledSection";
import LocaleLink from "@/components/ui/LocaleLink";
import FeatureShowcase from "@/components/sections/FeatureShowcase";
import CtaBand from "@/components/sections/CtaBand";
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
      <Masthead
        kicker={h.hero.eyebrow}
        title={h.hero.title}
        dek={h.hero.subtitle}
      >
        <LocaleLink href="/reach-out" locale={locale} className="btn btn-book text-base">
          {dict.common.joinWaitlist}
        </LocaleLink>
        <LocaleLink href="/partner" locale={locale} className="btn btn-outline text-base">
          {dict.common.partnerWithCue}
        </LocaleLink>
      </Masthead>

      {/* The booking loop — a real sequence, numbered small, one screen */}
      <RuledSection head={h.loop.kicker}>
        <h2 className="max-w-2xl text-3xl sm:text-4xl">{h.loop.title}</h2>
        <EditorialList
          className="mt-10"
          numbers
          items={h.loop.steps.map((s) => ({ num: s.n, title: s.title, body: s.body }))}
        />
      </RuledSection>

      {/* For guests — contact sheet */}
      <RuledSection head={h.guest.kicker}>
        <div className="max-w-2xl">
          <h2 className="text-3xl sm:text-4xl">{h.guest.title}</h2>
          <p className="mt-4 text-lg leading-relaxed text-muted">{h.guest.body}</p>
        </div>
        <div className="mt-10">
          <FeatureShowcase features={h.guest.features} columns={3} />
        </div>
      </RuledSection>

      {/* For operators — contact sheet */}
      <RuledSection head={h.operator.kicker}>
        <div className="max-w-2xl">
          <h2 className="text-3xl sm:text-4xl">{h.operator.title}</h2>
          <p className="mt-4 text-lg leading-relaxed text-muted">{h.operator.body}</p>
        </div>
        <div className="mt-10">
          <FeatureShowcase features={h.operator.features} columns={4} />
        </div>
      </RuledSection>

      {/* The thinking — plain ruled rows */}
      <RuledSection head={h.philosophy.kicker}>
        <div className="max-w-2xl">
          <h2 className="text-3xl sm:text-4xl">{h.philosophy.title}</h2>
          <p className="mt-4 text-lg leading-relaxed text-muted">{h.philosophy.body}</p>
        </div>
        <EditorialList className="mt-10" items={h.philosophy.points} />
      </RuledSection>

      <CtaBand
        locale={locale}
        head={h.hero.eyebrow}
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
