import type { SVGProps } from "react";
import { cn } from "@/lib/utils";

/**
 * The Cue mark — a single thick "C" ring opening to the right, with a dot
 * at its centre. Geometry is traced from the brand file
 * (public/branding/cue-logo.png, 1024px): ring centred at 50/50 with a
 * mid-line radius of 28.125 and a 16.8 stroke, round caps, the arc running
 * from 48° to 312°; dot radius 5.37. Drawn with currentColor so the same
 * mark inherits the surrounding text colour in light and dark mode.
 */
export const CUE_MARK_PATH = "M68.82 70.9A28.125 28.125 0 1 1 68.82 29.1";
export const CUE_MARK_STROKE = 16.8;
export const CUE_MARK_DOT = 5.37;

export function CueMark({
  className,
  title = "Cue",
  ...rest
}: {
  className?: string;
  title?: string;
} & Omit<SVGProps<SVGSVGElement>, "className" | "title">) {
  return (
    <svg
      viewBox="0 0 100 100"
      role="img"
      aria-label={title}
      className={cn("block", className)}
      fill="none"
      {...rest}
    >
      {/* ring */}
      <path
        d={CUE_MARK_PATH}
        stroke="currentColor"
        strokeWidth={CUE_MARK_STROKE}
        strokeLinecap="round"
      />
      {/* centre dot */}
      <circle cx="50" cy="50" r={CUE_MARK_DOT} fill="currentColor" />
    </svg>
  );
}

/** Full logo lockup: mark + wordmark. */
export function Logo({
  className,
  markClassName,
  wordClassName,
  showWord = true,
}: {
  className?: string;
  markClassName?: string;
  wordClassName?: string;
  showWord?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <CueMark className={cn("h-7 w-7", markClassName)} />
      {showWord && (
        <span
          className={cn(
            "text-2xl font-semibold tracking-tight",
            wordClassName
          )}
        >
          Cue
        </span>
      )}
    </span>
  );
}
