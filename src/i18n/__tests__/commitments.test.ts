import { describe, expect, it } from "vitest";
import en from "../content/en";
import ar from "../content/ar";
import { WFP_DONATE_URL } from "@/components/home/SocialImpact";

/**
 * Guardrails for the two LinkedIn commitment sections (career growth and
 * learning, social impact). These pin the copy rules the sections shipped
 * under, so a later edit can't quietly reintroduce what was ruled out:
 * dashes between words, "food bank" phrasing, partner/endorsement language
 * around WFP, a money figure next to the percentage, or a tracked WFP URL.
 */

function strings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value && typeof value === "object")
    return Object.values(value).flatMap(strings);
  return [];
}

const sections = [
  ["en growth", en.home.growth],
  ["en impact", en.home.impact],
  ["ar growth", ar.home.growth],
  ["ar impact", ar.home.impact],
] as const;

describe("commitment sections copy rules", () => {
  it.each(sections)("%s has no dashes between words", (_name, section) => {
    for (const s of strings(section)) {
      expect(s, s).not.toMatch(/[—–]/);
      expect(s, s).not.toMatch(/\s-\s/);
    }
  });

  it("names WFP, never a food bank, in both locales", () => {
    const enText = strings(en.home.impact).join(" ");
    const arText = strings(ar.home.impact).join(" ");
    expect(enText).toContain("United Nations World Food Programme");
    expect(enText).toContain("WFP");
    expect(enText.toLowerCase()).not.toContain("food bank");
    expect(arText).toContain("برنامج الأغذية العالمي");
    expect(arText).not.toContain("بنك طعام");
    expect(arText).not.toContain("بنك الطعام");
  });

  it("frames Cue as a donor, not a partner, with no endorsement language", () => {
    const enText = strings(en.home.impact).join(" ").toLowerCase();
    for (const banned of ["partner", "partnership", "endorse", "official"]) {
      expect(enText, banned).not.toContain(banned);
    }
    const arText = strings(ar.home.impact).join(" ");
    for (const banned of ["شريك", "شراكة", "رسمي"]) {
      expect(arText, banned).not.toContain(banned);
    }
  });

  it("states the percentage only, never a currency amount", () => {
    expect(en.home.impact.stat).toBe("5%");
    expect(ar.home.impact.stat).toBe("٥٪");
    const all = [...strings(en.home.impact), ...strings(ar.home.impact)].join(" ");
    expect(all).not.toMatch(/JOD|JD\b|\$|USD|دينار|دولار/);
  });

  it("links to WFP's own donate page with no tracking parameters", () => {
    expect(WFP_DONATE_URL).toBe("https://donate.wfp.org");
    expect(WFP_DONATE_URL).not.toMatch(/[?#]/);
  });

  it("keeps the three career commitments and their substance", () => {
    for (const dict of [en, ar]) {
      expect(dict.home.growth.items).toHaveLength(3);
      expect(dict.home.growth.items.map((i) => i.icon)).toEqual([
        "course",
        "mentor",
        "build",
      ]);
    }
    const enGrowth = strings(en.home.growth).join(" ");
    expect(enGrowth).toContain("Coursera");
    expect(enGrowth).toContain("mentor");
    expect(enGrowth).toContain("day one");
    const arGrowth = strings(ar.home.growth).join(" ");
    expect(arGrowth).toContain("Coursera");
    expect(arGrowth).toContain("موجّه");
    expect(arGrowth).toContain("اليوم الأول");
  });

  it("is linked from the footer in both locales", () => {
    for (const dict of [en, ar]) {
      const hrefs = dict.footer.columns.flatMap((c) => c.links.map((l) => l.href));
      expect(hrefs).toContain("/#career-growth");
      expect(hrefs).toContain("/#social-impact");
    }
  });
});
