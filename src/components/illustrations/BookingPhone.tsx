/**
 * BookingPhone — hero-scale spot illustration: a hand holding a phone showing
 * the Cue booking card (date/time/party chips, Confirm button, tiny status
 * pill). Thumb hovers over Confirm — the product moment, not decoration.
 *
 * v2 "warm technical": 1.5px content-colored line work (inherited from the
 * root svg), flat token fills, rounded geometry. All color through Tailwind
 * token utilities so both themes adapt; the single sanctioned hex is the
 * abstracted skin tone fill-[#C99B7E]. Confirm label uses fill-bg so it stays
 * dark-ink-on-light-accent in dark mode (never white-on-accent).
 */
export default function BookingPhone({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 400"
      fill="none"
      aria-hidden="true"
      strokeWidth={1.5}
      strokeLinecap="round"
      className={className}
    >
      {/* Quiet wash ground */}
      <circle cx="160" cy="180" r="136" className="fill-accent-wash" />

      {/* Sleeve + palm behind the phone (modern cuff, abstracted hand) */}
      <rect
        x="214"
        y="310"
        width="52"
        height="130"
        rx="26"
        transform="rotate(-28 240 375)"
        className="fill-surface2 stroke-content"
      />
      <ellipse cx="205" cy="306" rx="38" ry="26" className="fill-[#C99B7E] stroke-content" />

      {/* Phone body + screen */}
      <rect x="95" y="36" width="130" height="264" rx="24" className="fill-surface stroke-content" />
      <rect x="104" y="45" width="112" height="246" rx="17" className="fill-bg" />
      <rect x="146" y="53" width="28" height="5" rx="2.5" className="fill-line" />

      {/* Venue header */}
      <circle cx="122" cy="74" r="9" className="fill-accent-wash stroke-content" />
      <rect x="138" y="69" width="52" height="6" rx="3" className="fill-muted" />
      <rect x="138" y="80" width="34" height="5" rx="2.5" className="fill-line" />

      {/* Booking card */}
      <rect x="112" y="96" width="96" height="150" rx="12" className="fill-surface stroke-line" />
      <rect x="122" y="107" width="42" height="6" rx="3" className="fill-muted" />

      {/* Tiny status pill (dot = confirmed semantic) */}
      <rect x="170" y="104" width="30" height="13" rx="6.5" className="fill-accent-wash" />
      <circle cx="177.5" cy="110.5" r="2.5" className="fill-ok" />
      <rect x="183" y="108.5" width="12" height="4" rx="2" className="fill-accent-deep" />

      {/* Date chip (selected) + time chip */}
      <rect x="122" y="126" width="36" height="18" rx="8" className="fill-accent-wash" />
      <rect x="129" y="132.5" width="22" height="5" rx="2.5" className="fill-accent-deep" />
      <rect x="162" y="126" width="36" height="18" rx="8" className="fill-surface2" />
      <rect x="169" y="132.5" width="22" height="5" rx="2.5" className="fill-muted" />

      {/* Party-size chip (three heads) */}
      <rect x="122" y="150" width="54" height="18" rx="8" className="fill-surface2" />
      <circle cx="133" cy="159" r="3" className="fill-muted" />
      <circle cx="142" cy="159" r="3" className="fill-muted" />
      <circle cx="151" cy="159" r="3" className="fill-muted" />
      <rect x="158" y="156.5" width="12" height="5" rx="2.5" className="fill-line" />

      {/* Note skeleton lines */}
      <rect x="122" y="178" width="76" height="5" rx="2.5" className="fill-line" />
      <rect x="122" y="188" width="56" height="5" rx="2.5" className="fill-line" />

      {/* Confirm button — the prominent accent moment */}
      <rect x="122" y="204" width="76" height="28" rx="10" className="fill-accent" />
      <rect x="146" y="215.5" width="28" height="5" rx="2.5" className="fill-bg" />

      {/* Home indicator */}
      <rect x="138" y="281" width="44" height="4" rx="2" className="fill-line" />

      {/* Fingertips wrapping the far edge */}
      <rect x="84" y="214" width="22" height="13" rx="6.5" className="fill-[#C99B7E] stroke-content" />
      <rect x="84" y="238" width="22" height="13" rx="6.5" className="fill-[#C99B7E] stroke-content" />
      <rect x="84" y="262" width="22" height="13" rx="6.5" className="fill-[#C99B7E] stroke-content" />
      <rect x="84" y="286" width="22" height="13" rx="6.5" className="fill-[#C99B7E] stroke-content" />

      {/* Thumb reaching for Confirm */}
      <rect
        x="191.5"
        y="220"
        width="17"
        height="76"
        rx="8.5"
        transform="rotate(-25 200 258)"
        className="fill-[#C99B7E] stroke-content"
      />
    </svg>
  );
}
