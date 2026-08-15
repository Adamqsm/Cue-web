"use client";

import { useEffect, useRef, useState } from "react";
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

type Status = "incoming" | "confirmed" | "seated";
type Row = { id: number; name: string; time: string; status: Status };

const VISIBLE = 4;
const CYCLE_MS = 4200;
const CONFIRM_MS = 1400;

/* Newest at the top; older entries have already been walked to their table. */
const SEED_STATUS: Status[] = ["confirmed", "confirmed", "seated", "seated"];

/** Normalize Arabic-Indic digits (٠-٩) to Western before parsing. */
function toWesternDigits(value: string): string {
  return value.replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660));
}

/** Party size out of a row name ("party of 4" / "٤ أشخاص") — Arabic-Indic aware. */
function partyOf(name: string): number {
  const match = name.match(/[0-9٠-٩]+/);
  if (!match) return 2;
  const n = parseInt(toWesternDigits(match[0]), 10);
  return Number.isFinite(n) && n > 0 ? n : 2;
}

/**
 * The signature element: a live "service board" docket.
 * The color moment made literal — every ~4s a new request slides in *glowing
 * marigold* (incoming/live), then settles to *olive* (confirmed) after a beat,
 * and the covers counter ticks up. A booking arrives as a warm signal and
 * settles into place: the product's core promise, shown not described.
 * Pausable (WCAG 2.2.2); reduced-motion users get a static all-confirmed board.
 */
export default function ServiceBoard({
  board,
  labels,
  tone = "page",
}: {
  board: Board;
  labels?: { play: string; pause: string };
  /** "band": the board sits on the navy brand band — the pause control
      restyles light so it stays visible there. */
  tone?: "page" | "band";
}) {
  const [rows, setRows] = useState<Row[]>(() =>
    board.rows
      .slice(0, VISIBLE)
      .reverse()
      .map((r, i) => ({ id: i, ...r, status: SEED_STATUS[i] ?? "seated" }))
  );
  const [covers, setCovers] = useState<string | number>(() => {
    const n = parseInt(toWesternDigits(board.footerValue), 10);
    return Number.isFinite(n) ? n : board.footerValue;
  });
  const [playing, setPlaying] = useState(true);
  const [hovered, setHovered] = useState(false);
  const idRef = useRef(VISIBLE);

  const arabicNumerals = /[٠-٩]/.test(board.footerValue);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPlaying(false);
      setRows((prev) =>
        prev.map((r) => ({ ...r, status: "confirmed" as Status }))
      );
    }
  }, []);

  useEffect(() => {
    if (board.rows.length === 0 || !playing || hovered) return;
    let confirmT: ReturnType<typeof setTimeout> | undefined;
    const cycle = setInterval(() => {
      const id = idRef.current++;
      const src = board.rows[id % board.rows.length];
      setRows((prev) => [
        { id, name: src.name, time: src.time, status: "incoming" },
        ...prev
          .slice(0, VISIBLE - 1)
          .map((r, i) => (i >= 1 ? { ...r, status: "seated" as Status } : r)),
      ]);
      confirmT = setTimeout(() => {
        setRows((prev) =>
          prev.map((r) =>
            r.id === id ? { ...r, status: "confirmed" as Status } : r
          )
        );
        setCovers((c) => (typeof c === "number" ? c + partyOf(src.name) : c));
      }, CONFIRM_MS);
    }, CYCLE_MS);
    return () => {
      clearInterval(cycle);
      if (confirmT) clearTimeout(confirmT);
    };
  }, [board.rows, playing, hovered]);

  return (
    <div className="w-full max-w-md">
      <div
        aria-hidden="true"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="overflow-hidden rounded-panel border border-line bg-surface shadow-card"
      >
        {/* Header — title + live pill */}
        <div className="flex items-center justify-between gap-3 border-b border-line bg-surface2/50 ps-5 pe-5 py-4">
          <span className="label !text-muted">{board.title}</span>
          <span className="pill-live">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-spark" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-spark" />
            </span>
            {board.live}
          </span>
        </div>

        {/* Rows — hairline-separated docket lines */}
        <ul className="divide-y divide-line">
          {rows.map((row) => (
            <li
              key={row.id}
              className={cn(
                "relative flex items-center gap-3 ps-5 pe-5 py-3.5 transition-colors duration-500",
                row.id >= VISIBLE && "animate-board-in",
                row.status === "incoming" && "bg-spark-wash/60"
              )}
            >
              {/* Reading-edge glow bar on the live row */}
              <span
                className={cn(
                  "absolute inset-y-0 start-0 w-[3px] transition-colors duration-500",
                  row.status === "incoming"
                    ? "bg-spark"
                    : row.status === "confirmed"
                      ? "bg-accent"
                      : "bg-transparent"
                )}
                style={{ insetInlineStart: 0 }}
              />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold text-content">
                  {row.name}
                </div>
                <div className="mt-0.5 text-xs tabular-nums text-muted">
                  {row.time}
                </div>
              </div>
              <StatusPill label={board.states[row.status]} status={row.status} />
            </li>
          ))}
        </ul>

        {/* Footer — covers counter, ticks up as requests confirm */}
        <div className="flex items-baseline justify-between gap-3 border-t border-line bg-surface2/60 ps-5 pe-5 py-4">
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted rtl:text-xs rtl:normal-case rtl:tracking-normal">
            {board.footerLabel}
          </span>
          <span className="display text-xl font-semibold tabular-nums text-content">
            {typeof covers === "number"
              ? covers.toLocaleString(arabicNumerals ? "ar-EG" : "en-US", {
                  useGrouping: false,
                })
              : covers}
          </span>
        </div>
      </div>

      {/* Pause/stop mechanism (WCAG 2.2.2) */}
      {labels && (
        <div className="mt-3 flex justify-end">
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? labels.pause : labels.play}
            className={cn(
              "inline-flex h-11 w-11 items-center justify-center rounded-full border transition-colors duration-200",
              tone === "band"
                ? "border-white/40 text-white hover:bg-white/10"
                : "border-line text-content hover:border-spark/50 hover:bg-spark-wash hover:text-spark-deep"
            )}
          >
            {playing ? (
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                <rect x="6" y="5" width="4" height="14" rx="1" />
                <rect x="14" y="5" width="4" height="14" rx="1" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                <path d="M7 5l12 7-12 7V5Z" />
              </svg>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

/* Color moment: incoming = marigold spark, confirmed = olive, seated = muted. */
function StatusPill({ label, status }: { label: string; status: Status }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full ps-2.5 pe-2.5 py-1 text-[11px] font-semibold transition-colors duration-500",
        status === "incoming" && "bg-spark-wash text-spark-deep",
        status === "confirmed" && "bg-accent-wash text-accent-deep",
        status === "seated" && "bg-muted/10 text-muted"
      )}
    >
      {status === "confirmed" && (
        <svg
          viewBox="0 0 24 24"
          className="h-3 w-3"
          fill="none"
          stroke="currentColor"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M5 13l4 4L19 7" />
        </svg>
      )}
      {label}
    </span>
  );
}
