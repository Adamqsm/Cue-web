import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import en from "../content/en";
import ar from "../content/ar";
import FaqPage from "@/app/[locale]/faq/page";

/** The help centre names info@cue-app.net as the support address, in both languages. */

const locales = [
  ["en", en],
  ["ar", ar],
] as const;

describe("/faq support contact", () => {
  for (const [locale, dict] of locales) {
    const html = renderToStaticMarkup(FaqPage({ params: { locale } }));

    it(`${locale}: links info@cue-app.net`, () => {
      expect(dict.faq.contact.email).toBe("info@cue-app.net");
      expect(html).toContain('href="mailto:info@cue-app.net"');
      expect(html).not.toContain("{email}");
    });
  }
});
