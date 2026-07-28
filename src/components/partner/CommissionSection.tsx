import type { Dictionary } from "@/i18n/dictionaries";
import RuledSection from "@/components/layout/RuledSection";

/**
 * Commission as definition rows — the amount in serif tabular numerals on
 * the reading edge, the condition beside it. Add-ons follow as tariff
 * rows with the "never a tax" note set as the folio.
 */
export default function CommissionSection({
  commission,
}: {
  commission: Dictionary["partner"]["commission"];
}) {
  return (
    <RuledSection head={commission.kicker}>
      <div className="max-w-2xl">
        <h2 className="text-3xl sm:text-4xl">{commission.title}</h2>
        <p className="mt-4 text-lg leading-relaxed text-muted">{commission.body}</p>
      </div>

      <div className="mt-10 border-t-2 border-content">
        {commission.items.map((item) => (
          <div
            key={item.lead}
            className="grid gap-1 border-b border-line py-5 sm:grid-cols-[14rem_1fr] sm:items-baseline sm:gap-6 sm:py-6"
          >
            <span className="display text-xl tabular-nums text-content sm:text-2xl">
              {item.lead}
            </span>
            <p className="leading-relaxed text-muted">{item.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-12">
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-t-2 border-content pt-3">
          <h3 className="running-head">{commission.addons.title}</h3>
          <span className="folio">{commission.addons.note}</span>
        </div>
        <div className="mt-2">
          {commission.addons.items.map((addon) => (
            <div
              key={addon.name}
              className="flex items-baseline justify-between gap-6 border-b border-line py-3.5"
            >
              <span className="text-[15px] font-medium text-content">
                {addon.name}
              </span>
              <span className="whitespace-nowrap text-[15px] font-semibold tabular-nums text-content">
                {addon.price}
              </span>
            </div>
          ))}
        </div>
      </div>
    </RuledSection>
  );
}
