import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import Reveal from "@/components/ui/Reveal";
import LocaleLink from "@/components/ui/LocaleLink";
import { CueMark } from "@/components/BrandMark";

/** High-weight founding-partner offer banner — the outreach hook, shown directly under the page hero. */
export default function FoundingBanner({
  locale,
  founding,
}: {
  locale: Locale;
  founding: Dictionary["partner"]["founding"];
}) {
  return (
    <section className="container-pad pt-10 sm:pt-14">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2.5rem] bg-green px-6 py-12 text-bone sm:px-14 sm:py-16">
          <CueMark className="pointer-events-none absolute -bottom-16 -end-10 h-64 w-64 text-bone/15 animate-spin-slow" />
          <div className="pointer-events-none absolute -top-24 start-1/3 h-64 w-64 rounded-full bg-amber/30 blur-3xl" />
          <div className="relative grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <span className="inline-flex items-center gap-2.5 rounded-full border border-bone/25 bg-bone/10 px-3.5 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-bone/90">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-amber-300 animate-pulse-ring" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-300" />
                </span>
                {founding.badge}
              </span>
              <h2 className="mt-5 text-balance text-3xl font-semibold leading-[1.05] sm:text-5xl">
                {founding.title}
              </h2>
              <p className="mt-4 max-w-xl text-lg text-bone/85">{founding.body}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <LocaleLink
                  href="/partner/apply"
                  locale={locale}
                  className="btn btn-ink text-base"
                >
                  {founding.cta}
                </LocaleLink>
              </div>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {founding.perks.map((perk) => (
                <li
                  key={perk}
                  className="flex items-center gap-3 rounded-2xl border border-bone/15 bg-bone/5 px-4 py-3 text-sm font-medium text-bone/90"
                >
                  <CueMark className="h-4 w-4 shrink-0 text-amber-300" />
                  {perk}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
