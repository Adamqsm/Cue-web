"use client";

import { motion } from "framer-motion";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import LocaleLink from "@/components/ui/LocaleLink";
import PhoneFrame from "@/components/ui/PhoneFrame";
import { CueMark } from "@/components/BrandMark";

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
    <section className="relative overflow-hidden pb-10 pt-28 sm:pt-32 lg:pb-16 lg:pt-40">
      {/* animated concentric backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.4, ease }}
          className="absolute -end-40 -top-40 h-[36rem] w-[36rem]"
        >
          <CueMark className="h-full w-full text-clay/10 animate-spin-slow" />
        </motion.div>
        <div className="absolute start-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-ember/20 blur-3xl" />
      </div>

      <div className="container-pad grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-paper/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-ink/70 backdrop-blur"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-clay opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-clay" />
            </span>
            {h.eyebrow}
          </motion.span>

          <h1 className="mt-6 text-5xl font-semibold leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl">
            <motion.span
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease, delay: 0.08 }}
              className="block text-ink"
            >
              {h.title}
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease, delay: 0.2 }}
              className="block italic text-clay"
            >
              {h.titleAccent}
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.34 }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-ink/70 sm:text-xl"
          >
            {h.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.46 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <LocaleLink href="/reach-out" locale={locale} className="btn btn-primary text-base">
              {h.primary}
            </LocaleLink>
            <LocaleLink href="/how-it-works" locale={locale} className="btn btn-outline text-base">
              {h.secondary}
            </LocaleLink>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-5 text-sm text-ink/50"
          >
            {h.note}
          </motion.p>
        </div>

        {/* Phone cluster */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, ease, delay: 0.24 }}
          className="relative mx-auto flex max-w-md items-center justify-center lg:max-w-none"
        >
          <div className="absolute inset-0 -z-10 scale-110 rounded-[3rem] bg-gradient-to-br from-clay/10 via-transparent to-pine/10" />
          <div className="animate-floaty">
            <PhoneFrame
              src="/app/discover.png"
              alt="Cue app — discover venues in Amman"
              priority
              width={300}
              className="rotate-[-4deg]"
            />
          </div>
          <div className="absolute -bottom-6 end-0 hidden sm:block animate-floaty [animation-delay:1.5s]">
            <PhoneFrame
              src="/app/dash-bookings.png"
              alt="Cue partner dashboard — booking management"
              width={210}
              className="rotate-[6deg]"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
