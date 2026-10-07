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
 * The portal takes its language from its own cookie, so the href is the
 * same in both locales.
 */

const PORTAL_LOGIN = "https://portal.cue-app.net/login";

const cases = [
  ["en", en, "Restaurant login"],
  ["ar", ar, "دخول المطاعم"],
] as const;

function loginLinks(html: string) {
  return Array.from(html.matchAll(/<a [^>]*>([^<]*)<\/a>/g)).filter(
    (m) => m[0].includes(`href="${PORTAL_LOGIN}"`)
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
        expect(link[1]).toBe(label);
        expect(link[0]).toContain("btn-outline");
        expect(link[0]).not.toContain("target=");
      }
    });
  }
});

describe("portal login URL", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("defaults to portal.cue-app.net", async () => {
    vi.stubEnv("NEXT_PUBLIC_PORTAL_URL", "");
    vi.resetModules();
    const { PORTAL_LOGIN_URL } = await import("@/lib/utils");
    expect(PORTAL_LOGIN_URL).toBe(PORTAL_LOGIN);
  });

  it("follows NEXT_PUBLIC_PORTAL_URL, trailing slash or not", async () => {
    vi.stubEnv("NEXT_PUBLIC_PORTAL_URL", "https://portal.staging.example/");
    vi.resetModules();
    const { PORTAL_LOGIN_URL } = await import("@/lib/utils");
    expect(PORTAL_LOGIN_URL).toBe("https://portal.staging.example/login");
  });
});
