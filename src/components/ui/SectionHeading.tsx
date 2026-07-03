import Reveal from "./Reveal";
import { cn } from "@/lib/utils";

export default function SectionHeading({
  kicker,
  title,
  body,
  align = "start",
  tone = "ink",
  className,
}: {
  kicker?: string;
  title: string;
  body?: string;
  align?: "start" | "center";
  tone?: "ink" | "paper";
  className?: string;
}) {
  const isCenter = align === "center";
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        isCenter && "items-center text-center",
        "max-w-3xl",
        isCenter && "mx-auto",
        className
      )}
    >
      {kicker && (
        <Reveal>
          <span
            className={cn(
              "eyebrow",
              tone === "paper" && "text-green-300"
            )}
          >
            <span className="h-px w-6 bg-current opacity-60" />
            {kicker}
          </span>
        </Reveal>
      )}
      <Reveal delay={1}>
        <h2
          className={cn(
            "text-balance text-3xl font-semibold leading-[1.08] sm:text-4xl md:text-5xl",
            tone === "paper" ? "text-bone" : "text-content"
          )}
        >
          {title}
        </h2>
      </Reveal>
      {body && (
        <Reveal delay={2}>
          <p
            className={cn(
              "text-lg leading-relaxed",
              tone === "paper" ? "text-bone/70" : "text-content/70"
            )}
          >
            {body}
          </p>
        </Reveal>
      )}
    </div>
  );
}
