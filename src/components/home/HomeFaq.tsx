import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import SectionIntro from "./SectionIntro";
import FaqAccordion from "@/components/sections/FaqAccordion";
import LocaleLink from "@/components/ui/LocaleLink";
import Reveal from "@/components/ui/Reveal";

export default function HomeFaq({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const f = dict.home.faqHome;
  const items = dict.faq.items.slice(0, 6);
  return (
    <section className="border-y border-line bg-surface2">
      <div className="container-pad grid gap-12 py-20 sm:py-28 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div>
          <SectionIntro label={f.label} title={f.title} />
          <Reveal delay={1} className="mt-8">
            <LocaleLink href="/faq" locale={locale} className="inline-flex min-h-[44px] items-center">
              <span className="link-underline">
                {f.seeAll}
                <span className="nudge" aria-hidden="true">
                  <svg viewBox="0 0 16 16" className="h-4 w-4 rtl:-scale-x-100" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 8h10M9.5 3.5 14 8l-4.5 4.5" />
                  </svg>
                </span>
              </span>
            </LocaleLink>
          </Reveal>
        </div>
        <Reveal delay={1}>
          <FaqAccordion items={items} />
        </Reveal>
      </div>
    </section>
  );
}
