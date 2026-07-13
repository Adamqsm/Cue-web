"use client";

import { motion, type Variants } from "framer-motion";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import LocaleLink from "@/components/ui/LocaleLink";
import ServiceBoard from "@/components/home/ServiceBoard";

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* One restrained staggered rise — Reveal timing: 12px / 0.5s / 60ms. */
const rise: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

export default function HomeHero({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const h = dict.home.hero;
  return (
    <section className="relative pb-16 pt-28 sm:pt-32 lg:pb-24 lg:pt-36">
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="container-pad grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16"
      >
        {/* Copy */}
        <div>
          {/* Eyebrow status pill — accent wash, accent-deep text, tiny live dot */}
          <motion.span
            variants={rise}
            className="inline-flex items-center gap-2 rounded-full bg-accent-wash ps-3.5 pe-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-deep rtl:text-xs rtl:normal-case rtl:tracking-normal"
          >
            <span
              className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
              aria-hidden="true"
            />
            {h.status}
          </motion.span>

          {/* Display headline — weight/tracking/leading come from the global h1 role */}
          <motion.h1
            variants={rise}
            className="mt-6 text-[clamp(2.5rem,6vw,4.75rem)]"
          >
            <span className="block text-content">{h.titleTop}</span>
            <span className="block text-accent">{h.titleAccent}</span>
          </motion.h1>

          <motion.p
            variants={rise}
            className="mt-6 max-w-[60ch] text-lg leading-[1.65] text-muted"
          >
            {h.subtitle}
          </motion.p>

          <motion.div
            variants={rise}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <LocaleLink
              href="/reach-out"
              locale={locale}
              className="btn btn-primary"
            >
              {h.primary}
              <span className="nudge inline-flex" aria-hidden="true">
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 rtl:-scale-x-100"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="m13 6 6 6-6 6" />
                </svg>
              </span>
            </LocaleLink>
            <LocaleLink
              href="/partner"
              locale={locale}
              className="btn btn-outline"
            >
              {h.secondary}
            </LocaleLink>
          </motion.div>

          <motion.p variants={rise} className="mt-5 text-[13px] text-muted">
            {h.note}
          </motion.p>
        </div>

        {/* Signature: live service board */}
        <motion.div variants={rise} className="flex justify-center lg:justify-end">
          <ServiceBoard
            board={h.board}
            labels={{ play: dict.home.demo.play, pause: dict.home.demo.pause }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
