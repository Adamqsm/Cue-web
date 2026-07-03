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
    <section className="border-t border-line bg-surface/50">
      <div className="container-pad grid gap-12 py-20 sm:py-28 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div>
          <SectionIntro label={f.label} title={f.title} />
          <Reveal delay={1} className="mt-6">
            <LocaleLink href="/faq" locale={locale} className="link-underline">
              {f.seeAll} →
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
