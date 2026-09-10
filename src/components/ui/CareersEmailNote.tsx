import { CAREERS_EMAIL, careersMailto } from "@/lib/careers";
import { cn } from "@/lib/utils";

/**
 * A sentence that names the careers inbox, with the address itself as the
 * mailto link. `text` carries an "{email}" slot (same convention as the
 * claim ticket's emailedTo). dir="ltr" isolates the address so a trailing
 * period stays put in Arabic; nowrap stops phones breaking it at the hyphen
 * ("careers@qasem-" / "portal.com"), which invites a mis-copied address.
 */
export default function CareersEmailNote({
  text,
  subject,
  className,
}: {
  text: string;
  subject: string;
  className?: string;
}) {
  const [pre, post] = text.split("{email}");
  return (
    <p className={cn(className)}>
      {pre}
      <a
        href={careersMailto(subject)}
        dir="ltr"
        className="whitespace-nowrap font-semibold text-content underline underline-offset-2 transition-colors hover:text-accent-deep"
      >
        {CAREERS_EMAIL}
      </a>
      {post}
    </p>
  );
}
