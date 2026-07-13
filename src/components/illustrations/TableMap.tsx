/**
 * TableMap — overhead venue floor map, a quiet square spot illustration.
 * Rounded-rect and round tables with chair arcs; confirmed tables are filled
 * accent-wash with ok status dots, one table carries the incoming highlight
 * (accent outline + dot + static ring). A coffee counter and entry door frame
 * the room.
 *
 * v2 "warm technical": 1.5px content-colored line work (inherited from the
 * root svg), flat token fills, rounded geometry, theme-adaptive via tokens.
 * Status colors are information, not decoration: incoming = accent,
 * confirmed = ok. No people, no motion — the map itself is the story.
 */
export default function TableMap({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 400"
      fill="none"
      aria-hidden="true"
      strokeWidth={1.5}
      strokeLinecap="round"
      className={className}
    >
      {/* Floor plate */}
      <rect x="28" y="28" width="344" height="344" rx="22" className="fill-surface stroke-content" />

      {/* Coffee counter (coffee/tea only) */}
      <rect x="52" y="52" width="116" height="26" rx="10" className="fill-surface2 stroke-content" />
      <circle cx="84" cy="65" r="5.5" className="fill-accent-wash stroke-content" />
      <circle cx="106" cy="65" r="5.5" className="fill-accent-wash stroke-content" />
      <rect x="126" y="62" width="28" height="6" rx="3" className="fill-line" />

      {/* Entry door + swing */}
      <rect x="60" y="334" width="3" height="38" rx="1.5" className="fill-content" />
      <path d="M61.5 334 a38 38 0 0 1 38 38" className="stroke-line" />

      {/* Host stand by the door */}
      <rect x="118" y="336" width="24" height="20" rx="7" className="fill-surface2 stroke-content" />

      {/* Table 1 — round, empty */}
      <circle cx="124" cy="160" r="24" className="fill-bg stroke-content" />
      <path d="M115 128 a11 11 0 0 1 18 0" className="stroke-content" />
      <path d="M115 192 a11 11 0 0 0 18 0" className="stroke-content" />
      <path d="M92 151 a11 11 0 0 0 0 18" className="stroke-content" />
      <path d="M156 151 a11 11 0 0 1 0 18" className="stroke-content" />

      {/* Table 2 — square, confirmed (accent-wash + ok dot) */}
      <rect x="232" y="104" width="54" height="54" rx="12" className="fill-accent-wash stroke-content" />
      <circle cx="259" cy="131" r="4.5" className="fill-ok" />
      <path d="M250 96 a11 11 0 0 1 18 0" className="stroke-content" />
      <path d="M250 166 a11 11 0 0 0 18 0" className="stroke-content" />
      <path d="M224 122 a11 11 0 0 0 0 18" className="stroke-content" />
      <path d="M294 122 a11 11 0 0 1 0 18" className="stroke-content" />

      {/* Table 3 — long banquette, confirmed (accent-wash + ok dot) */}
      <rect x="72" y="236" width="104" height="48" rx="12" className="fill-accent-wash stroke-content" />
      <circle cx="124" cy="260" r="4.5" className="fill-ok" />
      <path d="M91 228 a11 11 0 0 1 18 0" className="stroke-content" />
      <path d="M139 228 a11 11 0 0 1 18 0" className="stroke-content" />
      <path d="M91 292 a11 11 0 0 0 18 0" className="stroke-content" />
      <path d="M139 292 a11 11 0 0 0 18 0" className="stroke-content" />

      {/* Table 4 — round, incoming highlight (accent + static ring) */}
      <circle cx="302" cy="232" r="24" className="fill-accent-wash stroke-accent" />
      <circle cx="302" cy="232" r="11" className="stroke-accent" />
      <circle cx="302" cy="232" r="5" className="fill-accent" />
      <path d="M293 200 a11 11 0 0 1 18 0" className="stroke-content" />
      <path d="M293 264 a11 11 0 0 0 18 0" className="stroke-content" />
      <path d="M270 223 a11 11 0 0 0 0 18" className="stroke-content" />
      <path d="M334 223 a11 11 0 0 1 0 18" className="stroke-content" />

      {/* Table 5 — small square, empty */}
      <rect x="212" y="302" width="44" height="44" rx="10" className="fill-bg stroke-content" />
      <path d="M204 315 a11 11 0 0 0 0 18" className="stroke-content" />
      <path d="M264 315 a11 11 0 0 1 0 18" className="stroke-content" />

      {/* Table 6 — small round, empty */}
      <circle cx="328" cy="328" r="18" className="fill-bg stroke-content" />
      <path d="M319 302 a11 11 0 0 1 18 0" className="stroke-content" />
      <path d="M319 354 a11 11 0 0 0 18 0" className="stroke-content" />
    </svg>
  );
}
