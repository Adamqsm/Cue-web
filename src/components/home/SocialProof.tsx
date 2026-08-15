import type { Dictionary } from "@/i18n/dictionaries";
import EditorialSection from "./EditorialSection";
import Reveal, { RevealGroup, RevealItem } from "@/components/ui/Reveal";

/**
 * Social proof structure — testimonials + press strip.
 *
 * PLACEHOLDER CONTENT: every quote, attribution, and press slot ships as
 * clearly-flagged stand-in content (see `home.socialProof` in the
 * dictionaries and the visible badge from `placeholderTag`). The structure is
 * real and ready: drop in genuine quotes and press names, then delete the
 * `placeholderTag` strings to remove the badges. Partner logos live in the
 * Traction section's strip, which stays placeholder-ready too.
 */
export default function SocialProof({
  dict,
  num = "00",
}: {
  dict: Dictionary;
  num?: string;
}) {
  const s = dict.home.socialProof;
  return (
    <EditorialSection num={num} label={s.label} band="bg">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <h2 className="text-[clamp(1.9rem,3.4vw,3rem)] leading-[1.1] text-content">
            {s.title}
          </h2>
          <p className="mt-4 text-lg leading-[1.6] text-muted">{s.body}</p>
        </div>
        {s.placeholderTag && (
          <span className="tag-placeholder">{s.placeholderTag}</span>
        )}
      </div>

      {/* Testimonial cards */}
      <RevealGroup className="mt-10 grid gap-5 md:grid-cols-3">
        {s.quotes.map((q) => (
          <RevealItem
            key={q.text}
            as="div"
            className="card card-hover flex flex-col p-7"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-7 w-7 text-accent"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M4.5 12.5c0-4.2 2.6-7 6.3-8l.7 1.7c-2.2.9-3.6 2.5-3.9 4.3.3-.1.7-.2 1.1-.2 1.8 0 3.1 1.3 3.1 3.1 0 1.9-1.4 3.3-3.4 3.3-2.3 0-3.9-1.8-3.9-4.2Zm10 0c0-4.2 2.6-7 6.3-8l.7 1.7c-2.2.9-3.6 2.5-3.9 4.3.3-.1.7-.2 1.1-.2 1.8 0 3.1 1.3 3.1 3.1 0 1.9-1.4 3.3-3.4 3.3-2.3 0-3.9-1.8-3.9-4.2Z" />
            </svg>
            <p className="mt-4 flex-1 leading-[1.7] text-content/85">{q.text}</p>
            <div className="mt-6 flex items-center gap-3 border-t border-line pt-5">
              <span
                className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-wash text-sm font-bold text-accent-deep"
                aria-hidden
              >
                {q.initial}
              </span>
              <div>
                <p className="text-sm font-bold text-content">{q.name}</p>
                <p className="text-xs text-muted">{q.role}</p>
              </div>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>

      {/* Press strip — dashed slots until real coverage lands */}
      <Reveal className="mt-12">
        <span className="label !bg-transparent !px-0 !text-muted">
          {s.pressLabel}
        </span>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {s.pressSlots.map((slot, i) => (
            <div
              key={`${slot}-${i}`}
              className="flex h-16 items-center justify-center rounded-card border border-dashed border-line-strong/50 text-sm font-semibold text-muted"
            >
              {slot}
            </div>
          ))}
        </div>
      </Reveal>
    </EditorialSection>
  );
}
