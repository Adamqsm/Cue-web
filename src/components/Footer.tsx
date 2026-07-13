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
    <footer className="relative border-t border-line bg-surface2 text-content">
      {/* Links */}
      <div className="container-pad grid gap-10 py-12 md:grid-cols-[1.5fr_repeat(3,1fr)] md:py-14">
        <div className="max-w-xs">
          <Link href={localizedHref("/", locale)} aria-label="Cue home">
            <Logo className="text-content" />
          </Link>
          <p className="mt-3 text-lg font-semibold text-content">
            {f.tagline}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted">{f.blurb}</p>
        </div>

        {f.columns.map((col) => (
          <div key={col.title}>
            <h3 className="label">{col.title}</h3>
            <ul className="mt-3 space-y-2">
              {col.links.map((link, i) => (
                <li key={`${link.href}-${i}`}>
                  <LocaleLink
                    href={link.href}
                    locale={locale}
                    className="text-sm text-muted transition-colors duration-200 hover:text-content"
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
      <div className="border-t border-line">
        <div className="container-pad flex flex-col gap-4 py-5 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
            <span>{f.rights}</span>
            <span className="hidden text-muted/50 sm:inline">·</span>
            <span>{f.ownedBy}</span>
          </div>
          <div className="flex items-center gap-4">
            {f.social.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors duration-200 hover:text-content"
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
