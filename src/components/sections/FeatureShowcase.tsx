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
      <ol className="order-2 flex flex-col gap-2 lg:order-1">
        {features.map((f, i) => {
          const on = i === active;
          return (
            <li key={f.title}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-current={on}
                className={cn(
                  "w-full rounded-3xl border p-5 text-start transition-all duration-300",
                  on
                    ? dark
                      ? "border-green/50 bg-bone/[0.06]"
                      : "border-green/40 bg-surface2"
                    : dark
                      ? "border-bone/10 hover:border-bone/25"
                      : "border-line hover:border-content/25"
                )}
              >
                <div className="flex items-start gap-4">
                  <span
                    className={cn(
                      "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-display text-sm font-semibold transition-colors",
                      on
                        ? "bg-green text-bone"
                        : dark
                          ? "bg-bone/10 text-bone/70"
                          : "bg-content/10 text-content/60"
                    )}
                  >
                    {i + 1}
                  </span>
                  <div>
                    <h3
                      className={cn(
                        "text-lg font-semibold",
                        dark ? "text-bone" : "text-content"
                      )}
                    >
                      {f.title}
                    </h3>
                    <div
                      className={cn(
                        "grid transition-all duration-300",
                        on ? "mt-2 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                      )}
                    >
                      <p
                        className={cn(
                          "overflow-hidden text-sm",
                          dark ? "text-bone/65" : "text-content/65"
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
        <div className="relative">
          <div
            className={cn(
              "absolute inset-0 -z-10 scale-125 rounded-full blur-3xl",
              dark ? "bg-green/20" : "bg-green/10"
            )}
          />
          <AnimatePresence mode="wait">
            <motion.div
              key={current.img}
              initial={{ opacity: 0, y: 16, rotate: -2 }}
              animate={{ opacity: 1, y: 0, rotate: -3 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <PhoneFrame src={current.img} alt={current.title} width={280} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
