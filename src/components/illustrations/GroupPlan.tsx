/**
 * GroupPlan — three friends coordinating a night out over a chat thread.
 * v2 "warm technical" illustration: 1.5px content-colored line work, flat
 * accent / accent-wash / surface-2 fills, on-token colors only so the piece
 * adapts to both themes automatically. Skin tone #C99B7E is the single
 * documented hardcoded-hex exception (spec: Illustration system).
 *
 * Composition is horizontally symmetric (figure left / figure right / figure
 * behind the phone) so a parent-applied scaleX(-1) mirror for RTL reads fine.
 * Static by design — any motion is the parent's job.
 */
export default function GroupPlan({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 640 400" fill="none" aria-hidden="true" className={className}>
      {/* Ground wash */}
      <ellipse cx="320" cy="352" rx="240" ry="24" className="fill-accent-wash" />

      {/* ---- Center friend (behind the phone) ---- */}
      <rect x="244" y="90" width="152" height="76" rx="34" className="fill-surface2 stroke-content" strokeWidth={1.5} />
      <circle cx="320" cy="68" r="22" className="fill-[#C99B7E] stroke-content" strokeWidth={1.5} />
      <path d="M298 68 a22 22 0 0 1 44 0 Z" className="fill-content" />

      {/* ---- Floating phone: shared chat thread ---- */}
      <rect x="254" y="92" width="132" height="238" rx="22" className="fill-surface stroke-content" strokeWidth={1.5} />
      <rect x="304" y="104" width="32" height="5" rx="2.5" className="fill-line" />

      {/* Thread header: three member avatars + group name */}
      <circle cx="306" cy="124" r="8" className="fill-[#C99B7E] stroke-content" strokeWidth={1.5} />
      <circle cx="320" cy="124" r="8" className="fill-accent stroke-content" strokeWidth={1.5} />
      <circle cx="334" cy="124" r="8" className="fill-surface2 stroke-content" strokeWidth={1.5} />
      <rect x="296" y="138" width="48" height="4" rx="2" className="fill-muted" />

      {/* Shared venue card bubble */}
      <rect x="266" y="152" width="86" height="62" rx="8" className="fill-surface2 stroke-content" strokeWidth={1.5} />
      <rect x="273" y="159" width="72" height="24" rx="5" className="fill-accent-wash" />
      <circle cx="309" cy="171" r="5.5" className="fill-accent" />
      <rect x="273" y="190" width="48" height="4" rx="2" className="fill-muted" />
      <rect x="273" y="199" width="32" height="4" rx="2" className="fill-line" />

      {/* Split-payment link bubbles, each settled with an ok check */}
      <rect x="266" y="224" width="84" height="20" rx="10" className="fill-surface stroke-content" strokeWidth={1.5} />
      <rect x="276" y="231.5" width="38" height="5" rx="2.5" className="fill-line" />
      <circle cx="336" cy="234" r="6.5" className="fill-ok" />
      <path d="M332.8 234 l2.4 2.6 l4.6 -5.2" className="stroke-surface" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />

      <rect x="290" y="252" width="84" height="20" rx="10" className="fill-surface stroke-content" strokeWidth={1.5} />
      <rect x="300" y="259.5" width="38" height="5" rx="2.5" className="fill-line" />
      <circle cx="360" cy="262" r="6.5" className="fill-ok" />
      <path d="M356.8 262 l2.4 2.6 l4.6 -5.2" className="stroke-surface" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />

      <rect x="266" y="280" width="84" height="20" rx="10" className="fill-surface stroke-content" strokeWidth={1.5} />
      <rect x="276" y="287.5" width="38" height="5" rx="2.5" className="fill-line" />
      <circle cx="336" cy="290" r="6.5" className="fill-ok" />
      <path d="M332.8 290 l2.4 2.6 l4.6 -5.2" className="stroke-surface" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />

      {/* Composer row + send */}
      <rect x="266" y="306" width="108" height="18" rx="9" className="fill-surface2" />
      <circle cx="365" cy="315" r="7" className="fill-accent" />
      <path d="M361.5 315 h6.5 M365.5 312.5 l2.5 2.5 l-2.5 2.5" className="stroke-surface" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />

      {/* ---- Left friend ---- */}
      <rect x="90" y="222" width="84" height="118" rx="32" className="fill-accent stroke-content" strokeWidth={1.5} />
      <rect x="158" y="238" width="58" height="14" rx="7" transform="rotate(-16 158 245)" className="fill-accent stroke-content" strokeWidth={1.5} />
      <circle cx="214" cy="229" r="7.5" className="fill-[#C99B7E] stroke-content" strokeWidth={1.5} />
      <circle cx="132" cy="186" r="24" className="fill-[#C99B7E] stroke-content" strokeWidth={1.5} />
      <path d="M108 186 a24 24 0 0 1 48 0 Z" className="fill-content" />

      {/* ---- Right friend ---- */}
      <rect x="466" y="222" width="84" height="118" rx="32" className="fill-content stroke-content" strokeWidth={1.5} />
      <rect x="424" y="238" width="58" height="14" rx="7" transform="rotate(16 482 245)" className="fill-content stroke-content" strokeWidth={1.5} />
      <circle cx="426" cy="229" r="7.5" className="fill-[#C99B7E] stroke-content" strokeWidth={1.5} />
      <circle cx="508" cy="186" r="24" className="fill-[#C99B7E] stroke-content" strokeWidth={1.5} />
      <path d="M484 186 a24 24 0 0 1 48 0 Z" className="fill-content" />
      <circle cx="508" cy="158" r="7" className="fill-content" />

      {/* Checkmarks landing: settled payments floating in from each side */}
      <circle cx="222" cy="120" r="9" className="fill-ok" />
      <path d="M217.8 120 l3 3.2 l6 -6.8" className="stroke-surface" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="418" cy="140" r="9" className="fill-ok" />
      <path d="M413.8 140 l3 3.2 l6 -6.8" className="stroke-surface" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
