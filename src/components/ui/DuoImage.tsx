import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * A duotone photograph with an optional caption row. The `.duo` wrapper
 * applies the night×limestone filter from DuoFilter; the caption sits under
 * the image like a printed cutline, with an optional folio on the far end.
 * `aspect` controls the frame (e.g. "aspect-[4/3]"); the image fills it.
 */
export default function DuoImage({
  src,
  alt,
  sizes,
  aspect = "aspect-[4/3]",
  priority = false,
  caption,
  folio,
  className,
}: {
  src: string;
  alt: string;
  sizes: string;
  aspect?: string;
  priority?: boolean;
  caption?: string;
  folio?: string;
  className?: string;
}) {
  return (
    <figure className={className}>
      <span className={cn("duo relative block overflow-hidden bg-surface2", aspect)}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      </span>
      {caption && (
        <figcaption className="mt-2 flex items-baseline justify-between gap-4 border-b border-line pb-2 text-[12px] leading-relaxed text-muted">
          <span>{caption}</span>
          {folio && <span className="folio shrink-0">{folio}</span>}
        </figcaption>
      )}
    </figure>
  );
}
