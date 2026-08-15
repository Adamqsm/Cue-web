import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import LocaleLink from "@/components/ui/LocaleLink";
import EditorialSection from "@/components/home/EditorialSection";
import { cn } from "@/lib/utils";
import { withUtm } from "@/lib/utm";

/** Three-tier plan comparison — side-by-side on desktop, stacked cards on mobile. */
export default function PricingTiers({
  locale,
  pricing,
  num = "03",
}: {
  locale: Locale;
  pricing: Dictionary["partner"]["pricing"];
  num?: string;
}) {
  return (
    <EditorialSection num={num} label={pricing.kicker} band="bg" id="pricing">
      <div className="max-w-2xl">
        <h2 className="text-[clamp(1.9rem,3.4vw,3rem)] leading-[1.08] text-content">
          {pricing.title}
        </h2>
        <p className="mt-5 text-lg leading-[1.6] text-muted">{pricing.body}</p>
      </div>
      <RevealGroup className="mt-12 grid gap-6 lg:grid-cols-3">
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
                href={withUtm("/partner/apply", "pricing-tiers")}
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
    </EditorialSection>
  );
}
