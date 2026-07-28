import type { Config } from "tailwindcss";

// Cue redesign v4 — "The White City at Night". Token-driven.
// Limestone ground · night ink · bougainvillea reserved for availability.
// Components style through semantic roles; never hardcode hex.
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

        // ---- Action — ink (kept as `accent` for form/nav compat) ----
        accent: {
          DEFAULT: "rgb(var(--accent) / <alpha-value>)",
          strong: "rgb(var(--accent-strong) / <alpha-value>)",
          deep: "rgb(var(--accent-deep) / <alpha-value>)",
          wash: "var(--accent-wash)",
          inverse: "rgb(var(--accent-on-inverse) / <alpha-value>)",
        },

        // ---- Availability — bougainvillea. Bookable-now ONLY. ----
        avail: {
          DEFAULT: "rgb(var(--avail) / <alpha-value>)",
          strong: "rgb(var(--avail-strong) / <alpha-value>)",
          deep: "rgb(var(--avail-deep) / <alpha-value>)",
          wash: "var(--avail-wash)",
        },

        // ---- Print furniture ----
        brass: "rgb(var(--brass) / <alpha-value>)",
        sky: "rgb(var(--sky) / <alpha-value>)",

        // ---- The one field moment per page ----
        field: {
          DEFAULT: "rgb(var(--field) / <alpha-value>)",
          content: "rgb(var(--field-content) / <alpha-value>)",
        },

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
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
        arabic: ["var(--font-arabic)", "Tahoma", "sans-serif"],
      },
      // Print-flat: hard corners
      borderRadius: {
        chip: "2px",
        card: "4px",
        panel: "6px",
      },
      maxWidth: {
        content: "82rem",
      },
      boxShadow: {
        // Single elevation voice — overlays only (consent gate)
        soft: "var(--shadow-card)",
        card: "var(--shadow-card)",
      },
      keyframes: {
        // Modal entrance only
        "board-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "board-in": "board-in 0.4s cubic-bezier(0.22,1,0.36,1) both",
      },
    },
  },
  plugins: [],
};

export default config;
