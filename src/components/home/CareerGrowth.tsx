import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import EditorialSection from "./EditorialSection";
import Reveal, { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import LocaleLink from "@/components/ui/LocaleLink";

/* Same 24px / 1.6 stroke family as the Features tiles. */
const icons: Record<string, JSX.Element> = {
  course: (
    <>
      <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4H11v15H6.5A2.5 2.5 0 0 0 4 21.5V6.5Z" />
      <path d="M20 6.5A2.5 2.5 0 0 0 17.5 4H13v15h4.5a2.5 2.5 0 0 1 2.5 2.5V6.5Z" />
    </>
  ),
  mentor: (
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 19.5c0-3 2.5-5 5.5-5s5.5 2 5.5 5" />
      <circle cx="17" cy="9.5" r="2.4" />
      <path d="M16 15.2c2.6 0 4.5 1.6 4.5 4.3" />
    </>
  ),
  build: (
    <>
      <path d="M14.5 5.5 18.5 9.5 8 20H4v-4L14.5 5.5Z" />
      <path d="M12.5 7.5l4 4M16 4l1.5-1.5L21.5 6.5 20 8" />
    </>
  ),
};

/**
 * "Growing with Cue" — the career growth and learning commitments. Reuses
 * the Features card grid (lifted cards, blue icon tiles) so it reads as the
 * same site, with a short closing line and a quiet link to /careers.
 * Anchored by id so the section has a shareable public URL.
 */
export default function CareerGrowth({
  locale,
  dict,
  num = "00",
}: {
  locale: Locale;
  dict: Dictionary;
  num?: string;
}) {
  const g = dict.home.growth;
  return (
    <EditorialSection num={num} id="career-growth" label={g.label} band="bg">
      <div className="max-w-2xl">
        <h2 className="text-[clamp(1.9rem,3.4vw,3rem)] leading-[1.1] text-content">
          {g.title}
        </h2>
        <p className="mt-5 text-lg leading-[1.6] text-muted">{g.body}</p>
      </div>

      <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {g.items.map((item) => (
          <RevealItem
            key={item.title}
            className="card card-hover flex flex-col p-7"
          >
            <span
              className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-chip bg-accent-wash text-accent-deep"
              aria-hidden
            >
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {icons[item.icon] ?? icons.course}
              </svg>
            </span>
            <h3 className="mt-5 text-xl text-content">{item.title}</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-muted">
              {item.body}
            </p>
          </RevealItem>
        ))}
      </RevealGroup>

      <Reveal className="mt-10 max-w-2xl">
        <p className="text-lg leading-[1.7] text-content/85">{g.closing}</p>
        <LocaleLink
          href="/careers"
          locale={locale}
          className="link-underline mt-5 text-[15px] text-accent-deep"
        >
          {g.cta}
          <svg
            viewBox="0 0 16 16"
            className="nudge h-4 w-4 rtl:-scale-x-100"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M3 8h10M9.5 3.5 14 8l-4.5 4.5" />
          </svg>
        </LocaleLink>
      </Reveal>
    </EditorialSection>
  );
}
