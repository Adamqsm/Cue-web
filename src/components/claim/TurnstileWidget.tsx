"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/i18n/config";

type TurnstileApi = {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string;
      theme?: "auto" | "light" | "dark";
      language?: string;
      callback?: (token: string) => void;
      "expired-callback"?: () => void;
      "error-callback"?: () => void;
    }
  ) => string;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

// Cloudflare's always-pass test key keeps previews working without env setup —
// but only outside production. A production build missing the real key fails
// closed (null) and shows the failure message instead of an always-pass check.
const SITE_KEY =
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ||
  (process.env.NODE_ENV === "production" ? null : "1x00000000000000000000AA");

const SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

let scriptPromise: Promise<void> | null = null;

function loadTurnstile(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = SCRIPT_SRC;
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => {
        // Allow a retry on a later mount (e.g. flaky connection).
        scriptPromise = null;
        reject(new Error("turnstile script failed to load"));
      };
      document.head.appendChild(s);
    });
  }
  return scriptPromise;
}

export default function TurnstileWidget({
  onToken,
  locale,
  failText,
}: {
  onToken: (token: string | null) => void;
  locale: Locale;
  failText?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  // True when the check can't render (no prod key, or script load failure) —
  // shows failText instead of an empty box.
  const [failed, setFailed] = useState(false);
  // Ref keeps the render effect stable across parent re-renders.
  const onTokenRef = useRef(onToken);
  onTokenRef.current = onToken;

  useEffect(() => {
    if (!SITE_KEY) {
      setFailed(true);
      onTokenRef.current(null);
      return;
    }
    const sitekey = SITE_KEY;
    let widgetId: string | null = null;
    let cancelled = false;

    loadTurnstile()
      .then(() => {
        if (cancelled || !containerRef.current || !window.turnstile) return;
        widgetId = window.turnstile.render(containerRef.current, {
          sitekey,
          theme: "auto",
          language: locale,
          callback: (token) => onTokenRef.current(token),
          "expired-callback": () => onTokenRef.current(null),
          "error-callback": () => onTokenRef.current(null),
        });
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
        onTokenRef.current(null);
      });

    return () => {
      cancelled = true;
      if (widgetId !== null) {
        try {
          window.turnstile?.remove(widgetId);
        } catch {
          // Widget already torn down.
        }
      }
    };
  }, [locale]);

  // min-h reserves the widget's footprint so the form doesn't shift on load.
  if (failed) {
    return (
      <p className="flex min-h-[65px] items-center text-xs text-muted">
        {failText}
      </p>
    );
  }
  return <div ref={containerRef} className="min-h-[65px]" />;
}
