import type { Metadata } from "next";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import LegalDoc from "@/components/sections/LegalDoc";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale = isLocale(params.locale) ? params.locale : "en";
  const dict = getDictionary(locale);
  return {
    title: dict.legal.terms.title,
    description: dict.legal.meta.description,
  };
}

export default function TermsPage({ params }: { params: { locale: string } }) {
  const locale = (isLocale(params.locale) ? params.locale : "en") as Locale;
  const dict = getDictionary(locale);
  return <LegalDoc locale={locale} dict={dict} docKey="terms" />;
}
