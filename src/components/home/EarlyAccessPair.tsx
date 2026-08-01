import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import EditorialSection from "./EditorialSection";
import SectionHeading from "@/components/ui/SectionHeading";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import LocaleLink from "@/components/ui/LocaleLink";

/**
 * "Two doors" — the paired pre-launch offers, one per side of the booking:
 * guests claim a Qinsider code, operators take the founding-partner year.
 * Deliberately symmetric cards; only wash + button accent tell them apart.
 */
export default function EarlyAccessPair({
  locale,
  dict,
  num = "08",
}: {
  locale: Locale;
  dict: Dictionary;
  num?: string;
}) {
  const ea = dict.home.earlyAccess;
  return (
    <EditorialSection num={num} label={ea.label} band="surface2" id="early-access">
      <SectionHeading title={ea.title} body={ea.body} />
      <RevealGroup className="mt-12 grid gap-6 md:grid-cols-2">
        <RevealItem className="flex flex-col rounded-panel border border-line bg-spark-wash p-7 md:p-9">
          <p className="eyebrow">
            <span className="h-px w-6 bg-current opacity-60" />
            {ea.guest.eyebrow}
          </p>
          <h3 className="mt-4 font-display text-2xl text-content">
            {ea.guest.title}
          </h3>
          <p className="mt-3 leading-[1.65] text-muted">{ea.guest.body}</p>
          <div className="mt-auto pt-8">
            <LocaleLink href="/claim" locale={locale} className="btn btn-spark">
              {ea.guest.cta}
            </LocaleLink>
          </div>
        </RevealItem>
        <RevealItem className="flex flex-col rounded-panel border border-line bg-accent-wash p-7 md:p-9">
          <p className="eyebrow">
            <span className="h-px w-6 bg-current opacity-60" />
            {ea.operator.eyebrow}
          </p>
          <h3 className="mt-4 font-display text-2xl text-content">
            {ea.operator.title}
          </h3>
          <p className="mt-3 leading-[1.65] text-muted">{ea.operator.body}</p>
          <div className="mt-auto pt-8">
            <LocaleLink href="/partner" locale={locale} className="btn btn-primary">
              {ea.operator.cta}
            </LocaleLink>
          </div>
        </RevealItem>
      </RevealGroup>
    </EditorialSection>
  );
}
