"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";
import { getUtmParams } from "@/lib/utm";
import { CueMark } from "@/components/BrandMark";

type Status = "idle" | "submitting" | "success" | "error";

export default function LeadForm({
  form,
  locale,
}: {
  form: Dictionary["reach"]["form"];
  locale: Locale;
}) {
  const [audience, setAudience] = useState<string>("operator");
  const [contact, setContact] = useState<string>("email");
  const [status, setStatus] = useState<Status>("idle");
  // Focused when the success panel replaces the form, so SR users hear it —
  // same pattern as ClaimForm's outcome heading.
  const successHeadingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (status === "success") successHeadingRef.current?.focus();
  }, [status]);

  const isOperator = audience === "operator";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    const data = new FormData(e.currentTarget);
    const payload = {
      audience,
      contactPreference: contact,
      locale,
      name: String(data.get("name") || ""),
      email: String(data.get("email") || ""),
      phone: String(data.get("phone") || ""),
      establishment: String(data.get("establishment") || ""),
      instagram: String(data.get("instagram") || ""),
      message: String(data.get("message") || ""),
      utm: getUtmParams(),
    };
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("bad status");
      setStatus("success");
      (e.target as HTMLFormElement).reset();
    } catch {
      setStatus("error");
    }
  }

  const fieldBase =
    "w-full rounded-chip border border-line-strong bg-surface px-4 py-3 text-content placeholder:text-muted transition-colors focus:border-accent";
  const labelBase = "mb-1.5 block text-sm font-medium text-content/80";

  return (
    <div className="relative overflow-hidden rounded-panel border border-line bg-surface2 p-6 shadow-soft sm:p-8">
      <CueMark className="pointer-events-none absolute -end-8 -top-8 h-28 w-28 text-accent/10" />
      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="relative flex min-h-[26rem] flex-col items-center justify-center text-center"
          >
            {/* ok = confirmed semantic */}
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-ok/15 text-ok">
              <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="m5 13 4 4L19 7" />
              </svg>
            </span>
            <h3
              ref={successHeadingRef}
              tabIndex={-1}
              className="mt-6 text-3xl text-content outline-none"
            >
              {form.success.title}
            </h3>
            <p className="mt-3 max-w-sm text-muted">{form.success.body}</p>
            <button
              type="button"
              onClick={() => setStatus("idle")}
              className="mt-6 inline-flex min-h-[44px] items-center"
            >
              <span className="link-underline">{form.success.again}</span>
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
            onSubmit={onSubmit}
            className="relative flex flex-col gap-5"
          >
            <div>
              <h2 className="text-2xl text-content">{form.heading}</h2>
              <p className="mt-1 text-sm text-muted">{form.subheading}</p>
            </div>

            {/* Audience segmented control */}
            <div>
              <span className={labelBase}>{form.audienceLabel}</span>
              {/* Track matches ApplyForm's prepayment toggle: border-line on
                  bg-surface keeps inactive text-muted labels AA in light mode. */}
              <div className="grid grid-cols-3 gap-1.5 rounded-card border border-line bg-surface p-1">
                {form.audiences.map((a) => (
                  <button
                    key={a.value}
                    type="button"
                    onClick={() => setAudience(a.value)}
                    aria-pressed={audience === a.value}
                    className={cn(
                      "min-h-[44px] rounded-chip px-2 py-2.5 text-center text-xs font-semibold transition-colors sm:text-sm",
                      audience === a.value
                        ? "bg-accent-wash text-accent-deep"
                        : "text-muted hover:text-content"
                    )}
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className={labelBase}>
                  {form.fields.name} *
                </label>
                <input id="name" name="name" required autoComplete="name" placeholder={form.placeholders.name} className={fieldBase} />
              </div>
              <div>
                <label htmlFor="email" className={labelBase}>
                  {form.fields.email} *
                </label>
                <input id="email" name="email" type="email" required autoComplete="email" placeholder={form.placeholders.email} className={fieldBase} />
              </div>
              <div>
                <label htmlFor="phone" className={labelBase}>
                  {form.fields.phone}
                </label>
                <input id="phone" name="phone" type="tel" autoComplete="tel" placeholder={form.placeholders.phone} dir="ltr" className={cn(fieldBase, "text-start")} />
              </div>
              <div>
                <label htmlFor="instagram" className={labelBase}>
                  {form.fields.instagram}
                </label>
                <input id="instagram" name="instagram" placeholder={form.placeholders.instagram} dir="ltr" className={cn(fieldBase, "text-start")} />
              </div>
            </div>

            {/* Conditional establishment */}
            <div
              className={cn(
                "grid transition-all duration-300",
                isOperator ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              )}
            >
              <div className="overflow-hidden">
                <label htmlFor="establishment" className={labelBase}>
                  {form.fields.establishment}
                </label>
                <input id="establishment" name="establishment" placeholder={form.placeholders.establishment} className={fieldBase} />
                <p className="mt-1 text-xs text-muted">{form.establishmentHint}</p>
              </div>
            </div>

            <div>
              <label htmlFor="message" className={labelBase}>
                {form.fields.message}
              </label>
              <textarea id="message" name="message" rows={3} placeholder={form.placeholders.message} className={cn(fieldBase, "resize-none")} />
            </div>

            {/* Contact preference */}
            <div>
              <span className={labelBase}>{form.contactPref}</span>
              <div className="flex flex-wrap gap-2">
                {form.contactOptions.map((o) => (
                  <button
                    key={o.value}
                    type="button"
                    onClick={() => setContact(o.value)}
                    aria-pressed={contact === o.value}
                    className={cn(
                      "min-h-[44px] rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                      contact === o.value
                        ? "border-accent/60 bg-accent-wash text-accent-deep"
                        : "border-line text-muted hover:border-accent/35 hover:text-content"
                    )}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>

            {status === "error" && (
              <p role="alert" className="rounded-chip bg-error/10 px-4 py-3 text-sm text-error-deep">
                {form.error}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "submitting"}
              className="btn btn-primary w-full text-base disabled:opacity-60"
            >
              {status === "submitting" ? form.submitting : form.submit}
            </button>
            <p className="text-center text-xs text-muted">{form.requiredNote}</p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
