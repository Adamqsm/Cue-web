"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { localizedHref, cn } from "@/lib/utils";
import { Logo } from "./BrandMark";
import LanguageToggle from "./LanguageToggle";

export default function Nav({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-ink/10 bg-paper/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <nav className="container-pad flex h-16 items-center justify-between md:h-[72px]">
        <Link
          href={localizedHref("/", locale)}
          className="text-ink transition-opacity hover:opacity-80"
          aria-label="Cue home"
        >
          <Logo />
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {dict.nav.links.map((link) => {
            const active =
              pathname === localizedHref(link.href, locale) ||
              (link.href !== "/" &&
                pathname.startsWith(localizedHref(link.href, locale)));
            return (
              <Link
                key={link.href}
                href={localizedHref(link.href, locale)}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  active
                    ? "text-clay"
                    : "text-ink/70 hover:bg-ink/5 hover:text-ink"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <LanguageToggle
            locale={locale}
            label={dict.nav.langToggle}
            className="text-ink/80 hover:text-ink"
          />
          <Link
            href={localizedHref("/reach-out", locale)}
            className="btn btn-primary"
          >
            {dict.nav.cta}
          </Link>
        </div>

        {/* Mobile trigger */}
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-3 py-2 text-sm font-semibold text-ink lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? dict.nav.close : dict.nav.menu}
        >
          <span className="relative flex h-4 w-5 flex-col justify-between">
            <span
              className={cn(
                "h-0.5 w-full bg-ink transition-transform",
                open && "translate-y-[7px] rotate-45"
              )}
            />
            <span
              className={cn(
                "h-0.5 w-full bg-ink transition-opacity",
                open && "opacity-0"
              )}
            />
            <span
              className={cn(
                "h-0.5 w-full bg-ink transition-transform",
                open && "-translate-y-[7px] -rotate-45"
              )}
            />
          </span>
        </button>
      </nav>

      {/* Mobile panel */}
      <div
        className={cn(
          "overflow-hidden bg-paper/95 backdrop-blur-xl transition-[max-height,opacity] duration-300 lg:hidden",
          open ? "max-h-[90vh] border-b border-ink/10 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="container-pad flex flex-col gap-1 py-5">
          {dict.nav.links.map((link) => (
            <Link
              key={link.href}
              href={localizedHref(link.href, locale)}
              className="rounded-2xl px-4 py-3.5 text-lg font-medium text-ink hover:bg-ink/5"
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-3 flex items-center justify-between gap-3">
            <LanguageToggle locale={locale} label={dict.nav.langToggle} />
            <Link
              href={localizedHref("/reach-out", locale)}
              className="btn btn-primary flex-1"
            >
              {dict.nav.cta}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
