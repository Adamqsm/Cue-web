import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import Reveal from "@/components/ui/Reveal";
import LocaleLink from "@/components/ui/LocaleLink";
import { CueMark } from "@/components/BrandMark";

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
      <Reveal className="relative overflow-hidden rounded-[2.5rem] border border-green-600 bg-green px-8 py-16 text-center sm:px-12 sm:py-20 dark:border-green-500 dark:bg-green-600">
        <CueMark className="pointer-events-none absolute -end-10 -top-10 h-48 w-48 text-bone/10" />
        <CueMark className="pointer-events-none absolute -start-12 -bottom-14 h-56 w-56 text-bone/[0.07]" />
        <div className="relative mx-auto max-w-2xl">
          <h2 className="text-4xl font-extrabold leading-[1.05] text-bone sm:text-5xl">
            {c.title}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-bone/85">
            {c.body}
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <LocaleLink
              href="/partner"
              locale={locale}
              className="btn bg-bone text-ink hover:-translate-y-0.5 hover:bg-white text-base"
            >
              {c.primary}
            </LocaleLink>
            <LocaleLink
              href="/reach-out"
              locale={locale}
              className="btn btn-ghost-light text-base"
            >
              {c.secondary}
            </LocaleLink>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
