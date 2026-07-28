import type { Metadata } from "next";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import PageHero from "@/components/sections/PageHero";
import Reveal, { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import LocaleLink from "@/components/ui/LocaleLink";
import CtaBand from "@/components/sections/CtaBand";
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
    path: "/careers",
    title: dict.careers.meta.title,
    description: dict.careers.meta.description,
  });
}

export default function CareersPage({ params }: { params: { locale: string } }) {
  const locale = (isLocale(params.locale) ? params.locale : "en") as Locale;
  const dict = getDictionary(locale);
  const c = dict.careers;

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: "Cue", path: "" },
          { name: c.hero.eyebrow, path: "/careers" },
        ])}
      />
      <PageHero eyebrow={c.hero.eyebrow} title={c.hero.title} subtitle={c.hero.subtitle}>
        <LocaleLink href="/reach-out" locale={locale} className="btn btn-primary text-base">
          {c.hero.primary}
        </LocaleLink>
      </PageHero>

      {/* Why join — editorial rows */}
      <RuledSection head={c.why.kicker}>
        <div className="max-w-2xl">
          <h2 className="text-3xl text-content sm:text-4xl">
            {c.why.title}
          </h2>
          <p className="mt-5 text-lg leading-[1.6] text-muted">{c.why.body}</p>
        </div>
        <EditorialList className="mt-12" items={c.why.items} />
      </RuledSection>

      {/* Roles — editorial index of openings */}
      <RuledSection head={c.roles.kicker}>
        <div className="max-w-2xl">
          <h2 className="text-3xl text-content sm:text-4xl">
            {c.roles.title}
          </h2>
        </div>
        <RevealGroup className="mt-10 flex flex-col border-t border-line">
          {c.roles.items.map((role) => (
            <RevealItem key={role.title}>
              <LocaleLink
                href="/reach-out"
                locale={locale}
                className="group flex flex-col gap-2 border-b border-line py-6 transition-colors hover:bg-surface/70 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-baseline gap-4">
                  <span className="label">{role.area}</span>
                  <h3 className="text-2xl text-content">{role.title}</h3>
                </div>
                <div className="flex items-center gap-4">
                  <p className="max-w-sm text-sm text-muted">{role.body}</p>
                  <span
                    aria-hidden
                    className="hidden shrink-0 text-brass transition-transform group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1 sm:inline-block"
                  >
                    →
                  </span>
                </div>
              </LocaleLink>
            </RevealItem>
          ))}
        </RevealGroup>
        <Reveal className="mt-8">
          <p className="text-sm text-muted">{c.roles.note}</p>
        </Reveal>
      </RuledSection>

      <CtaBand
        locale={locale}
        head={c.hero.eyebrow}
        title={c.cta.title}
        body={c.cta.body}
        primary={c.cta.primary}
        primaryHref="/reach-out"
      />
    </>
  );
}
