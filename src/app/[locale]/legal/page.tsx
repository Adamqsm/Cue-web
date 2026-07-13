import type { Metadata } from "next";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { buildMetadata } from "@/lib/seo";
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
  return buildMetadata({
    locale,
    path: "/legal",
    title: dict.legal.meta.title,
    description: dict.legal.meta.description,
  });
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
                className="card card-hover group relative flex h-full flex-col justify-between overflow-hidden p-7"
              >
                <CueMark className="absolute -end-6 -top-6 h-20 w-20 text-content/[0.04]" />
                <div className="relative">
                  <h2 className="text-xl text-content">{d.title}</h2>
                  <p className="mt-2 text-sm text-muted">{d.body}</p>
                </div>
                <span className="relative mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-deep">
                  {dict.common.readMore}
                  <span
                    aria-hidden
                    className="inline-block transition-transform group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1"
                  >
                    →
                  </span>
                </span>
              </LocaleLink>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>
    </>
  );
}
