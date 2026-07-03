"use client";

import { motion } from "framer-motion";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import LocaleLink from "@/components/ui/LocaleLink";
import ServiceBoard from "@/components/home/ServiceBoard";

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function HomeHero({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const h = dict.home.hero;
  return (
    <section className="relative overflow-hidden pb-16 pt-28 sm:pt-32 lg:pb-24 lg:pt-40">
      <div className="container-pad grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
        {/* Copy */}
        <div>
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="inline-flex items-center gap-2.5 rounded-full border border-line bg-surface/70 px-3.5 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-muted backdrop-blur"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-green" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green" />
            </span>
            {h.status}
          </motion.span>

          <h1 className="mt-6 text-[2.9rem] font-extrabold leading-[0.95] tracking-tight sm:text-6xl lg:text-[4.6rem]">
            <motion.span
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease, delay: 0.08 }}
              className="block text-content"
            >
              {h.titleTop}
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease, delay: 0.2 }}
              className="block text-green dark:text-green-400"
            >
              {h.titleAccent}
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.34 }}
            className="mt-7 max-w-xl text-lg leading-relaxed text-muted sm:text-xl"
          >
            {h.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.46 }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <LocaleLink href="/partner" locale={locale} className="btn btn-primary text-base">
              {h.primary}
            </LocaleLink>
            <LocaleLink href="/reach-out" locale={locale} className="btn btn-outline text-base">
              {h.secondary}
            </LocaleLink>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.62 }}
            className="mt-5 font-mono text-[12px] uppercase tracking-[0.12em] text-muted/80"
          >
            {h.note}
          </motion.p>
        </div>

        {/* Signature: live service board */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, ease, delay: 0.28 }}
          className="flex justify-center lg:justify-end"
        >
          <ServiceBoard board={h.board} />
        </motion.div>
      </div>
    </section>
  );
}
