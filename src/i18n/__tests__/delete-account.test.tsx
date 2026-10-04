import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import en from "../content/en";
import ar from "../content/ar";
import DeleteAccountPage from "@/app/[locale]/delete-account/page";
import sitemap from "@/app/sitemap";

/**
 * Google Play needs a public deletion page that names a way to ask without
 * the app. These pin that page: both locales link the deletion inbox, every
 * unconfirmed "[[...]]" period renders with its badge (and Arabic marks the
 * same number as English), and the footer and sitemap point at it.
 */

const locales = [
  ["en", en],
  ["ar", ar],
] as const;

const badges = (html: string) => html.match(/class="tag-placeholder/g)?.length ?? 0;
const markers = (d: typeof en.deleteAccount) =>
  JSON.stringify(d).match(/\[\[/g)?.length ?? 0;

describe("/delete-account", () => {
  for (const [locale, dict] of locales) {
    const html = renderToStaticMarkup(DeleteAccountPage({ params: { locale } }));

    it(`${locale}: offers info@cue-app.net, with a subject on the button`, () => {
      expect(dict.deleteAccount.email).toBe("info@cue-app.net");
      const subject = encodeURIComponent(dict.deleteAccount.byEmail.subject);
      expect(html).toContain(`href="mailto:info@cue-app.net?subject=${subject}"`);
      expect(html).toContain('href="mailto:info@cue-app.net"');
    });

    it(`${locale}: renders every unconfirmed period with a badge`, () => {
      expect(badges(html)).toBe(markers(dict.deleteAccount));
      expect(html).not.toMatch(/\[\[|\]\]|\{email\}/);
    });

    it(`${locale}: is linked from the footer`, () => {
      const links = dict.footer.columns.flatMap((c) => c.links.map((l) => l.href));
      expect(links).toContain("/delete-account");
    });
  }

  it("marks the same number of unconfirmed periods in both languages", () => {
    expect(markers(en.deleteAccount)).toBeGreaterThan(0);
    expect(markers(ar.deleteAccount)).toBe(markers(en.deleteAccount));
  });

  it("is in the sitemap in both languages", () => {
    const urls = sitemap().map((e) => e.url);
    expect(urls).toContain("https://www.cue-app.net/en/delete-account");
    expect(urls).toContain("https://www.cue-app.net/ar/delete-account");
  });
});
