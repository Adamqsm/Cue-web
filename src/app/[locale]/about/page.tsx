import type { Metadata } from "next";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import PageHero from "@/components/sections/PageHero";
import Reveal from "@/components/ui/Reveal";
import LocaleLink from "@/components/ui/LocaleLink";
import { CueMark } from "@/components/BrandMark";
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

      {/* Mission — statement set against the spine */}
      <EditorialSection num="01" label={a.mission.kicker} band="bg">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <h2 className="text-[clamp(1.9rem,3.4vw,3rem)] leading-[1.08] text-content">
            {a.mission.title}
          </h2>
          <Reveal delay={1} className="flex items-center">
            <p className="text-xl leading-relaxed text-content/80 sm:text-2xl">
              {a.mission.body}
            </p>
          </Reveal>
        </div>
      </EditorialSection>

      {/* What Cue solves — two sides, editorial rows */}
      <EditorialSection num="02" label={a.problem.kicker} band="surface2">
        <div className="max-w-2xl">
          <h2 className="text-[clamp(1.9rem,3.4vw,3rem)] leading-[1.08] text-content">
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
      </EditorialSection>

      {/* Principles — the six, as an editorial index */}
      <EditorialSection num="03" label={a.values.kicker} band="bg">
        <div className="max-w-2xl">
          <h2 className="text-[clamp(1.9rem,3.4vw,3rem)] leading-[1.08] text-content">
            {a.values.title}
          </h2>
        </div>
        <EditorialList className="mt-12" items={a.values.items} />
      </EditorialSection>

      {/* Vision */}
      <section className="container-pad pb-24">
        <Reveal>
          <div className="relative overflow-hidden rounded-panel border border-line bg-surface2 px-6 py-16 sm:px-14 sm:py-20">
            <CueMark className="pointer-events-none absolute -bottom-16 -end-10 h-72 w-72 text-accent/[0.07]" />
            <div className="relative max-w-2xl">
              <span className="eyebrow">{a.vision.kicker}</span>
              <h2 className="mt-4 text-3xl leading-tight text-content sm:text-4xl lg:text-[2.75rem]">
                {a.vision.title}
              </h2>
              <p className="mt-4 text-lg text-muted">{a.vision.body}</p>
              <LocaleLink
                href="/how-it-works"
                locale={locale}
                className="btn btn-primary mt-8 text-base"
              >
                {a.vision.cta}
              </LocaleLink>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
