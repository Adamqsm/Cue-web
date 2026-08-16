import { describe, expect, it } from "vitest";
import { getCountries, getCountryCallingCode } from "libphonenumber-js";
import enLabels from "react-phone-number-input/locale/en.json";
import arLabels from "react-phone-number-input/locale/ar.json";
import {
  foldForSearch,
  searchCountries,
  type CountryOption,
} from "../country-search";

/** Build the option list the way PhoneField does: real metadata + labels. */
function optionsFor(labels: Record<string, string>, locale: string): CountryOption[] {
  return getCountries()
    .map((code) => ({
      code,
      label: labels[code] ?? code,
      callingCode: getCountryCallingCode(code),
    }))
    .sort((a, b) => a.label.localeCompare(b.label, locale));
}

const en = optionsFor(enLabels, "en");
const ar = optionsFor(arLabels, "ar");

describe("foldForSearch", () => {
  it("folds case, Latin diacritics, Arabic digits and apostrophes", () => {
    expect(foldForSearch("Türkiye")).toBe("turkiye");
    expect(foldForSearch("Côte d'Ivoire")).toBe("cote divoire");
    expect(foldForSearch("٩٦٢")).toBe("962");
  });

  it("folds hamza and teh-marbuta variants so bare-alef typing matches", () => {
    expect(foldForSearch("الإمارات")).toBe(foldForSearch("الامارات"));
    expect(foldForSearch("المتحدة")).toBe(foldForSearch("المتحده"));
  });
});

describe("searchCountries", () => {
  it("returns the full list for an empty query", () => {
    expect(searchCountries(en, "")).toEqual(en);
    expect(searchCountries(en, "   ")).toEqual(en);
  });

  it("filters live from the first letter, best match on top", () => {
    const results = searchCountries(en, "u");
    expect(results.length).toBeGreaterThan(0);
    expect(results.length).toBeLessThan(en.length);
    // Top hit is a name actually starting with the letter, not a mere match.
    expect(foldForSearch(results[0].label).startsWith("u")).toBe(true);
  });

  it("narrows to the intended country as more letters are typed", () => {
    expect(searchCountries(en, "united s")[0].code).toBe("US");
    expect(searchCountries(en, "jord")[0].code).toBe("JO");
    expect(searchCountries(en, "turk")[0].code).toBe("TR");
  });

  it("ranks exact ISO codes and name-starts above name-contains", () => {
    const results = searchCountries(en, "in");
    const codes = results.map((c) => c.code);
    expect(codes[0]).toBe("IN"); // exact ISO code: India
    expect(codes[1]).toBe("ID"); // name-starts: Indonesia
    // Bahrain only *contains* "in", so it must trail the starts-with tier.
    expect(codes).toContain("BH");
    expect(codes.indexOf("BH")).toBeGreaterThan(codes.indexOf("ID"));
  });

  it("matches later words of multi-word names", () => {
    const top = searchCountries(en, "arab")
      .slice(0, 2)
      .map((c) => c.code)
      .sort();
    expect(top).toEqual(["AE", "SA"]); // United Arab Emirates, Saudi Arabia
  });

  it("matches calling codes typed as digits, with or without + / 00", () => {
    expect(searchCountries(en, "962").map((c) => c.code)).toEqual(["JO"]);
    expect(searchCountries(en, "+962").map((c) => c.code)).toEqual(["JO"]);
    expect(searchCountries(en, "00962").map((c) => c.code)).toEqual(["JO"]);

    const plusOne = searchCountries(en, "+1");
    expect(plusOne.map((c) => c.code)).toContain("US");
    expect(plusOne.every((c) => c.callingCode === "1")).toBe(true);

    const region = searchCountries(en, "96").map((c) => c.code);
    expect(region).toContain("JO");
    expect(region).toContain("KW");
    expect(region).toContain("OM");
  });

  it("matches Arabic-Indic digit queries against calling codes", () => {
    expect(searchCountries(ar, "٩٦٢").map((c) => c.code)).toEqual(["JO"]);
  });

  it("searches Arabic names, tolerating bare-alef spelling", () => {
    expect(searchCountries(ar, "الأردن")[0].code).toBe("JO");
    expect(searchCountries(ar, "الامارات")[0].code).toBe("AE");
  });

  it("returns nothing for gibberish", () => {
    expect(searchCountries(en, "zzzzzz")).toEqual([]);
  });
});
