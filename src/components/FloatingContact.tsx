"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import type { Locale } from "@/i18n/config";
import { withUtm } from "@/lib/utm";
import LocaleLink from "@/components/ui/LocaleLink";

/**
 * Floating contact pill — a persistent route to /reach-out for visitors deep
 * in the content. Appears after the fold so it never competes with a hero CTA,
 * and stays off the pages that are themselves a form (reach-out, claim,
 * partner apply): covering the submit button of the thing the visitor is
 * already filling in would be worse than absent. It also steps aside while
 * the footer is on screen — anchored to the same logical end corner, it would
 * otherwise sit exactly on the footer's social link at full scroll.
 *
 * z-40: under the fixed nav (50) and every modal scrim (85/90).
 */
const HIDDEN_ROUTES = /\/(reach-out|claim|partner\/apply)$/;
const SHOW_AFTER_PX = 400;

export default function FloatingContact({
  locale,
  label,
}: {
  locale: Locale;
  label: string;
}) {
  const [pastFold, setPastFold] = useState(false);
  const [footerInView, setFooterInView] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setPastFold(window.scrollY > SHOW_AFTER_PX);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;
    const io = new IntersectionObserver(([entry]) =>
      setFooterInView(entry.isIntersecting)
    );
    io.observe(footer);
    return () => io.disconnect();
  }, []);

  const shown = pastFold && !footerInView;

  if (HIDDEN_ROUTES.test(pathname ?? "")) return null;

  return (
    <div
      className={
        "fixed bottom-5 end-5 z-40 transition-all duration-300 " +
        (shown
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0")
      }
    >
      <LocaleLink
        href={withUtm("/reach-out", "floating-contact")}
        locale={locale}
        className="btn btn-primary px-5 shadow-[var(--shadow-cta)]"
      >
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z" />
        </svg>
        {label}
      </LocaleLink>
    </div>
  );
}
