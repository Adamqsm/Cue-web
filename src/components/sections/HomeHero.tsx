"use client";

import { motion, type Variants } from "framer-motion";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import LocaleLink from "@/components/ui/LocaleLink";
import ServiceBoard from "@/components/home/ServiceBoard";

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

const rise: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

/**
 * "Tonight" — the opening spread. Not a centered hero with a gradient blob and
 * a wall of subtitle: an asymmetric editorial fold where the *live board*
 * co-headlines and does the talking (product truth over stock copy). The
 * headline is Fraunces at display size; the promise is one tight line.
 */
export default function HomeHero({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const h = dict.home.hero;
  return (
    <section className="relative overflow-hidden pb-16 pt-28 sm:pt-32 lg:pb-28 lg:pt-40">
      {/* Oversized ghost chapter numeral, bleeding off the reading edge */}
      <span
        aria-hidden="true"
        className="section-num pointer-events-none absolute -top-6 select-none text-[34vw] leading-none start-[-2vw] lg:text-[15rem]"
      >
        00
      </span>

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="container-pad relative grid items-center gap-12 lg:grid-cols-[1.02fr_0.98fr] lg:gap-14"
      >
        {/* Copy */}
        <div>
          <motion.div variants={rise} className="flex items-center gap-3">
            <span className="pill-live">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-spark" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-spark" />
              </span>
              {h.status}
            </span>
          </motion.div>

          <motion.h1
            variants={rise}
            className="mt-6 text-[clamp(2.75rem,6.4vw,5.25rem)] leading-[0.98]"
          >
            <span className="block text-content">{h.titleTop}</span>
            <span className="block italic text-accent rtl:not-italic">
              {h.titleAccent}
            </span>
          </motion.h1>

          <motion.p
            variants={rise}
            className="mt-7 max-w-[46ch] text-lg leading-[1.6] text-muted"
          >
            {h.subtitle}
          </motion.p>

          <motion.div
            variants={rise}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <LocaleLink href="/reach-out" locale={locale} className="btn btn-spark">
              {h.primary}
              <span className="nudge inline-flex" aria-hidden="true">
                <svg viewBox="0 0 24 24" className="h-4 w-4 rtl:-scale-x-100" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="m13 6 6 6-6 6" />
                </svg>
              </span>
            </LocaleLink>
            <LocaleLink href="/partner" locale={locale} className="btn btn-outline">
              {h.secondary}
            </LocaleLink>
          </motion.div>

          <motion.p variants={rise} className="mt-6 text-[13px] text-muted">
            {h.note}
          </motion.p>
        </div>

        {/* Signature: live service board, co-hero */}
        <motion.div
          variants={rise}
          className="flex justify-center lg:justify-end"
        >
          <div className="w-full max-w-md">
            <ServiceBoard
              board={h.board}
              labels={{ play: dict.home.demo.play, pause: dict.home.demo.pause }}
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
