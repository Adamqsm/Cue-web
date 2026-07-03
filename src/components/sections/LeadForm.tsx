"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";
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
    "w-full rounded-2xl border border-line bg-bg px-4 py-3 text-content placeholder:text-muted transition-colors focus:border-green focus:outline-none";
  const labelBase = "mb-1.5 block text-sm font-medium text-content/80";

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-line bg-surface2/70 p-6 shadow-[0_30px_60px_-40px_rgba(23,19,15,0.5)] sm:p-8">
      <CueMark className="pointer-events-none absolute -end-8 -top-8 h-28 w-28 text-green/10" />
      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative flex min-h-[26rem] flex-col items-center justify-center text-center"
          >
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-green text-bone">
              <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="m5 13 4 4L19 7" />
              </svg>
            </span>
            <h3 className="mt-6 text-3xl font-semibold text-content">{form.success.title}</h3>
            <p className="mt-3 max-w-sm text-content/70">{form.success.body}</p>
            <button
              type="button"
              onClick={() => setStatus("idle")}
              className="mt-6 link-underline"
            >
              {form.success.again}
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onSubmit={onSubmit}
            className="relative flex flex-col gap-5"
          >
            <div>
              <h2 className="text-2xl font-semibold text-content">{form.heading}</h2>
              <p className="mt-1 text-sm text-content/60">{form.subheading}</p>
            </div>

            {/* Audience segmented control */}
            <div>
              <span className={labelBase}>{form.audienceLabel}</span>
              <div className="grid grid-cols-3 gap-2 rounded-2xl bg-content/5 p-1">
                {form.audiences.map((a) => (
                  <button
                    key={a.value}
                    type="button"
                    onClick={() => setAudience(a.value)}
                    className={cn(
                      "rounded-xl px-2 py-2 text-center text-xs font-semibold transition-all sm:text-sm",
                      audience === a.value
                        ? "bg-bg text-content shadow-sm"
                        : "text-content/55 hover:text-content"
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
                <p className="mt-1 text-xs text-content/45">{form.establishmentHint}</p>
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
                    className={cn(
                      "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                      contact === o.value
                        ? "border-green bg-green/10 text-green dark:text-green-300"
                        : "border-line text-content/60 hover:border-content/35"
                    )}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>

            {status === "error" && (
              <p className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
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
            <p className="text-center text-xs text-content/45">{form.requiredNote}</p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
