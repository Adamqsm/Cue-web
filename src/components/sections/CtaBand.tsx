import type { Locale } from "@/i18n/config";
import LocaleLink from "@/components/ui/LocaleLink";
import RuledSection from "@/components/layout/RuledSection";

/**
 * The page closer — the ONE field-colour moment a page gets. A route that
 * renders CtaBand must not use RuledSection tone="field" anywhere else.
 * `primaryTone="book"` is allowed only for booking/early-access intents
 * (the bougainvillea exclusivity rule); partner/careers actions use paper.
 */
export default function CtaBand({
  locale,
  head,
  title,
  body,
  primary,
  primaryHref,
  primaryTone = "paper",
  secondary,
  secondaryHref,
}: {
  locale: Locale;
  head: string;
  title: string;
  body: string;
  primary: string;
  primaryHref: string;
  primaryTone?: "paper" | "book";
  secondary?: string;
  secondaryHref?: string;
}) {
  return (
    <RuledSection head={head} tone="field">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
        <div>
          <h2 className="max-w-2xl text-3xl sm:text-4xl">{title}</h2>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-field-content/70">
            {body}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 lg:justify-end">
          <LocaleLink
            href={primaryHref}
            locale={locale}
            className={`btn text-base ${primaryTone === "book" ? "btn-book" : "btn-paper"}`}
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
              className="btn btn-outline border-field-content/40 !text-field-content hover:border-field-content hover:!bg-field-content/10 text-base"
            >
              {secondary}
            </LocaleLink>
          )}
        </div>
      </div>
    </RuledSection>
  );
}
