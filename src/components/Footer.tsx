import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { localizedHref } from "@/lib/utils";
import Link from "next/link";
import LocaleLink from "./ui/LocaleLink";
import { Logo } from "./BrandMark";

export default function Footer({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const f = dict.footer;
  return (
    <footer className="relative border-t border-line bg-ink text-bone">
      {/* Links */}
      <div className="container-pad grid gap-10 py-16 md:grid-cols-[1.5fr_repeat(3,1fr)]">
        <div className="max-w-xs">
          <Link href={localizedHref("/", locale)} aria-label="Cue home">
            <Logo className="text-bone" />
          </Link>
          <p className="mt-4 font-display text-lg font-semibold text-bone/90">
            {f.tagline}
          </p>
          <p className="mt-2 text-sm text-bone/55">{f.blurb}</p>
        </div>

        {f.columns.map((col) => (
          <div key={col.title}>
            <h3 className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-bone/45">
              {col.title}
            </h3>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((link, i) => (
                <li key={`${link.href}-${i}`}>
                  <LocaleLink
                    href={link.href}
                    locale={locale}
                    className="text-sm text-bone/75 transition-colors hover:text-green-300"
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
      <div className="border-t border-bone/10">
        <div className="container-pad flex flex-col gap-4 py-6 text-sm text-bone/55 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
            <span>{f.rights}</span>
            <span className="hidden text-bone/25 sm:inline">·</span>
            <span>{f.ownedBy}</span>
          </div>
          <div className="flex items-center gap-4">
            {f.social.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-green-300"
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
