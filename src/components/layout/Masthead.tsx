/**
 * v4 page opener — a newspaper masthead, not a hero. Kicker on top, the
 * title at display size, an optional dek and actions, closed by a
 * thick-thin double rule. Static by design: the page starts reading
 * immediately, nothing floats and nothing fades in.
 */
export default function Masthead({
  kicker,
  folio,
  title,
  dek,
  children,
}: {
  kicker: string;
  folio?: string;
  title: string;
  dek?: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="container-pad pb-10 pt-28 sm:pb-12 sm:pt-36">
      <div className="flex items-baseline justify-between gap-4">
        <p className="running-head">{kicker}</p>
        {folio && <p className="folio">{folio}</p>}
      </div>
      <h1 className="mt-5 max-w-4xl text-[clamp(2.5rem,5.6vw,4.5rem)]">
        {title}
      </h1>
      {dek && (
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl">
          {dek}
        </p>
      )}
      {children && <div className="mt-7 flex flex-wrap gap-3">{children}</div>}
      {/* Thick-thin double rule — the masthead's close */}
      <div className="mt-10 border-b-[3px] border-content pb-[5px]">
        <div className="border-b border-content" />
      </div>
    </header>
  );
}
