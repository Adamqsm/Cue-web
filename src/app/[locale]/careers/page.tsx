import type { Metadata } from "next";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import PageHero from "@/components/sections/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal, { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import LocaleLink from "@/components/ui/LocaleLink";
import CtaBand from "@/components/sections/CtaBand";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale = isLocale(params.locale) ? params.locale : "en";
  const dict = getDictionary(locale);
  return { title: dict.careers.meta.title, description: dict.careers.meta.description };
}

export default function CareersPage({ params }: { params: { locale: string } }) {
  const locale = (isLocale(params.locale) ? params.locale : "en") as Locale;
  const dict = getDictionary(locale);
  const c = dict.careers;

  return (
    <>
      <PageHero eyebrow={c.hero.eyebrow} title={c.hero.title} subtitle={c.hero.subtitle}>
        <LocaleLink href="/reach-out" locale={locale} className="btn btn-primary text-base">
          {c.hero.primary}
        </LocaleLink>
      </PageHero>

      {/* Why join */}
      <section className="container-pad py-20 sm:py-28">
        <SectionHeading kicker={c.why.kicker} title={c.why.title} body={c.why.body} className="mb-14" />
        <RevealGroup className="grid gap-6 md:grid-cols-3">
          {c.why.items.map((item) => (
            <RevealItem
              key={item.title}
              className="rounded-4xl border border-line bg-surface2/50 p-7"
            >
              <h3 className="text-xl font-semibold text-content">{item.title}</h3>
              <p className="mt-2 text-content/70">{item.body}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* Roles — dark */}
      <section className="bg-ink text-bone">
        <div className="container-pad py-20 sm:py-28">
          <SectionHeading kicker={c.roles.kicker} title={c.roles.title} tone="paper" className="mb-12" />
          <RevealGroup className="flex flex-col">
            {c.roles.items.map((role) => (
              <RevealItem key={role.title}>
                <LocaleLink
                  href="/reach-out"
                  locale={locale}
                  className="group flex flex-col gap-2 border-t border-bone/12 py-6 transition-colors hover:bg-bone/[0.03] sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-baseline gap-4">
                    <span className="text-xs font-semibold uppercase tracking-[0.15em] text-green-300">
                      {role.area}
                    </span>
                    <h3 className="text-2xl font-semibold text-bone">{role.title}</h3>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="max-w-sm text-sm text-bone/60">{role.body}</p>
                    <span className="hidden shrink-0 text-green-300 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 sm:inline">
                      →
                    </span>
                  </div>
                </LocaleLink>
              </RevealItem>
            ))}
          </RevealGroup>
          <Reveal className="mt-8">
            <p className="text-sm text-bone/55">{c.roles.note}</p>
          </Reveal>
        </div>
      </section>

      <CtaBand
        locale={locale}
        title={c.cta.title}
        body={c.cta.body}
        primary={c.cta.primary}
        primaryHref="/reach-out"
      />
    </>
  );
}
