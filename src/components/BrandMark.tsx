import { cn } from "@/lib/utils";

/**
 * The Cue mark — concentric "C" rings echoing the logo (a cue / signal).
 * Two arcs opening to the right, rendered as themeable strokes.
 */
export function CueMark({
  className,
  title = "Cue",
}: {
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      role="img"
      aria-label={title}
      className={cn("block", className)}
      fill="none"
    >
      {/* outer ring */}
      <circle
        cx="50"
        cy="50"
        r="40"
        pathLength={100}
        stroke="currentColor"
        strokeWidth="13"
        strokeLinecap="round"
        strokeDasharray="72 28"
        strokeDashoffset="-14"
      />
      {/* inner ring */}
      <circle
        cx="50"
        cy="50"
        r="19"
        pathLength={100}
        stroke="currentColor"
        strokeWidth="13"
        strokeLinecap="round"
        strokeDasharray="70 30"
        strokeDashoffset="-15"
      />
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
