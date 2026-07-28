import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import LocaleLink from "@/components/ui/LocaleLink";
import RuledSection from "@/components/layout/RuledSection";

/**
 * The founding-partner offer as ledger terms — the page's ONE "JD 0"
 * statement. Perks are ruled rows, the action is ink (a partnership
 * application is not a booking, so no bougainvillea here).
 */
export default function FoundingBanner({
  locale,
  founding,
}: {
  locale: Locale;
  founding: Dictionary["partner"]["founding"];
}) {
  return (
    <RuledSection head={founding.badge}>
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
        <div>
          <h2 className="max-w-xl text-3xl sm:text-4xl">{founding.title}</h2>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted">
            {founding.body}
          </p>
          <div className="mt-7">
            <LocaleLink
              href="/partner/apply"
              locale={locale}
              className="btn btn-ink text-base"
            >
              {founding.cta}
            </LocaleLink>
          </div>
        </div>
        <ul className="self-start border-t-2 border-content">
          {founding.perks.map((perk) => (
            <li
              key={perk}
              className="flex items-center gap-3 border-b border-line py-3.5 text-[15px] font-medium text-content"
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-4 w-4 shrink-0 text-brass"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m5 13 4 4L19 7" />
              </svg>
              {perk}
            </li>
          ))}
        </ul>
      </div>
    </RuledSection>
  );
}
