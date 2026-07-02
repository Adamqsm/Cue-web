import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { localizedHref } from "@/lib/utils";
import Link from "next/link";
import LocaleLink from "./ui/LocaleLink";
import { Logo, CueMark } from "./BrandMark";

export default function Footer({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const f = dict.footer;
  return (
    <footer className="relative overflow-hidden bg-ink text-paper">
      {/* CTA band */}
      <div className="container-pad relative border-b border-paper/10 py-16 sm:py-20">
        <CueMark className="pointer-events-none absolute -right-16 -top-10 h-56 w-56 text-paper/5 animate-spin-slow" />
        <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <h2 className="text-4xl font-semibold leading-tight text-paper sm:text-5xl">
              {f.ctaTitle}
            </h2>
            <p className="mt-3 text-lg text-paper/70">{f.ctaBody}</p>
          </div>
          <Link
            href={localizedHref("/reach-out", locale)}
            className="btn btn-primary text-base"
          >
            {f.ctaButton}
          </Link>
        </div>
      </div>

      {/* Links */}
      <div className="container-pad grid gap-10 py-14 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="max-w-xs">
          <Link href={localizedHref("/", locale)} aria-label="Cue home">
            <Logo className="text-paper" />
          </Link>
          <p className="mt-4 font-display text-lg italic text-paper/85">
            {f.tagline}
          </p>
          <p className="mt-2 text-sm text-paper/55">{f.blurb}</p>
        </div>

        {f.columns.map((col) => (
          <div key={col.title}>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-paper/50">
              {col.title}
            </h3>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((link, i) => (
                <li key={`${link.href}-${i}`}>
                  <LocaleLink
                    href={link.href}
                    locale={locale}
                    className="text-sm text-paper/75 transition-colors hover:text-clay-300"
                  >
                    {link.label}
                  </LocaleLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="border-t border-paper/10">
        <div className="container-pad flex flex-col gap-4 py-6 text-sm text-paper/55 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
            <span>{f.rights}</span>
            <span className="hidden sm:inline text-paper/25">·</span>
            <span>{f.ownedBy}</span>
          </div>
          <div className="flex items-center gap-4">
            {f.social.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-clay-300"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
