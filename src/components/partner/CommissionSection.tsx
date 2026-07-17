import type { Dictionary } from "@/i18n/dictionaries";
import Reveal, { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import GroupPlan from "@/components/illustrations/GroupPlan";
import EditorialSection from "@/components/home/EditorialSection";

/** Commission structure — a clean lead/amount list plus the optional visibility add-ons. */
export default function CommissionSection({
  commission,
  num = "04",
}: {
  commission: Dictionary["partner"]["commission"];
  num?: string;
}) {
  return (
    <EditorialSection num={num} label={commission.kicker} band="surface2">
      <div className="max-w-2xl">
        <h2 className="text-[clamp(1.9rem,3.4vw,3rem)] leading-[1.08] text-content">
          {commission.title}
        </h2>
        <p className="mt-5 text-lg leading-[1.6] text-muted">{commission.body}</p>
      </div>
      <div className="mt-12">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,400px)]">
          {/* Definition table — hairline rows, tabular numerals */}
          <RevealGroup className="flex flex-col border-t border-line">
            {commission.items.map((item) => (
              <RevealItem
                key={item.lead}
                className="grid gap-1 border-b border-line py-5 sm:grid-cols-[14rem_1fr] sm:items-baseline sm:gap-6 sm:py-6"
              >
                <span className="text-xl font-[650] tabular-nums tracking-[-0.015em] rtl:tracking-normal text-content sm:text-2xl">
                  {item.lead}
                </span>
                <p className="leading-[1.65] text-muted">{item.body}</p>
              </RevealItem>
            ))}
          </RevealGroup>
          {/* Group coordination is where the prepayment commission lives — show it */}
          <Reveal className="flex justify-center">
            <GroupPlan className="w-full max-w-[400px] rtl:-scale-x-100" />
          </Reveal>
        </div>

        <Reveal className="mt-14">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="text-xl font-semibold tracking-[-0.015em] text-content">
              {commission.addons.title}
            </h3>
            <span className="eyebrow">{commission.addons.note}</span>
          </div>
          {/* Add-ons as chips */}
          <div className="mt-5 flex flex-wrap gap-3">
            {commission.addons.items.map((addon) => (
              <div
                key={addon.name}
                className="inline-flex items-center gap-3 rounded-full border border-line bg-surface px-5 py-2.5"
              >
                <span className="text-sm font-medium text-content">{addon.name}</span>
                <span className="whitespace-nowrap text-sm font-semibold tabular-nums text-accent-deep">
                  {addon.price}
                </span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </EditorialSection>
  );
}
