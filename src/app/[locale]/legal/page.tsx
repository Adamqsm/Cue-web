import type { Metadata } from "next";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import PageHero from "@/components/sections/PageHero";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import LocaleLink from "@/components/ui/LocaleLink";
import { CueMark } from "@/components/BrandMark";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale = isLocale(params.locale) ? params.locale : "en";
  const dict = getDictionary(locale);
  return { title: dict.legal.meta.title, description: dict.legal.meta.description };
}

export default function LegalIndexPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = (isLocale(params.locale) ? params.locale : "en") as Locale;
  const dict = getDictionary(locale);
  const l = dict.legal.index;

  return (
    <>
      <PageHero eyebrow={l.eyebrow} title={l.title} subtitle={l.subtitle} />
      <section className="container-pad py-14 sm:py-20">
        <span className="eyebrow mb-6 inline-flex">{l.docsLabel}</span>
        <RevealGroup className="grid gap-5 sm:grid-cols-2">
          {l.docs.map((d) => (
            <RevealItem key={d.href}>
              <LocaleLink
                href={d.href}
                locale={locale}
                className="group relative flex h-full flex-col justify-between overflow-hidden rounded-4xl border border-ink/10 bg-paper-soft/50 p-7 transition-all hover:-translate-y-1 hover:border-clay/30"
              >
                <CueMark className="absolute -end-6 -top-6 h-20 w-20 text-ink/[0.04] transition-transform duration-500 group-hover:rotate-45" />
                <div className="relative">
                  <h2 className="text-xl font-semibold text-ink">{d.title}</h2>
                  <p className="mt-2 text-sm text-ink/65">{d.body}</p>
                </div>
                <span className="relative mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-clay">
                  {dict.common.readMore}
                  <span className="transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1">→</span>
                </span>
              </LocaleLink>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>
    </>
  );
}
