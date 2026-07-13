import type { Config } from "tailwindcss";

// Cue redesign v2 — token-driven palette. See docs/redesign-v2-spec.md.
// Components style through semantic roles + the accent scale; never hardcode hex.
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
          // Input boundaries — ≥3:1 non-text contrast (WCAG 1.4.11)
          strong: "rgb(var(--line-strong) / <alpha-value>)",
        },

        // ---- Accent — terracotta (locked #C86B4A), theme-adaptive ----
        accent: {
          DEFAULT: "rgb(var(--accent) / <alpha-value>)",
          strong: "rgb(var(--accent-strong) / <alpha-value>)",
          deep: "rgb(var(--accent-deep) / <alpha-value>)",
          wash: "var(--accent-wash)",
          // For accent text on inverse (bg-content) bands — flips with the band
          inverse: "rgb(var(--accent-on-inverse) / <alpha-value>)",
        },

        // ---- Status (information, not decoration) ----
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
        display: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
        arabic: ["var(--font-arabic)", "Tahoma", "sans-serif"],
      },
      borderRadius: {
        chip: "8px",
        card: "14px",
        panel: "22px",
      },
      maxWidth: {
        content: "78rem",
      },
      boxShadow: {
        soft: "var(--shadow-card)",
        card: "var(--shadow-card)",
        cta: "var(--shadow-cta)",
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
      },
      animation: {
        "pulse-ring": "pulse-ring 2.6s ease-out infinite",
        "board-in": "board-in 0.6s cubic-bezier(0.22,1,0.36,1) both",
      },
    },
  },
  plugins: [],
};

export default config;
