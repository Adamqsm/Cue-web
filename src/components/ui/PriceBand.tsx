import { cn } from "@/lib/utils";

/**
 * Price band as a four-slot scale — information, not decoration. Filled
 * slots are ink; empty slots keep a boundary stroke. The accessible name
 * carries the localized "band n of 4" reading.
 */
export default function PriceBand({
  n,
  label,
  className,
}: {
  n: number;
  label: string;
  className?: string;
}) {
  return (
    <span
      role="img"
      aria-label={label}
      className={cn("inline-flex items-center gap-[3px]", className)}
    >
      {[1, 2, 3, 4].map((i) => (
        <span
          key={i}
          aria-hidden
          className={cn(
            "h-[7px] w-[7px]",
            i <= n
              ? "bg-current"
              : "border border-current opacity-40"
          )}
        />
      ))}
    </span>
  );
}
