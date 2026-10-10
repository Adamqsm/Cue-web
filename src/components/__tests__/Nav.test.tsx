import { afterEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import en from "@/i18n/content/en";
import ar from "@/i18n/content/ar";
import Nav from "@/components/Nav";

vi.mock("next/navigation", () => ({
  usePathname: () => "/en",
  useRouter: () => ({ push: () => {} }),
}));

/**
 * The header's "Restaurant login" link sends restaurants to the Cue portal
 * sign-in, in the same tab, from both the desktop bar and the mobile menu.
 * `?lang=` carries the site locale so the portal opens in the same language.
 */

const cases = [
  ["en", en, "Restaurant login"],
  ["ar", ar, "دخول المطاعم"],
] as const;

function loginLinks(html: string) {
  return Array.from(html.matchAll(/<a [^>]*>([^<]*)<\/a>/g)).filter((m) =>
    m[0].includes('href="https://portal.cue-app.net/login')
  );
}

describe("header restaurant login", () => {
  for (const [locale, dict, label] of cases) {
    const html = renderToStaticMarkup(<Nav locale={locale} dict={dict} />);

    it(`${locale}: reads "${label}"`, () => {
      expect(dict.nav.restaurantLogin).toBe(label);
    });

    it(`${locale}: renders in the desktop bar and the mobile menu`, () => {
      const links = loginLinks(html);
      expect(links).toHaveLength(2);
      for (const link of links) {
        expect(link[0]).toContain(
          `href="https://portal.cue-app.net/login?lang=${locale}"`
        );
        expect(link[1]).toBe(label);
        expect(link[0]).toContain("btn-outline");
        expect(link[0]).not.toContain("target=");
      }
    });
  }
});

describe("portal login href", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("defaults to portal.cue-app.net", async () => {
    vi.stubEnv("NEXT_PUBLIC_PORTAL_URL", "");
    vi.resetModules();
    const { portalLoginHref } = await import("@/lib/utils");
    expect(portalLoginHref("en")).toBe("https://portal.cue-app.net/login?lang=en");
    expect(portalLoginHref("ar")).toBe("https://portal.cue-app.net/login?lang=ar");
  });

  it("follows NEXT_PUBLIC_PORTAL_URL, trailing slash or not", async () => {
    vi.stubEnv("NEXT_PUBLIC_PORTAL_URL", "https://portal.staging.example/");
    vi.resetModules();
    const { portalLoginHref } = await import("@/lib/utils");
    expect(portalLoginHref("ar")).toBe("https://portal.staging.example/login?lang=ar");
  });
});
