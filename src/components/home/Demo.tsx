"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { Dictionary } from "@/i18n/dictionaries";
import EditorialSection from "./EditorialSection";
import { cn } from "@/lib/utils";

const INTERVAL = 3000;

/** "See it move" — the real app screens, in a clean device frame. */
export default function Demo({
  dict,
  num = "05",
}: {
  dict: Dictionary;
  num?: string;
}) {
  const d = dict.home.demo;
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const count = d.slides.length;

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) setPlaying(false);
  }, []);

  useEffect(() => {
    if (!playing) return;
    timer.current = setInterval(() => setActive((a) => (a + 1) % count), INTERVAL);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [playing, count]);

  return (
    <EditorialSection num={num} label={d.label} band="bg">
      <div className="max-w-2xl">
        <h2 className="text-[clamp(1.9rem,3.4vw,3rem)] leading-[1.08] text-content">
          {d.title}
        </h2>
        <p className="mt-5 text-lg leading-[1.6] text-muted">{d.body}</p>
      </div>

      <div className="mt-10 grid items-center gap-10 lg:grid-cols-[0.85fr_1.15fr]">
        {/* Screen */}
        <div className="flex justify-center">
          <div className="relative w-[240px] rounded-panel border border-line bg-surface p-1.5 shadow-card sm:w-[268px]">
            <div className="relative aspect-[1206/2622] w-full overflow-hidden rounded-card">
              {d.slides.map((slide, i) => (
                <Image
                  key={slide.img}
                  src={slide.img}
                  alt={slide.caption}
                  fill
                  sizes="268px"
                  loading="lazy"
                  className={cn(
                    "object-cover transition-opacity duration-700",
                    i === active ? "opacity-100" : "opacity-0"
                  )}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Captions + controls */}
        <div>
          <ol className="space-y-1">
            {d.slides.map((slide, i) => (
              <li key={slide.caption}>
                <button
                  onClick={() => setActive(i)}
                  className={cn(
                    "flex w-full items-center gap-4 rounded-chip border px-3 py-3 text-start transition-colors duration-200",
                    i === active
                      ? "border-line bg-surface"
                      : "border-transparent hover:bg-surface/60"
                  )}
                >
                  <span
                    className={cn(
                      "display text-lg font-semibold tabular-nums transition-colors",
                      i === active ? "text-spark-deep" : "text-muted"
                    )}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={cn(
                      "text-sm font-medium transition-colors sm:text-base",
                      i === active ? "text-content" : "text-muted"
                    )}
                  >
                    {slide.caption}
                  </span>
                  {i === active && playing && (
                    <span className="ms-auto h-1 w-16 overflow-hidden rounded-full bg-line">
                      <span
                        key={active}
                        className="block h-full bg-spark"
                        style={{ animation: `demoprog ${INTERVAL}ms linear` }}
                      />
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ol>

          <div className="mt-6 flex items-center gap-3 border-t border-line pt-6">
            <button
              onClick={() => setPlaying((p) => !p)}
              aria-label={playing ? d.pause : d.play}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line text-content transition-colors duration-200 hover:border-spark/50 hover:bg-spark-wash hover:text-spark-deep"
            >
              {playing ? (
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                  <rect x="6" y="5" width="4" height="14" rx="1" />
                  <rect x="14" y="5" width="4" height="14" rx="1" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                  <path d="M7 5l12 7-12 7V5Z" />
                </svg>
              )}
            </button>
            <span className="text-xs font-medium tabular-nums text-muted">
              {playing ? d.pause : d.play} · {String(active + 1).padStart(2, "0")}/{String(count).padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>

      <style>{`@keyframes demoprog{from{width:0}to{width:100%}}`}</style>
    </EditorialSection>
  );
}
