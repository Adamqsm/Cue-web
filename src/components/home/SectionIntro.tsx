import { cn } from "@/lib/utils";
import Reveal from "@/components/ui/Reveal";

/** Shared section header: mono label + display title + optional body. */
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
          "label",
          align === "center" && "justify-center"
        )}
      >
        <span className="h-px w-6 bg-green/50" aria-hidden />
        {label}
      </span>
      <h2
        className={cn(
          "mt-4 text-3xl font-bold leading-[1.05] text-content sm:text-4xl lg:text-[2.9rem]",
          titleClassName
        )}
      >
        {title}
      </h2>
      {body && (
        <p className="mt-4 text-lg leading-relaxed text-muted">{body}</p>
      )}
    </Reveal>
  );
}
