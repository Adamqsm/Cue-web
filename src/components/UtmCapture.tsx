"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { captureUtm } from "@/lib/utm";

/** Renders nothing — records landing utm_* params on every client navigation. */
export default function UtmCapture() {
  const pathname = usePathname();
  useEffect(() => {
    captureUtm();
  }, [pathname]);
  return null;
}
