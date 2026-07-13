import { cn } from "@/lib/utils";
import Reveal from "@/components/ui/Reveal";

/** Shared section header: eyebrow label + h2 title + optional muted body. */
export default function SectionIntro({
  label,
  title,
  body,
  align = "start",
  className,
  titleClassName,
}: {
  label: string;
  title: string;
  body?: string;
  align?: "start" | "center";
  className?: string;
  titleClassName?: string;
}) {
  return (
    <Reveal
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      <span
        className={cn(
          "eyebrow",
          align === "center" && "justify-center"
        )}
      >
        <span className="h-px w-6 bg-accent/60" aria-hidden />
        {label}
      </span>
      <h2
        className={cn(
          "mt-4 text-[clamp(1.75rem,3.2vw,2.75rem)] font-[650] leading-[1.1] tracking-[-0.025em] text-content",
          titleClassName
        )}
      >
        {title}
      </h2>
      {body && (
        <p
          className={cn(
            "mt-4 max-w-[65ch] text-lg leading-relaxed text-muted",
            align === "center" && "mx-auto"
          )}
        >
          {body}
        </p>
      )}
    </Reveal>
  );
}
