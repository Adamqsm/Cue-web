import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import Reveal from "@/components/ui/Reveal";
import LocaleLink from "@/components/ui/LocaleLink";

/**
 * "Close" — a warm invitation to end the night on. Marigold spark CTA, a serif
 * headline, and a quiet confirmation motif. Full-bleed feel via a bone panel.
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
      <Reveal className="relative overflow-hidden rounded-panel border border-line bg-surface px-8 py-16 text-center shadow-card sm:px-12 sm:py-24">
        {/* Warm blooms — the night, ending on a glow */}
        <span
          className="pointer-events-none absolute -end-16 -top-16 h-56 w-56 rounded-full bg-spark-wash opacity-70"
          aria-hidden
        />
        <span
          className="pointer-events-none absolute -bottom-20 -start-16 h-56 w-56 rounded-full bg-accent-wash opacity-60"
          aria-hidden
        />
        <div className="relative mx-auto max-w-2xl">
          <span className="pill-live mx-auto">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-spark" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-spark" />
            </span>
            {dict.common.preLaunch}
          </span>
          <h2 className="mt-6 text-[clamp(2rem,4vw,3.25rem)] leading-[1.04] text-content">
            {c.title}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-[1.6] text-muted">
            {c.body}
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-x-7 gap-y-4">
            <LocaleLink href="/partner" locale={locale} className="btn btn-spark text-base">
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
              className="inline-flex min-h-[44px] items-center text-base"
            >
              <span className="link-underline">{c.secondary}</span>
            </LocaleLink>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
