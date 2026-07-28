import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import LocaleLink from "@/components/ui/LocaleLink";
import RuledSection from "@/components/layout/RuledSection";
import { cn } from "@/lib/utils";

/**
 * Plans as a printed tariff table — three columns divided by vertical
 * hairlines under one heavy rule, prices in serif tabular numerals, each
 * tier's tag set as a folio. One apply action per column, as a text link;
 * no cards, no highlight box.
 */
export default function PricingTiers({
  locale,
  pricing,
}: {
  locale: Locale;
  pricing: Dictionary["partner"]["pricing"];
}) {
  return (
    <RuledSection head={pricing.kicker} id="pricing">
      <div className="max-w-2xl">
        <h2 className="text-3xl sm:text-4xl">{pricing.title}</h2>
        <p className="mt-4 text-lg leading-relaxed text-muted">{pricing.body}</p>
      </div>

      <div className="mt-10 border-t-2 border-content lg:grid lg:grid-cols-3">
        {pricing.tiers.map((tier, i) => {
          const recommended = tier.id === "core";
          return (
            <div
              key={tier.id}
              className={cn(
                "flex flex-col py-7",
                i > 0 && "border-t border-line lg:border-t-0 lg:border-s lg:border-line",
                "lg:px-7",
                i === 0 && "lg:ps-0",
                i === pricing.tiers.length - 1 && "lg:pe-0"
              )}
            >
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="text-xl text-content sm:text-2xl">{tier.name}</h3>
                <span className={cn("folio", recommended && "!text-brass")}>
                  {tier.tag}
                </span>
              </div>
              <div className="display mt-4 text-4xl tabular-nums text-content sm:text-5xl">
                {tier.price}
              </div>
              <p className="mt-1 text-sm tabular-nums text-muted">{tier.priceNote}</p>
              <ul className="mt-6 flex flex-1 flex-col border-t border-line">
                {tier.features.map((feature) => (
                  <li
                    key={feature}
                    className="border-b border-line py-2.5 text-[15px] leading-relaxed text-content/80"
                  >
                    {feature}
                  </li>
                ))}
              </ul>
              <LocaleLink
                href="/partner/apply"
                locale={locale}
                className="link-underline mt-6 text-sm"
              >
                {pricing.cta}
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
          );
        })}
      </div>
    </RuledSection>
  );
}
