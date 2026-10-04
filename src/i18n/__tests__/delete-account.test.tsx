import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import en from "../content/en";
import ar from "../content/ar";
import DeleteAccountPage from "@/app/[locale]/delete-account/page";
import sitemap from "@/app/sitemap";
import { isUngatedPath } from "@/components/ConsentBanner";

/**
 * Google Play needs a public deletion page that names a way to ask without
 * the app. These pin that page: both locales link the deletion inbox, every
 * period is confirmed (no placeholder badge is left), and the footer and
 * sitemap point at it.
 */

const locales = [
  ["en", en],
  ["ar", ar],
] as const;

describe("/delete-account", () => {
  for (const [locale, dict] of locales) {
    const html = renderToStaticMarkup(DeleteAccountPage({ params: { locale } }));

    it(`${locale}: offers info@cue-app.net, with a subject on the button`, () => {
      expect(dict.deleteAccount.email).toBe("info@cue-app.net");
      const subject = encodeURIComponent(dict.deleteAccount.byEmail.subject);
      expect(html).toContain(`href="mailto:info@cue-app.net?subject=${subject}"`);
      expect(html).toContain('href="mailto:info@cue-app.net"');
    });

    it(`${locale}: shows no placeholder badge and no unfilled slot`, () => {
      expect(html).not.toContain("tag-placeholder");
      expect(html).not.toMatch(/\[\[|\]\]|\{email\}/);
    });

    it(`${locale}: is linked from the footer`, () => {
      const links = dict.footer.columns.flatMap((c) => c.links.map((l) => l.href));
      expect(links).toContain("/delete-account");
    });
  }

  it("is readable without accepting the consent banner", () => {
    expect(isUngatedPath("/en/delete-account")).toBe(true);
    expect(isUngatedPath("/ar/delete-account")).toBe(true);
    expect(isUngatedPath("/en/legal/privacy")).toBe(true);
    expect(isUngatedPath("/en/delete-account-now")).toBe(false);
    expect(isUngatedPath("/en/claim")).toBe(false);
  });

  it("is in the sitemap in both languages", () => {
    const urls = sitemap().map((e) => e.url);
    expect(urls).toContain("https://www.cue-app.net/en/delete-account");
    expect(urls).toContain("https://www.cue-app.net/ar/delete-account");
  });
});
