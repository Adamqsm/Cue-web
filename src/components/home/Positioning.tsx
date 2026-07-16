import type { Dictionary } from "@/i18n/dictionaries";
import EditorialSection from "./EditorialSection";

/**
 * "The gap" — the problem, promoted and made a full-bleed ink moment. Short,
 * sharp, high-contrast. A bespoke motif carries the metaphor: fragmented
 * channels (DMs, calls, walk-ins, paper) scatter on the reading edge and
 * resolve into one confirmed olive line. Drawn with explicit light strokes
 * because it lives only on the ink band (token stroke-content would vanish).
 */
export default function Positioning({
  dict,
  num = "01",
}: {
  dict: Dictionary;
  num?: string;
}) {
  const p = dict.home.problem;
  return (
    <EditorialSection num={num} label={p.label} band="ink">
      <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <div>
          <h2 className="text-[clamp(2rem,4.4vw,3.5rem)] leading-[1.04] text-bg">
            {p.title}
          </h2>
          <p className="mt-6 max-w-[52ch] text-lg leading-[1.6] text-bg/70 sm:text-xl">
            {p.body}
          </p>
          <p className="mt-7 flex items-start gap-3 text-lg font-semibold leading-[1.5] text-bg sm:text-xl">
            <span
              className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-spark"
              aria-hidden
            />
            <span className="max-w-[46ch]">{p.resolve}</span>
          </p>
        </div>

        <div className="flex justify-center lg:justify-end">
          <GapMotif className="w-full max-w-[380px]" />
        </div>
      </div>
    </EditorialSection>
  );
}

/* Scattered fragmented channels → one settled confirmed line. */
function GapMotif({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 380 300"
      fill="none"
      aria-hidden="true"
      className={className}
      strokeLinecap="round"
    >
      {/* Fragmented channels on the reading edge (currentColor = band text,
          which inverts correctly when the ink band flips light in dark mode) */}
      <g stroke="currentColor" strokeOpacity={0.4} strokeWidth={2} strokeDasharray="4 7">
        <path d="M18 46h120" />
        <path d="M18 92h96" />
        <path d="M18 138h132" />
        <path d="M18 184h84" />
        <path d="M18 230h110" />
      </g>
      {/* Marigold origin dots (incoming, scattered) */}
      <g fill="#DF9426">
        <circle cx="18" cy="46" r="4" />
        <circle cx="18" cy="92" r="4" />
        <circle cx="18" cy="138" r="4" />
        <circle cx="18" cy="184" r="4" />
        <circle cx="18" cy="230" r="4" />
      </g>
      {/* Converging strands into the funnel node */}
      <g stroke="currentColor" strokeOpacity={0.55} strokeWidth={2}>
        <path d="M150 46C210 46 214 138 250 138" />
        <path d="M132 92C204 92 210 138 250 138" />
        <path d="M168 138H250" />
        <path d="M120 184C200 184 214 138 250 138" />
        <path d="M146 230C212 230 214 138 250 138" />
      </g>
      {/* The single settled olive line + confirmed node */}
      <path d="M250 138H352" stroke="#9DAA6C" strokeWidth={3} />
      <circle cx="250" cy="138" r="9" fill="#5B6A38" />
      <circle cx="352" cy="138" r="14" fill="#5B6A38" />
      <path
        d="M346 138l4 4 8-8"
        stroke="#fff"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
