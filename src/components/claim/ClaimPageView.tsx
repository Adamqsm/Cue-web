"use client";

import { useEffect } from "react";
import type { Locale } from "@/i18n/config";
import { track } from "@/lib/qinsider/analytics";

/** Renders nothing — fires the claim-page view event once on mount. */
export default function ClaimPageView({ locale }: { locale: Locale }) {
  useEffect(() => {
    track("claim_view", { source: "claim-page", locale });
  }, [locale]);
  return null;
}
