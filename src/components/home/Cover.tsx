import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import LocaleLink from "@/components/ui/LocaleLink";
import DuoImage from "@/components/ui/DuoImage";

/**
 * The cover story — a front page, not a hero. Kicker and cross-script folio
 * up top, the headline at masthead size, then dek + actions beside the
 * night's cover photograph. Static: nothing floats, nothing fades in.
 * The early-access button is bougainvillea because it is the one bookable
 * action before launch.
 */
export default function Cover({
  locale,
  c,
}: {
  locale: Locale;
  c: Dictionary["home"]["cover"];
}) {
  return (
    <section className="container-pad pb-12 pt-28 sm:pb-16 sm:pt-36">
      <div className="flex items-baseline justify-between gap-4">
        <p className="running-head">{c.kicker}</p>
        <p className="folio">{c.folio}</p>
      </div>

      <h1 className="mt-5 max-w-5xl text-[clamp(2.75rem,7vw,5.5rem)]">
        {c.title}
      </h1>

      <div className="mt-8 grid gap-8 lg:mt-10 lg:grid-cols-12 lg:gap-14">
        <div className="flex flex-col justify-end lg:col-span-5">
          <p className="max-w-md text-lg leading-relaxed text-muted sm:text-xl">
            {c.dek}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <LocaleLink href="/reach-out" locale={locale} className="btn btn-book">
              {c.primary}
              <span className="nudge inline-flex" aria-hidden="true">
                <svg
                  viewBox="0 0 16 16"
                  className="h-4 w-4 rtl:-scale-x-100"
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
            <LocaleLink href="/partner" locale={locale} className="btn btn-outline">
              {c.secondary}
            </LocaleLink>
          </div>
        </div>

        <DuoImage
          className="lg:col-span-7"
          src={c.photo}
          alt={c.photoAlt}
          sizes="(min-width: 1024px) 56vw, 100vw"
          aspect="aspect-[16/10]"
          priority
          caption={c.photoCaption}
          folio={c.photoFolio}
        />
      </div>

      {/* Thick-thin double rule — the cover's close */}
      <div className="mt-10 border-b-[3px] border-content pb-[5px] sm:mt-12">
        <div className="border-b border-content" />
      </div>
    </section>
  );
}
