import type { Locale } from "@/i18n/config";
import Reveal from "@/components/ui/Reveal";
import LocaleLink from "@/components/ui/LocaleLink";
import { CueMark } from "@/components/BrandMark";

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
        <div className="relative overflow-hidden rounded-[2.5rem] bg-clay px-6 py-14 text-paper sm:px-14 sm:py-20">
          <CueMark className="pointer-events-none absolute -bottom-16 -end-10 h-64 w-64 text-paper/15 animate-spin-slow" />
          <div className="pointer-events-none absolute -top-24 start-1/3 h-64 w-64 rounded-full bg-ember/30 blur-3xl" />
          <div className="relative max-w-2xl">
            <h2 className="text-4xl font-semibold leading-[1.05] sm:text-5xl">
              {title}
            </h2>
            <p className="mt-4 text-lg text-paper/85">{body}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <LocaleLink
                href={primaryHref}
                locale={locale}
                className="btn bg-ink text-paper hover:bg-ink-700 hover:-translate-y-0.5 text-base"
              >
                {primary}
              </LocaleLink>
              {secondary && secondaryHref && (
                <LocaleLink
                  href={secondaryHref}
                  locale={locale}
                  className="btn btn-ghost-light text-base"
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
