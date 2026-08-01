"use client";

import { useEffect, useRef } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import ClaimForm from "@/components/claim/ClaimForm";
import { track } from "@/lib/qinsider/analytics";

type ClaimModalStrings = Pick<
  Dictionary["claim"],
  "modal" | "form" | "success" | "duplicate"
>;

/**
 * Claim dialog — same blocking mechanics as ConsentBanner (scroll lock,
 * document-level focus containment, capture-phase Tab trap), but dismissable:
 * Escape, scrim click, and a visible close button. z-[85] keeps it under the
 * consent gate (z-[90]) so first-visit consent always wins if both are up.
 */
export default function ClaimModal({
  strings,
  locale,
  source,
  onClose,
}: {
  strings: ClaimModalStrings;
  locale: Locale;
  source: "claim-modal" | "nav-cta";
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  // True only while a press that STARTED on the scrim is in flight — a drag
  // out of the dialog (e.g. text selection) must not close and destroy input.
  const scrimPressStarted = useRef(false);
  const viewTracked = useRef(false);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    // Ref guard: strict-mode double-invoke must not double-count the view.
    if (viewTracked.current) return;
    viewTracked.current = true;
    track("claim_view", { source, locale });
  }, [source, locale]);

  useEffect(() => {
    // Captured before we move focus, restored on close.
    const opener = document.activeElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    headingRef.current?.focus();

    const keepFocus = (e: FocusEvent) => {
      if (
        dialogRef.current &&
        e.target instanceof Node &&
        !dialogRef.current.contains(e.target)
      ) {
        headingRef.current?.focus();
      }
    };
    const onKeydown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onCloseRef.current();
        return;
      }
      if (e.key !== "Tab" || !dialogRef.current) return;
      const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
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
    document.addEventListener("keydown", onKeydown, true);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("focusin", keepFocus);
      document.removeEventListener("keydown", onKeydown, true);
      if (opener instanceof HTMLElement) opener.focus();
    };
  }, []);

  return (
    /* Theme-stable scrim: always dims, in dark mode too. */
    <div
      className="fixed inset-0 z-[85] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm sm:p-6"
      onPointerDown={(e) => {
        scrimPressStarted.current = e.target === e.currentTarget;
      }}
      onClick={(e) => {
        const startedOnScrim = scrimPressStarted.current;
        scrimPressStarted.current = false;
        // Close only when the press started AND ended on the scrim itself.
        if (startedOnScrim && e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="claim-modal-title"
        className="relative max-h-[calc(100dvh-2rem)] w-full max-w-lg animate-board-in overflow-y-auto rounded-panel border border-line bg-surface p-6 shadow-card md:p-8"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={strings.modal.close}
          className="absolute end-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-line text-muted transition-colors hover:bg-surface2 hover:text-content"
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>

        <p className="eyebrow">
          <span className="h-px w-6 bg-current opacity-60" />
          {strings.success.ticket.label}
        </p>
        <h2
          ref={headingRef}
          id="claim-modal-title"
          tabIndex={-1}
          className="mt-3 pe-10 text-xl text-content outline-none sm:text-2xl"
        >
          {strings.modal.title}
        </h2>

        <div className="mt-6">
          <ClaimForm
            strings={{
              form: strings.form,
              success: strings.success,
              duplicate: strings.duplicate,
            }}
            locale={locale}
            source={source}
            variant="modal"
          />
        </div>
      </div>
    </div>
  );
}
