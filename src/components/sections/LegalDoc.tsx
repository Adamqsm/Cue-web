import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import Reveal from "@/components/ui/Reveal";
import LocaleLink from "@/components/ui/LocaleLink";

type LegalSection = { h: string; p?: string[]; list?: string[] };
type DocKey = "terms" | "privacy" | "cookies" | "dpa" | "notice";

export default function LegalDoc({
  locale,
  dict,
  docKey,
}: {
  locale: Locale;
  dict: Dictionary;
  docKey: DocKey;
}) {
  const doc = dict.legal[docKey] as {
    title: string;
    intro: string;
    sections: LegalSection[];
  };
  const common = dict.legal.common;
  const docs = dict.legal.index.docs;
  const currentHref = `/legal/${docKey === "cookies" ? "cookies" : docKey}`;

  return (
    <section className="relative pt-28 sm:pt-36">
      <div className="container-pad pb-24">
        <Reveal>
          <LocaleLink
            href="/legal"
            locale={locale}
            className="text-sm font-semibold text-green dark:text-green-300 hover:underline"
          >
            ← {common.backToLegal}
          </LocaleLink>
        </Reveal>

        <div className="mt-8 grid gap-12 lg:grid-cols-[0.32fr_0.68fr] lg:gap-16">
          {/* Sidebar */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <nav className="flex flex-col gap-1 rounded-3xl border border-line bg-surface2/50 p-3">
              {docs.map((d) => {
                const active = d.href === currentHref;
                return (
                  <LocaleLink
                    key={d.href}
                    href={d.href}
                    locale={locale}
                    className={`rounded-2xl px-4 py-2.5 text-sm font-medium transition-colors ${
                      active
                        ? "bg-content text-bg"
                        : "text-content/70 hover:bg-content/5 hover:text-content"
                    }`}
                  >
                    {d.title}
                  </LocaleLink>
                );
              })}
            </nav>
          </aside>

          {/* Body */}
          <article className="max-w-2xl">
            <Reveal>
              <p className="text-sm text-content/50">
                {common.lastUpdated}: {common.updatedValue}
              </p>
              <h1 className="mt-2 text-4xl font-semibold leading-tight text-content sm:text-5xl">
                {doc.title}
              </h1>
              <p className="mt-6 leading-relaxed text-content/70">{doc.intro}</p>
            </Reveal>

            <div className="mt-10 flex flex-col gap-8">
              {doc.sections.map((section) => (
                <div key={section.h}>
                  <h2 className="text-lg font-semibold text-content">{section.h}</h2>
                  {section.p?.map((para, i) => (
                    <p key={i} className="mt-2 leading-relaxed text-content/70">
                      {para}
                    </p>
                  ))}
                  {section.list && (
                    <ul className="mt-3 flex flex-col gap-2">
                      {section.list.map((li, i) => (
                        <li key={i} className="flex gap-3 text-content/70">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-green" />
                          <span className="leading-relaxed">{li}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-12 rounded-2xl border border-line bg-surface2/50 p-5 text-sm text-content/60">
              {common.governing}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
