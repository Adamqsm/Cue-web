import type { Dictionary } from "@/i18n/dictionaries";
import SectionIntro from "./SectionIntro";
import Reveal, { RevealGroup, RevealItem } from "@/components/ui/Reveal";

/**
 * Traction — honest by design. Targets are labelled as targets; the partner
 * row is a placeholder structure ready for real logos (a one-line copy swap).
 */
export default function Traction({ dict }: { dict: Dictionary }) {
  const t = dict.home.traction;
  return (
    <section className="container-pad py-20 sm:py-28">
      <SectionIntro label={t.label} title={t.title} body={t.body} />

      {/* Founding-partner logo strip (placeholder-ready, deliberately quiet) */}
      <Reveal delay={1} className="mt-12">
        <span className="label !text-muted">{t.logosLabel}</span>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex h-16 items-center justify-center rounded-card border border-dashed border-line text-xs font-medium text-muted"
            >
              {t.logosPlaceholder}
            </div>
          ))}
        </div>
      </Reveal>

      {/* Targets — clearly framed as forward-looking. Hairline-separated stat row. */}
      <div className="mt-14">
        <span className="label !text-muted">{t.targetsLabel}</span>
        <RevealGroup className="mt-6 grid grid-cols-2 lg:grid-cols-4">
          {t.targets.map((s) => (
            <RevealItem
              key={s.label}
              className="border-line py-6 pe-4 even:border-s even:ps-5 sm:py-8 sm:even:ps-6 max-lg:[&:nth-child(n+3)]:border-t lg:[&:not(:first-child)]:border-s lg:[&:not(:first-child)]:ps-6"
            >
              <div className="text-4xl font-[650] tracking-[-0.02em] rtl:tracking-normal text-accent tabular-nums sm:text-5xl">
                {s.value}
              </div>
              <div className="mt-2 text-sm text-muted">{s.label}</div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
