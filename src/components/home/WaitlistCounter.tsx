"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import LocaleLink from "@/components/ui/LocaleLink";

/**
 * The queue counter — how many people are already in.
 *
 * DATA SOURCE: /api/waitlist-count, the live cueInsiderClaims total plus the
 * server-side offset, fetched fresh on every page load (no-store on both the
 * response and the request, so neither the CDN nor the browser can serve a
 * stale number). Until the fetch resolves the ticket shows a same-size
 * skeleton — never a 0, an undefined, or a made-up number. If the fetch
 * fails, FALLBACK keeps the section intact. The count-up starts once the
 * ticket is in view AND the real number has arrived.
 */
const FALLBACK = 50; // the server-side offset floor — safe, never inflated

function formatCount(n: number, locale: Locale): string {
  return n.toLocaleString(locale === "ar" ? "ar-EG" : "en-US");
}

export default function WaitlistCounter({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const w = dict.home.waitlist;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [target, setTarget] = useState<number | null>(null);
  const [shown, setShown] = useState<number | null>(null);

  // Fetch on mount, not on scroll — the number is usually ready before the
  // ticket enters the viewport, so the skeleton is rarely seen at all.
  useEffect(() => {
    const ctrl = new AbortController();
    fetch("/api/waitlist-count", { cache: "no-store", signal: ctrl.signal })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`${res.status}`))))
      .then((data: { count?: unknown }) => {
        setTarget(
          typeof data.count === "number" && Number.isFinite(data.count) && data.count >= 0
            ? Math.round(data.count)
            : FALLBACK
        );
      })
      .catch(() => {
        if (!ctrl.signal.aborted) setTarget(FALLBACK);
      });
    return () => ctrl.abort();
  }, []);

  // Count up once the ticket scrolls into view and the live number exists.
  // Reduced motion (or no JS) never gates content: the final value is set
  // directly, and the skeleton's pulse is stilled by the global motion clamp.
  useEffect(() => {
    if (!inView || target === null) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(target);
      return;
    }
    const start = performance.now();
    const from = Math.max(0, target - 160);
    const DURATION = 1400;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION);
      const eased = 1 - Math.pow(1 - t, 3);
      setShown(Math.round(from + (target - from) * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target]);

  return (
    <section
      id="waitlist-counter"
      className="border-t border-line bg-surface2/60"
    >
      <div className="container-pad py-14 sm:py-20">
        <div
          ref={ref}
          className="grid items-center gap-10 lg:grid-cols-[1fr_auto] lg:gap-16"
        >
          <div>
            <span className="label">{w.label}</span>
            <h2 className="mt-5 max-w-xl text-[clamp(1.8rem,3.2vw,2.75rem)] leading-[1.12] text-content">
              {w.title}
            </h2>
            <p className="mt-4 max-w-[52ch] text-lg leading-[1.6] text-muted">
              {w.body}
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-4">
              <LocaleLink
                href="/claim"
                locale={locale}
                className="btn btn-spark"
              >
                {w.cta}
              </LocaleLink>
              <span className="text-sm text-muted">{w.note}</span>
            </div>
          </div>

          {/* The ticket — a stamped queue number, not a floating bubble */}
          <div className="flex justify-center lg:justify-end">
            <div className="ticket flex w-fit flex-col items-center px-10 py-8 sm:px-14 sm:py-10">
              {/* No opacity dimming: the ticket's ink on terracotta is 4.89:1,
                  but at 70% it collapses to 3.15:1 — under AA for 12px bold. */}
              <span className="text-xs font-bold uppercase tracking-[0.14em] rtl:tracking-normal">
                {w.ticketLabel}
              </span>
              <span
                className="mt-2 font-mono text-[clamp(3rem,7vw,4.5rem)] font-bold leading-none tabular-nums"
                dir="ltr"
                aria-live="off"
                aria-busy={shown === null}
              >
                {shown === null ? (
                  // Same-line-box skeleton (em/ch sized): holds the ticket's
                  // shape while the count loads, no 0-flash, no layout jump.
                  <span
                    aria-hidden="true"
                    className="inline-block h-[0.72em] w-[3ch] animate-pulse rounded-lg bg-current opacity-20 align-middle"
                  />
                ) : (
                  formatCount(shown, locale)
                )}
              </span>
              <span className="mt-3 flex items-center gap-2 text-sm font-bold">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-content/60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-content" />
                </span>
                {w.countLabel}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
