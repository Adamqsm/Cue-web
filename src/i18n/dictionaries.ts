import type { Locale } from "./config";
import en from "./content/en";
import ar from "./content/ar";
import type { Dictionary } from "./content/en";

const dictionaries: Record<Locale, Dictionary> = { en, ar };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export type { Dictionary };
