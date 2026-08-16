/**
 * Search + ranking for the claim form's phone country selector.
 *
 * Pure on purpose: the dropdown feeds every keystroke through
 * searchCountries and highlights result[0], so the whole
 * search-as-you-type behavior is unit-testable without a DOM.
 */

import { toAsciiDigits } from "../cue-insider/normalize";

export type CountryOption = {
  /** ISO 3166-1 alpha-2 country code, e.g. "JO". */
  code: string;
  /** Display name in the visitor's locale. */
  label: string;
  /** Country calling code without the "+", e.g. "962". */
  callingCode: string;
};

/**
 * Fold a label or query for matching: case, Latin diacritics (Türkiye →
 * turkiye), the hamza/teh-marbuta variants Arabic typists elide (typing
 * الامارات must find
 * الإمارات), Arabic-Indic digits,
 * and apostrophes (divoire finds Côte d'Ivoire).
 */
export function foldForSearch(value: string): string {
  // NFD first: é splits into e + mark, and أ/إ/آ/ؤ/ئ split into the bare
  // letter + a combining hamza/madda — so stripping the combining ranges
  // below erases diacritics and hamza variants in one move.
  return toAsciiDigits(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // Latin combining marks
    .replace(/[ٓ-ٕ]/g, "") // combining madda + hamza above/below
    .replace(/ٱ/g, "ا") // alef wasla -> alef (doesn't decompose)
    .replace(/ى/g, "ي") // alef maqsura -> yeh
    .replace(/ة/g, "ه") // teh marbuta -> heh
    .replace(/[ً-ْٰـ]/g, "") // harakat + tatweel
    .replace(/['’ʼ`]/g, ""); // apostrophe variants
}

/**
 * Filter + rank countries for a search query.
 *
 * Digit-ish queries ("962", "+962", "00962", "٩٦٢") match
 * calling codes. Name queries rank: exact ISO code ("us", "jo") → name
 * starts with the query → a later word does ("arab" → United Arab Emirates)
 * → name contains it. Ties keep the incoming (alphabetical) order, so after
 * a first letter the top hit is the alphabetically first name — what a
 * native select's type-ahead would land on — and each further letter
 * narrows live.
 */
export function searchCountries<T extends CountryOption>(
  countries: readonly T[],
  rawQuery: string
): T[] {
  const query = foldForSearch(rawQuery).trim();
  if (!query) return [...countries];

  const dialDigits = query.replace(/^(\+|00)/, "").replace(/[\s-]/g, "");
  if (dialDigits.length > 0 && /^\d+$/.test(dialDigits)) {
    return countries.filter((c) => c.callingCode.startsWith(dialDigits));
  }

  const isoExact: T[] = [];
  const nameStarts: T[] = [];
  const wordStarts: T[] = [];
  const nameIncludes: T[] = [];

  for (const country of countries) {
    const label = foldForSearch(country.label);
    if (query.length === 2 && country.code.toLowerCase() === query) {
      isoExact.push(country);
    } else if (label.startsWith(query)) {
      nameStarts.push(country);
    } else if (
      label.split(/[\s-]+/).some((word, i) => i > 0 && word.startsWith(query))
    ) {
      wordStarts.push(country);
    } else if (label.includes(query)) {
      nameIncludes.push(country);
    }
  }

  return [...isoExact, ...nameStarts, ...wordStarts, ...nameIncludes];
}
