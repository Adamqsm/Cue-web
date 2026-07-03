"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Dictionary } from "@/i18n/dictionaries";
import SectionIntro from "./SectionIntro";
import { cn } from "@/lib/utils";

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function HowItWorks({ dict }: { dict: Dictionary }) {
  const h = dict.home.hiw;
  const [tab, setTab] = useState<"guests" | "operators">("operators");
  const steps = h[tab];

  return (
    <section className="container-pad py-20 sm:py-28">
      <SectionIntro label={h.label} title={h.title} body={h.body} align="center" />

      {/* Tab switch */}
      <div className="mt-10 flex justify-center">
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
              onClick={() => setTab(key)}
              className={cn(
                "relative rounded-full px-5 py-2 text-sm font-semibold transition-colors",
                tab === key ? "text-bone dark:text-ink" : "text-muted hover:text-content"
              )}
            >
              {tab === key && (
                <motion.span
                  layoutId="hiw-pill"
                  transition={{ duration: 0.35, ease }}
                  className="absolute inset-0 -z-10 rounded-full bg-green dark:bg-green-500"
                />
              )}
              {h.tabs[key]}
            </button>
          ))}
        </div>
      </div>

      {/* Steps */}
      <AnimatePresence mode="wait">
        <motion.ol
          key={tab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease }}
          className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4"
        >
          {steps.map((step, i) => (
            <li key={step.title} className="group relative bg-surface p-6 sm:p-7">
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-sm font-medium text-green dark:text-green-300">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {i < steps.length - 1 && (
                  <span className="text-muted/40 rtl:rotate-180" aria-hidden>
                    →
                  </span>
                )}
              </div>
              <h3 className="mt-6 text-lg font-bold text-content">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{step.body}</p>
              <span className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-green transition-transform duration-500 group-hover:scale-x-100 rtl:origin-right" />
            </li>
          ))}
        </motion.ol>
      </AnimatePresence>
    </section>
  );
}
