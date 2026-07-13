import type { Locale } from "@/i18n/config";
import Reveal from "@/components/ui/Reveal";
import LocaleLink from "@/components/ui/LocaleLink";

export default function CtaBand({
  locale,
  title,
  body,
  primary,
  primaryHref,
  secondary,
  secondaryHref,
}: {
  locale: Locale;
  title: string;
  body: string;
  primary: string;
  primaryHref: string;
  secondary?: string;
  secondaryHref?: string;
}) {
  return (
    <section className="container-pad py-16 sm:py-24">
      <Reveal>
        <div className="rounded-panel border border-line bg-surface2 px-6 py-14 sm:px-14 sm:py-20">
          <div className="max-w-2xl">
            <h2 className="text-3xl text-content sm:text-4xl lg:text-[2.75rem]">
              {title}
            </h2>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted">
              {body}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <LocaleLink
                href={primaryHref}
                locale={locale}
                className="btn btn-primary text-base"
              >
                {primary}
                <span className="nudge" aria-hidden="true">
                  <svg viewBox="0 0 16 16" className="h-4 w-4 rtl:-scale-x-100" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 8h10M9.5 3.5 14 8l-4.5 4.5" />
                  </svg>
                </span>
              </LocaleLink>
              {secondary && secondaryHref && (
                <LocaleLink
                  href={secondaryHref}
                  locale={locale}
                  className="btn btn-outline text-base"
                >
                  {secondary}
                </LocaleLink>
              )}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
