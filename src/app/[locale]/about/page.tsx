import type { Metadata } from "next";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import PageHero from "@/components/sections/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal, { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import LocaleLink from "@/components/ui/LocaleLink";
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
      <section className="container-pad py-20 sm:py-28">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <SectionHeading kicker={a.mission.kicker} title={a.mission.title} />
          <Reveal delay={1} className="flex items-center">
            <p className="text-xl leading-relaxed text-content/75 sm:text-2xl">
              {a.mission.body}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Problem — dark */}
      <section className="bg-ink text-bone">
        <div className="container-pad py-20 sm:py-28">
          <SectionHeading
            kicker={a.problem.kicker}
            title={a.problem.title}
            body={a.problem.body}
            tone="paper"
            className="mb-12"
          />
          <RevealGroup className="grid gap-6 sm:grid-cols-2">
            {a.problem.columns.map((c) => (
              <RevealItem
                key={c.title}
                className="rounded-4xl border border-bone/12 bg-bone/[0.04] p-7"
              >
                <h3 className="text-2xl font-semibold text-bone">{c.title}</h3>
                <p className="mt-3 text-bone/70">{c.body}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Values */}
      <section className="container-pad py-20 sm:py-28">
        <SectionHeading
          kicker={a.values.kicker}
          title={a.values.title}
          align="center"
          className="mb-14"
        />
        <RevealGroup className="grid gap-x-8 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
          {a.values.items.map((item, i) => (
            <RevealItem key={item.title} className="border-t border-line pt-5">
              <div className="flex items-center gap-3">
                <span className="font-display text-lg text-green dark:text-green-300">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-lg font-semibold text-content">{item.title}</h3>
              </div>
              <p className="mt-2 text-content/65">{item.body}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* Vision */}
      <section className="container-pad pb-24">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-ink px-6 py-16 text-bone sm:px-14 sm:py-20">
            <CueMark className="pointer-events-none absolute -bottom-16 -end-10 h-72 w-72 text-bone/10 animate-spin-slow" />
            <div className="relative max-w-2xl">
              <span className="eyebrow text-amber">{a.vision.kicker}</span>
              <h2 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">
                {a.vision.title}
              </h2>
              <p className="mt-4 text-lg text-bone/80">{a.vision.body}</p>
              <LocaleLink
                href="/how-it-works"
                locale={locale}
                className="btn mt-8 bg-bone text-ink hover:bg-green hover:text-bone text-base"
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
