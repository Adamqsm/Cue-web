import Image from "next/image";
import { cn } from "@/lib/utils";

type Feature = { img: string; title: string; body: string };

/**
 * A contact sheet, not an accordion: every screenshot visible at once in a
 * plain print frame, its caption set beneath like a cutline. Product UI
 * stays true-colour (duotone is for photography only). Static by design.
 */
export default function FeatureShowcase({
  features,
  columns = 3,
}: {
  features: Feature[];
  columns?: 3 | 4;
}) {
  return (
    <div
      className={cn(
        "grid gap-x-6 gap-y-10 grid-cols-2",
        columns === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"
      )}
    >
      {features.map((f) => (
        <figure key={f.title}>
          <span className="block border border-line bg-surface p-2">
            <Image
              src={f.img}
              alt={`${f.title} — Cue restaurant reservation app, Amman`}
              width={1206}
              height={2622}
              sizes="(min-width: 1024px) 24vw, 45vw"
              className="block h-auto w-full"
            />
          </span>
          <figcaption className="mt-3 border-b border-line pb-3">
            <h3 className="text-base text-content sm:text-lg">{f.title}</h3>
            <p className="mt-1 text-[13px] leading-relaxed text-muted sm:text-sm">
              {f.body}
            </p>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
