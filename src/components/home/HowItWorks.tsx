"use client";

import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import type { Dictionary } from "@/i18n/dictionaries";
import EditorialSection from "./EditorialSection";
import BookingPhone from "@/components/illustrations/BookingPhone";
import OperatorBoard from "@/components/illustrations/OperatorBoard";
import { cn } from "@/lib/utils";

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * "The Loop" — the motion centerpiece. On desktop the four booking steps are
 * pinned and advance with scroll position (scroll-linked, not fade-in): the
 * progress rail fills, the active step enlarges, the illustration stays as the
 * anchor. A guest/operator toggle swaps the narration. On mobile and under
 * reduced-motion it degrades to a plain stacked list — no pin, no jank, all
 * content always visible.
 */
export default function HowItWorks({
  dict,
  num = "02",
}: {
  dict: Dictionary;
  num?: string;
}) {
  const h = dict.home.hiw;
  const [tab, setTab] = useState<"guests" | "operators">("operators");
  const steps = h[tab];

  const scrollRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"],
  });
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const i = Math.min(steps.length - 1, Math.floor(v * steps.length));
    setActive(i < 0 ? 0 : i);
  });

  return (
    <EditorialSection num={num} label={h.label} band="surface2">
      <div className="max-w-2xl">
        <h2 className="text-[clamp(1.9rem,3.4vw,3rem)] leading-[1.08] text-content">
          {h.title}
        </h2>
        <p className="mt-5 text-lg leading-[1.6] text-muted">{h.body}</p>
      </div>

      {/* Toggle */}
      <div className="mt-9">
        <div
          role="tablist"
          aria-label={h.title}
          className="inline-flex rounded-full border border-line bg-surface p-1"
        >
          {(["operators", "guests"] as const).map((key) => (
            <button
              key={key}
              role="tab"
              aria-selected={tab === key}
              onClick={() => {
                setTab(key);
                setActive(0);
              }}
              className={cn(
                "relative min-h-[44px] rounded-full px-5 py-2 text-sm font-semibold transition-colors duration-200",
                tab === key ? "text-content" : "text-muted hover:text-content"
              )}
            >
              {tab === key && (
                <motion.span
                  layoutId="loop-thumb"
                  transition={{ duration: 0.25, ease }}
                  className="absolute inset-0 -z-10 rounded-full bg-accent-wash"
                />
              )}
              {h.tabs[key]}
            </button>
          ))}
        </div>
      </div>

      {/* ---- Desktop: pinned scroll-advancing sequence (skipped when the
           user prefers reduced motion — no tall spacer, no dead zone) ---- */}
      {!reduced && (
      <div ref={scrollRef} className="relative mt-10 hidden lg:block" style={{ height: `${steps.length * 78}vh` }}>
        <div className="sticky top-24 grid grid-cols-[minmax(0,1fr)_minmax(0,420px)] items-center gap-14">
          {/* Steps rail */}
          <div className="relative">
            {/* progress track */}
            <span className="absolute inset-y-0 start-[15px] w-px bg-line" aria-hidden />
            <motion.span
              className="absolute start-[15px] top-0 w-px origin-top bg-accent"
              style={{ scaleY: scrollYProgress, height: "100%" }}
              aria-hidden
            />
            <ol className="space-y-2">
              {steps.map((step, i) => {
                const on = i === active;
                return (
                  <li key={step.title} className="relative ps-12">
                    <span
                      className={cn(
                        "absolute start-0 top-1 flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold tabular-nums transition-colors duration-300",
                        on
                          ? "border-accent bg-accent text-white dark:text-content"
                          : "border-line bg-surface text-muted"
                      )}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <button
                      type="button"
                      onClick={() => setActive(i)}
                      className="block py-3 text-start"
                    >
                      <h3
                        className={cn(
                          "text-xl transition-colors duration-300 sm:text-2xl",
                          on ? "text-content" : "text-muted"
                        )}
                      >
                        {step.title}
                      </h3>
                      <AnimatePresence initial={false}>
                        {on && (
                          <motion.p
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease }}
                            className="overflow-hidden text-[15px] leading-relaxed text-muted"
                          >
                            <span className="mt-2 block max-w-md">{step.body}</span>
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* Illustration anchor */}
          <div className="relative flex justify-center">
            <div className="pointer-events-none absolute inset-0 -z-10 m-auto h-64 w-64 rounded-full bg-accent-wash blur-2xl" aria-hidden />
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.3, ease }}
              >
                {tab === "guests" ? (
                  <BookingPhone className="w-full max-w-[320px]" />
                ) : (
                  <OperatorBoard className="w-full max-w-[420px]" />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
      )}

      {/* ---- Mobile / reduced-motion / no-JS: static stacked list ---- */}
      <ol
        className={cn(
          "mt-8 divide-y divide-line border-y border-line",
          !reduced && "lg:hidden"
        )}
      >
        {steps.map((step, i) => (
          <li key={step.title} className="flex items-baseline gap-4 py-5">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-wash text-xs font-semibold tabular-nums text-accent-deep">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <h3 className="text-lg text-content">{step.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </EditorialSection>
  );
}
