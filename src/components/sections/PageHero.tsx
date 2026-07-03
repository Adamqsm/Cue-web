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
    <section className="relative overflow-hidden pt-28 sm:pt-36">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <CueMark className="absolute -end-24 -top-24 h-[28rem] w-[28rem] text-green/[0.07] animate-spin-slow" />
      </div>
      <div className="container-pad pb-6">
        <div
          className={cn(
            "max-w-4xl",
            center && "mx-auto text-center"
          )}
        >
          <Reveal>
            <span className="eyebrow">
              <span className="h-px w-6 bg-current opacity-60" />
              {eyebrow}
            </span>
          </Reveal>
          <Reveal delay={1}>
            <h1 className="mt-5 text-balance text-4xl font-semibold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
              {title}
            </h1>
          </Reveal>
          {subtitle && (
            <Reveal delay={2}>
              <p
                className={cn(
                  "mt-6 text-lg leading-relaxed text-content/70 sm:text-xl",
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
