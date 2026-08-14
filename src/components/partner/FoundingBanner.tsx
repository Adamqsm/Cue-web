import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import Reveal from "@/components/ui/Reveal";
import LocaleLink from "@/components/ui/LocaleLink";

/** High-weight founding-partner offer banner — the outreach hook, shown directly under the page hero. */
export default function FoundingBanner({
  locale,
  founding,
  claimCta,
}: {
  locale: Locale;
  founding: Dictionary["partner"]["founding"];
  claimCta: string;
}) {
  return (
    <section className="container-pad pt-10 sm:pt-14">
      <Reveal>
        <div className="rounded-panel border border-accent/25 bg-accent-wash px-6 py-12 sm:px-14 sm:py-16">
          <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <span className="label">
                <span className="h-px w-6 bg-current opacity-60" />
                {founding.badge}
              </span>
              <h2 className="mt-5 text-balance text-[clamp(1.75rem,3.2vw,2.75rem)] font-[650] leading-[1.1] tracking-[-0.025em] text-content">
                {founding.title}
              </h2>
              <p className="mt-4 max-w-xl text-lg leading-[1.65] text-muted">
                {founding.body}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <LocaleLink
                  href="/partner/apply"
                  locale={locale}
                  className="btn btn-primary text-base"
                >
                  {founding.cta}
                </LocaleLink>
              </div>
            </div>
            <ul className="flex flex-col divide-y divide-accent/15">
              {founding.perks.map((perk) => (
                <li
                  key={perk}
                  className="flex items-center gap-3 py-3.5 text-sm font-medium text-content"
                >
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="h-4 w-4 shrink-0 text-accent-deep"
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

          {/* Guest-side proof point: the Cue Insider list is already filling. */}
          <p className="mt-6 border-t border-line/60 pt-4 text-sm text-muted">
            {founding.waitlistNote}{" "}
            <LocaleLink href="/claim" locale={locale} className="link-underline">
              {claimCta}
            </LocaleLink>
          </p>
        </div>
      </Reveal>
    </section>
  );
}
