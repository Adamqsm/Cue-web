"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Board = {
  title: string;
  live: string;
  states: { incoming: string; confirmed: string; seated: string };
  rows: { name: string; time: string }[];
  footerLabel: string;
  footerValue: string;
  confirmLabel: string;
};

/**
 * The signature element: a live reservation "service board".
 * The top row cycles Incoming → Confirmed on a gentle loop — the product's
 * core promise, shown rather than described. Static confirmed state under
 * reduced-motion.
 */
export default function ServiceBoard({ board }: { board: Board }) {
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setConfirmed(true);
      return;
    }
    let t: ReturnType<typeof setTimeout>;
    const loop = () => {
      setConfirmed(false);
      t = setTimeout(() => {
        setConfirmed(true);
        t = setTimeout(loop, 2600);
      }, 2600);
    };
    loop();
    return () => clearTimeout(t);
  }, []);

  const statuses = [
    confirmed ? "confirmed" : "incoming",
    "confirmed",
    "confirmed",
    "seated",
  ] as const;

  return (
    <div className="relative w-full max-w-md">
      {/* soft glow behind the panel */}
      <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-green/10 blur-2xl dark:bg-green/20" />

      <div className="card overflow-hidden p-0 shadow-lift">
        {/* header */}
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
            {board.title}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-amber/15 px-2.5 py-1 text-[11px] font-semibold text-amber">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-amber" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber" />
            </span>
            {board.live}
          </span>
        </div>

        {/* rows */}
        <ul className="divide-y divide-line">
          {board.rows.slice(0, 4).map((row, i) => {
            const status = statuses[i];
            const isTop = i === 0;
            return (
              <li
                key={row.name}
                className={cn(
                  "relative flex items-center gap-3 px-5 py-3.5 transition-colors duration-500",
                  isTop && !confirmed && "bg-amber/[0.06]"
                )}
              >
                {/* sweep highlight when the top row confirms */}
                {isTop && confirmed && (
                  <span className="pointer-events-none absolute inset-0 overflow-hidden">
                    <span className="absolute inset-y-0 w-1/3 animate-sweep bg-gradient-to-r from-transparent via-green/15 to-transparent" />
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold text-content">
                    {row.name}
                  </div>
                  <div className="font-mono text-[11px] text-muted">{row.time}</div>
                </div>

                {isTop && !confirmed ? (
                  <span className="btn btn-primary !px-3.5 !py-1.5 !text-xs">
                    {board.confirmLabel}
                  </span>
                ) : (
                  <StatusChip
                    label={board.states[status]}
                    tone={status === "seated" ? "muted" : "green"}
                  />
                )}
              </li>
            );
          })}
        </ul>

        {/* footer */}
        <div className="flex items-center justify-between border-t border-line bg-surface2/60 px-5 py-3.5">
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
            {board.footerLabel}
          </span>
          <span className="font-display text-lg font-semibold text-content">
            {board.footerValue}
          </span>
        </div>
      </div>
    </div>
  );
}

function StatusChip({ label, tone }: { label: string; tone: "green" | "muted" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold",
        tone === "green"
          ? "bg-green/12 text-green dark:bg-green/20 dark:text-green-300"
          : "bg-content/8 text-muted"
      )}
    >
      {tone === "green" && (
        <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 13l4 4L19 7" />
        </svg>
      )}
      {label}
    </span>
  );
}
