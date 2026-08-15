import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import Reveal from "@/components/ui/Reveal";
import LocaleLink from "@/components/ui/LocaleLink";
import { CueMark } from "@/components/BrandMark";

/**
 * "Close" — the launch-moment sendoff: a committed navy panel, big friendly
 * type, and the confirm-green CTA. The one full-bleed color moment that ends
 * the page the way the relaunch means to begin.
 */
export default function FinalCta({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const c = dict.home.finalCta;
  return (
    <section className="container-pad py-20 sm:py-28">
      <Reveal className="relative overflow-hidden rounded-panel bg-[rgb(var(--olive-band))] px-8 py-16 text-center text-white shadow-card sm:px-12 sm:py-24">
        {/* Brand rings, bleeding off the corners */}
        <CueMark
          className="pointer-events-none absolute -end-20 -top-24 h-72 w-72 text-white/[0.06]"
          aria-hidden
        />
        <CueMark
          className="pointer-events-none absolute -bottom-28 -start-24 h-80 w-80 text-white/[0.05]"
          aria-hidden
        />
        <div className="relative mx-auto max-w-2xl">
          <span className="pill-live mx-auto !bg-white/10 !text-white">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-spark" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-spark" />
            </span>
            {dict.common.preLaunch}
          </span>
          <h2 className="mt-6 text-[clamp(2rem,4vw,3.25rem)] leading-[1.08] text-white">
            {c.title}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-[1.6] text-white/80">
            {c.body}
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <LocaleLink href="/partner" locale={locale} className="btn btn-spark px-8 text-base">
              {c.primary}
              <span className="nudge" aria-hidden="true">
                <svg viewBox="0 0 16 16" className="h-4 w-4 rtl:-scale-x-100" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 8h10M9.5 3.5 14 8l-4.5 4.5" />
                </svg>
              </span>
            </LocaleLink>
            <LocaleLink
              href="/reach-out"
              locale={locale}
              className="btn btn-ghost-light px-7 text-base"
            >
              {c.secondary}
            </LocaleLink>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
