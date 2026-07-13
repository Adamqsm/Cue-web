/**
 * OperatorBoard — landscape spot illustration: the restaurant pass. A tablet
 * propped on the counter runs the Cue request queue (three rows — the middle
 * one is the live incoming request with its accent confirm tap) beside a
 * floor-plan dot grid. A coffee cup and an order ticket ground the scene.
 *
 * v2 "warm technical": 1.5px content-colored line work (inherited from the
 * root svg), flat token fills, rounded geometry. Status dots follow the
 * service-board semantics: incoming = accent, confirmed = ok, seated = muted.
 * Confirm label uses fill-bg so dark mode keeps dark ink on the light accent.
 */
export default function OperatorBoard({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 320"
      fill="none"
      aria-hidden="true"
      strokeWidth={1.5}
      strokeLinecap="round"
      className={className}
    >
      {/* Quiet wash ground */}
      <circle cx="230" cy="150" r="140" className="fill-accent-wash" />

      {/* Kickstand behind the tablet */}
      <rect
        x="344"
        y="150"
        width="9"
        height="100"
        rx="4.5"
        transform="rotate(-24 348.5 200)"
        className="fill-surface2 stroke-content"
      />

      {/* Pass counter */}
      <rect x="24" y="246" width="432" height="16" rx="8" className="fill-surface2 stroke-content" />

      {/* Tablet + screen */}
      <rect x="120" y="74" width="220" height="176" rx="16" className="fill-surface stroke-content" />
      <rect x="132" y="86" width="196" height="152" rx="10" className="fill-bg" />

      {/* Screen header */}
      <rect x="144" y="98" width="56" height="7" rx="3.5" className="fill-muted" />
      <rect x="296" y="96" width="24" height="11" rx="5.5" className="fill-surface2" />

      {/* Queue row 1 — confirmed (ok dot) */}
      <rect x="144" y="116" width="116" height="32" rx="8" className="fill-surface2" />
      <circle cx="158" cy="132" r="6" className="fill-line" />
      <rect x="170" y="125" width="38" height="5" rx="2.5" className="fill-muted" />
      <rect x="170" y="134.5" width="26" height="4" rx="2" className="fill-line" />
      <circle cx="246" cy="132" r="4" className="fill-ok" />

      {/* Queue row 2 — incoming, highlighted, with the confirm tap */}
      <rect x="144" y="152" width="116" height="32" rx="8" className="fill-accent-wash stroke-accent" />
      <circle cx="158" cy="168" r="6" className="fill-surface stroke-accent-deep" />
      <rect x="170" y="161" width="38" height="5" rx="2.5" className="fill-accent-deep" />
      <rect x="170" y="170.5" width="26" height="4" rx="2" className="fill-accent-deep" />
      <rect x="222" y="160" width="34" height="16" rx="8" className="fill-accent" />
      <rect x="231" y="166" width="16" height="4" rx="2" className="fill-bg" />

      {/* Queue row 3 — seated (muted dot) */}
      <rect x="144" y="188" width="116" height="32" rx="8" className="fill-surface2" />
      <circle cx="158" cy="204" r="6" className="fill-line" />
      <rect x="170" y="197" width="38" height="5" rx="2.5" className="fill-muted" />
      <rect x="170" y="206.5" width="26" height="4" rx="2" className="fill-line" />
      <circle cx="246" cy="204" r="4" className="fill-muted" />

      {/* Floor-plan dot grid */}
      <rect x="268" y="116" width="52" height="104" rx="8" className="fill-surface2 stroke-line" />
      <circle cx="281" cy="131" r="4" className="fill-ok" />
      <circle cx="294" cy="131" r="4" className="fill-line" />
      <circle cx="307" cy="131" r="4" className="fill-line" />
      <circle cx="281" cy="155" r="4" className="fill-line" />
      <circle cx="294" cy="155" r="4" className="fill-accent" />
      <circle cx="307" cy="155" r="4" className="fill-line" />
      <circle cx="281" cy="179" r="4" className="fill-line" />
      <circle cx="294" cy="179" r="4" className="fill-ok" />
      <circle cx="307" cy="179" r="4" className="fill-line" />
      <circle cx="281" cy="203" r="4" className="fill-line" />
      <circle cx="294" cy="203" r="4" className="fill-line" />
      <circle cx="307" cy="203" r="4" className="fill-ok" />

      {/* Coffee cup on the counter */}
      <rect x="386" y="214" width="30" height="32" rx="7" className="fill-surface stroke-content" />
      <ellipse cx="401" cy="216" rx="10" ry="3.5" className="fill-accent-wash stroke-content" />
      <path d="M416 222 a9 9 0 0 1 0 16" className="stroke-content" />
      <path d="M394 202 q-4 -7 0 -14" className="stroke-muted" />
      <path d="M407 202 q4 -7 0 -14" className="stroke-muted" />

      {/* Order ticket */}
      <rect x="68" y="230" width="38" height="16" rx="3" className="fill-surface stroke-content" />
      <rect x="75" y="235" width="20" height="3" rx="1.5" className="fill-line" />
      <rect x="75" y="240.5" width="14" height="3" rx="1.5" className="fill-line" />
    </svg>
  );
}
