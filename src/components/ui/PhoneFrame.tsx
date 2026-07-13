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
  // New product screenshots (public/images) are 1206×2622; legacy /app shots are 191×340.
  const hiRes = src.includes("/images/");
  return (
    <div
      className={cn(
        "relative shrink-0 rounded-panel border border-line bg-surface p-2 shadow-soft",
        className
      )}
      style={{ width }}
    >
      <div className="overflow-hidden rounded-card bg-surface2">
        <Image
          src={src}
          alt={alt}
          width={hiRes ? 1206 : 191}
          height={hiRes ? 2622 : 340}
          priority={priority}
          className="h-auto w-full select-none"
          sizes="(max-width: 768px) 60vw, 300px"
        />
      </div>
    </div>
  );
}
