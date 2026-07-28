import type { Metadata } from "next";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import PageHero from "@/components/sections/PageHero";
import Reveal from "@/components/ui/Reveal";
import LocaleLink from "@/components/ui/LocaleLink";
import RuledSection from "@/components/layout/RuledSection";
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
    path: "/about",
    title: dict.about.meta.title,
    description: dict.about.meta.description,
  });
}

export default function AboutPage({ params }: { params: { locale: string } }) {
  const locale = (isLocale(params.locale) ? params.locale : "en") as Locale;
  const dict = getDictionary(locale);
  const a = dict.about;

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: "Cue", path: "" },
          { name: a.hero.eyebrow, path: "/about" },
        ])}
      />
      <PageHero eyebrow={a.hero.eyebrow} title={a.hero.title} subtitle={a.hero.subtitle} />

      {/* Mission */}
      <RuledSection head={a.mission.kicker}>
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <h2 className="text-3xl text-content sm:text-4xl">
            {a.mission.title}
          </h2>
          <Reveal delay={1} className="flex items-center">
            <p className="text-xl leading-relaxed text-content/80 sm:text-2xl">
              {a.mission.body}
            </p>
          </Reveal>
        </div>
      </RuledSection>

      {/* What Cue solves — ruled rows */}
      <RuledSection head={a.problem.kicker}>
        <div className="max-w-2xl">
          <h2 className="text-3xl text-content sm:text-4xl">
            {a.problem.title}
          </h2>
          <p className="mt-5 text-lg leading-[1.6] text-muted">{a.problem.body}</p>
        </div>
        <EditorialList
          className="mt-12"
          numbers={false}
          items={a.problem.columns.map((c) => ({
            title: c.title,
            body: c.body,
          }))}
        />
      </RuledSection>

      {/* Principles — an editorial index */}
      <RuledSection head={a.values.kicker}>
        <div className="max-w-2xl">
          <h2 className="text-3xl text-content sm:text-4xl">
            {a.values.title}
          </h2>
        </div>
        <EditorialList className="mt-12" items={a.values.items} />
      </RuledSection>

      {/* Vision — the page's one field moment */}
      <RuledSection head={a.vision.kicker} tone="field">
        <div className="max-w-2xl">
          <h2 className="text-3xl sm:text-4xl">{a.vision.title}</h2>
          <p className="mt-4 text-lg leading-relaxed text-field-content/70">
            {a.vision.body}
          </p>
          <LocaleLink
            href="/how-it-works"
            locale={locale}
            className="btn btn-paper mt-8 text-base"
          >
            {a.vision.cta}
          </LocaleLink>
        </div>
      </RuledSection>
    </>
  );
}
