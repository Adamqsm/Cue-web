import { describe, expect, it } from "vitest";
import nextConfig from "../../../next.config.mjs";

async function connectSrc(): Promise<string[]> {
  const [{ headers }] = await nextConfig.headers!();
  const csp = headers.find((h) => h.key === "Content-Security-Policy")!.value;
  const directive = csp.split(";").map((d) => d.trim()).find((d) => d.startsWith("connect-src "))!;
  return directive.split(/\s+/).slice(1);
}

// The partner form uploads straight from the browser to the API on the Django
// backend; without these origins the browser refuses the request before it
// leaves the page (live www.cue-app.net, 2026-09-24: connect-src violation).
describe("CSP connect-src", () => {
  it("allows both Cue API origins", async () => {
    expect(await connectSrc()).toEqual(
      expect.arrayContaining(["https://api.cue-app.net", "https://api-staging.cue-app.net"])
    );
  });

  it("allows no Firebase or Google API host now that nothing on the site talks to Firebase", async () => {
    for (const source of await connectSrc()) {
      expect(source).not.toMatch(/googleapis\.com|firebaseio\.com|firebasestorage|firebaseapp\.com/);
    }
  });

  it("stays an explicit allow-list: no bare scheme and no wildcard host", async () => {
    for (const source of await connectSrc()) {
      // http:, https:, wss:, data:, blob: ... would allow any host of that scheme.
      expect(source).not.toMatch(/^[a-z][a-z0-9+.-]*:$/i);
      // *, https://*, wss://*:443 ... (a *.sub.domain wildcard is fine).
      expect(source).not.toMatch(/^([a-z][a-z0-9+.-]*:\/\/)?\*(:[^/]*)?(\/.*)?$/i);
    }
  });
});
