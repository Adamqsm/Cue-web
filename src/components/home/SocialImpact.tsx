import type { Dictionary } from "@/i18n/dictionaries";
import EditorialSection from "./EditorialSection";
import Reveal from "@/components/ui/Reveal";

/**
 * Cue's giving page on WFP's own site. Plain, no UTM tags: WFP is a donor
 * relationship, not a campaign we attribute. Exported so the dictionary
 * test can pin it.
 */
export const WFP_DONATE_URL = "https://donate.wfp.org";

/**
 * "Every booking gives back" — the social impact commitment. One lifted
 * card (the Traction stat pattern: big blue numeral + caption) beside the
 * statement and a standard secondary button out to WFP.
 *
 * Text-only reference to WFP by design: no logo, emblem, or UN branding
 * (those need written permission Cue does not have), no "partner" language,
 * and nothing about WFP in the schema.org graph. Cue is a donor.
 * Anchored by id so the section has a shareable public URL.
 */
export default function SocialImpact({
  dict,
  num = "00",
}: {
  dict: Dictionary;
  num?: string;
}) {
  const s = dict.home.impact;
  return (
    <EditorialSection num={num} id="social-impact" label={s.label} band="surface2">
      <div className="max-w-2xl">
        <h2 className="text-[clamp(1.9rem,3.4vw,3rem)] leading-[1.1] text-content">
          {s.title}
        </h2>
        <p className="mt-5 text-lg leading-[1.6] text-muted">{s.body}</p>
      </div>

      <Reveal className="mt-10">
        <div className="card grid gap-8 p-8 sm:p-10 lg:grid-cols-[auto_minmax(0,1fr)] lg:gap-12">
          {/* The number, framed as a share of profit and nothing else. */}
          <div className="flex flex-col gap-1.5 border-b border-line pb-6 lg:max-w-[14rem] lg:border-b-0 lg:border-e lg:pb-0 lg:pe-12">
            <span className="text-5xl font-extrabold tabular-nums tracking-[-0.02em] text-accent rtl:tracking-normal sm:text-6xl">
              {s.stat}
            </span>
            <span className="text-sm font-medium leading-snug text-muted">
              {s.statLabel}
            </span>
          </div>

          <div className="min-w-0">
            <p className="max-w-[62ch] text-lg leading-[1.7] text-content/85">
              {s.detail}
            </p>
            <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
              <a
                href={WFP_DONATE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
              >
                {s.cta}
                <svg
                  viewBox="0 0 16 16"
                  className="h-4 w-4 rtl:-scale-x-100"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M6 3.5h6.5V10M12.5 3.5 4 12" />
                </svg>
                <span className="sr-only">{s.ctaNewTab}</span>
              </a>
              <p className="max-w-sm text-sm leading-relaxed text-muted">
                {s.note}
              </p>
            </div>
          </div>
        </div>
      </Reveal>
    </EditorialSection>
  );
}
