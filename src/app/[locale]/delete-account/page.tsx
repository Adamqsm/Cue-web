import type { Metadata } from "next";
import type { ReactNode } from "react";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import PageHero from "@/components/sections/PageHero";
import Reveal from "@/components/ui/Reveal";
import LocaleLink from "@/components/ui/LocaleLink";

// The public account-deletion page Google Play's Data safety form links to
// (/en/delete-account, /ar/delete-account). Static: nothing here submits.

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale = isLocale(params.locale) ? params.locale : "en";
  const d = getDictionary(locale).deleteAccount;
  return buildMetadata({
    locale,
    path: "/delete-account",
    title: d.meta.title,
    description: d.meta.description,
  });
}

/**
 * Dictionary text whose "{email}" slot becomes the address as a mailto link
 * (dir="ltr" keeps a trailing full stop in place in Arabic).
 */
function rich(text: string, email: string): ReactNode[] {
  return text.split("{email}").flatMap((chunk, i) => [
    ...(i > 0
      ? [
          <a
            key={`e${i}`}
            href={`mailto:${email}`}
            dir="ltr"
            className="whitespace-nowrap font-semibold text-content underline underline-offset-2 transition-colors hover:text-accent-deep"
          >
            {email}
          </a>,
        ]
      : []),
    chunk,
  ]);
}

function Bullets({ items, r }: { items: string[]; r: (t: string) => ReactNode[] }) {
  return (
    <ul className="mt-4 flex flex-col gap-2.5">
      {items.map((li) => (
        <li key={li} className="flex gap-3 text-muted">
          <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
          <span className="leading-relaxed">{r(li)}</span>
        </li>
      ))}
    </ul>
  );
}

export default function DeleteAccountPage({ params }: { params: { locale: string } }) {
  const locale = (isLocale(params.locale) ? params.locale : "en") as Locale;
  const dict = getDictionary(locale);
  const d = dict.deleteAccount;
  const r = (t: string) => rich(t, d.email);
  const mailto = `mailto:${d.email}?subject=${encodeURIComponent(d.byEmail.subject)}`;

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: "Cue", path: "" },
          { name: d.hero.eyebrow, path: "/delete-account" },
        ])}
      />
      <PageHero eyebrow={d.hero.eyebrow} title={d.hero.title} subtitle={d.hero.subtitle} />

      <section className="container-pad pb-24 pt-8">
        <div className="max-w-[70ch]">
          <p className="text-sm text-muted">
            {dict.legal.common.lastUpdated}: {d.updatedValue}
          </p>

          <div className="mt-6 divide-y divide-line border-t border-line">
            <Reveal className="py-8">
              <h2 className="text-2xl text-content">{d.app.h}</h2>
              <ol className="mt-5 flex flex-col gap-3">
                {d.app.steps.map((step, i) => (
                  <li key={step} className="flex items-start gap-3 text-content">
                    <span
                      aria-hidden
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-wash text-sm font-semibold text-accent-deep"
                    >
                      {i + 1}
                    </span>
                    <span className="pt-0.5 leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
              {d.app.notes.map((p) => (
                <p key={p} className="mt-4 leading-relaxed text-muted">
                  {r(p)}
                </p>
              ))}
            </Reveal>

            <Reveal className="py-8">
              <h2 className="text-2xl text-content">{d.byEmail.h}</h2>
              <p className="mt-3 leading-relaxed text-muted">{r(d.byEmail.body)}</p>
              <p className="mt-4 font-medium text-content">{d.byEmail.includeLabel}</p>
              <Bullets items={d.byEmail.include} r={r} />
              <p className="mt-4 leading-relaxed text-muted">{d.byEmail.verify}</p>
              <LocaleLink href={mailto} locale={locale} className="btn btn-primary mt-6 text-base">
                {d.byEmail.button}
              </LocaleLink>
            </Reveal>

            <Reveal className="py-8">
              <h2 className="text-2xl text-content">{d.deleted.h}</h2>
              <Bullets items={d.deleted.list} r={r} />
            </Reveal>

            <Reveal className="py-8">
              <h2 className="text-2xl text-content">{d.kept.h}</h2>
              <p className="mt-3 leading-relaxed text-muted">{d.kept.intro}</p>
              <Bullets items={d.kept.list} r={r} />
              <p className="mt-5 leading-relaxed text-muted">{r(d.kept.erase)}</p>
            </Reveal>

            <Reveal className="py-8">
              <h2 className="text-2xl text-content">{d.timing.h}</h2>
              <Bullets items={d.timing.list} r={r} />
            </Reveal>
          </div>

          <p className="mt-10 rounded-card border border-line bg-surface2 p-5 text-sm text-muted">
            {d.privacyNote}{" "}
            <LocaleLink
              href="/legal/privacy"
              locale={locale}
              className="font-semibold text-content underline underline-offset-2 hover:text-accent-deep"
            >
              {d.privacyLink}
            </LocaleLink>
            .
          </p>
        </div>
      </section>
    </>
  );
}
