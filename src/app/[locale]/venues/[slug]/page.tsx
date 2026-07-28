import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { SITE_URL, tpl } from "@/lib/utils";
import JsonLd from "@/components/JsonLd";
import Masthead from "@/components/layout/Masthead";
import RuledSection from "@/components/layout/RuledSection";
import DuoImage from "@/components/ui/DuoImage";
import PriceBand from "@/components/ui/PriceBand";
import LocaleLink from "@/components/ui/LocaleLink";
import { VENUES, getVenue } from "@/data/venues";
import { amenityLabel, cuisineLabel } from "@/data/refData";

export function generateStaticParams() {
  return VENUES.map((v) => ({ slug: v.id }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const locale = (isLocale(params.locale) ? params.locale : "en") as Locale;
  const venue = getVenue(params.slug);
  if (!venue) return {};
  return buildMetadata({
    locale,
    path: `/venues/${venue.id}`,
    title: `${venue.name[locale]} — ${venue.area[locale]} · Cue`,
    description: venue.description[locale],
  });
}

/** Schema.org Restaurant entry for a guide page. */
function venueJsonLd(locale: Locale, venue: NonNullable<ReturnType<typeof getVenue>>) {
  return {
    "@context": "https://schema.org",
    "@type": venue.type === "cafe" ? "CafeOrCoffeeShop" : "Restaurant",
    "@id": `${SITE_URL}/${locale}/venues/${venue.id}`,
    name: venue.name[locale],
    description: venue.description[locale],
    image: `${SITE_URL}${venue.photo}`,
    servesCuisine: venue.cuisineIds.map((c) => cuisineLabel(c, "en")),
    priceRange: "$".repeat(venue.priceRange),
    address: {
      "@type": "PostalAddress",
      addressLocality: `${venue.area[locale]}, ${venue.city}`,
      addressCountry: "JO",
    },
  };
}

export default function VenuePage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const locale = (isLocale(params.locale) ? params.locale : "en") as Locale;
  const dict = getDictionary(locale);
  const d = dict.venues.detail;
  const venue = getVenue(params.slug);
  if (!venue) notFound();

  const cuisines = venue.cuisineIds
    .map((c) => cuisineLabel(c, locale))
    .join(" · ");
  const amenities = venue.amenityKeys
    .map((a) => amenityLabel(a, locale))
    .join(" · ");
  const typeLabel = d.typeLabels[venue.type];

  const facts: { term: string; value: React.ReactNode }[] = [
    { term: d.facts.area, value: venue.area[locale] },
    { term: d.facts.cuisine, value: cuisines },
    { term: d.facts.type, value: typeLabel },
    {
      term: d.facts.price,
      value: (
        <PriceBand
          n={venue.priceRange}
          label={tpl(dict.venues.rail.priceBand, venue.priceRange)}
          className="text-content"
        />
      ),
    },
    { term: d.facts.party, value: tpl(d.facts.partyValue, venue.maxPartySize) },
    {
      term: d.facts.cancel,
      value: tpl(d.facts.cancelValue, venue.cancellationWindowHours),
    },
  ];

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: "Cue", path: "" },
          { name: dict.venues.hero.kicker, path: "/venues" },
          { name: venue.name[locale], path: `/venues/${venue.id}` },
        ])}
      />
      <JsonLd data={venueJsonLd(locale, venue)} />

      <Masthead
        kicker={d.kicker}
        folio={`${venue.area[locale]} · ${venue.city}`}
        title={venue.name[locale]}
        dek={venue.description[locale]}
      />

      <RuledSection head={d.factsHead} folio={typeLabel}>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <DuoImage
            className="lg:col-span-7"
            src={venue.photo}
            alt={venue.name[locale]}
            sizes="(min-width: 1024px) 56vw, 100vw"
            aspect="aspect-[16/10]"
            priority
            caption={venue.description[locale]}
            folio={venue.area[locale]}
          />

          <div className="lg:col-span-5">
            {/* Tariff rows */}
            <dl>
              {facts.map((f) => (
                <div
                  key={f.term}
                  className="flex items-baseline justify-between gap-6 border-b border-line py-3"
                >
                  <dt className="label">{f.term}</dt>
                  <dd className="text-[15px] font-medium text-content">
                    {f.value}
                  </dd>
                </div>
              ))}
            </dl>

            <p className="running-head mt-8">{d.amenitiesHead}</p>
            <p className="mt-2 text-[15px] leading-relaxed text-muted">
              {amenities}
            </p>

            {/* Booking status — honest pre-launch state + the bookable action */}
            <div className="mt-8 border-t-2 border-content pt-4">
              <p className="running-head">{d.statusHead}</p>
              <p className="mt-2 max-w-md text-[15px] leading-relaxed text-muted">
                {d.statusBody}
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-4">
                <LocaleLink
                  href="/reach-out"
                  locale={locale}
                  className="btn btn-book"
                >
                  {d.cta}
                </LocaleLink>
                <LocaleLink
                  href="/venues"
                  locale={locale}
                  className="link-underline text-sm"
                >
                  {d.back}
                </LocaleLink>
              </div>
            </div>
          </div>
        </div>
      </RuledSection>
    </>
  );
}
