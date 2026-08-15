import type { Dictionary } from "@/i18n/dictionaries";
import EditorialSection from "./EditorialSection";
import Reveal, { RevealGroup, RevealItem } from "@/components/ui/Reveal";

/**
 * "Where we're headed" — honest by design. Targets are labelled as targets;
 * the partner row is a placeholder ready for real logos. v5: stats live in
 * friendly lifted cards with big blue numerals.
 */
export default function Traction({
  dict,
  num = "08",
}: {
  dict: Dictionary;
  num?: string;
}) {
  const t = dict.home.traction;
  return (
    <EditorialSection num={num} label={t.label} band="bg">
      <div className="max-w-2xl">
        <h2 className="text-[clamp(1.9rem,3.4vw,3rem)] leading-[1.1] text-content">
          {t.title}
        </h2>
        <p className="mt-5 text-lg leading-[1.6] text-muted">{t.body}</p>
      </div>

      {/* Founding-partner logo strip (placeholder-ready, deliberately quiet) */}
      <Reveal delay={1} className="mt-12">
        <span className="label !bg-transparent !px-0 !text-muted">{t.logosLabel}</span>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex h-16 items-center justify-center rounded-card border border-dashed border-line-strong/50 text-xs font-medium text-muted"
            >
              {t.logosPlaceholder}
            </div>
          ))}
        </div>
      </Reveal>

      {/* Targets — clearly framed as forward-looking. */}
      <div className="mt-14">
        <span className="label !bg-transparent !px-0 !text-muted">{t.targetsLabel}</span>
        <RevealGroup className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {t.targets.map((s) => (
            <RevealItem
              key={s.label}
              className="card flex flex-col gap-1.5 p-6 sm:p-7"
            >
              <span className="text-4xl font-extrabold tabular-nums tracking-[-0.02em] rtl:tracking-normal text-accent sm:text-5xl">
                {s.value}
              </span>
              <span className="text-sm font-medium text-muted">{s.label}</span>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </EditorialSection>
  );
}
