import { cn } from "@/lib/utils";

/**
 * v4 section grammar. One continuous page: every section opens with a 2px
 * rule carrying a running head (what this is) and an optional folio (the
 * meta fact — a count, a place, a credit). No background slabs, no
 * numerals, no per-section anatomy beyond the rule row.
 *
 * tone="field" is the ONE night-panel moment a page is allowed — it opens
 * with a brass rule instead and sets its own ground. Never use it twice on
 * the same route.
 */
export default function RuledSection({
  head,
  folio,
  id,
  tone = "page",
  className,
  children,
}: {
  head: string;
  folio?: string;
  id?: string;
  tone?: "page" | "field";
  className?: string;
  children: React.ReactNode;
}) {
  if (tone === "field") {
    return (
      <section id={id} className={cn("bg-field text-field-content", className)}>
        <div className="container-pad py-14 sm:py-20">
          <div className="flex items-baseline justify-between gap-4 border-t-2 border-brass pt-3">
            <span className="running-head !text-field-content">{head}</span>
            {folio && <span className="folio !text-field-content/60">{folio}</span>}
          </div>
          <div className="pt-8 sm:pt-10">{children}</div>
        </div>
      </section>
    );
  }

  return (
    <section id={id} className={className}>
      <div className="container-pad">
        <div className="flex items-baseline justify-between gap-4 border-t-2 border-content pt-3">
          <span className="running-head">{head}</span>
          {folio && <span className="folio">{folio}</span>}
        </div>
        <div className="pb-14 pt-8 sm:pb-20 sm:pt-10">{children}</div>
      </div>
    </section>
  );
}
