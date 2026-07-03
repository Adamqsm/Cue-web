import type { Config } from "tailwindcss";

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
        // Exposed as rgb channels so Tailwind opacity modifiers (text-content/70) work.
        bg: "rgb(var(--bg) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        surface2: "rgb(var(--surface-2) / <alpha-value>)",
        content: "rgb(var(--content) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        line: "rgb(var(--line) / <alpha-value>)",

        // ---- Fixed brand palette ----
        // Warm near-black — heavy type + inverted panels.
        ink: {
          DEFAULT: "#14140F",
          900: "#0D0D09",
          800: "#1C1C15",
          700: "#26261C",
          600: "#333326",
        },
        // Porcelain / bone — light surfaces.
        bone: {
          DEFAULT: "#F4F3EE",
          200: "#ECEAE1",
          300: "#E0DDD1",
        },
        // Operator green — primary brand accent (trust / go / confirmed).
        green: {
          DEFAULT: "#1E6E52",
          700: "#124A37",
          600: "#185B44",
          500: "#26845F",
          400: "#43A57D",
          300: "#79C1A2",
          100: "#C9E2D5",
          50: "#E6F0EA",
        },
        // Signal amber — used sparingly for live / incoming states.
        amber: {
          DEFAULT: "#E1993A",
          400: "#EDB25C",
          300: "#F3C883",
        },

        // ---- Legacy aliases (repointed to the new palette) ----
        // Keeps existing secondary pages compiling + recolored to the new system.
        paper: {
          DEFAULT: "#F4F3EE",
          soft: "#ECEAE1",
          dim: "#E0DDD1",
        },
        clay: {
          DEFAULT: "#1E6E52",
          600: "#185B44",
          700: "#124A37",
          300: "#79C1A2",
          200: "#C9E2D5",
        },
        ember: "#E1993A",
        pine: {
          DEFAULT: "#14140F",
          600: "#1C1C15",
          300: "#79C1A2",
        },
        sand: "#CBBBA0",
      },
      fontFamily: {
        display: ["var(--font-display)", "Bricolage Grotesque", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "IBM Plex Mono", "ui-monospace", "monospace"],
        arabic: ["var(--font-arabic)", "Tahoma", "sans-serif"],
      },
      letterSpacing: {
        brand: "0.28em",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.75rem",
      },
      maxWidth: {
        content: "78rem",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(20,20,15,0.04), 0 12px 32px -18px rgba(20,20,15,0.28)",
        lift: "0 2px 4px rgba(20,20,15,0.05), 0 28px 60px -30px rgba(20,20,15,0.45)",
      },
      keyframes: {
        "pulse-ring": {
          "0%": { transform: "scale(0.85)", opacity: "0.7" },
          "100%": { transform: "scale(2.2)", opacity: "0" },
        },
        floaty: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "board-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "sweep": {
          "0%": { transform: "translateX(-120%)" },
          "100%": { transform: "translateX(120%)" },
        },
      },
      animation: {
        "pulse-ring": "pulse-ring 2.6s ease-out infinite",
        floaty: "floaty 7s ease-in-out infinite",
        "board-in": "board-in 0.6s cubic-bezier(0.22,1,0.36,1) both",
        sweep: "sweep 2.8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
