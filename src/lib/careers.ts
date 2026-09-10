/**
 * Cue does not hire; Qasem Portal does. Every careers path on cue-app.net
 * ends at this one address (the same inbox the careers form on
 * qasem-portal.com notifies), never at a Cue address or a Cue form.
 */
export const CAREERS_EMAIL = "careers@qasem-portal.com";

/**
 * mailto: link to the careers inbox. The subject carries the same
 * "[Careers]" tag the qasem-portal.com notifications use, so one inbox
 * filter catches applications from both sites. The tag stays Latin in both
 * locales; the topic after it is localized.
 */
export function careersMailto(topic: string): string {
  const subject = encodeURIComponent(`[Careers] ${topic}`);
  return `mailto:${CAREERS_EMAIL}?subject=${subject}`;
}
