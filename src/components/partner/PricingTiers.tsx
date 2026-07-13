import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import SectionHeading from "@/components/ui/SectionHeading";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import LocaleLink from "@/components/ui/LocaleLink";
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
                "card flex flex-col p-7 sm:p-8",
                recommended ? "border-accent shadow-card" : "card-hover"
              )}
            >
              {/* !important so the override beats .dark .label's specificity
                  (same pattern as Traction.tsx). */}
              <span className={cn("label", !recommended && "!text-muted")}>
                {tier.tag}
              </span>
              <h3 className="mt-5 text-2xl font-semibold tracking-[-0.015em] text-content">
                {tier.name}
              </h3>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-4xl font-[650] tabular-nums tracking-[-0.025em] rtl:tracking-normal text-content sm:text-5xl">
                  {tier.price}
                </span>
              </div>
              <p className="mt-1 text-sm tabular-nums text-muted">{tier.priceNote}</p>
              <ul className="mt-7 flex flex-1 flex-col divide-y divide-line border-t border-line">
                {tier.features.map((feature) => (
                  <li key={feature} className="py-3 text-[15px] leading-relaxed text-content/80">
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
