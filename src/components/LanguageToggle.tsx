"use client";

import { usePathname, useRouter } from "next/navigation";
import { locales, type Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";

export default function LanguageToggle({
  locale,
  label,
  className,
}: {
  locale: Locale;
  label: string;
  className?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const other = locales.find((l) => l !== locale) ?? "en";

  function switchTo() {
    const segments = pathname.split("/");
    if (locales.includes(segments[1] as Locale)) {
      segments[1] = other;
    } else {
      segments.splice(1, 0, other);
    }
    router.push(segments.join("/") || `/${other}`);
  }

  return (
    <button
      type="button"
      onClick={switchTo}
      aria-label={`Switch language to ${label}`}
      className={cn(
        "group inline-flex items-center gap-1.5 rounded-full border border-ink/20 px-3 py-1.5 text-sm font-semibold transition-colors",
        className
      )}
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7">
        <circle cx="12" cy="12" r="9.5" />
        <path d="M2.5 12h19M12 2.5c2.5 2.6 3.8 6 3.8 9.5S14.5 18.9 12 21.5c-2.5-2.6-3.8-6-3.8-9.5S9.5 5.1 12 2.5Z" />
      </svg>
      <span>{label}</span>
    </button>
  );
}
