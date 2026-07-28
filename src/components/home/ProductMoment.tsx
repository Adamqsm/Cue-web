import Image from "next/image";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import RuledSection from "@/components/layout/RuledSection";
import LocaleLink from "@/components/ui/LocaleLink";

/**
 * The product, inset — one true-colour app screenshot in a plain print
 * frame beside the four booking steps as an order ticket. The numerals are
 * real sequence (a booking happens in this order), set small in brass.
 * Fits inside a viewport; the whole story continues on /how-it-works.
 */
export default function ProductMoment({
  locale,
  p,
}: {
  locale: Locale;
  p: Dictionary["home"]["product"];
}) {
  return (
    <RuledSection head={p.head} folio={p.folio}>
      <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-6 xl:col-span-5">
          <h2 className="text-3xl sm:text-4xl">{p.title}</h2>
          <ol className="mt-8 border-t border-line">
            {p.steps.map((s, i) => (
              <li
                key={s.title}
                className="flex items-baseline gap-5 border-b border-line py-4"
              >
                <span
                  className="display shrink-0 text-lg tabular-nums text-brass"
                  aria-hidden
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-lg text-content">{s.title}</h3>
                  <p className="mt-1 text-[14px] leading-relaxed text-muted">
                    {s.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
          <LocaleLink
            href="/how-it-works"
            locale={locale}
            className="link-underline mt-6 text-sm"
          >
            {p.link}
            <span className="nudge inline-flex" aria-hidden="true">
              <svg
                viewBox="0 0 16 16"
                className="h-3.5 w-3.5 rtl:-scale-x-100"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 8h10M9.5 3.5 14 8l-4.5 4.5" />
              </svg>
            </span>
          </LocaleLink>
        </div>

        <figure className="mx-auto w-full max-w-[300px] lg:col-span-5 lg:col-start-8 lg:mx-0">
          <span className="block border border-line bg-surface p-2">
            <Image
              src={p.screenshot}
              alt={p.screenshotAlt}
              width={1206}
              height={2622}
              sizes="300px"
              className="block h-auto w-full"
            />
          </span>
          <figcaption className="mt-2 border-b border-line pb-2 text-[12px] leading-relaxed text-muted">
            {p.screenshotCaption}
          </figcaption>
        </figure>
      </div>
    </RuledSection>
  );
}
