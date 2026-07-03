import Image from "next/image";
import type { Dictionary } from "@/i18n/dictionaries";
import SectionIntro from "./SectionIntro";
import Reveal, { RevealGroup, RevealItem } from "@/components/ui/Reveal";

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

export default function Features({ dict }: { dict: Dictionary }) {
  const f = dict.home.features;
  return (
    <section className="border-t border-line bg-surface/50">
      <div className="container-pad py-20 sm:py-28">
        <SectionIntro label={f.label} title={f.title} />
        <RevealGroup className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {f.items.map((item) => (
            <RevealItem
              key={item.title}
              className="group card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-green/10 text-green transition-colors duration-300 group-hover:bg-green group-hover:text-bone dark:bg-green/20 dark:text-green-300 dark:group-hover:bg-green-500 dark:group-hover:text-ink">
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {icons[item.icon] ?? icons.inbox}
                </svg>
              </span>
              <h3 className="mt-5 text-lg font-bold text-content">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.body}</p>
            </RevealItem>
          ))}
        </RevealGroup>

        {/* Spotlight: group payments */}
        <Reveal className="mt-6">
          <div className="relative grid items-center gap-10 overflow-hidden rounded-3xl border border-ink/60 bg-ink p-8 shadow-lift sm:p-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
            <div>
              <span className="label !text-green-300">
                <span className="h-px w-6 bg-green-400/60" aria-hidden />
                {f.spotlight.label}
              </span>
              <h3 className="mt-4 text-2xl font-bold leading-[1.1] text-bone sm:text-3xl lg:text-4xl">
                {f.spotlight.title}
              </h3>
              <p className="mt-4 max-w-lg leading-relaxed text-bone/65">
                {f.spotlight.body}
              </p>
              <ul className="mt-6 space-y-3">
                {f.spotlight.points.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green/20 text-green-300">
                      <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span className="text-bone/80">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-center lg:justify-end">
              <div className="relative w-[236px] overflow-hidden rounded-[2rem] border border-bone/15 bg-ink-900 p-1.5 shadow-lift sm:w-[264px]">
                <div className="absolute -inset-8 -z-10 rounded-full bg-green/20 blur-3xl" />
                <div className="relative aspect-[1206/2622] w-full overflow-hidden rounded-[1.6rem]">
                  <Image
                    src={f.spotlight.image}
                    alt={f.spotlight.imageAlt}
                    fill
                    sizes="264px"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
