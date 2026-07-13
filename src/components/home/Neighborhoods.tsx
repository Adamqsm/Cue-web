import type { Dictionary } from "@/i18n/dictionaries";
import SectionIntro from "./SectionIntro";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";

/** Local-SEO signal: the Amman neighborhoods Cue serves. */
export default function Neighborhoods({ dict }: { dict: Dictionary }) {
  const n = dict.home.neighborhoods;
  return (
    <section className="border-t border-line">
      <div className="container-pad py-20 sm:py-28">
        <SectionIntro label={n.label} title={n.title} body={n.body} />
        <RevealGroup className="mt-10 flex flex-wrap gap-3">
          {n.areas.map((area) => (
            <RevealItem key={area}>
              <span className="inline-flex items-center rounded-full border border-line bg-surface px-5 py-2.5 text-sm font-medium text-content transition-colors duration-200 hover:border-accent/30 hover:bg-accent-wash hover:text-accent-deep">
                {area}
              </span>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
