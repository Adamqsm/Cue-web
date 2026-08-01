"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { localizedHref } from "@/lib/utils";
import ClaimModal from "./ClaimModal";

type ClaimModalStrings = Pick<
  Dictionary["claim"],
  "modal" | "form" | "success" | "duplicate"
>;
type ClaimModalSource = "nav-cta" | "claim-modal";

// Written by ClaimForm on issue/duplicate — presence means "never auto-nag".
const CLAIMED_KEY = "cue-qinsider-claimed";
const SEEN_KEY = "cue-qinsider-modal-seen";
const SEEN_TTL_MS = 30 * 24 * 60 * 60 * 1000;

// While the consent banner is still up its focus trap would fight the
// modal's — treat unreadable storage as "banner may be up".
function consentGiven(): boolean {
  try {
    return localStorage.getItem("cue-consent") === "v1";
  } catch {
    return false;
  }
}

const ClaimModalContext = createContext<{
  openClaimModal: (source: ClaimModalSource) => void;
} | null>(null);

/** Null when no ClaimModalProvider is mounted — callers fall back to /claim. */
export function useClaimModal() {
  return useContext(ClaimModalContext);
}

/**
 * Owns the claim dialog + the homepage auto-trigger: opens once per pageview
 * when the visitor scrolls past 60% of `/{locale}` — only if they haven't
 * claimed and haven't been shown the modal in the last 30 days. On success the
 * modal stays open so the ticket is seen; closing is always the user's action.
 */
export default function ClaimModalProvider({
  locale,
  strings,
  children,
}: {
  locale: Locale;
  strings: ClaimModalStrings;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [source, setSource] = useState<ClaimModalSource>("claim-modal");
  const openRef = useRef(false);
  openRef.current = open;
  const autoFired = useRef(false);
  const pathname = usePathname();
  const router = useRouter();

  const openClaimModal = useCallback(
    (src: ClaimModalSource) => {
      // Consent still pending — fall back to the page instead of stacking
      // two focus-trapped dialogs.
      if (!consentGiven()) {
        router.push(localizedHref("/claim", locale));
        return;
      }
      setSource(src);
      setOpen(true);
    },
    [locale, router]
  );
  const close = useCallback(() => setOpen(false), []);
  const ctx = useMemo(() => ({ openClaimModal }), [openClaimModal]);

  useEffect(() => {
    if (autoFired.current || pathname !== `/${locale}`) return;

    const detach = () => window.removeEventListener("scroll", onScroll);
    const onScroll = () => {
      if (autoFired.current || openRef.current) return;
      const range =
        document.documentElement.scrollHeight - window.innerHeight;
      if (range <= 0 || window.scrollY < range * 0.6) return;
      // Consent still pending — don't stack on the banner; keep listening so
      // a later scroll (after consent) can still auto-open.
      if (!consentGiven()) return;
      try {
        if (localStorage.getItem(CLAIMED_KEY) === "1") {
          detach();
          return;
        }
        const seen = localStorage.getItem(SEEN_KEY);
        if (seen) {
          const seenAt = Date.parse(seen);
          if (!Number.isNaN(seenAt) && Date.now() - seenAt < SEEN_TTL_MS) {
            detach();
            return;
          }
        }
        localStorage.setItem(SEEN_KEY, new Date().toISOString());
      } catch {
        // Storage unavailable — can't honor the frequency caps, so never auto-open.
        detach();
        return;
      }
      autoFired.current = true;
      detach();
      setSource("claim-modal");
      setOpen(true);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return detach;
  }, [pathname, locale]);

  return (
    <ClaimModalContext.Provider value={ctx}>
      {children}
      {open ? (
        <ClaimModal
          strings={strings}
          locale={locale}
          source={source}
          onClose={close}
        />
      ) : null}
    </ClaimModalContext.Provider>
  );
}
