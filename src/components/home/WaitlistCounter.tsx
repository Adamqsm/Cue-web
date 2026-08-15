"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import LocaleLink from "@/components/ui/LocaleLink";

/**
 * The queue counter — how many people are already in.
 *
 * DATA SOURCE (PLACEHOLDER until wired): the site is fully static (SSG) and
 * this redesign is frontend-only, so there is no live endpoint to read the
 * real Cue Insider claim count yet. The number below is a configured baseline
 * that grows deterministically by day, so it moves between visits without a
 * backend and without hydration mismatches (the DOM always renders BASELINE;
 * the count-up runs after mount). When a real count endpoint exists, replace
 * `queueCount()` with the fetched value and delete this note.
 */
const BASELINE = 2300; // PLACEHOLDER — sync with the real Cue Insider list size
const PER_DAY = 12; // PLACEHOLDER — growth pacing between manual syncs
const ANCHOR_UTC = Date.UTC(2026, 7, 1); // 2026-08-01

function queueCount(): number {
  const days = Math.max(0, Math.floor((Date.now() - ANCHOR_UTC) / 86_400_000));
  return BASELINE + days * PER_DAY;
}

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
  const [shown, setShown] = useState(BASELINE);

  // Count up from the baseline once the ticket scrolls into view. Reduced
  // motion (or no JS) simply keeps the baseline value — content never gates
  // on the animation.
  useEffect(() => {
    if (!inView) return;
    const target = queueCount();
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
  }, [inView]);

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
              <span className="text-xs font-bold uppercase tracking-[0.14em] rtl:tracking-normal opacity-70">
                {w.ticketLabel}
              </span>
              <span
                className="mt-2 font-mono text-[clamp(3rem,7vw,4.5rem)] font-bold leading-none tabular-nums"
                dir="ltr"
                aria-live="off"
              >
                {formatCount(shown, locale)}
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
