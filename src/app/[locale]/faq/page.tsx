import type { Metadata } from "next";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { buildMetadata, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import PageHero from "@/components/sections/PageHero";
import Reveal from "@/components/ui/Reveal";
import FaqAccordion from "@/components/sections/FaqAccordion";
import ContactForm from "@/components/sections/ContactForm";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale = isLocale(params.locale) ? params.locale : "en";
  const dict = getDictionary(locale);
  return buildMetadata({
    locale,
    path: "/faq",
    title: dict.faq.meta.title,
    description: dict.faq.meta.description,
  });
}

export default function FaqPage({ params }: { params: { locale: string } }) {
  const locale = (isLocale(params.locale) ? params.locale : "en") as Locale;
  const dict = getDictionary(locale);
  const f = dict.faq;

  return (
    <>
      <JsonLd data={faqJsonLd(f.items)} />
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: "Cue", path: "" },
          { name: f.hero.eyebrow, path: "/faq" },
        ])}
      />
      <PageHero eyebrow={f.hero.eyebrow} title={f.hero.title} subtitle={f.hero.subtitle} />

      <section className="container-pad py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <FaqAccordion items={f.items} />
          </Reveal>
        </div>
      </section>

      {/* Contact */}
      <section className="container-pad pb-24">
        <div className="mx-auto grid max-w-4xl gap-10 rounded-panel border border-line bg-surface2 p-8 sm:p-12 md:grid-cols-[0.9fr_1.1fr]">
          <div>
            <span className="eyebrow">{f.contact.kicker}</span>
            <h2 className="mt-3 text-3xl text-content sm:text-4xl">
              {f.contact.title}
            </h2>
            <p className="mt-3 text-muted">{f.contact.body}</p>
          </div>
          <ContactForm content={f.contact} />
        </div>
      </section>
    </>
  );
}
