import { CueMark } from "@/components/BrandMark";

/**
 * Infinite marquee strip. Pure CSS animation (see tailwind keyframes).
 * Duplicated content ensures a seamless -50% loop.
 */
export default function Marquee({
  items,
  rtl = false,
}: {
  items: string[];
  rtl?: boolean;
}) {
  const row = (
    <div
      className="flex shrink-0 items-center gap-8 px-4"
      aria-hidden={undefined}
    >
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-8">
          <span className="font-display text-2xl italic text-paper/90 sm:text-3xl">
            {item}
          </span>
          <CueMark className="h-4 w-4 text-clay-300" />
        </span>
      ))}
    </div>
  );

  return (
    <div className="group relative flex w-full overflow-hidden py-6">
      <div
        className={`flex min-w-full shrink-0 ${
          rtl ? "animate-marquee-rtl" : "animate-marquee"
        } group-hover:[animation-play-state:paused]`}
      >
        {row}
      </div>
      <div
        className={`flex min-w-full shrink-0 ${
          rtl ? "animate-marquee-rtl" : "animate-marquee"
        } group-hover:[animation-play-state:paused]`}
        aria-hidden
      >
        {row}
      </div>
    </div>
  );
}
