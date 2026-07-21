"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";
import { cn } from "@/lib/utils";

type Band = "bg" | "surface2" | "ink" | "olive";

/**
 * The editorial spine. Each homepage chapter gets an oversized margin numeral
 * (Fraunces, sticky within the section) that lights marigold while the section
 * is the one in view — the "table of contents of the night." The margin column
 * is the grid's inline-start track, so it mirrors to the right in Arabic for
 * free. On mobile the spine collapses to a small inline number tag above the
 * content. Content is never gated on this — it's pure chrome.
 */
export default function EditorialSection({
  num,
  label,
  id,
  band = "bg",
  divide = true,
  children,
  className,
  contentClassName,
}: {
  num: string;
  label?: string;
  id?: string;
  band?: Band;
  divide?: boolean;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { margin: "-45% 0px -45% 0px" });

  const bandClass =
    band === "surface2"
      ? "bg-surface2"
      : band === "ink"
        ? "bg-content text-bg"
        : band === "olive"
          ? "bg-[rgb(var(--olive-band))] text-white"
          : "bg-transparent";

  const numTone =
    band === "ink" || band === "olive"
      ? inView
        ? "text-white/90"
        : "text-white/25"
      : undefined;

  return (
    <section
      id={id}
      ref={ref}
      className={cn(
        bandClass,
        divide && band === "bg" && "border-t border-line",
        (band === "surface2" || band === "ink" || band === "olive") &&
          "border-y border-line/60",
        className
      )}
    >
      <div className="container-pad py-16 sm:py-24 lg:py-28">
        <div className="grid gap-y-6 lg:grid-cols-[6.5rem_minmax(0,1fr)] lg:gap-x-10 xl:grid-cols-[8rem_minmax(0,1fr)]">
          {/* Desktop spine numeral — sticky within the section */}
          <div className="hidden lg:block">
            <div className="sticky top-28">
              <span
                data-active={inView}
                className={cn(
                  "section-num block text-[3.75rem] xl:text-[4.5rem]",
                  numTone
                )}
                aria-hidden="true"
              >
                {num}
              </span>
              {label && (
                <span
                  className={cn(
                    "mt-3 block text-[11px] font-semibold uppercase tracking-[0.2em]",
                    band === "ink" || band === "olive"
                      ? "text-white/60"
                      : "text-muted",
                    "rtl:tracking-normal rtl:text-xs rtl:normal-case font-sans"
                  )}
                >
                  {label}
                </span>
              )}
            </div>
          </div>

          {/* Content column */}
          <div className={cn("min-w-0", contentClassName)}>
            {/* Mobile inline chapter tag */}
            <div className="mb-6 flex items-center gap-3 lg:hidden">
              <span
                data-active="true"
                className={cn(
                  "section-num text-2xl",
                  (band === "ink" || band === "olive") && "!text-white/80"
                )}
                aria-hidden="true"
              >
                {num}
              </span>
              {label && (
                <span
                  className={cn(
                    "text-[11px] font-semibold uppercase tracking-[0.2em] rtl:tracking-normal rtl:text-xs rtl:normal-case",
                    band === "ink" || band === "olive"
                      ? "text-white/60"
                      : "text-muted"
                  )}
                >
                  {label}
                </span>
              )}
            </div>
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
