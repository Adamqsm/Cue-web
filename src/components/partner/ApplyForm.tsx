"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { cn, localizedHref } from "@/lib/utils";
import { firebaseApp } from "@/lib/firebase";
import { newApplicationId } from "@/lib/partner-application";
import { EMAIL_RE } from "@/lib/validation";
import { getUtmParams } from "@/lib/utm";
import LocaleLink from "@/components/ui/LocaleLink";

type Status = "idle" | "submitting" | "success" | "error";

// Canonical values stored on the application; labels are localized by index
// from home.neighborhoods.areas so the dropdown matches the site list exactly.
const NEIGHBORHOODS = [
  "Abdoun",
  "Sweifieh",
  "Rainbow Street",
  "Seventh Circle",
  "Jabal Amman",
  "Shmeisani",
  "Al Weibdeh",
  "Dabouq",
] as const;

// Importer day keys (seed.cjs WEEKDAYS), displayed Sunday-first per the local week.
const DAYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const;
type DayKey = (typeof DAYS)[number];
type DayHours = { open: string; close: string; closed: boolean };

const MENU_MAX_BYTES = 10 * 1024 * 1024;
const PHOTO_MAX_BYTES = 8 * 1024 * 1024;
const PHOTO_MAX_COUNT = 6;

const defaultHours = (): Record<DayKey, DayHours> =>
  Object.fromEntries(
    DAYS.map((d) => [d, { open: "12:00", close: "23:00", closed: false }])
  ) as Record<DayKey, DayHours>;

