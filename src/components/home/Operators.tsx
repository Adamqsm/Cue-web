import Image from "next/image";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import Reveal from "@/components/ui/Reveal";
import LocaleLink from "@/components/ui/LocaleLink";

export default function Operators({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const o = dict.home.operators;
  return (
    <section className="border-y border-line bg-surface2">
      <div className="container-pad grid items-center gap-14 py-20 sm:py-28 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Copy */}
        <Reveal>
          <span className="label">
            <span className="h-px w-6 bg-current opacity-60" aria-hidden />
            {o.label}
          </span>
          <h2 className="mt-4 text-3xl text-content sm:text-4xl lg:text-[2.75rem]">
            {o.title}
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
            {o.body}
          </p>
          <ul className="mt-8 space-y-3.5">
            {o.points.map((point) => (
              <li key={point} className="flex items-start gap-3">
                {/* Marketing bullets are decorative — accent wash, not --ok
                    (ok is reserved for confirmed states). */}
                <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-wash text-accent-deep">
                  <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <span className="text-content">{point}</span>
              </li>
            ))}
          </ul>
          <LocaleLink
            href="/partner"
            locale={locale}
            className="btn btn-primary mt-9 text-base"
          >
            {o.cta}
            <span className="nudge" aria-hidden="true">
              <svg viewBox="0 0 16 16" className="h-4 w-4 rtl:-scale-x-100" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 8h10M9.5 3.5 14 8l-4.5 4.5" />
              </svg>
            </span>
          </LocaleLink>
        </Reveal>

        {/* Dashboard shot — minimal device frame */}
        <Reveal delay={1} className="flex justify-center lg:justify-end">
          <div className="w-[264px] rounded-panel border border-line bg-surface p-1.5 sm:w-[300px]">
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
        </Reveal>
      </div>
    </section>
  );
}
