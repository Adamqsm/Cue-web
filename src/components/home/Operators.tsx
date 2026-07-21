import Image from "next/image";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import EditorialSection from "./EditorialSection";
import LocaleLink from "@/components/ui/LocaleLink";

/**
 * "The control room" — the operator pitch on the olive brand band. High-warmth
 * color moment: the one section that commits fully to olive, the dashboard shot
 * floating in a light frame against it.
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
          <h2 className="text-[clamp(1.9rem,3.6vw,3.25rem)] leading-[1.06] text-white">
            {o.title}
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-[1.6] text-white/85">
            {o.body}
          </p>
          <ul className="mt-8 space-y-3.5">
            {o.points.map((point) => (
              <li key={point} className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/20 text-white">
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
          <div className="w-[264px] rounded-panel border border-white/20 bg-white/10 p-1.5 shadow-card backdrop-blur-sm sm:w-[300px]">
            <div className="relative aspect-[1206/2622] w-full overflow-hidden rounded-card">
              <Image
                src={o.image}
                alt={o.imageAlt}
                fill
                sizes="300px"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </EditorialSection>
  );
}
