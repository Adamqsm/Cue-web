"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { localizedHref, cn } from "@/lib/utils";
import { useClaimModal } from "@/components/claim/ClaimModalProvider";
import { Logo } from "./BrandMark";
import LanguageToggle from "./LanguageToggle";
import ThemeToggle from "./ThemeToggle";

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
  const router = useRouter();
  const claimModal = useClaimModal();

  // Modal when the provider is mounted; plain navigation to /claim otherwise.
  const onClaim = () => {
    setOpen(false);
    if (claimModal) claimModal.openClaimModal("nav-cta");
    else router.push(localizedHref("/claim", locale));
  };

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

  const themeLabels = { light: dict.common.theme.light, dark: dict.common.theme.dark };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled || open
          ? "border-b border-line bg-bg/85 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <nav className="container-pad flex h-16 items-center justify-between md:h-[72px]">
        <Link
          href={localizedHref("/", locale)}
          className="inline-flex min-h-[44px] items-center text-content transition-opacity hover:opacity-80"
          aria-label="Cue home"
        >
          <Logo />
        </Link>

        <div className="hidden items-center gap-6 lg:flex">
          {dict.nav.links.map((link) => {
            const active =
              pathname === localizedHref(link.href, locale) ||
              (link.href !== "/" &&
                pathname.startsWith(localizedHref(link.href, locale)));
            return (
              <Link
                key={link.href}
                href={localizedHref(link.href, locale)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  // 44px hit box on the anchor; underline on an inner
                  // text-height span so ::after hugs the label, not the box.
                  "inline-flex min-h-[44px] items-center text-sm transition-colors",
                  active ? "text-content" : "text-muted hover:text-content"
                )}
              >
                <span className="link-underline text-inherit">{link.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <ThemeToggle labels={themeLabels} />
          <LanguageToggle locale={locale} label={dict.nav.langToggle} />
          <button type="button" onClick={onClaim} className="btn btn-outline px-5">
            {dict.nav.claimCta}
          </button>
          <Link
            href={localizedHref("/reach-out", locale)}
            className="btn btn-spark px-5"
          >
            {dict.nav.cta}
          </Link>
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle labels={themeLabels} />
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line text-content transition-colors duration-200 hover:bg-accent-wash hover:text-accent-deep"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? dict.nav.close : dict.nav.menu}
          >
            <span className="relative flex h-4 w-5 flex-col justify-between">
              <span
                className={cn(
                  "h-0.5 w-full bg-content transition-transform",
                  open && "translate-y-[7px] rotate-45"
                )}
              />
              <span
                className={cn(
                  "h-0.5 w-full bg-content transition-opacity",
                  open && "opacity-0"
                )}
              />
              <span
                className={cn(
                  "h-0.5 w-full bg-content transition-transform",
                  open && "-translate-y-[7px] -rotate-45"
                )}
              />
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile panel */}
      <div
        className={cn(
          // visibility rides the transition: hidden lands only after the
          // close animation, keeping the collapsed panel out of the tab order.
          "overflow-hidden bg-bg/90 backdrop-blur-xl transition-[max-height,opacity,visibility] duration-300 lg:hidden",
          open
            ? "visible max-h-[90vh] border-b border-line opacity-100"
            : "invisible max-h-0 opacity-0"
        )}
      >
        <div className="container-pad py-4">
          <div className="rounded-panel border border-line bg-surface p-3 shadow-soft">
            <div className="flex flex-col gap-1">
              {dict.nav.links.map((link) => (
                <Link
                  key={link.href}
                  href={localizedHref(link.href, locale)}
                  className="rounded-card px-4 py-3 text-base font-medium text-content transition-colors hover:bg-surface2"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <button
              type="button"
              onClick={onClaim}
              className="btn btn-outline mt-3 w-full"
            >
              {dict.nav.claimCta}
            </button>
            <div className="mt-3 flex items-center justify-between gap-3 border-t border-line pt-3">
              <LanguageToggle locale={locale} label={dict.nav.langToggle} />
              <Link
                href={localizedHref("/reach-out", locale)}
                className="btn btn-spark flex-1"
              >
                {dict.nav.cta}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
