import type { Metadata } from "next";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import PageHero from "@/components/sections/PageHero";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import EditorialList from "@/components/ui/EditorialList";
import ClaimForm from "@/components/claim/ClaimForm";
import ClaimPageView from "@/components/claim/ClaimPageView";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale = isLocale(params.locale) ? params.locale : "en";
  const dict = getDictionary(locale);
  return buildMetadata({
    locale,
    path: "/claim",
    title: dict.claim.meta.title,
    description: dict.claim.meta.description,
  });
}

export default function ClaimPage({ params }: { params: { locale: string } }) {
  const locale = (isLocale(params.locale) ? params.locale : "en") as Locale;
  const dict = getDictionary(locale);
  const c = dict.claim;

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd(locale, [{ name: c.hero.eyebrow, path: "/claim" }])}
      />
      <ClaimPageView locale={locale} />
      <PageHero eyebrow={c.hero.eyebrow} title={c.hero.title} subtitle={c.hero.subtitle} />

      <section className="container-pad py-16 sm:py-20">
        <div className="gap-12 lg:grid lg:grid-cols-[1fr_minmax(24rem,28rem)]">
          <div>
            {/* Offer */}
            <SectionHeading kicker={c.offer.kicker} title={c.offer.title} />
            <EditorialList items={c.offer.points} numbers={false} className="mt-8" />
            <Reveal>
              <p className="mt-6 rounded-card bg-spark-wash p-4 text-sm leading-relaxed text-spark-deep">
                {c.offer.timing}
              </p>
            </Reveal>

            {/* Steps — a real sequence, so numbered */}
            <div className="mt-16 sm:mt-20">
              <SectionHeading kicker={c.steps.kicker} title={c.steps.title} />
              <EditorialList items={c.steps.items} className="mt-8" />
            </div>
          </div>

          {/* Claim card */}
          <div className="mt-12 lg:mt-0">
            <Reveal className="lg:sticky lg:top-24">
              <div className="rounded-panel border border-line bg-surface p-6 shadow-card md:p-8">
                <h2 className="text-2xl font-[650] tracking-[-0.025em] text-content">
                  {c.form.title}
                </h2>
                <div className="mt-6">
                  <ClaimForm
                    strings={{ form: c.form, success: c.success, duplicate: c.duplicate }}
                    locale={locale}
                    source="claim-page"
                    variant="page"
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Small print */}
        <Reveal className="mt-16 max-w-3xl border-t border-line pt-8 sm:mt-20">
          <h2 className="label">{c.terms.title}</h2>
          <ul className="mt-4 list-disc space-y-2 ps-5 text-sm leading-relaxed text-muted marker:text-line-strong">
            {c.terms.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Reveal>
      </section>
    </>
  );
}
