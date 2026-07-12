import type { Dictionary } from "@/i18n/dictionaries";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal, { RevealGroup, RevealItem } from "@/components/ui/Reveal";

/** Commission structure — a clean lead/amount list plus the optional visibility add-ons. */
export default function CommissionSection({
  commission,
}: {
  commission: Dictionary["partner"]["commission"];
}) {
  return (
    <section className="container-pad pb-20 sm:pb-28">
      <SectionHeading
        kicker={commission.kicker}
        title={commission.title}
        body={commission.body}
        className="mb-14"
      />
      <RevealGroup className="flex flex-col gap-4">
        {commission.items.map((item) => (
          <RevealItem
            key={item.lead}
            className="grid gap-2 rounded-4xl border border-line bg-surface2/50 p-6 transition-colors hover:border-green/30 sm:grid-cols-[14rem_1fr] sm:items-baseline sm:gap-6 sm:p-7"
          >
            <span className="font-display text-2xl font-semibold tracking-tight text-green dark:text-green-300">
              {item.lead}
            </span>
            <p className="text-lg text-content/75">{item.body}</p>
          </RevealItem>
        ))}
      </RevealGroup>

      <Reveal className="mt-10">
        <div className="rounded-4xl border border-line bg-bg p-6 sm:p-7">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="text-xl font-semibold text-content">{commission.addons.title}</h3>
            <span className="eyebrow">{commission.addons.note}</span>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {commission.addons.items.map((addon) => (
              <div
                key={addon.name}
                className="flex items-center justify-between gap-4 rounded-2xl border border-line bg-surface px-5 py-4"
              >
                <span className="font-medium text-content/80">{addon.name}</span>
                <span className="whitespace-nowrap font-display text-lg font-semibold text-content">
                  {addon.price}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
