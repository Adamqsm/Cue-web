import type { Dictionary } from "@/i18n/dictionaries";
import EditorialSection from "./EditorialSection";
import Reveal from "@/components/ui/Reveal";
import { CueMark } from "@/components/BrandMark";

/**
 * A short personal note from the founder.
 *
 * PLACEHOLDER CONTENT: the letter body and the signature line ship as
 * clearly-flagged stand-in copy (see `home.founder` in the dictionaries, and
 * the visible badge rendered from `founder.placeholderTag`). Swap in the real
 * note before launch and delete the `placeholderTag` strings to remove the
 * badge. No bio, photo, or quote is invented here.
 */
export default function FounderNote({
  dict,
  num = "00",
}: {
  dict: Dictionary;
  num?: string;
}) {
  const f = dict.home.founder;
  return (
    <EditorialSection num={num} label={f.label} band="surface2">
      <Reveal>
        <div className="relative mx-auto max-w-3xl overflow-hidden rounded-panel border border-line bg-surface p-8 shadow-soft sm:p-12">
          <CueMark className="pointer-events-none absolute -end-14 -top-14 h-48 w-48 text-accent/[0.06]" aria-hidden />

          {f.placeholderTag && (
            <span className="tag-placeholder mb-6">{f.placeholderTag}</span>
          )}

          <div className="relative space-y-5 text-lg leading-[1.75] text-content/85">
            {f.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>

          <div className="mt-8 flex items-center gap-4 border-t border-line pt-6">
            <span
              className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-wash text-accent-deep"
              aria-hidden
            >
              <CueMark className="h-6 w-6" />
            </span>
            <div>
              <p className="font-bold text-content">{f.signName}</p>
              <p className="text-sm text-muted">{f.signRole}</p>
            </div>
          </div>
        </div>
      </Reveal>
    </EditorialSection>
  );
}
