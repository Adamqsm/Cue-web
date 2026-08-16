import type { Config } from "tailwindcss";

// Cue redesign v5.2 — "Queue Blue" on neutral ground. Token-driven palette:
// neutral off-white/near-black surfaces · queue-blue accent (restrained) ·
// confirm-orange spark (queue/claim/live moments). Components style through
// semantic roles; never hardcode hex.
// See docs/design-tokens-v5.md (also the source of truth for the Flutter port).
const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ---- Semantic roles (flip in dark mode via CSS variables) ----
        bg: "rgb(var(--bg) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        surface2: "rgb(var(--surface-2) / <alpha-value>)",
        content: "rgb(var(--content) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        line: {
          DEFAULT: "rgb(var(--line) / <alpha-value>)",
          strong: "rgb(var(--line-strong) / <alpha-value>)",
        },

        // ---- Accent — queue blue (brand + primary actions) ----
        accent: {
          DEFAULT: "rgb(var(--accent) / <alpha-value>)",
          strong: "rgb(var(--accent-strong) / <alpha-value>)",
          deep: "rgb(var(--accent-deep) / <alpha-value>)",
          wash: "var(--accent-wash)",
          inverse: "rgb(var(--accent-on-inverse) / <alpha-value>)",
        },

        // ---- Spark — confirm orange ("the queue ticket" / live / energy) ----
        spark: {
          DEFAULT: "rgb(var(--spark) / <alpha-value>)",
          strong: "rgb(var(--spark-strong) / <alpha-value>)",
          deep: "rgb(var(--spark-deep) / <alpha-value>)",
          wash: "var(--spark-wash)",
          inverse: "rgb(var(--spark-on-inverse) / <alpha-value>)",
        },

        // ---- Clay — slate-blue support mid-tone (illustration depth) ----
        clay: "rgb(var(--clay) / <alpha-value>)",

        // ---- Status ----
        ok: {
          DEFAULT: "rgb(var(--ok) / <alpha-value>)",
          deep: "rgb(var(--ok-deep) / <alpha-value>)",
        },
        error: {
          DEFAULT: "rgb(var(--error) / <alpha-value>)",
          deep: "rgb(var(--error-deep) / <alpha-value>)",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
        arabic: ["var(--font-arabic)", "Tahoma", "sans-serif"],
      },
      // Rounder shape language than v3 — consumer-app friendly, not bubbly.
      borderRadius: {
        chip: "12px",
        card: "18px",
        panel: "28px",
      },
      maxWidth: {
        content: "82rem",
      },
      boxShadow: {
        soft: "var(--shadow-card)",
        card: "var(--shadow-card)",
        cta: "var(--shadow-cta)",
        spark: "var(--shadow-spark)",
      },
      keyframes: {
        "pulse-ring": {
          "0%": { transform: "scale(0.85)", opacity: "0.7" },
          "100%": { transform: "scale(2.2)", opacity: "0" },
        },
        "board-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "sheen": {
          "0%": { transform: "translateX(-120%)" },
          "60%,100%": { transform: "translateX(220%)" },
        },
        "drift": {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      animation: {
        "pulse-ring": "pulse-ring 2.6s ease-out infinite",
        "board-in": "board-in 0.6s cubic-bezier(0.22,1,0.36,1) both",
        "sheen": "sheen 2.8s ease-in-out infinite",
        "drift": "drift 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
