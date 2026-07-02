import type { Metadata } from "next";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { SITE_URL } from "@/lib/utils";
import HomeHero from "@/components/sections/HomeHero";
import Marquee from "@/components/ui/Marquee";
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
  return {
    title: dict.home.meta.title,
    description: dict.home.meta.description,
  };
}

export default function HomePage({ params }: { params: { locale: string } }) {
  const locale = (isLocale(params.locale) ? params.locale : "en") as Locale;
  const dict = getDictionary(locale);
  const h = dict.home;

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Cue",
    legalName: "Cue Technologies",
    url: `${SITE_URL}/${locale}`,
    logo: `${SITE_URL}/favicon.svg`,
    slogan: dict.brand.tagline,
    description: dict.home.meta.description,
    parentOrganization: { "@type": "Organization", name: "Qasem Capital & Enterprise" },
    areaServed: { "@type": "City", name: "Amman", addressCountry: "JO" },
    sameAs: dict.footer.social.map((s) => s.href),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />

      <HomeHero locale={locale} dict={dict} />

      {/* Marquee strip */}
      <div className="bg-ink">
        <Marquee items={h.marquee} rtl={locale === "ar"} />
      </div>

      {/* Intro */}
      <section className="container-pad py-20 sm:py-28">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <SectionHeading kicker={h.intro.kicker} title={h.intro.title} />
          <Reveal delay={1} className="flex items-center">
            <p className="text-xl leading-relaxed text-ink/75 sm:text-2xl">
              {h.intro.body}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Three paths */}
      <section className="container-pad pb-20 sm:pb-28">
        <SectionHeading
          kicker={h.paths.kicker}
          title={h.paths.title}
          align="center"
          className="mb-12"
        />
        <RevealGroup className="grid gap-5 md:grid-cols-3">
          {h.paths.items.map((item) => (
            <RevealItem key={item.title}>
              <LocaleLink
                href={item.href}
                locale={locale}
                className="group relative flex h-full flex-col justify-between overflow-hidden rounded-4xl border border-ink/10 bg-paper-soft/70 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-clay/40 hover:shadow-[0_24px_50px_-30px_rgba(23,19,15,0.5)]"
              >
                <CueMark className="absolute -end-6 -top-6 h-24 w-24 text-ink/[0.04] transition-transform duration-500 group-hover:rotate-45" />
                <div className="relative">
                  <span className="eyebrow">{item.tag}</span>
                  <h3 className="mt-4 text-2xl font-semibold text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-ink/70">{item.body}</p>
                </div>
                <span className="relative mt-8 inline-flex items-center gap-2 font-semibold text-clay">
                  {item.cta}
                  <span className="transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
                    →
                  </span>
                </span>
              </LocaleLink>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* Value — dark section */}
      <section className="bg-ink text-paper">
        <div className="container-pad py-20 sm:py-28">
          <SectionHeading
            kicker={h.value.kicker}
            title={h.value.title}
            tone="paper"
            className="mb-14"
          />
          <RevealGroup className="grid gap-x-8 gap-y-10 sm:grid-cols-2">
            {h.value.items.map((item, i) => (
              <RevealItem
                key={item.title}
                className="flex gap-5 border-t border-paper/15 pt-6"
              >
                <span className="font-display text-2xl text-clay-300">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-xl font-semibold text-paper">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-paper/65">{item.body}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* App showcase */}
      <section className="container-pad py-20 sm:py-28">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            kicker={h.showcase.kicker}
            title={h.showcase.title}
            body={h.showcase.body}
          />
          <Reveal delay={2} className="shrink-0">
            <LocaleLink
              href="/how-it-works"
              locale={locale}
              className="link-underline"
            >
              {h.showcase.cta} →
            </LocaleLink>
          </Reveal>
        </div>

        <RevealGroup className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {h.showcase.slides.map((slide) => (
            <RevealItem
              key={slide.title}
              className="flex flex-col items-center text-center"
            >
              <PhoneFrame src={slide.img} alt={slide.title} width={230} />
              <h3 className="mt-6 text-xl font-semibold text-ink">
                {slide.title}
              </h3>
              <p className="mt-2 max-w-xs text-sm text-ink/65">{slide.body}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* Stats */}
      <section className="container-pad pb-20 sm:pb-28">
        <Reveal>
          <div className="rounded-[2.5rem] border border-ink/10 bg-paper-soft/60 p-8 sm:p-12">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div className="max-w-lg">
                <span className="eyebrow">{h.stats.kicker}</span>
                <h2 className="mt-3 text-3xl font-semibold text-ink sm:text-4xl">
                  {h.stats.title}
                </h2>
              </div>
              <p className="text-sm text-ink/55">{h.stats.note}</p>
            </div>
            <div className="mt-10 grid grid-cols-2 gap-6 lg:grid-cols-4">
              {h.stats.items.map((s) => (
                <div
                  key={s.label}
                  className="border-t-2 border-clay/60 pt-4"
                >
                  <div className="font-display text-4xl font-semibold text-ink sm:text-5xl">
                    {s.value}
                  </div>
                  <div className="mt-1 text-sm text-ink/60">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      <CtaBand
        locale={locale}
        title={h.ctaBand.title}
        body={h.ctaBand.body}
        primary={h.ctaBand.primary}
        primaryHref="/partner"
        secondary={h.ctaBand.secondary}
        secondaryHref="/reach-out"
      />
    </>
  );
}
