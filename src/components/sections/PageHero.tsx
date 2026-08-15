import Reveal from "@/components/ui/Reveal";
import { CueMark } from "@/components/BrandMark";
import { cn } from "@/lib/utils";

export default function PageHero({
  eyebrow,
  title,
  subtitle,
  children,
  align = "start",
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  align?: "start" | "center";
}) {
  const center = align === "center";
  return (
    <section className="relative overflow-hidden pt-32 sm:pt-40">
      {/* Hairline brand watermark — static, barely-there */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <CueMark className="absolute -end-24 -top-24 h-[26rem] w-[26rem] text-accent/[0.05]" />
      </div>
      <div className="container-pad pb-6">
        <div
          className={cn(
            "max-w-4xl",
            center && "mx-auto text-center"
          )}
        >
          <Reveal>
            <span className="eyebrow">{eyebrow}</span>
          </Reveal>
          <Reveal delay={1}>
            <h1 className="mt-5 text-balance text-[clamp(2.5rem,6vw,4.75rem)]">
              {title}
            </h1>
          </Reveal>
          {subtitle && (
            <Reveal delay={2}>
              <p
                className={cn(
                  "mt-6 text-lg leading-relaxed text-muted sm:text-xl",
                  center ? "mx-auto max-w-2xl" : "max-w-2xl"
                )}
              >
                {subtitle}
              </p>
            </Reveal>
          )}
          {children && (
            <Reveal delay={3}>
              <div className={cn("mt-8 flex flex-wrap gap-3", center && "justify-center")}>
                {children}
              </div>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
