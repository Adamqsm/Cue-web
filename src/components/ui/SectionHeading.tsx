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
              /* Inverse band: the accent must flip WITH the band, not the
                 theme (! beats .dark .eyebrow's specificity). AA both modes. */
              tone === "paper" && "!text-accent-inverse"
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
            "text-balance text-[clamp(1.75rem,3.2vw,2.75rem)] font-[650] leading-[1.1] tracking-[-0.025em]",
            tone === "paper" ? "text-bg" : "text-content"
          )}
        >
          {title}
        </h2>
      </Reveal>
      {body && (
        <Reveal delay={2}>
          <p
            className={cn(
              "max-w-[65ch] text-[17px] leading-[1.65]",
              tone === "paper" ? "text-bg/70" : "text-muted"
            )}
          >
            {body}
          </p>
        </Reveal>
      )}
    </div>
  );
}
