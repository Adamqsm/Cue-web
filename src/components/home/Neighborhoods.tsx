import type { Dictionary } from "@/i18n/dictionaries";
import SectionIntro from "./SectionIntro";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";

/** Local-SEO signal: the Amman neighborhoods Cue serves. */
export default function Neighborhoods({ dict }: { dict: Dictionary }) {
  const n = dict.home.neighborhoods;
  return (
    <section className="border-t border-line bg-surface/50">
      <div className="container-pad py-20 sm:py-28">
        <SectionIntro label={n.label} title={n.title} body={n.body} />
        <RevealGroup className="mt-10 flex flex-wrap gap-3">
          {n.areas.map((area) => (
            <RevealItem key={area}>
              <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-5 py-2.5 text-sm font-semibold text-content transition-colors hover:border-green/50 hover:text-green dark:hover:text-green-300">
                <span className="h-1.5 w-1.5 rounded-full bg-green" aria-hidden />
                {area}
              </span>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
