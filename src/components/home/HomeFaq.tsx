import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import EditorialSection from "./EditorialSection";
import FaqAccordion from "@/components/sections/FaqAccordion";
import LocaleLink from "@/components/ui/LocaleLink";

export default function HomeFaq({
  locale,
  dict,
  num = "09",
}: {
  locale: Locale;
  dict: Dictionary;
  num?: string;
}) {
  const f = dict.home.faqHome;
  const items = dict.faq.items.slice(0, 6);
  return (
    <EditorialSection num={num} label={f.label} band="surface2">
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div>
          <h2 className="text-[clamp(1.9rem,3.4vw,3rem)] leading-[1.08] text-content">
            {f.title}
          </h2>
          <LocaleLink
            href="/faq"
            locale={locale}
            className="mt-8 inline-flex min-h-[44px] items-center"
          >
            <span className="link-underline">
              {f.seeAll}
              <span className="nudge" aria-hidden="true">
                <svg viewBox="0 0 16 16" className="h-4 w-4 rtl:-scale-x-100" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 8h10M9.5 3.5 14 8l-4.5 4.5" />
                </svg>
              </span>
            </span>
          </LocaleLink>
        </div>
        <FaqAccordion items={items} />
      </div>
    </EditorialSection>
  );
}