export default function ApplyForm({
  form,
  areas,
  locale,
}: {
  form: Dictionary["partnerApply"]["form"];
  areas: string[];
  locale: Locale;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorKey, setErrorKey] = useState<keyof Dictionary["partnerApply"]["form"]["errors"]>("submit");
  const [neighborhood, setNeighborhood] = useState("");
  const [cuisines, setCuisines] = useState<string[]>([]);
  const [hours, setHours] = useState<Record<DayKey, DayHours>>(defaultHours);
  const [prepayment, setPrepayment] = useState(false);
  const [menuFile, setMenuFile] = useState<File | null>(null);
  const [photos, setPhotos] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  // Focused when the success panel replaces the form, so SR users hear it —
  // same pattern as ClaimForm's outcome heading.
  const successHeadingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (status === "success") successHeadingRef.current?.focus();
  }, [status]);

  const fieldBase =
    "w-full rounded-chip border border-line-strong bg-surface px-4 py-3 text-content placeholder:text-muted transition-colors focus:border-accent";
  const labelBase = "mb-1.5 block text-sm font-medium text-content";
  const sectionLabel = "eyebrow mt-2";
  // Step numeral for section wayfinding — mirrors the homepage margin spine,
  // scaled down for a form. Confirm orange (spark-deep, AA), decorative.
  const stepNum = "display text-sm font-semibold tabular-nums text-spark-deep";

  function fail(key: typeof errorKey) {
    setErrorKey(key);
    setStatus("error");
  }

  function setDay(day: DayKey, patch: Partial<DayHours>) {
    setHours((h) => ({ ...h, [day]: { ...h[day], ...patch } }));
  }

  function toggleCuisine(id: string) {
    setCuisines((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]));
  }

  function onMenuChange(file: File | null) {
    setFileError(null);
    if (!file) return setMenuFile(null);
    if (file.type !== "application/pdf") return setFileError(form.errors.menuType);
    if (file.size > MENU_MAX_BYTES) return setFileError(form.errors.menuSize);
    setMenuFile(file);
  }

  function onPhotosChange(list: FileList | null) {
    setFileError(null);
    const files = Array.from(list ?? []);
    if (files.length > PHOTO_MAX_COUNT) return setFileError(form.errors.photoCount);
    for (const f of files) {
      if (!f.type.startsWith("image/")) return setFileError(form.errors.photoType);
      if (f.size > PHOTO_MAX_BYTES) return setFileError(form.errors.photoSize);
    }
    setPhotos(files);
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const get = (k: string) => String(data.get(k) || "").trim();

    const venueName = get("venueName");
    const contactName = get("contactName");
    const phone = get("phone");
    const email = get("email");
    const menuUrl = get("menuLink");

    if (!EMAIL_RE.test(email)) return fail("email");
    if (!menuFile && !menuUrl) return fail("menu");
    if (neighborhood === "Other" && !get("neighborhoodOther")) return fail("required");
    if (cuisines.length === 0) return fail("required");

    setStatus("submitting");

    const areaEn = neighborhood === "Other" ? get("neighborhoodOther") : neighborhood;
    const priceRange = get("avgPrice") ? Number(get("avgPrice")) : null;

    // Field names follow the venue importer (functions/seed.cjs +
    // venues.template.json) verbatim where a matching field exists — name/area
    // as localized maps, phone/whatsapp/instagram, cuisineIds, priceRange,
    // openingHours {mon..sun:{open,close,closed}} — so an approved application
    // can feed the importer without remapping.
    // `status` and `source` are set by /api/partner-apply, not here — a form
    // submission does not get to declare its own provenance or approval state.
    const application = {
      locale,
      name: { en: venueName },
      area: { en: areaEn },
      areaIsOther: neighborhood === "Other",
      city: "Amman",
      phone,
      whatsapp: get("whatsappBusiness") || null,
      instagram: get("instagram").replace(/^@/, "") || null,
      cuisineIds: cuisines,
      priceRange,
      openingHours: Object.fromEntries(
        DAYS.map((d) => [
          d,
          hours[d].closed
            ? { closed: true }
            : { open: hours[d].open, close: hours[d].close, closed: false },
        ])
      ),
      // Application-only fields:
      contactName,
      contactRole: get("role") || null,
      email,
      streetAddress: get("street") || null,
      menuUrl: menuUrl || null,
      interestedInPrepayment: prepayment,
      planInterest: get("plan") || null,
      notes: get("notes") || null,
      consent: true,
    };

    // Minted here rather than by doc(collection(db, ...)): the Firestore
    // document is written by /api/partner-apply with the Admin SDK, because
    // `partnerApplications` has no client-write rule and never should. Shape
    // still matches what storage.rules accepts — see @/lib/partner-application.
    const applicationId = newApplicationId();

    try {
      const app = firebaseApp();

      // Uploads stay client-side: Storage rules already allow exactly these
      // two path shapes under partner-applications/{applicationId}/, and the
      // doc stores their storage PATHS (the convention seed.cjs establishes).
      let menuPath: string | null = null;
      const photoPaths: string[] = [];
      if (app && (menuFile || photos.length)) {
        const { getStorage, ref, uploadBytes } = await import("firebase/storage");
        const storage = getStorage(app);

        if (menuFile) {
          menuPath = `partner-applications/${applicationId}/menu.pdf`;
          await uploadBytes(ref(storage, menuPath), menuFile, {
            contentType: "application/pdf",
          });
        }
        for (let i = 0; i < photos.length; i++) {
          const ext = (photos[i].name.split(".").pop() || "jpg").toLowerCase();
          const path = `partner-applications/${applicationId}/photos/photo-${i + 1}.${ext}`;
          await uploadBytes(ref(storage, path), photos[i], { contentType: photos[i].type });
          photoPaths.push(path);
        }
      }

      // One call: the route persists the application (Admin SDK) and forwards
      // to the lead webhook, and reports ok if either destination took it.
      const res = await fetch("/api/partner-apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...application,
          applicationId,
          menuPath,
          photoPaths,
          utm: getUtmParams(),
        }),
      });
      // The IP budget is shared with everyone behind the same address, so a
      // rate-limited applicant is not a broken form — say so instead of
      // inviting an immediate retry.
      if (res.status === 429) return fail("rateLimited");
      if (!res.ok) throw new Error(`partner-apply failed: ${res.status}`);

      setStatus("success");
    } catch (err) {
      console.error("[partner-apply] submit failed:", err);
      fail("submit");
    }
  }

  if (status === "success") {
    return (
      <div className="flex min-h-[26rem] flex-col items-center justify-center rounded-panel border border-line bg-surface2 p-8 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-ok text-white">
          <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="m5 13 4 4L19 7" />
          </svg>
        </span>
        <h3
          ref={successHeadingRef}
          tabIndex={-1}
          className="mt-6 text-3xl font-semibold tracking-[-0.015em] text-content outline-none"
        >
          {form.success.title}
        </h3>
        <p className="mt-3 max-w-md leading-[1.65] text-muted">{form.success.body}</p>
        <LocaleLink href="/" locale={locale} className="mt-6 inline-flex min-h-[44px] items-center">
          <span className="link-underline">{form.success.home}</span>
        </LocaleLink>
      </div>
    );
  }

  return (
    <div className="rounded-panel border border-line bg-surface2 p-6 sm:p-8">
      <AnimatePresence mode="wait">
        <motion.form
          key="form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25 }}
          onSubmit={onSubmit}
          className="relative flex flex-col gap-5"
        >
          <div>
            <h2 className="text-2xl font-[650] tracking-[-0.025em] text-content">{form.heading}</h2>
            <p className="mt-1 text-sm text-muted">{form.subheading}</p>
          </div>

          {/* ---- Venue ---- */}
          <span className={sectionLabel}>
            <span className={stepNum} aria-hidden>01</span>
            {form.sections.venue}
          </span>
          <div>
            <label htmlFor="venueName" className={labelBase}>
              {form.fields.venueName} *
            </label>
            <input id="venueName" name="venueName" required placeholder={form.placeholders.venueName} className={fieldBase} />
          </div>

          {/* ---- Contact ---- */}
          <span className={sectionLabel}>
            <span className={stepNum} aria-hidden>02</span>
            {form.sections.contact}
          </span>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="contactName" className={labelBase}>
                {form.fields.contactName} *
              </label>
              <input id="contactName" name="contactName" required autoComplete="name" placeholder={form.placeholders.contactName} className={fieldBase} />
            </div>
            <div>
              <label htmlFor="role" className={labelBase}>
                {form.fields.role} <span className="text-muted">({form.hints.role})</span>
              </label>
              <input id="role" name="role" placeholder={form.placeholders.role} className={fieldBase} />
            </div>
            <div>
              <label htmlFor="phone" className={labelBase}>
                {form.fields.phone} *
              </label>
              <input id="phone" name="phone" type="tel" required autoComplete="tel" defaultValue="+962 " placeholder={form.placeholders.phone} dir="ltr" className={cn(fieldBase, "text-start")} />
            </div>
            <div>
              <label htmlFor="email" className={labelBase}>
                {form.fields.email} *
              </label>
              <input id="email" name="email" type="email" required autoComplete="email" placeholder={form.placeholders.email} dir="ltr" className={cn(fieldBase, "text-start")} />
            </div>
          </div>

          {/* ---- Location & cuisine ---- */}
          <span className={sectionLabel}>
            <span className={stepNum} aria-hidden>03</span>
            {form.sections.details}
          </span>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="neighborhood" className={labelBase}>
                {form.fields.neighborhood} *
              </label>
              <select
                id="neighborhood"
                name="neighborhood"
                required
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                className={cn(fieldBase, "appearance-none", !neighborhood && "text-muted")}
              >
                <option value="" disabled>
                  {form.options.neighborhoodPlaceholder}
                </option>
                {NEIGHBORHOODS.map((value, i) => (
                  <option key={value} value={value}>
                    {areas[i] ?? value}
                  </option>
                ))}
                <option value="Other">{form.options.other}</option>
              </select>
            </div>
            <div>
              <label htmlFor="street" className={labelBase}>
                {form.fields.street} <span className="text-muted">({form.hints.optional})</span>
              </label>
              <input id="street" name="street" placeholder={form.placeholders.street} className={fieldBase} />
            </div>
          </div>
          <div
            className={cn(
              "grid transition-all duration-300",
              neighborhood === "Other" ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            )}
          >
            <div className="overflow-hidden">
              <label htmlFor="neighborhoodOther" className={labelBase}>
                {form.fields.neighborhoodOther} *
              </label>
              <input
                id="neighborhoodOther"
                name="neighborhoodOther"
                required={neighborhood === "Other"}
                placeholder={form.placeholders.neighborhoodOther}
                className={fieldBase}
              />
            </div>
          </div>
          <div>
            <span className={labelBase}>
              {form.fields.cuisines} * <span className="text-muted">— {form.hints.cuisines}</span>
            </span>
            <div className="flex flex-wrap gap-2">
              {form.cuisines.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => toggleCuisine(c.id)}
                  aria-pressed={cuisines.includes(c.id)}
                  className={cn(
                    "min-h-[44px] rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                    cuisines.includes(c.id)
                      ? "border-accent bg-accent-wash text-accent-deep"
                      : "border-line text-muted hover:border-accent/35"
                  )}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="avgPrice" className={labelBase}>
              {form.fields.avgPrice} <span className="text-muted">({form.hints.optional})</span>
            </label>
            <select id="avgPrice" name="avgPrice" defaultValue="" className={cn(fieldBase, "appearance-none")}>
              <option value="">{form.options.avgPricePlaceholder}</option>
              {form.options.avgPrice.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          {/* ---- Working hours ---- */}
          <span className={sectionLabel}>
            <span className={stepNum} aria-hidden>04</span>
            {form.sections.hours}
          </span>
          <p className="-mt-3 text-sm text-muted">{form.hints.hours}</p>
          <div className="flex flex-col gap-2">
            {DAYS.map((day) => (
              <div
                key={day}
                className="grid grid-cols-[5.5rem_1fr_1fr_auto] items-center gap-2 rounded-chip border border-line bg-surface px-3 py-2 sm:grid-cols-[7rem_1fr_1fr_auto] sm:gap-3 sm:px-4"
              >
                <span className="text-sm font-medium text-content">{form.hours.days[day]}</span>
                <label className="flex items-center gap-2">
                  <span className="sr-only">{`${form.hours.days[day]} — ${form.hours.open}`}</span>
                  <input
                    type="time"
                    value={hours[day].open}
                    disabled={hours[day].closed}
                    onChange={(e) => setDay(day, { open: e.target.value })}
                    dir="ltr"
                    className={cn(
                      "w-full rounded-chip border border-line-strong bg-bg px-2 py-1.5 text-sm tabular-nums text-content transition-colors focus:border-accent disabled:opacity-35",
                    )}
                  />
                </label>
                <label className="flex items-center gap-2">
                  <span className="sr-only">{`${form.hours.days[day]} — ${form.hours.close}`}</span>
                  <input
                    type="time"
                    value={hours[day].close}
                    disabled={hours[day].closed}
                    onChange={(e) => setDay(day, { close: e.target.value })}
                    dir="ltr"
                    className={cn(
                      "w-full rounded-chip border border-line-strong bg-bg px-2 py-1.5 text-sm tabular-nums text-content transition-colors focus:border-accent disabled:opacity-35",
                    )}
                  />
                </label>
                <button
                  type="button"
                  onClick={() => setDay(day, { closed: !hours[day].closed })}
                  aria-pressed={hours[day].closed}
                  className={cn(
                    "min-h-[44px] rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
                    hours[day].closed
                      ? "border-accent bg-accent-wash text-accent-deep"
                      : "border-line text-muted hover:border-accent/35"
                  )}
                >
                  {form.hours.closed}
                </button>
              </div>
            ))}
          </div>

          {/* ---- Menu & photos ---- */}
          <span className={sectionLabel}>
            <span className={stepNum} aria-hidden>05</span>
            {form.sections.menu}
          </span>
          <p className="-mt-3 text-sm text-muted">{form.hints.menu}</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="menuFile" className={labelBase}>
                {form.fields.menuFile}
              </label>
              <input
                id="menuFile"
                type="file"
                accept="application/pdf"
                onChange={(e) => onMenuChange(e.target.files?.[0] ?? null)}
                className={cn(
                  fieldBase,
                  "file:me-3 file:rounded-full file:border-0 file:bg-accent-wash file:px-4 file:py-1.5 file:text-sm file:font-semibold file:text-accent-deep"
                )}
              />
            </div>
            <div>
              <label htmlFor="menuLink" className={labelBase}>
                {form.fields.menuLink}
              </label>
              <input id="menuLink" name="menuLink" type="url" placeholder={form.placeholders.menuLink} dir="ltr" className={cn(fieldBase, "text-start")} />
            </div>
          </div>
          <div>
            <label htmlFor="photos" className={labelBase}>
              {form.fields.photos} <span className="text-muted">— {form.hints.photos}</span>
            </label>
            <input
              id="photos"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={(e) => onPhotosChange(e.target.files)}
              className={cn(
                fieldBase,
                "file:me-3 file:rounded-full file:border-0 file:bg-accent-wash file:px-4 file:py-1.5 file:text-sm file:font-semibold file:text-accent-deep"
              )}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="instagram" className={labelBase}>
                {form.fields.instagram} <span className="text-muted">({form.hints.optional})</span>
              </label>
              <input id="instagram" name="instagram" placeholder={form.placeholders.instagram} dir="ltr" className={cn(fieldBase, "text-start")} />
            </div>
            <div>
              <label htmlFor="whatsappBusiness" className={labelBase}>
                {form.fields.whatsappBusiness} <span className="text-muted">({form.hints.optional})</span>
              </label>
              <input id="whatsappBusiness" name="whatsappBusiness" type="url" placeholder={form.placeholders.whatsappBusiness} dir="ltr" className={cn(fieldBase, "text-start")} />
            </div>
          </div>

          {/* ---- Plans & extras ---- */}
          <span className={sectionLabel}>
            <span className={stepNum} aria-hidden>06</span>
            {form.sections.plan}
          </span>
          <div>
            <span className={labelBase}>{form.fields.prepayment}</span>
            <div className="grid w-fit grid-cols-2 gap-1 rounded-full border border-line bg-surface p-1">
              {([true, false] as const).map((v) => (
                <button
                  key={String(v)}
                  type="button"
                  onClick={() => setPrepayment(v)}
                  aria-pressed={prepayment === v}
                  className={cn(
                    "min-h-[44px] rounded-full px-6 py-2 text-center text-sm font-semibold transition-colors",
                    prepayment === v
                      ? "bg-accent-wash text-accent-deep"
                      : "text-muted hover:text-content"
                  )}
                >
                  {v ? form.options.yes : form.options.no}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="plan" className={labelBase}>
              {form.fields.plan} <span className="text-muted">({form.hints.optional})</span>
            </label>
            <select id="plan" name="plan" defaultValue="" className={cn(fieldBase, "appearance-none")}>
              <option value="">{form.options.planPlaceholder}</option>
              {form.options.plans.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="notes" className={labelBase}>
              {form.fields.notes} <span className="text-muted">({form.hints.optional})</span>
            </label>
            <textarea id="notes" name="notes" rows={3} placeholder={form.placeholders.notes} className={cn(fieldBase, "resize-none")} />
          </div>

          <label className="flex items-start gap-3 text-sm text-content/80">
            <input
              type="checkbox"
              name="consent"
              required
              className="mt-0.5 h-4 w-4 shrink-0 accent-accent"
            />
            <span>
              {form.consent.pre}{" "}
              <a href={localizedHref("/legal/privacy", locale)} className="font-semibold underline underline-offset-2 transition-colors hover:text-accent-deep" target="_blank" rel="noopener noreferrer">
                {form.consent.privacy}
              </a>{" "}
              {form.consent.and}{" "}
              <a href={localizedHref("/legal/terms", locale)} className="font-semibold underline underline-offset-2 transition-colors hover:text-accent-deep" target="_blank" rel="noopener noreferrer">
                {form.consent.terms}
              </a>
              {form.consent.post} *
            </span>
          </label>

          {(status === "error" || fileError) && (
            <p role="alert" className="rounded-chip bg-error/10 px-4 py-3 text-sm text-error-deep">
              {fileError ?? form.errors[errorKey]}
            </p>
          )}

          <button
            type="submit"
            disabled={status === "submitting" || Boolean(fileError)}
            className="btn btn-primary w-full text-base disabled:opacity-60"
          >
            {status === "submitting" ? form.submitting : form.submit}
          </button>
        </motion.form>
      </AnimatePresence>
    </div>
  );
}
