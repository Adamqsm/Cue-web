import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import en from "../content/en";
import ar from "../content/ar";
import Footer from "@/components/Footer";

/**
 * The footer's parent-company line is permanent in both locales and links
 * to qasem-portal.com in the same tab. "Qasem Portal" stays in Latin script
 * in Arabic because it is the brand name.
 */

const cases = [
  ["en", en, "A Qasem Portal company"],
  ["ar", ar, "إحدى شركات Qasem Portal"],
] as const;

describe("footer parent-company line", () => {
  for (const [locale, dict, text] of cases) {
    const html = renderToStaticMarkup(Footer({ locale, dict }));

    it(`${locale}: reads "${text}"`, () => {
      expect(dict.footer.ownedBy).toBe(text);
    });

    it(`${locale}: links to qasem-portal.com in the same tab`, () => {
      const link = html.match(/<a [^>]*href="https:\/\/qasem-portal\.com"[^>]*>([^<]*)<\/a>/);
      expect(link).not.toBeNull();
      expect(link![0]).toContain('rel="noopener"');
      expect(link![0]).not.toContain("target=");
      expect(link![1]).toBe(text);
    });
  }
});
