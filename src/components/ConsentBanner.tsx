"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import type { Locale } from "@/i18n/config";
import LocaleLink from "@/components/ui/LocaleLink";

const CONSENT_KEY = "cue-consent";
// Bump when policy substance changes to re-prompt returning visitors.
const CONSENT_VERSION = "v1";

type ConsentContent = {
  eyebrow: string;
  title: string;
  body: string;
  accept: string;
  note: string;
};

type PolicyLink = { href: string; title: string };

/**
 * First-visit consent gate: blocks interaction until accepted.
 * - Renders nothing on the server and nothing until the client has checked
 *   localStorage — crawlers and no-JS visitors always get the full,
 *   un-obscured page (SEO-safe).
 * - Never gates /legal/* — the policies must be readable BEFORE consenting.
 * - Receives only the strings it needs (not the whole dictionary) to keep
 *   the serialized client payload tiny.
 */
export default function ConsentBanner({
  locale,
  content,
  policies,
}: {
  locale: Locale;
  content: ConsentContent;
  policies: PolicyLink[];
}) {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const acceptRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const isLegal = /^\/[a-z]{2}(-[A-Za-z]{2})?\/legal(\/|$)/.test(pathname ?? "");

  useEffect(() => {
    if (isLegal) return;
    try {
      if (localStorage.getItem(CONSENT_KEY) !== CONSENT_VERSION) setOpen(true);
    } catch {
      // Storage unavailable (private mode hard-block etc.) — don't gate.
    }
  }, [isLegal]);

  // Cross-tab: accepting in any tab dismisses the gate everywhere.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === CONSENT_KEY && e.newValue === CONSENT_VERSION) setOpen(false);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Blocking behavior: scroll lock + DOCUMENT-level focus containment, so a
  // backdrop click or browser-chrome re-entry can't escape into the page.
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    acceptRef.current?.focus();

    const keepFocus = (e: FocusEvent) => {
      if (
        dialogRef.current &&
        e.target instanceof Node &&
        !dialogRef.current.contains(e.target)
      ) {
        acceptRef.current?.focus();
      }
    };
    const trapTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !dialogRef.current) return;
      const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])'
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;
      if (!dialogRef.current.contains(active)) {
        e.preventDefault();
        first.focus();
        return;
      }
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("focusin", keepFocus);
    document.addEventListener("keydown", trapTab, true);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("focusin", keepFocus);
      document.removeEventListener("keydown", trapTab, true);
    };
  }, [open]);

  if (!open || isLegal) return null;

  const accept = () => {
    try {
      localStorage.setItem(CONSENT_KEY, CONSENT_VERSION);
    } catch {
      // If storage fails we still dismiss for this pageview.
    }
    setOpen(false);
    // Land keyboard/AT users at the top of the page content — mirrors where
    // a fresh visit starts (dialog unmount would otherwise drop focus to body).
    // setTimeout, not rAF: rAF never fires in throttled/hidden tabs.
    setTimeout(() => document.getElementById("main")?.focus(), 0);
  };

  return (
    /* Theme-stable scrim: always dims, in dark mode too. */
    <div className="fixed inset-0 z-[90] flex items-end justify-center bg-black/50 p-4 backdrop-blur-sm sm:p-6">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="consent-title"
        aria-describedby="consent-body"
        className="max-h-[calc(100dvh-2rem)] w-full max-w-xl animate-board-in overflow-y-auto rounded-panel border border-line bg-surface p-6 shadow-card sm:p-8"
      >
        <p className="eyebrow">{content.eyebrow}</p>
        <h2 id="consent-title" className="mt-3 text-xl text-content sm:text-2xl">
          {content.title}
        </h2>
        <p id="consent-body" className="mt-2 text-sm leading-[1.65] text-muted">
          {content.body}
        </p>

        <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1">
          {policies.map((doc) => (
            <li key={doc.href}>
              <LocaleLink
                href={doc.href}
                locale={locale}
                target="_blank"
                className="inline-flex min-h-[32px] items-center text-sm font-semibold text-content underline decoration-accent decoration-[1.5px] underline-offset-4 transition-colors hover:text-accent-deep"
              >
                {doc.title}
              </LocaleLink>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted">{content.note}</p>
          <button
            ref={acceptRef}
            type="button"
            onClick={accept}
            className="btn btn-primary w-full sm:w-auto"
          >
            {content.accept}
          </button>
        </div>
      </div>
    </div>
  );
}
