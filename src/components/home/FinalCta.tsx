import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import Reveal from "@/components/ui/Reveal";
import LocaleLink from "@/components/ui/LocaleLink";
import ConfirmPulse from "@/components/illustrations/ConfirmPulse";

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
      <Reveal className="relative overflow-hidden rounded-panel border border-line bg-surface2 px-8 py-16 text-center sm:px-12 sm:py-20">
        {/* Corner spot — the confirmation moment, cropped and quiet */}
        <ConfirmPulse className="pointer-events-none absolute -end-8 -top-8 hidden h-44 w-44 opacity-70 sm:block" />
        <div className="relative mx-auto max-w-2xl">
          <h2 className="text-3xl text-content sm:text-4xl lg:text-[2.75rem]">{c.title}</h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-muted">
            {c.body}
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-x-7 gap-y-4">
            <LocaleLink
              href="/partner"
              locale={locale}
              className="btn btn-primary text-base"
            >
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
