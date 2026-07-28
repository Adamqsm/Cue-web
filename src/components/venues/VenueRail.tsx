import Image from "next/image";
import type { Locale } from "@/i18n/config";
import type { Venue } from "@/data/venues";
import { cuisineLabel } from "@/data/refData";
import { tpl } from "@/lib/utils";
import LocaleLink from "@/components/ui/LocaleLink";
import PriceBand from "@/components/ui/PriceBand";

export type RailLabels = {
  columns: { venue: string; area: string; cuisine: string; price: string };
  priceBand: string;
};

/**
 * The listings rail — an index table, not a card grid. Every row is a real
 * venue linking to its guide page: duotone thumb, name in the display face,
 * neighborhood, kitchen, price band, and nothing else. On mobile the meta
 * collapses into one line under the name.
 */
export default function VenueRail({
  locale,
  venues,
  labels,
  showHeader = true,
}: {
  locale: Locale;
  venues: Venue[];
  labels: RailLabels;
  showHeader?: boolean;
}) {
  const cols =
    "sm:grid-cols-[4.5rem_minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,1fr)_5.5rem_2rem]";
  return (
    <div>
      {showHeader && (
        <div
          className={`hidden border-b border-content pb-2 sm:grid ${cols} sm:gap-4`}
          aria-hidden
        >
          <span />
          <span className="folio">{labels.columns.venue}</span>
          <span className="folio">{labels.columns.area}</span>
          <span className="folio">{labels.columns.cuisine}</span>
          <span className="folio">{labels.columns.price}</span>
          <span />
        </div>
      )}
      <ul>
        {venues.map((v) => {
          const cuisines = v.cuisineIds
            .map((c) => cuisineLabel(c, locale))
            .join(" · ");
          return (
            <li key={v.id} className="border-b border-line">
              <LocaleLink
                href={`/venues/${v.id}`}
                locale={locale}
                className={`group grid grid-cols-[3.5rem_minmax(0,1fr)_auto] items-center gap-3 py-4 sm:grid ${cols} sm:gap-4`}
              >
                <span className="duo relative block aspect-square overflow-hidden bg-surface2">
                  <Image
                    src={v.photo}
                    alt=""
                    fill
                    sizes="72px"
                    className="object-cover"
                  />
                </span>
                <span className="min-w-0">
                  <span className="display block truncate text-lg leading-snug text-content sm:text-xl">
                    {v.name[locale]}
                  </span>
                  <span className="mt-0.5 block truncate text-[13px] text-muted sm:hidden">
                    {v.area[locale]} · {cuisines}
                  </span>
                </span>
                <span className="hidden truncate text-[15px] text-muted sm:block">
                  {v.area[locale]}
                </span>
                <span className="hidden truncate text-[15px] text-muted sm:block">
                  {cuisines}
                </span>
                <PriceBand
                  n={v.priceRange}
                  label={tpl(labels.priceBand, v.priceRange)}
                  className="justify-self-start text-content"
                />
                <span
                  className="hidden text-muted transition-colors group-hover:text-content sm:inline-flex"
                  aria-hidden
                >
                  <svg
                    viewBox="0 0 16 16"
                    className="h-4 w-4 rtl:-scale-x-100"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 8h10M9.5 3.5 14 8l-4.5 4.5" />
                  </svg>
                </span>
              </LocaleLink>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
