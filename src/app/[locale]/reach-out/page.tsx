import type { Metadata } from "next";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import Reveal from "@/components/ui/Reveal";
import LeadForm from "@/components/sections/LeadForm";
import { CueMark } from "@/components/BrandMark";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale = isLocale(params.locale) ? params.locale : "en";
  const dict = getDictionary(locale);
  return { title: dict.reach.meta.title, description: dict.reach.meta.description };
}

export default function ReachOutPage({ params }: { params: { locale: string } }) {
  const locale = (isLocale(params.locale) ? params.locale : "en") as Locale;
  const dict = getDictionary(locale);
  const r = dict.reach;

  return (
    <section className="relative overflow-hidden pb-24 pt-28 sm:pt-36">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <CueMark className="absolute -start-24 top-20 h-[26rem] w-[26rem] text-content/[0.06] animate-spin-slow" />
      </div>
      <div className="container-pad grid items-start gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
        <div className="lg:sticky lg:top-28">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-green/30 bg-green/5 px-4 py-1.5 text-xs font-semibold text-green dark:text-green-300">
              <span className="h-2 w-2 rounded-full bg-green" />
              {r.hero.status}
            </span>
          </Reveal>
          <Reveal delay={1}>
            <h1 className="mt-6 text-5xl font-semibold leading-[1.0] tracking-tight sm:text-6xl lg:text-7xl">
              {r.hero.title}
            </h1>
          </Reveal>
          <Reveal delay={2}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-content/70">
              {r.hero.subtitle}
            </p>
          </Reveal>
          <Reveal delay={3}>
            <div className="mt-8 flex items-center gap-3 text-sm text-content/55">
              <CueMark className="h-6 w-6 text-green dark:text-green-300" />
              <span>{dict.brand.tagline}</span>
            </div>
          </Reveal>
        </div>

        <Reveal delay={1}>
          <LeadForm form={r.form} locale={locale} />
        </Reveal>
      </div>
    </section>
  );
}
