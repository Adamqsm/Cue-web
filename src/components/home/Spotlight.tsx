"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { Dictionary } from "@/i18n/dictionaries";
import EditorialSection from "./EditorialSection";

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * "Split the night" — the social beat. Group-payment shares land one by one as
 * the section enters view (whileInView stagger, reduced-motion clamped by
 * MotionConfig), landing beside the real app screen. Warm, playful, on-token.
 */
export default function Spotlight({
  dict,
  num = "04",
}: {
  dict: Dictionary;
  num?: string;
}) {
  const s = dict.home.features.spotlight;
  // Illustrative share chips — visual only, mirrors the "everyone pays a share"
  // idea (aria-hidden; the real copy carries meaning).
  const shares = ["1/4", "2/4", "3/4", "4/4"];

  return (
    <EditorialSection num={num} label={s.label} band="surface2">
      <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <div>
          <h2 className="text-[clamp(1.9rem,3.4vw,3rem)] leading-[1.08] text-content">
            {s.title}
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-[1.6] text-muted">{s.body}</p>
          <ul className="mt-8 space-y-3.5">
            {s.points.map((point) => (
              <li key={point} className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-wash text-accent-deep">
                  <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <span className="text-content">{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Phone + landing share chips */}
        <div className="relative flex justify-center lg:justify-end">
          <div className="relative w-[236px] rounded-panel border border-line bg-surface p-1.5 shadow-card sm:w-[264px]">
            <div className="relative aspect-[1206/2622] w-full overflow-hidden rounded-card">
              <Image
                src={s.image}
                alt={s.imageAlt}
                fill
                sizes="264px"
                className="object-cover"
              />
            </div>
          </div>

          {/* Landing chips — decorative, staggered on view */}
          <motion.ul
            aria-hidden
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            transition={{ staggerChildren: 0.16, delayChildren: 0.2 }}
            className="pointer-events-none absolute end-[-8px] top-6 flex flex-col gap-2.5 sm:end-[-18px]"
          >
            {shares.map((sh, i) => (
              <motion.li
                key={sh}
                variants={{
                  hidden: { opacity: 0, y: 12, scale: 0.9 },
                  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease } },
                }}
                className="flex items-center gap-2 rounded-full border border-line bg-surface ps-2 pe-3 py-1.5 shadow-soft"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-white dark:text-content">
                  <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <span className="text-xs font-semibold tabular-nums text-content">
                  {sh}
                </span>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </div>
    </EditorialSection>
  );
}
