import type { Dictionary } from "@/i18n/dictionaries";
import Reveal from "@/components/ui/Reveal";

/**
 * Problem / positioning. Deliberately spare: the claim carries it, not chrome.
 */
export default function Positioning({ dict }: { dict: Dictionary }) {
  const p = dict.home.problem;
  return (
    <section className="border-y border-line bg-surface/50">
      <div className="container-pad py-20 sm:py-28">
        <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
          <Reveal>
            <span className="label">
              <span className="h-px w-6 bg-green/50" aria-hidden />
              {p.label}
            </span>
          </Reveal>
          <Reveal delay={1}>
            <h2 className="text-3xl font-bold leading-[1.08] text-content sm:text-4xl lg:text-[3.1rem]">
              {p.title}
            </h2>
            <p className="mt-6 max-w-2xl text-xl leading-relaxed text-muted">
              {p.body}
            </p>
            <p className="mt-5 max-w-2xl text-xl font-semibold leading-relaxed text-content">
              {p.resolve}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
