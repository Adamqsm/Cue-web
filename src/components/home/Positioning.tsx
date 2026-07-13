import type { Dictionary } from "@/i18n/dictionaries";
import Reveal from "@/components/ui/Reveal";
import TableMap from "@/components/illustrations/TableMap";

/**
 * Problem / positioning. Deliberately spare: the claim carries it, not chrome.
 * Sits on a sunken surface-2 band between 1px line rules; the TableMap spot
 * illustration sits quietly under the resolve line — content leads.
 */
export default function Positioning({ dict }: { dict: Dictionary }) {
  const p = dict.home.problem;
  return (
    <section className="border-y border-line bg-surface2">
      <div className="container-pad py-20 sm:py-28">
        <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
          <Reveal>
            <span className="label">
              <span className="h-px w-6 bg-accent/60" aria-hidden />
              {p.label}
            </span>
          </Reveal>
          <Reveal delay={1}>
            <h2 className="text-[clamp(1.75rem,3.2vw,2.75rem)] font-[650] leading-[1.1] tracking-[-0.025em] text-content">
              {p.title}
            </h2>
            <p className="mt-6 max-w-[65ch] text-lg leading-relaxed text-muted sm:text-xl">
              {p.body}
            </p>
            <p className="mt-5 max-w-[65ch] text-lg font-semibold leading-relaxed text-content sm:text-xl">
              {p.resolve}
            </p>
            <TableMap className="mt-12 w-full max-w-[340px]" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
