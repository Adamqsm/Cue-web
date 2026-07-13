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
          <LocaleLink href="/legal" locale={locale} className="inline-flex min-h-[44px] items-center text-sm">
            <span className="link-underline">
              <span aria-hidden className="inline-block rtl:-scale-x-100">
                ←
              </span>
              {common.backToLegal}
            </span>
          </LocaleLink>
        </Reveal>

        <div className="mt-8 grid gap-12 lg:grid-cols-[0.32fr_0.68fr] lg:gap-16">
          {/* Sidebar */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <nav className="flex flex-col gap-1 rounded-panel border border-line bg-surface p-2">
              {docs.map((d) => {
                const active = d.href === currentHref;
                return (
                  <LocaleLink
                    key={d.href}
                    href={d.href}
                    locale={locale}
                    aria-current={active ? "page" : undefined}
                    className={`rounded-chip px-4 py-2.5 text-sm font-medium transition-colors ${
                      active
                        ? "bg-content text-bg"
                        : "text-muted hover:bg-surface2 hover:text-content"
                    }`}
                  >
                    {d.title}
                  </LocaleLink>
                );
              })}
            </nav>
          </aside>

          {/* Body */}
          <article className="max-w-[70ch]">
            <Reveal>
              <p className="text-sm text-muted">
                {common.lastUpdated}: {common.updatedValue}
              </p>
              <h1 className="mt-2 text-4xl text-content sm:text-5xl">
                {doc.title}
              </h1>
              <p className="mt-6 leading-relaxed text-muted">{doc.intro}</p>
            </Reveal>

            <div className="mt-10 divide-y divide-line border-t border-line">
              {doc.sections.map((section) => (
                <div key={section.h} className="py-7">
                  <h2 className="text-lg text-content">{section.h}</h2>
                  {section.p?.map((para, i) => (
                    <p key={i} className="mt-2 leading-relaxed text-muted">
                      {para}
                    </p>
                  ))}
                  {section.list && (
                    <ul className="mt-3 flex flex-col gap-2">
                      {section.list.map((li, i) => (
                        <li key={i} className="flex gap-3 text-muted">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                          <span className="leading-relaxed">{li}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-12 rounded-card border border-line bg-surface2 p-5 text-sm text-muted">
              {common.governing}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
