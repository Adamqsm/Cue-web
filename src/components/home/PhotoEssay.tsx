import type { Dictionary } from "@/i18n/dictionaries";
import RuledSection from "@/components/layout/RuledSection";
import DuoImage from "@/components/ui/DuoImage";

// Fixed editorial layout for the three frames — lead, portrait counter,
// wide closer. The asymmetry is the design; don't equalise it.
const FRAMES = [
  { span: "sm:col-span-7", aspect: "aspect-[4/3]" },
  { span: "sm:col-span-5", aspect: "aspect-[3/4]" },
  { span: "sm:col-span-8 sm:col-start-3", aspect: "aspect-[16/9]" },
];

/**
 * The photo essay — the city the product exists for, in the duotone
 * treatment that makes mixed sources read as one night. A serif standfirst
 * opens; three captioned frames carry it.
 */
export default function PhotoEssay({
  e,
}: {
  e: Dictionary["home"]["essay"];
}) {
  return (
    <RuledSection head={e.head} folio={e.folio}>
      <p className="display max-w-2xl text-2xl leading-snug text-content sm:text-3xl">
        {e.standfirst}
      </p>
      <div className="mt-10 grid gap-x-6 gap-y-8 sm:grid-cols-12">
        {e.photos.map((p, i) => (
          <DuoImage
            key={p.img}
            className={FRAMES[i]?.span}
            src={p.img}
            alt={p.alt}
            sizes="(min-width: 640px) 60vw, 100vw"
            aspect={FRAMES[i]?.aspect}
            caption={p.caption}
          />
        ))}
      </div>
    </RuledSection>
  );
}
