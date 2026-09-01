import type { ReactNode } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { localizedHref } from "@/lib/utils";
import Link from "next/link";
import LocaleLink from "./ui/LocaleLink";
import { Logo } from "./BrandMark";

// Solid brand glyphs, keyed by the `icon` field on `footer.social` entries.
// Brand marks keep their orientation in RTL (no rtl:-scale-x-100).
const socialIcons: Record<string, ReactNode> = {
  linkedin: (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-4 w-4"
      fill="currentColor"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
    </svg>
  ),
};

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
                aria-label={s.label}
                className="-m-2 inline-flex items-center justify-center p-2 transition-colors duration-200 hover:text-content"
              >
                {socialIcons[s.icon] ?? s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
