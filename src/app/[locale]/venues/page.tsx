import type { Metadata } from "next";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import Masthead from "@/components/layout/Masthead";
import RuledSection from "@/components/layout/RuledSection";
import VenueRail from "@/components/venues/VenueRail";
import LocaleLink from "@/components/ui/LocaleLink";
import { localeDigits } from "@/lib/utils";
import { VENUES, venueAreas, areaAnchor } from "@/data/venues";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale = (isLocale(params.locale) ? params.locale : "en") as Locale;
  const dict = getDictionary(locale);
  return buildMetadata({
    locale,
    path: "/venues",
    title: dict.venues.meta.title,
    description: dict.venues.meta.description,
  });
}

export default function VenuesPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = (isLocale(params.locale) ? params.locale : "en") as Locale;
  const dict = getDictionary(locale);
  const v = dict.venues;
  const areas = venueAreas(locale);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: "Cue", path: "" },
          { name: v.hero.kicker, path: "/venues" },
        ])}
      />
      <Masthead
        kicker={v.hero.kicker}
        folio={v.hero.folio}
        title={v.hero.title}
        dek={v.hero.dek}
      >
        {/* Neighborhood index — jumps within the roster */}
        {areas.map((a) => (
          <a key={a.key} href={`#${a.key}`} className="link-underline text-sm">
            {a.label}
            <span className="folio">({localeDigits(a.count, locale)})</span>
          </a>
        ))}
      </Masthead>

      <RuledSection
        head={v.rail.head}
        folio={`${localeDigits(VENUES.length, locale)} ${dict.home.guide.folioVenues} · ${localeDigits(areas.length, locale)} ${dict.home.guide.folioAreas}`}
      >
        <div className="space-y-12">
          {areas.map((a, i) => {
            const inArea = VENUES.filter(
              (venue) => areaAnchor(venue) === a.key
            );
            return (
              <div key={a.key} id={a.key} className="scroll-mt-24">
                <div className="flex items-baseline justify-between gap-4 pb-3">
                  <h2 className="text-2xl sm:text-3xl">{a.label}</h2>
                  <span className="folio">{localeDigits(a.count, locale)}</span>
                </div>
                <VenueRail
                  locale={locale}
                  venues={inArea}
                  labels={{ columns: v.rail.columns, priceBand: v.rail.priceBand }}
                  showHeader={i === 0}
                />
              </div>
            );
          })}
        </div>

        {/* Roster status + the one bookable action */}
        <div className="mt-14 flex flex-col gap-5 border-t-2 border-content pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl text-[15px] leading-relaxed text-muted">
            {v.detail.statusBody}
          </p>
          <LocaleLink
            href="/reach-out"
            locale={locale}
            className="btn btn-book shrink-0"
          >
            {v.detail.cta}
          </LocaleLink>
        </div>
      </RuledSection>
    </>
  );
}
