"use client";

import { useState } from "react";
import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/lib/utils";

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactForm({
  content,
}: {
  content: Dictionary["faq"]["contact"];
}) {
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    const data = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          audience: "contact",
          source: "faq",
          name: String(data.get("name") || ""),
          email: String(data.get("email") || ""),
          message: String(data.get("message") || ""),
        }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      (e.target as HTMLFormElement).reset();
    } catch {
      setStatus("error");
    }
  }

  const field =
    "w-full rounded-2xl border border-ink/15 bg-paper px-4 py-3 text-ink placeholder:text-ink/35 focus:border-clay focus:outline-none";

  if (status === "success") {
    return (
      <div className="flex min-h-[12rem] items-center justify-center rounded-2xl bg-clay/5 p-6 text-center text-ink/80">
        {content.success}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <input name="name" required placeholder={content.fields.name} className={field} />
      <input name="email" type="email" required placeholder={content.fields.email} className={field} />
      <textarea name="message" rows={4} required placeholder={content.fields.message} className={cn(field, "resize-none")} />
      <button
        type="submit"
        disabled={status === "submitting"}
        className="btn btn-ink w-full disabled:opacity-60"
      >
        {content.submit}
      </button>
    </form>
  );
}
