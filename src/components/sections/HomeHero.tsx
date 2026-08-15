"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import LocaleLink from "@/components/ui/LocaleLink";

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

const rise: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const phoneIn: Variants = {
  hidden: { opacity: 0, y: 48, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease, delay: 0.15 },
  },
};

const chipPop: Variants = {
  hidden: { opacity: 0, y: 14, scale: 0.85 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease, delay: 0.55 + i * 0.18 },
  }),
};

/**
 * v5 "Queue Blue" opening — a launch moment, not a brochure. The queue pun
 * carries the headline; the product carries the visual: two real app screens
 * stacked like phones on a table, with the confirmation chips landing around
 * them. Load choreography staggers copy → phones → chips; a light scroll
 * parallax keeps it alive without stealing the page. Everything is gated by
 * MotionConfig reducedMotion="user", and reduced-motion users get the full
 * layout rendered instantly.
 */
export default function HomeHero({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const h = dict.home.hero;
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  // Subtle parallax: phones settle down, chips lift, as the hero scrolls away.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const phonesY = useTransform(scrollYProgress, [0, 1], [0, 56]);
  const chipsY = useTransform(scrollYProgress, [0, 1], [0, -36]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden pb-16 pt-28 sm:pt-32 lg:pb-24 lg:pt-36"
    >
      {/* Ground: one blue bloom + one yellow ember, fixed and quiet */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <span className="absolute -top-24 end-[-10%] h-96 w-96 rounded-full bg-accent-wash opacity-70 blur-3xl" />
        <span className="absolute bottom-[-20%] start-[-8%] h-80 w-80 rounded-full bg-spark-wash opacity-60 blur-3xl" />
      </div>

      <motion.div
        variants={stagger}
        initial={reduced ? "show" : "hidden"}
        animate="show"
        className="container-pad relative grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10"
      >
        {/* ---- Copy ---- */}
        <div className="relative z-10">
          <motion.div variants={rise}>
            <span className="pill-live">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-spark" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-spark" />
              </span>
              {h.status}
            </span>
          </motion.div>

          <motion.h1
            variants={rise}
            className="mt-6 text-[clamp(2.6rem,6.2vw,4.9rem)]"
          >
            <span className="block text-content">{h.titleTop}</span>
            <span className="relative mt-1 block w-fit text-accent">
              {h.titleAccent}
              {/* Hand-drawn underline swoosh, drawn in on load */}
              <motion.svg
                viewBox="0 0 220 14"
                aria-hidden="true"
                className="absolute -bottom-2 start-0 h-3 w-[68%] text-spark sm:-bottom-3"
                fill="none"
              >
                <motion.path
                  d="M4 10 C 60 2, 150 2, 216 8"
                  stroke="currentColor"
                  strokeWidth={5}
                  strokeLinecap="round"
                  initial={reduced ? { pathLength: 1 } : { pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: 0.6 }}
                />
              </motion.svg>
            </span>
          </motion.h1>

          <motion.p
            variants={rise}
            className="mt-7 max-w-[46ch] text-lg leading-[1.65] text-muted"
          >
            {h.subtitle}
          </motion.p>

          <motion.div
            variants={rise}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <LocaleLink
              href="/claim"
              locale={locale}
              className="btn btn-spark px-8 text-base"
            >
              {h.primary}
              <span className="nudge inline-flex" aria-hidden="true">
                <svg viewBox="0 0 24 24" className="h-4 w-4 rtl:-scale-x-100" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="m13 6 6 6-6 6" />
                </svg>
              </span>
            </LocaleLink>
            <LocaleLink
              href="/partner"
              locale={locale}
              className="btn btn-outline px-7 text-base"
            >
              {h.secondary}
            </LocaleLink>
          </motion.div>

          {/* Queue proof — reads on the counter section below */}
          <motion.a
            variants={rise}
            href="#waitlist-counter"
            className="mt-8 inline-flex min-h-[44px] items-center gap-3 text-sm font-semibold text-content transition-colors hover:text-accent-deep"
          >
            <span className="flex -space-x-2 rtl:space-x-reverse" aria-hidden="true">
              <span className="h-7 w-7 rounded-full border-2 border-bg bg-accent" />
              <span className="h-7 w-7 rounded-full border-2 border-bg bg-clay" />
              <span className="h-7 w-7 rounded-full border-2 border-bg bg-spark" />
            </span>
            <span>{h.proof}</span>
          </motion.a>
        </div>

        {/* ---- Product: two real screens + landing chips ---- */}
        <div className="relative flex justify-center lg:justify-end">
          <motion.div
            variants={phoneIn}
            style={reduced ? undefined : { y: phonesY }}
            className="relative me-4 mt-2 w-[248px] sm:w-[292px]"
          >
            {/* Back phone — the request being made */}
            <div className="absolute -start-24 top-10 w-[196px] -rotate-[9deg] rounded-panel border border-line bg-surface p-1.5 opacity-90 shadow-soft sm:-start-32 sm:w-[228px]">
              <div className="relative aspect-[1206/2622] w-full overflow-hidden rounded-card">
                <Image
                  src="/images/cue-app-guest-booking-request.jpeg"
                  alt={h.phoneBackAlt}
                  fill
                  sizes="228px"
                  className="object-cover"
                />
              </div>
            </div>

            {/* Front phone — the confirmed table */}
            <div className="relative rotate-[5deg] rounded-panel border border-line bg-surface p-1.5 shadow-card">
              <div className="relative aspect-[1206/2622] w-full overflow-hidden rounded-card">
                <Image
                  src="/images/cue-app-guest-reservation-confirmed.jpeg"
                  alt={h.phoneFrontAlt}
                  fill
                  priority
                  sizes="(max-width: 640px) 248px, 292px"
                  className="object-cover"
                />
              </div>
            </div>

            {/* Landing chips — decorative, the booking story in three beats */}
            <motion.div
              style={reduced ? undefined : { y: chipsY }}
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
            >
              <motion.span
                variants={chipPop}
                custom={0}
                className="absolute -start-28 -top-2 flex items-center gap-2 rounded-full border border-line bg-surface ps-2 pe-4 py-2 shadow-soft sm:-start-36"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ok text-white">
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <span className="text-xs font-bold text-content">{h.chips.confirmed}</span>
              </motion.span>

              <motion.span
                variants={chipPop}
                custom={1}
                className="ticket absolute -end-8 top-1/3 flex flex-col px-4 py-2.5 sm:-end-14"
              >
                <span className="text-[10px] font-bold uppercase tracking-wide rtl:tracking-normal opacity-70">
                  {h.chips.ticketLabel}
                </span>
                <span className="font-mono text-lg font-bold tabular-nums" dir="ltr">
                  {h.chips.ticket}
                </span>
              </motion.span>

              <motion.span
                variants={chipPop}
                custom={2}
                className="absolute -bottom-4 -start-12 flex items-center gap-2 rounded-full border border-line bg-surface ps-3 pe-4 py-2 shadow-soft sm:-start-20"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4 text-accent" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 3" />
                </svg>
                <span className="text-xs font-bold text-content">{h.chips.time}</span>
              </motion.span>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
