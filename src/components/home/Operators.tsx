import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import EditorialSection from "./EditorialSection";
import ServiceBoard from "./ServiceBoard";
import LocaleLink from "@/components/ui/LocaleLink";

/**
 * "The control room" — the operator pitch on the committed navy brand band.
 * v5 swaps the static dashboard screenshot for the live service board: the
 * actual thing an operator watches, moving, right on the pitch.
 */
export default function Operators({
  locale,
  dict,
  num = "07",
}: {
  locale: Locale;
  dict: Dictionary;
  num?: string;
}) {
  const o = dict.home.operators;
  return (
    <EditorialSection num={num} label={o.label} band="olive">
      <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <div>
          <h2 className="text-[clamp(1.9rem,3.6vw,3.25rem)] leading-[1.08] text-white">
            {o.title}
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-[1.6] text-white/85">
            {o.body}
          </p>
          <ul className="mt-8 space-y-3.5">
            {o.points.map((point) => (
              <li key={point} className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-spark text-[rgb(var(--olive-band))]">
                  <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <span className="text-white/90">{point}</span>
              </li>
            ))}
          </ul>
          <LocaleLink
            href="/partner"
            locale={locale}
            className="btn mt-9 bg-white text-[rgb(var(--olive-band))] hover:bg-white/90"
          >
            {o.cta}
            <span className="nudge" aria-hidden="true">
              <svg viewBox="0 0 16 16" className="h-4 w-4 rtl:-scale-x-100" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 8h10M9.5 3.5 14 8l-4.5 4.5" />
              </svg>
            </span>
          </LocaleLink>
        </div>

        <div className="flex justify-center lg:justify-end">
          <ServiceBoard
            board={dict.home.hero.board}
            labels={{ play: dict.home.demo.play, pause: dict.home.demo.pause }}
            tone="band"
          />
        </div>
      </div>
    </EditorialSection>
  );
}
