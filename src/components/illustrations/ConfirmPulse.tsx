/**
 * ConfirmPulse — small spot illustration: a booking status pill morphing to
 * confirmed. The fading accent-wash pill behind is the "incoming" state; the
 * front pill carries the ok check (confirmed = ok, per the service-board
 * semantics). One static concentric pulse ring — no animation here, motion is
 * the parent's job.
 *
 * v2 "warm technical": 1.5px content-colored line work, flat token fills only,
 * theme-adaptive via CSS variables. Symmetric on the vertical axis, so an RTL
 * scaleX(-1) mirror reads fine.
 */
export default function ConfirmPulse({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" aria-hidden="true" className={className}>
      {/* Static pulse ring + origin tick */}
      <circle cx="100" cy="100" r="74" className="stroke-ok" strokeWidth={1.5} opacity={0.35} />
      <circle cx="100" cy="26" r="3" className="fill-ok" />

      {/* Ghost of the incoming state (accent = incoming) */}
      <rect x="52" y="62" width="96" height="30" rx="15" className="fill-accent-wash" />
      <circle cx="68" cy="77" r="5" className="fill-accent" />
      <rect x="80" y="74.5" width="40" height="5" rx="2.5" className="fill-accent-deep" opacity={0.55} />

      {/* Confirmed pill */}
      <rect x="40" y="98" width="120" height="36" rx="18" className="fill-surface stroke-content" strokeWidth={1.5} />
      <circle cx="62" cy="116" r="9" className="fill-ok" />
      <path d="M57.8 116 l3 3.2 l6 -7" className="stroke-surface" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <rect x="80" y="113.25" width="54" height="5.5" rx="2.75" className="fill-content" />
    </svg>
  );
}
