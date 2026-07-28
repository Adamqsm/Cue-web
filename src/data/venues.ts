import type { Locale } from "@/i18n/config";
import type { LText } from "./refData";

/**
 * The venue roster — a mirror of cue-app/functions/venues.generic.json,
 * i.e. exactly what is seeded in the production backend today. These are
 * the placeholder founding-roster entries; when real venues sign, replace
 * the rows here (same shape as the Firestore importer templates) and the
 * whole site — guide rail, venue pages, sitemap — follows.
 *
 * Photos are assigned from the curated set in /public/images/photography
 * and always render through the duotone treatment.
 */

export type Venue = {
  id: string;
  name: LText;
  description: LText;
  area: LText;
  city: LText;
  cuisineIds: string[];
  amenityKeys: string[];
  /** 1 (casual) … 4 (high-end) — rendered as the price-band scale */
  priceRange: 1 | 2 | 3 | 4;
  type: "restaurant" | "rooftop" | "lounge" | "cafe";
  tags: string[];
  photo: string;
  featured?: boolean;
  maxPartySize: number;
  cancellationWindowHours: number;
};

export const VENUES: Venue[] = [
  {
    id: "restaurant-a",
    name: { en: "Restaurant A", ar: "مطعم أ" },
    description: {
      en: "A founding-roster seat in Abdoun — international kitchen, terrace seating, valet at the door.",
      ar: "مقعد ضمن قائمة الافتتاح في عبدون — مطبخ عالمي وجلسات على التراس وخدمة صف السيارات.",
    },
    area: { en: "Abdoun", ar: "عبدون" },
    city: { en: "Amman", ar: "عمّان" },
    cuisineIds: ["international"],
    amenityKeys: ["outdoor", "parking"],
    priceRange: 2,
    type: "restaurant",
    tags: ["groups", "outdoor", "valet"],
    photo: "/images/photography/feature-family-table.webp",
    featured: true,
    maxPartySize: 10,
    cancellationWindowHours: 2,
  },
  {
    id: "rooftop-b",
    name: { en: "Rooftop B", ar: "روفتوب ب" },
    description: {
      en: "Mediterranean plates above Jabal Amman — a dusk-to-late rooftop with a dress code and a view.",
      ar: "أطباق متوسطية فوق جبل عمّان — سطح من الغروب حتى وقت متأخر بإطلالة ولباس رسمي.",
    },
    area: { en: "Jabal Amman", ar: "جبل عمّان" },
    city: { en: "Amman", ar: "عمّان" },
    cuisineIds: ["mediterranean"],
    amenityKeys: ["rooftop", "outdoor"],
    priceRange: 3,
    type: "rooftop",
    tags: ["rooftop", "date_night", "late_night"],
    photo: "/images/photography/cta-arriving-dusk.webp",
    featured: true,
    maxPartySize: 12,
    cancellationWindowHours: 3,
  },
  {
    id: "lounge-c",
    name: { en: "Lounge C", ar: "لاونج ج" },
    description: {
      en: "A Lebanese lounge in Abdoun for long nights — shisha on the terrace, tables that hold twenty.",
      ar: "لاونج لبناني في عبدون للسهرات الطويلة — أرجيلة على التراس وطاولات تتسع لعشرين.",
    },
    area: { en: "Abdoun", ar: "عبدون" },
    city: { en: "Amman", ar: "عمّان" },
    cuisineIds: ["lebanese"],
    amenityKeys: ["shisha", "outdoor"],
    priceRange: 3,
    type: "lounge",
    tags: ["shisha", "late_night", "groups"],
    photo: "/images/photography/feature-festive-friends.webp",
    maxPartySize: 20,
    cancellationWindowHours: 2,
  },
  {
    id: "bistro-d",
    name: { en: "Bistro D", ar: "بيسترو د" },
    description: {
      en: "Weibdeh's corner Italian — a small room, a serious kitchen, and brunch on the weekend.",
      ar: "الإيطالي في زاوية اللويبدة — صالة صغيرة ومطبخ جاد وفطور متأخر في نهاية الأسبوع.",
    },
    area: { en: "Weibdeh", ar: "اللويبدة" },
    city: { en: "Amman", ar: "عمّان" },
    cuisineIds: ["italian"],
    amenityKeys: ["family"],
    priceRange: 4,
    type: "restaurant",
    tags: ["date_night", "brunch", "valet"],
    photo: "/images/photography/feature-chef-serving.webp",
    maxPartySize: 8,
    cancellationWindowHours: 4,
  },
  {
    id: "grill-e",
    name: { en: "Grill E", ar: "مشاوي هـ" },
    description: {
      en: "Jordanian grill in Sweifieh built for the big table — family platters, charcoal, parking that works.",
      ar: "مشاوي أردنية في الصويفية للطاولات الكبيرة — أطباق عائلية وفحم وموقف سيارات مريح.",
    },
    area: { en: "Sweifieh", ar: "الصويفية" },
    city: { en: "Amman", ar: "عمّان" },
    cuisineIds: ["jordanian", "grill"],
    amenityKeys: ["family", "parking"],
    priceRange: 2,
    type: "restaurant",
    tags: ["family", "groups", "outdoor"],
    photo: "/images/photography/hero-hotpot-group.webp",
    maxPartySize: 15,
    cancellationWindowHours: 2,
  },
  {
    id: "cafe-f",
    name: { en: "Cafe F", ar: "كافيه و" },
    description: {
      en: "A Shmeisani daytime room — breakfast through brunch, a counter worth sitting at.",
      ar: "صالة نهارية في الشميساني — من الفطور حتى الغداء المتأخر وبار قهوة يستحق الجلوس.",
    },
    area: { en: "Shmeisani", ar: "الشميساني" },
    city: { en: "Amman", ar: "عمّان" },
    cuisineIds: ["cafe"],
    amenityKeys: ["outdoor"],
    priceRange: 1,
    type: "cafe",
    tags: ["breakfast", "brunch", "outdoor"],
    photo: "/images/photography/feature-counter-chat.webp",
    maxPartySize: 6,
    cancellationWindowHours: 1,
  },
];

export function getVenue(id: string): Venue | undefined {
  return VENUES.find((v) => v.id === id);
}

/** Unique neighbourhoods in roster order, with venue counts. */
export function venueAreas(locale: Locale): { key: string; label: string; count: number }[] {
  const seen = new Map<string, { key: string; label: string; count: number }>();
  for (const v of VENUES) {
    const key = v.area.en.toLowerCase().replace(/\s+/g, "-");
    const entry = seen.get(key);
    if (entry) entry.count += 1;
    else seen.set(key, { key, label: v.area[locale], count: 1 });
  }
  return Array.from(seen.values());
}

export function areaAnchor(venue: Venue): string {
  return venue.area.en.toLowerCase().replace(/\s+/g, "-");
}
