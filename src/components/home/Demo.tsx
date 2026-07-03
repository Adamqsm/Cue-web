"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { Dictionary } from "@/i18n/dictionaries";
import SectionIntro from "./SectionIntro";
import { cn } from "@/lib/utils";

const INTERVAL = 3000;

export default function Demo({ dict }: { dict: Dictionary }) {
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
    <section className="container-pad py-20 sm:py-28">
      <SectionIntro label={d.label} title={d.title} body={d.body} />

      <div className="mt-12 overflow-hidden rounded-[2rem] border border-ink/60 bg-ink p-8 shadow-lift sm:p-12">
        <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          {/* Screen */}
          <div className="flex justify-center">
            <div className="relative w-[240px] overflow-hidden rounded-[2rem] border border-bone/15 bg-ink-900 p-1.5 shadow-lift sm:w-[268px]">
              <div className="relative aspect-[1206/2622] w-full overflow-hidden rounded-[1.6rem]">
                {d.slides.map((slide, i) => (
                  <Image
                    key={slide.img}
                    src={slide.img}
                    alt={slide.caption}
                    fill
                    sizes="268px"
                    priority={i === 0}
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
                      "flex w-full items-center gap-4 rounded-xl px-3 py-3 text-start transition-colors",
                      i === active ? "bg-bone/[0.06]" : "hover:bg-bone/[0.03]"
                    )}
                  >
                    <span
                      className={cn(
                        "font-mono text-xs transition-colors",
                        i === active ? "text-green-300" : "text-bone/40"
                      )}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={cn(
                        "text-sm font-medium transition-colors sm:text-base",
                        i === active ? "text-bone" : "text-bone/50"
                      )}
                    >
                      {slide.caption}
                    </span>
                    {i === active && playing && (
                      <span className="ms-auto h-1 w-16 overflow-hidden rounded-full bg-bone/15">
                        <span
                          key={active}
                          className="block h-full bg-green-400"
                          style={{ animation: `demoprog ${INTERVAL}ms linear` }}
                        />
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ol>

            <div className="mt-6 flex items-center gap-3 border-t border-bone/10 pt-6">
              <button
                onClick={() => setPlaying((p) => !p)}
                aria-label={playing ? d.pause : d.play}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-bone/20 text-bone transition-colors hover:bg-bone hover:text-ink"
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
              <span className="font-mono text-xs uppercase tracking-[0.14em] text-bone/45">
                {playing ? d.pause : d.play} · {String(active + 1).padStart(2, "0")}/{String(count).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>
      </div>

      <style>{`@keyframes demoprog{from{width:0}to{width:100%}}`}</style>
    </section>
  );
}
