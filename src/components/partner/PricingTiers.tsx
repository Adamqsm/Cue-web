import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import SectionHeading from "@/components/ui/SectionHeading";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import LocaleLink from "@/components/ui/LocaleLink";
import { CueMark } from "@/components/BrandMark";
import { cn } from "@/lib/utils";

/** Three-tier plan comparison — side-by-side on desktop, stacked cards on mobile. */
export default function PricingTiers({
  locale,
  pricing,
}: {
  locale: Locale;
  pricing: Dictionary["partner"]["pricing"];
}) {
  return (
    <section className="container-pad py-20 sm:py-28" id="pricing">
      <SectionHeading
        kicker={pricing.kicker}
        title={pricing.title}
        body={pricing.body}
        className="mb-14"
      />
      <RevealGroup className="grid gap-6 lg:grid-cols-3">
        {pricing.tiers.map((tier) => {
          const recommended = tier.id === "core";
          return (
            <RevealItem
              key={tier.id}
              className={cn(
                "card relative flex flex-col p-7 transition-colors sm:p-8",
                recommended
                  ? "border-green shadow-lift ring-1 ring-green"
                  : "hover:border-green/30"
              )}
            >
              <span
                className={cn(
                  "inline-flex w-fit items-center gap-2 rounded-full border px-3.5 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.18em]",
                  recommended
                    ? "border-green/40 bg-green text-bone"
                    : "border-line bg-surface2/70 text-muted"
                )}
              >
                {tier.tag}
              </span>
              <h3 className="mt-5 text-2xl font-semibold text-content">{tier.name}</h3>
              <div className="mt-4 flex items-baseline gap-2">
                <span
                  className={cn(
                    "font-display text-4xl font-semibold tracking-tight sm:text-5xl",
                    recommended ? "text-green dark:text-green-300" : "text-content"
                  )}
                >
                  {tier.price}
                </span>
              </div>
              <p className="mt-1 text-sm text-content/55">{tier.priceNote}</p>
              <ul className="mt-7 flex flex-1 flex-col gap-3 border-t border-line pt-6">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-content/75">
                    <CueMark className="mt-1 h-4 w-4 shrink-0 text-green dark:text-green-300" />
                    {feature}
                  </li>
                ))}
              </ul>
              <LocaleLink
                href="/partner/apply"
                locale={locale}
                className={cn(
                  "btn mt-8 w-full",
                  recommended ? "btn-primary" : "btn-outline"
                )}
              >
                {pricing.cta}
              </LocaleLink>
            </RevealItem>
          );
        })}
      </RevealGroup>
    </section>
  );
}
