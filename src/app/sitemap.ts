import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { SITE_URL } from "@/lib/utils";

const paths = [
  "",
  "/how-it-works",
  "/partner",
  "/about",
  "/reach-out",
  "/careers",
  "/faq",
  "/legal",
  "/legal/terms",
  "/legal/privacy",
  "/legal/cookies",
  "/legal/dpa",
  "/legal/notice",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  for (const locale of locales) {
    for (const p of paths) {
      entries.push({
        url: `${SITE_URL}/${locale}${p}`,
        lastModified: new Date(),
        changeFrequency: p === "" ? "weekly" : "monthly",
        priority: p === "" ? 1 : 0.7,
        alternates: {
          languages: {
            en: `${SITE_URL}/en${p}`,
            ar: `${SITE_URL}/ar${p}`,
          },
        },
      });
    }
  }
  return entries;
}
