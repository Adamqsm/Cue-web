import { cn } from "@/lib/utils";

type Band = "bg" | "surface2" | "ink" | "olive";

/**
 * v5 section shell. The v3 editorial spine (sticky margin numerals) is
 * retired; sections now open with a friendly pill label and give the full
 * width to content — the consumer-app rhythm this brand sits beside.
 *
 * The component keeps its v3 name and full prop contract (`num` included, now
 * unused) so every existing caller restyles without edits. Bands: `ink` is
 * the deep-ink moment, `olive` is the committed navy brand band (token name
 * kept from v3; the value is navy in v5). No hooks — renders on the server.
 */
export default function EditorialSection({
  num: _num,
  label,
  id,
  band = "bg",
  divide = true,
  children,
  className,
  contentClassName,
}: {
  num: string;
  label?: string;
  id?: string;
  band?: Band;
  divide?: boolean;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}) {
  const inverse = band === "ink" || band === "olive";
  const bandClass =
    band === "surface2"
      ? "bg-surface2"
      : band === "ink"
        ? "bg-content text-bg"
        : band === "olive"
          ? "bg-[rgb(var(--olive-band))] text-white"
          : "bg-transparent";

  return (
    <section
      id={id}
      className={cn(
        bandClass,
        // Anchor targets stop below the fixed nav (72px) with a little air.
        id && "scroll-mt-24",
        divide && band === "bg" && "border-t border-line",
        (band === "surface2" || inverse) && "border-y border-line/60",
        className
      )}
    >
      <div className="container-pad py-16 sm:py-24 lg:py-28">
        <div className={cn("min-w-0", contentClassName)}>
          {label && (
            <span
              className={cn(
                "label mb-6",
                inverse && "!border-white/25 !bg-white/10 !text-white"
              )}
            >
              {label}
            </span>
          )}
          {children}
        </div>
      </div>
    </section>
  );
}
