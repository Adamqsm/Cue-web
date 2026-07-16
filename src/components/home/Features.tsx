import type { Dictionary } from "@/i18n/dictionaries";
import EditorialSection from "./EditorialSection";
import Reveal, { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

const icons: Record<string, JSX.Element> = {
  inbox: (
    <path d="M3.5 13.5h4l1.5 2.5h6l1.5-2.5h4M5 5.5h14a1.5 1.5 0 0 1 1.5 1.4l.5 6.6v4a1.5 1.5 0 0 1-1.5 1.5H4A1.5 1.5 0 0 1 2.5 18v-4l.5-6.6A1.5 1.5 0 0 1 4.4 5.5Z" />
  ),
  dashboard: (
    <>
      <rect x="3.5" y="3.5" width="7" height="9" rx="1.5" />
      <rect x="3.5" y="15.5" width="7" height="5" rx="1.5" />
      <rect x="13.5" y="3.5" width="7" height="5" rx="1.5" />
      <rect x="13.5" y="11.5" width="7" height="9" rx="1.5" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3l7 2.5v5.5c0 4.5-3 8-7 9.5-4-1.5-7-5-7-9.5V5.5L12 3Z" />
      <path d="M9 12l2 2 4-4.5" />
    </>
  ),
  language: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.6 3.8 6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-6-3.8-9S9.5 5.6 12 3Z" />
    </>
  ),
  flow: (
    <>
      <circle cx="6" cy="6" r="2.5" />
      <circle cx="18" cy="6" r="2.5" />
      <circle cx="12" cy="18" r="2.5" />
      <path d="M6 8.5v2a3 3 0 0 0 3 3h1M18 8.5v2a3 3 0 0 1-3 3h-1" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21c4.5-4.2 7-7.6 7-11a7 7 0 1 0-14 0c0 3.4 2.5 6.8 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
};

/**
 * "What you get" — deliberately NOT a 3-icon feature grid. Six capabilities as
 * alternating editorial rows: index numeral + serif title on one edge, body on
 * the other, edges swapping row to row for an off-grid rhythm. Hairline-
 * separated, no card chrome.
 */
export default function Features({
  dict,
  num = "03",
}: {
  dict: Dictionary;
  num?: string;
}) {
  const f = dict.home.features;
  return (
    <EditorialSection num={num} label={f.label} band="bg">
      <div className="max-w-2xl">
        <h2 className="text-[clamp(1.9rem,3.4vw,3rem)] leading-[1.08] text-content">
          {f.title}
        </h2>
      </div>

      <RevealGroup className="mt-12 border-t border-line">
        {f.items.map((item, i) => {
          const flip = i % 2 === 1;
          return (
            <RevealItem
              key={item.title}
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
                  <span
                    className="display shrink-0 text-2xl tabular-nums text-spark-deep"
                    aria-hidden
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex items-center gap-4">
                    <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-chip bg-accent-wash text-accent-deep">
                      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        {icons[item.icon] ?? icons.inbox}
                      </svg>
                    </span>
                    <h3 className="text-xl text-content sm:text-2xl">{item.title}</h3>
                  </div>
                </div>
                {/* Body */}
                <p
                  className={cn(
                    "text-[15px] leading-relaxed text-muted lg:col-span-5 sm:text-base",
                    flip ? "lg:order-1 lg:col-start-1" : "lg:col-start-8"
                  )}
                >
                  {item.body}
                </p>
              </div>
            </RevealItem>
          );
        })}
      </RevealGroup>
    </EditorialSection>
  );
}
