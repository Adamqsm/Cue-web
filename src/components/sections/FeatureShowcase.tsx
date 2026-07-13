"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import PhoneFrame from "@/components/ui/PhoneFrame";
import { cn } from "@/lib/utils";

type Feature = { img: string; title: string; body: string };

export default function FeatureShowcase({
  features,
  variant = "light",
}: {
  features: Feature[];
  variant?: "light" | "dark";
}) {
  const [active, setActive] = useState(0);
  const dark = variant === "dark";
  const current = features[active];

  return (
    <div className="grid items-center gap-10 lg:grid-cols-[1fr_0.9fr]">
      <ol className="order-2 flex flex-col gap-3 lg:order-1">
        {features.map((f, i) => {
          const on = i === active;
          return (
            <li key={f.title}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-expanded={on}
                className={cn(
                  "w-full p-5 text-start",
                  dark
                    ? cn(
                        "rounded-card border transition-all duration-200",
                        on
                          ? "border-accent bg-bg/[0.06]"
                          : "border-bg/15 hover:border-bg/30"
                      )
                    : /* No card-hover on the selected card — its :hover rule
                         would fade the full-accent border down to accent/35. */
                      on
                      ? "card border-accent"
                      : "card card-hover"
                )}
              >
                <div className="flex items-start gap-4">
                  <span
                    className={cn(
                      "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-[600] tabular-nums transition-colors",
                      on
                        ? dark
                          ? "bg-bg/15 text-bg"
                          : "bg-accent-wash text-accent-deep"
                        : dark
                          ? "bg-bg/10 text-bg/70"
                          : "bg-surface2 text-muted"
                    )}
                  >
                    {i + 1}
                  </span>
                  <div>
                    <h3
                      className={cn(
                        "text-lg",
                        dark ? "text-bg" : "text-content"
                      )}
                    >
                      {f.title}
                    </h3>
                    <div
                      className={cn(
                        // visibility rides the transition so the collapsed
                        // body is hidden from AT once the animation ends.
                        "grid transition-all duration-200",
                        on
                          ? "visible mt-2 grid-rows-[1fr] opacity-100"
                          : "invisible grid-rows-[0fr] opacity-0"
                      )}
                    >
                      <p
                        className={cn(
                          "overflow-hidden text-sm leading-relaxed",
                          dark ? "text-bg/70" : "text-muted"
                        )}
                      >
                        {f.body}
                      </p>
                    </div>
                  </div>
                </div>
              </button>
            </li>
          );
        })}
      </ol>

      <div className="order-1 flex justify-center lg:order-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.img}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <PhoneFrame
              src={current.img}
              alt={`${current.title} — Cue restaurant reservation app, Amman`}
              width={280}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
