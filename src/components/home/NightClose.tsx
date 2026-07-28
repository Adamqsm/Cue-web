import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import RuledSection from "@/components/layout/RuledSection";
import LocaleLink from "@/components/ui/LocaleLink";

/**
 * The closer — the homepage's single field-colour moment. Two doors:
 * early access (bougainvillea — the bookable action) and partnership
 * (paper). Nothing else on the page may use tone="field".
 */
export default function NightClose({
  locale,
  cl,
}: {
  locale: Locale;
  cl: Dictionary["home"]["close"];
}) {
  return (
    <RuledSection head={cl.head} folio={cl.folio} tone="field">
      <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
        <div>
          <h2 className="max-w-2xl text-3xl sm:text-5xl">{cl.title}</h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-field-content/70">
            {cl.body}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 lg:justify-end">
          <LocaleLink href="/reach-out" locale={locale} className="btn btn-book">
            {cl.early}
          </LocaleLink>
          <LocaleLink href="/partner" locale={locale} className="btn btn-paper">
            {cl.partner}
          </LocaleLink>
        </div>
      </div>
    </RuledSection>
  );
}
