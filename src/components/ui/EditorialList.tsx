import { cn } from "@/lib/utils";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";

type Row = { label?: string; num?: string; title: string; body: string };

/**
 * The homepage "what you get" pattern (section 03), extracted for reuse across
 * inner pages: alternating editorial rows — index numeral + title on one edge,
 * body on the other, edges swapping row to row. Hairline-separated, no card
 * chrome. Numerals are marigold (spark-deep, AA) and decorative (aria-hidden).
 */
export default function EditorialList({
  items,
  startNum = 1,
  numbers = true,
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
        const flip = i % 2 === 1;
        const num = it.num ?? String(startNum + i).padStart(2, "0");
        return (
          <RevealItem
            key={it.title}
            className="border-b border-line py-8 sm:py-9"
          >
            <div className="grid items-start gap-4 lg:grid-cols-12 lg:gap-8">
              {/* Title cluster */}
              <div
                className={cn(
                  "flex items-start gap-5 lg:col-span-6",
                  flip && "lg:order-2 lg:col-start-7"
                )}
              >
                {numbers && (
                  <span
                    className="display shrink-0 text-2xl tabular-nums text-spark-deep"
                    aria-hidden
                  >
                    {num}
                  </span>
                )}
                <div>
                  {it.label && (
                    <span className="eyebrow mb-1.5 block">{it.label}</span>
                  )}
                  <h3 className="text-xl text-content sm:text-2xl">{it.title}</h3>
                </div>
              </div>
              {/* Body */}
              <p
                className={cn(
                  "text-[15px] leading-relaxed text-muted sm:text-base lg:col-span-5",
                  flip ? "lg:order-1 lg:col-start-1" : "lg:col-start-8"
                )}
              >
                {it.body}
              </p>
            </div>
          </RevealItem>
        );
      })}
    </RevealGroup>
  );
}
