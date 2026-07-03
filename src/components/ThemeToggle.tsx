"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Light/dark toggle. Reads the class set by the no-flash script in the
 * layout head, persists the choice to localStorage, and swaps at runtime.
 */
export default function ThemeToggle({
  className,
  labels,
}: {
  className?: string;
  labels: { light: string; dark: string };
}) {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    const root = document.documentElement;
    root.classList.toggle("dark", next);
    try {
      localStorage.setItem("cue-theme", next ? "dark" : "light");
    } catch {}
  }

  const isDark = mounted && dark;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? labels.light : labels.dark}
      aria-pressed={isDark}
      className={cn(
        "group inline-flex h-9 w-9 items-center justify-center rounded-full border border-line text-content transition-colors hover:bg-surface2",
        className
      )}
    >
      {/* Sun */}
      <svg
        viewBox="0 0 24 24"
        className={cn("h-[18px] w-[18px]", isDark ? "hidden" : "block")}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      >
        <circle cx="12" cy="12" r="4.2" />
        <path d="M12 2.5v2.4M12 19.1v2.4M4.6 4.6l1.7 1.7M17.7 17.7l1.7 1.7M2.5 12h2.4M19.1 12h2.4M4.6 19.4l1.7-1.7M17.7 6.3l1.7-1.7" />
      </svg>
      {/* Moon */}
      <svg
        viewBox="0 0 24 24"
        className={cn("h-[18px] w-[18px]", isDark ? "block" : "hidden")}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 14.5A8 8 0 1 1 9.5 4a6.3 6.3 0 0 0 10.5 10.5Z" />
      </svg>
    </button>
  );
}
