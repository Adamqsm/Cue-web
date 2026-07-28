import { cn } from "@/lib/utils";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";

type Row = { label?: string; num?: string; title: string; body: string };

/**
 * Ruled index rows: title on the reading edge, body on the far column, a
 * hairline between rows — no cards, no alternation. Numerals render ONLY
 * when the caller passes `numbers` (i.e. the rows are a real sequence);
 * they're brass and decorative (aria-hidden).
 */
export default function EditorialList({
  items,
  startNum = 1,
  numbers = false,
  className,
}: {
  items: Row[];
  startNum?: number;
  numbers?: boolean;
  className?: string;
}) {
  return (
    <RevealGroup className={cn("border-t border-line", className)}>
      {items.map((it, i) => {
        const num = it.num ?? String(startNum + i).padStart(2, "0");
        return (
          <RevealItem
            key={it.title}
            className="border-b border-line py-7 sm:py-8"
          >
            <div className="grid items-baseline gap-3 lg:grid-cols-12 lg:gap-8">
              <div className="flex items-baseline gap-5 lg:col-span-6">
                {numbers && (
                  <span
                    className="display shrink-0 text-lg tabular-nums text-brass"
                    aria-hidden
                  >
                    {num}
                  </span>
                )}
                <div>
                  {it.label && (
                    <span className="label mb-1.5 block">{it.label}</span>
                  )}
                  <h3 className="text-xl text-content sm:text-2xl">{it.title}</h3>
                </div>
              </div>
              <p className="text-[15px] leading-relaxed text-muted sm:text-base lg:col-span-5 lg:col-start-8">
                {it.body}
              </p>
            </div>
          </RevealItem>
        );
      })}
    </RevealGroup>
  );
}
