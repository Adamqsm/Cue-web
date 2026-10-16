import type { Metadata } from "next";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { buildMetadata, truncateForMeta } from "@/lib/seo";
import LegalDoc from "@/components/sections/LegalDoc";

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const locale = isLocale(params.locale) ? params.locale : "en";
  const dict = getDictionary(locale);
  return buildMetadata({
    locale,
    path: "/legal/dpa",
    title: `${dict.legal.dpa.title} | Cue`,
    description: truncateForMeta(dict.legal.dpa.intro),
  });
}

export default async function DpaPage(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params;
  const locale = (isLocale(params.locale) ? params.locale : "en") as Locale;
  const dict = getDictionary(locale);
  return <LegalDoc locale={locale} dict={dict} docKey="dpa" />;
}
