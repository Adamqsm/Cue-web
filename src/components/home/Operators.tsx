import Image from "next/image";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import Reveal from "@/components/ui/Reveal";
import LocaleLink from "@/components/ui/LocaleLink";

export default function Operators({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const o = dict.home.operators;
  return (
    <section className="bg-ink text-bone">
      <div className="container-pad grid items-center gap-14 py-20 sm:py-28 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Copy */}
        <Reveal>
          <span className="label !text-green-300">
            <span className="h-px w-6 bg-green-400/60" aria-hidden />
            {o.label}
          </span>
          <h2 className="mt-4 text-3xl font-bold leading-[1.05] text-bone sm:text-4xl lg:text-[3rem]">
            {o.title}
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-bone/65">
            {o.body}
          </p>
          <ul className="mt-8 space-y-3.5">
            {o.points.map((point) => (
              <li key={point} className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green/20 text-green-300">
                  <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <span className="text-bone/80">{point}</span>
              </li>
            ))}
          </ul>
          <LocaleLink
            href="/partner"
            locale={locale}
            className="btn btn-primary mt-9 text-base"
          >
            {o.cta}
          </LocaleLink>
        </Reveal>

        {/* Dashboard shot */}
        <Reveal delay={1} className="flex justify-center lg:justify-end">
          <div className="relative w-[260px] overflow-hidden rounded-[1.6rem] border border-bone/12 bg-ink-900 shadow-lift sm:w-[300px]">
            <div className="absolute -inset-8 -z-10 rounded-full bg-green/20 blur-3xl" />
            <div className="flex items-center gap-1.5 border-b border-bone/10 px-4 py-2.5">
              <span className="h-1.5 w-1.5 rounded-full bg-bone/25" />
              <span className="h-1.5 w-1.5 rounded-full bg-bone/25" />
              <span className="h-1.5 w-1.5 rounded-full bg-bone/25" />
            </div>
            <div className="relative aspect-[191/340] w-full">
              <Image
                src={o.image}
                alt={o.imageAlt}
                fill
                sizes="300px"
                className="object-cover"
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
