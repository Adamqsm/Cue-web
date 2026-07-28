import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import RuledSection from "@/components/layout/RuledSection";
import VenueRail from "@/components/venues/VenueRail";
import LocaleLink from "@/components/ui/LocaleLink";
import { localeDigits } from "@/lib/utils";
import { VENUES, venueAreas } from "@/data/venues";

/**
 * The guide, on the front page — the real launch roster as an index table,
 * every row clickable through to its venue page. This is the section the
 * site exists for: something to actually browse.
 */
export default function GuideRail({
  locale,
  g,
}: {
  locale: Locale;
  g: Dictionary["home"]["guide"];
}) {
  const areas = venueAreas(locale);
  return (
    <RuledSection
      head={g.head}
      folio={`${localeDigits(VENUES.length, locale)} ${g.folioVenues} · ${localeDigits(areas.length, locale)} ${g.folioAreas}`}
      id="guide"
    >
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-4">
          <h2 className="text-3xl sm:text-4xl">{g.title}</h2>
          <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-muted sm:text-base">
            {g.intro}
          </p>
          <LocaleLink
            href="/venues"
            locale={locale}
            className="link-underline mt-6 text-sm"
          >
            {g.browseAll}
            <span className="nudge inline-flex" aria-hidden="true">
              <svg
                viewBox="0 0 16 16"
                className="h-3.5 w-3.5 rtl:-scale-x-100"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 8h10M9.5 3.5 14 8l-4.5 4.5" />
              </svg>
            </span>
          </LocaleLink>
        </div>
        <div className="lg:col-span-8">
          <VenueRail
            locale={locale}
            venues={VENUES}
            labels={{ columns: g.columns, priceBand: g.priceBand }}
          />
        </div>
      </div>
    </RuledSection>
  );
}
