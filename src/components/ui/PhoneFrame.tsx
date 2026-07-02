import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Device frame wrapping an app screenshot. Screens are ~9:19.5 portrait.
 */
export default function PhoneFrame({
  src,
  alt,
  className,
  priority = false,
  width = 300,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  width?: number;
}) {
  return (
    <div
      className={cn(
        "relative shrink-0 rounded-[2.2rem] border border-ink/15 bg-ink p-2 shadow-[0_30px_60px_-25px_rgba(23,19,15,0.55)]",
        className
      )}
      style={{ width }}
    >
      {/* speaker / camera island */}
      <div className="absolute left-1/2 top-3 z-10 h-5 w-20 -translate-x-1/2 rounded-full bg-ink" />
      <div className="overflow-hidden rounded-[1.7rem] bg-paper-soft">
        <Image
          src={src}
          alt={alt}
          width={191}
          height={340}
          priority={priority}
          className="h-auto w-full select-none"
          sizes="(max-width: 768px) 60vw, 300px"
        />
      </div>
    </div>
  );
}
