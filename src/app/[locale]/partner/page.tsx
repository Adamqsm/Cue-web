import type { Metadata } from "next";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import PageHero from "@/components/sections/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal, { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import LocaleLink from "@/components/ui/LocaleLink";
import PhoneFrame from "@/components/ui/PhoneFrame";
import CtaBand from "@/components/sections/CtaBand";
import { CueMark } from "@/components/BrandMark";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale = isLocale(params.locale) ? params.locale : "en";
  const dict = getDictionary(locale);
  return { title: dict.partner.meta.title, description: dict.partner.meta.description };
}

export default function PartnerPage({ params }: { params: { locale: string } }) {
  const locale = (isLocale(params.locale) ? params.locale : "en") as Locale;
  const dict = getDictionary(locale);
  const p = dict.partner;

  return (
    <>
      <PageHero eyebrow={p.hero.eyebrow} title={p.hero.title} subtitle={p.hero.subtitle}>
        <LocaleLink href="/reach-out" locale={locale} className="btn btn-primary text-base">
          {p.hero.primary}
        </LocaleLink>
        <LocaleLink href="/how-it-works" locale={locale} className="btn btn-outline text-base">
          {p.hero.secondary}
        </LocaleLink>
      </PageHero>

      {/* Why */}
      <section className="container-pad py-20 sm:py-28">
        <SectionHeading kicker={p.why.kicker} title={p.why.title} className="mb-14" />
        <RevealGroup className="grid gap-6 sm:grid-cols-2">
          {p.why.items.map((item, i) => (
            <RevealItem
              key={item.title}
              className="group relative overflow-hidden rounded-4xl border border-ink/10 bg-paper-soft/50 p-7 transition-colors hover:border-clay/30"
            >
              <div className="flex items-start gap-4">
                <span className="font-display text-3xl font-semibold text-clay/80">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-xl font-semibold text-ink">{item.title}</h3>
                  <p className="mt-2 text-ink/70">{item.body}</p>
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* Built for — dark split */}
      <section className="bg-ink text-paper">
        <div className="container-pad grid items-center gap-12 py-20 sm:py-28 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <SectionHeading
              kicker={p.builtFor.kicker}
              title={p.builtFor.title}
              body={p.builtFor.body}
              tone="paper"
            />
            <RevealGroup className="mt-8 flex flex-col gap-3">
              {p.builtFor.items.map((item) => (
                <RevealItem
                  key={item}
                  className="flex items-center gap-3 border-b border-paper/12 pb-3 text-lg text-paper/85"
                >
                  <CueMark className="h-5 w-5 shrink-0 text-clay-300" />
                  {item}
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
          <Reveal delay={1} className="flex justify-center">
            <div className="animate-floaty">
              <PhoneFrame
                src="/app/dash-today.png"
                alt="Cue partner dashboard"
                width={280}
                className="rotate-3"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Steps */}
      <section className="container-pad py-20 sm:py-28">
        <SectionHeading kicker={p.steps.kicker} title={p.steps.title} className="mb-14" />
        <RevealGroup className="grid gap-6 md:grid-cols-3">
          {p.steps.items.map((step) => (
            <RevealItem
              key={step.n}
              className="relative rounded-4xl border border-ink/10 bg-paper p-7"
            >
              <span className="font-display text-5xl font-semibold text-clay/25">
                {step.n}
              </span>
              <h3 className="mt-3 text-xl font-semibold text-ink">{step.title}</h3>
              <p className="mt-2 text-ink/70">{step.body}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* Approach */}
      <section className="container-pad pb-20 sm:pb-28">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] border border-ink/10 bg-paper-soft/60 p-8 sm:p-14">
            <CueMark className="pointer-events-none absolute -end-10 -top-10 h-52 w-52 text-clay/10 animate-spin-slow" />
            <div className="relative max-w-3xl">
              <span className="eyebrow">{p.approach.kicker}</span>
              <h2 className="mt-4 text-3xl font-semibold leading-tight text-ink sm:text-4xl">
                {p.approach.title}
              </h2>
              <p className="mt-4 text-lg text-ink/70">{p.approach.body}</p>
            </div>
          </div>
        </Reveal>
      </section>

      <CtaBand
        locale={locale}
        title={p.cta.title}
        body={p.cta.body}
        primary={p.cta.primary}
        primaryHref="/reach-out"
        secondary={p.cta.secondary}
        secondaryHref="/reach-out"
      />
    </>
  );
}
