import type { Locale } from "@/i18n/config";

// Mirror of cue-app/functions/refData.template.json — the reference data the
// seeded venues point into. Keep ids in sync with the app's Firestore refData.

export type LText = { en: string; ar: string };

export const CUISINES: Record<string, LText> = {
  italian: { en: "Italian", ar: "إيطالي" },
  mediterranean: { en: "Mediterranean", ar: "متوسطي" },
  jordanian: { en: "Jordanian", ar: "أردني" },
  levantine: { en: "Levantine", ar: "شامي" },
  lebanese: { en: "Lebanese", ar: "لبناني" },
  grill: { en: "Grill", ar: "مشاوي" },
  cafe: { en: "Cafe", ar: "كافيه" },
  international: { en: "International", ar: "عالمي" },
};

export const AMENITIES: Record<string, LText> = {
  outdoor: { en: "Outdoor seating", ar: "جلسات خارجية" },
  parking: { en: "Parking", ar: "موقف سيارات" },
  valet: { en: "Valet", ar: "خدمة صف السيارات" },
  shisha: { en: "Shisha", ar: "أرجيلة" },
  family: { en: "Family friendly", ar: "مناسب للعائلات" },
  rooftop: { en: "Rooftop", ar: "سطح" },
};

export function cuisineLabel(id: string, locale: Locale): string {
  return CUISINES[id]?.[locale] ?? id;
}

export function amenityLabel(id: string, locale: Locale): string {
  return AMENITIES[id]?.[locale] ?? id;
}
