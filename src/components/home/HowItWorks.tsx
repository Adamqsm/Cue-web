"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Dictionary } from "@/i18n/dictionaries";
import SectionIntro from "./SectionIntro";
import BookingPhone from "@/components/illustrations/BookingPhone";
import OperatorBoard from "@/components/illustrations/OperatorBoard";
import { cn } from "@/lib/utils";

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function HowItWorks({ dict }: { dict: Dictionary }) {
  const h = dict.home.hiw;
  const [tab, setTab] = useState<"guests" | "operators">("operators");
  const steps = h[tab];

  return (
    <section className="container-pad py-20 sm:py-28">
      <SectionIntro label={h.label} title={h.title} body={h.body} align="center" />

      {/* Pill segmented control */}
      <div className="mt-10 flex justify-center">
        <div
          role="tablist"
          aria-label={h.title}
          className="inline-flex rounded-full bg-surface2 p-1"
        >
          {(["operators", "guests"] as const).map((key) => (
            <button
              key={key}
              role="tab"
              aria-selected={tab === key}
              onClick={() => setTab(key)}
              className={cn(
                "relative min-h-[44px] rounded-full px-5 py-2 text-sm font-semibold transition-colors duration-200",
                tab === key ? "text-content" : "text-muted hover:text-content"
              )}
            >
              {tab === key && (
                <motion.span
                  layoutId="hiw-thumb"
                  transition={{ duration: 0.2, ease }}
                  className="absolute inset-0 -z-10 rounded-full border border-line bg-surface shadow-soft"
                />
              )}
              {h.tabs[key]}
            </button>
          ))}
        </div>
      </div>

      {/* Steps + supporting illustration */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25, ease }}
          className="mx-auto mt-14 grid max-w-5xl items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,400px)]"
        >
          <ol className="divide-y divide-line">
            {steps.map((step, i) => (
              <li key={step.title} className="flex items-baseline gap-5 py-6">
                <span className="w-8 shrink-0 text-sm font-semibold tabular-nums text-accent-deep dark:text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-lg text-content">{step.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <div className="hidden lg:block">
            {tab === "guests" ? (
              <BookingPhone className="mx-auto w-full max-w-[340px]" />
            ) : (
              <OperatorBoard className="mx-auto w-full max-w-[400px]" />
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
