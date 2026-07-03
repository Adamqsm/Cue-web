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

      {/* Founding-partner logo strip (placeholder-ready) */}
      <Reveal delay={1} className="mt-12">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
          {t.logosLabel}
        </span>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex h-16 items-center justify-center rounded-2xl border border-dashed border-line bg-surface/40 text-xs font-medium text-muted/60"
            >
              {t.logosPlaceholder}
            </div>
          ))}
        </div>
      </Reveal>

      {/* Targets — clearly framed as forward-looking */}
      <div className="mt-14">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
          {t.targetsLabel}
        </span>
        <RevealGroup className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line bg-line lg:grid-cols-4">
          {t.targets.map((s) => (
            <RevealItem key={s.label} className="bg-surface p-6 sm:p-8">
              <div className="font-display text-4xl font-extrabold text-content sm:text-5xl">
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
