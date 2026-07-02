import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core warm palette drawn from the Cue app concepts
        ink: {
          DEFAULT: "#17130F", // near-black, warm
          800: "#211C16",
          700: "#2C251D",
          600: "#3A3128",
        },
        paper: {
          DEFAULT: "#F6F1E7", // warm cream
          soft: "#EFE8DA",
          dim: "#E6DDCB",
        },
        clay: {
          DEFAULT: "#C75E36", // terracotta / sunset orange — primary accent
          600: "#B24E2A",
          700: "#98401F",
          300: "#E2996E",
          200: "#EFC3A5",
        },
        ember: "#E8A15C", // warm highlight
        pine: {
          DEFAULT: "#2E4A3A", // deep hospitality green — secondary accent
          600: "#3B5B48",
          300: "#7FA08C",
        },
        sand: "#CBBBA0",
      },
      fontFamily: {
        display: ["var(--font-display)", "Fraunces", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
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
        content: "76rem",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "marquee-rtl": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(50%)" },
        },
        spinSlow: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        pulseRing: {
          "0%": { transform: "scale(0.9)", opacity: "0.7" },
          "100%": { transform: "scale(1.6)", opacity: "0" },
        },
        floaty: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        marquee: "marquee 32s linear infinite",
        "marquee-rtl": "marquee-rtl 32s linear infinite",
        "spin-slow": "spinSlow 40s linear infinite",
        "pulse-ring": "pulseRing 3s ease-out infinite",
        floaty: "floaty 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
