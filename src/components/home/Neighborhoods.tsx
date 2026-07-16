import type { Dictionary } from "@/i18n/dictionaries";
import EditorialSection from "./EditorialSection";

/**
 * "Across Amman" — a horizontal editorial rail of neighborhoods instead of a
 * static chip cloud. Scroll/swipe strip (snap), each area a numbered plate.
 * Local-SEO signal, given place and movement. The rail scrolls in the reading
 * direction and mirrors correctly in RTL (native overflow honors `dir`).
 */
export default function Neighborhoods({
  dict,
  num = "06",
}: {
  dict: Dictionary;
  num?: string;
}) {
  const n = dict.home.neighborhoods;
  return (
    <EditorialSection num={num} label={n.label} band="bg">
      <div className="max-w-2xl">
        <h2 className="text-[clamp(1.9rem,3.4vw,3rem)] leading-[1.08] text-content">
          {n.title}
        </h2>
        <p className="mt-5 text-lg leading-[1.6] text-muted">{n.body}</p>
      </div>

      <div className="mt-10 -mx-5 sm:-mx-8">
        <ul className="hide-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 sm:px-8">
          {n.areas.map((area, i) => (
            <li
              key={area}
              className="group snap-start"
            >
              <div className="relative flex h-40 w-52 shrink-0 flex-col justify-between overflow-hidden rounded-panel border border-line bg-surface p-5 transition-colors duration-300 hover:border-accent/40 sm:h-44 sm:w-60">
                {/* corner wash that warms on hover */}
                <span className="pointer-events-none absolute -end-6 -top-6 h-20 w-20 rounded-full bg-accent-wash opacity-60 transition-opacity duration-300 group-hover:opacity-100" aria-hidden />
                <span className="display relative text-sm font-semibold tabular-nums text-spark-deep">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="relative text-xl font-semibold text-content">
                  {area}
                </span>
              </div>
            </li>
          ))}
          {/* End plate — decorative "more coming" marker, no untranslated text */}
          <li className="snap-start" aria-hidden>
            <div className="flex h-40 w-40 shrink-0 items-center justify-center rounded-panel border border-dashed border-line text-muted sm:h-44 sm:w-44">
              <span className="flex gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-accent/50" />
                <span className="h-1.5 w-1.5 rounded-full bg-spark/60" />
                <span className="h-1.5 w-1.5 rounded-full bg-accent/30" />
              </span>
            </div>
          </li>
        </ul>
      </div>
    </EditorialSection>
  );
}
