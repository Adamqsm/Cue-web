/**
 * Claim-funnel analytics. Fire-and-forget beacons gated on the same
 * localStorage key the consent banner writes — no consent, no event, and no
 * failure ever escapes into the claim flow.
 */

export type CueInsiderEvent =
  | "claim_view"
  | "claim_submit"
  | "claim_success"
  | "claim_duplicate"
  | "claim_error";

export function track(
  event: CueInsiderEvent,
  props?: { source?: string; locale?: string }
): void {
  try {
    if (typeof window === "undefined") return;
    if (localStorage.getItem("cue-consent") !== "v1") return;

    const url = "/api/cue-insider/event";
    const payload = JSON.stringify({ event, ...props });
    const blob = new Blob([payload], { type: "application/json" });

    if (!(navigator.sendBeacon && navigator.sendBeacon(url, blob))) {
      fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      }).catch(() => {});
    }
  } catch {
    // Analytics must never throw.
  }
}
