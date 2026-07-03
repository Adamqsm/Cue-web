import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { SITE_URL } from "@/lib/utils";

// path -> [priority, changeFrequency]
const routes: Record<string, [number, MetadataRoute.Sitemap[number]["changeFrequency"]]> = {
  "": [1.0, "weekly"],
  "/how-it-works": [0.8, "monthly"],
  "/partner": [0.8, "monthly"],
  "/faq": [0.8, "monthly"],
  "/reach-out": [0.7, "monthly"],
  "/about": [0.6, "monthly"],
  "/careers": [0.6, "weekly"],
  "/legal": [0.3, "yearly"],
  "/legal/terms": [0.3, "yearly"],
  "/legal/privacy": [0.3, "yearly"],
  "/legal/cookies": [0.3, "yearly"],
  "/legal/dpa": [0.3, "yearly"],
  "/legal/notice": [0.3, "yearly"],
};

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];
  for (const locale of locales) {
    for (const [path, [priority, changeFrequency]] of Object.entries(routes)) {
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        lastModified: now,
        changeFrequency,
        priority,
        alternates: {
          languages: {
            en: `${SITE_URL}/en${path}`,
            ar: `${SITE_URL}/ar${path}`,
            "x-default": `${SITE_URL}/en${path}`,
          },
        },
      });
    }
  }
  return entries;
}
