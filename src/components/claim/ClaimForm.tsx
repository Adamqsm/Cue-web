"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";
import { isValidEmail, normalizePhone } from "@/lib/cue-insider/normalize";
import { track } from "@/lib/cue-insider/analytics";
import TurnstileWidget from "@/components/claim/TurnstileWidget";
import ClaimTicket from "@/components/claim/ClaimTicket";
import LocaleLink from "@/components/ui/LocaleLink";

type Status = "idle" | "submitting" | "success" | "duplicate" | "error";
type DuplicateVariant = "email" | "phone" | "rate-limited" | "resend-limit";

export type ClaimFormProps = {
  strings: Pick<Dictionary["claim"], "form" | "success" | "duplicate">;
  locale: Locale;
  source: "claim-page" | "claim-modal" | "nav-cta";
  variant?: "page" | "modal";
  onClaimed?: (o: { status: "issued" | "duplicate" }) => void;
};

const CLAIMED_KEY = "cue-insider-claimed";

// Copied verbatim from ApplyForm — the site's field styling.
const fieldBase =
  "w-full rounded-chip border border-line-strong bg-surface px-4 py-3 text-content placeholder:text-muted transition-colors focus:border-accent";
const labelBase = "mb-1.5 block text-sm font-medium text-content";

function markClaimed() {
  try {
    localStorage.setItem(CLAIMED_KEY, "1");
  } catch {
    // Storage unavailable — the server still dedupes.
  }
}

export default function ClaimForm({
  strings,
  locale,
  source,
  variant = "page",
  onClaimed,
}: ClaimFormProps) {
  const uid = useId();
  const [status, setStatus] = useState<Status>("idle");
  const [errorKey, setErrorKey] =
    useState<keyof Dictionary["claim"]["form"]["errors"]>("server");
  const [token, setToken] = useState<string | null>(null);
  // Bumped to remount (and thus reset) Turnstile after a rejected token.
  const [turnstileKey, setTurnstileKey] = useState(0);
  const [duplicateVariant, setDuplicateVariant] =
    useState<DuplicateVariant>("email");
  const [ticket, setTicket] = useState<{
    code: string;
    name: string;
    email: string;
    issuedAt: Date;
  } | null>(null);
  // Focused when the outcome panel replaces the form, so SR users hear it.
  const outcomeHeadingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (status === "success" || status === "duplicate") {
      outcomeHeadingRef.current?.focus();
    }
  }, [status]);

  const f = strings.form;

  function fail(key: typeof errorKey) {
    setErrorKey(key);
    setStatus("error");
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const get = (k: string) => String(data.get(k) || "").trim();

    const name = get("name");
    const email = get("email");
    const marketingConsent = data.get("marketingConsent") === "on";

    if (name.length < 2) return fail("name");
    if (!isValidEmail(email.toLowerCase())) return fail("email");
    const phone = normalizePhone(get("phone"));
    if (!phone.ok) {
      return fail(phone.reason === "unsupported-country" ? "phoneCountry" : "phone");
    }
    if (!token) return fail("turnstile");

    setStatus("submitting");
    track("claim_submit", { source, locale });

    try {
      const res = await fetch("/api/cue-insider/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone: phone.e164,
          locale,
          source,
          marketingConsent,
          turnstileToken: token,
        }),
      });
      const body = await res.json().catch(() => null);

      if (res.ok && body?.ok && body.status === "issued") {
        track("claim_success", { source, locale });
        markClaimed();
        setTicket({ code: body.code, name, email, issuedAt: new Date() });
        setStatus("success");
        onClaimed?.({ status: "issued" });
        return;
      }
      if (res.ok && body?.ok && body.status === "duplicate") {
        track("claim_duplicate", { source, locale });
        markClaimed();
        setDuplicateVariant(body.variant);
        setStatus("duplicate");
        onClaimed?.({ status: "duplicate" });
        return;
      }

      track("claim_error", { source, locale });
      if (res.status === 400 && body?.error === "turnstile") {
        setToken(null);
        setTurnstileKey((k) => k + 1);
        return fail("turnstile");
      }
      if (res.status === 429) return fail("rateLimited");
      if (res.status === 422 && body?.error === "validation") {
        const map = {
          name: "name",
          email: "email",
          phone: "phone",
          "phone-country": "phoneCountry",
        } as const;
        return fail(map[body.field as keyof typeof map] ?? "server");
      }
      return fail("server");
    } catch {
      track("claim_error", { source, locale });
      return fail("network");
    }
  }

  if (status === "success" && ticket) {
    return (
      <div className="flex flex-col gap-5">
        <h3 ref={outcomeHeadingRef} tabIndex={-1} className="sr-only">
          {strings.success.title}
        </h3>
        <ClaimTicket
          code={ticket.code}
          name={ticket.name}
          email={ticket.email}
          strings={strings.success}
          locale={locale}
          issuedAt={ticket.issuedAt}
          compact={variant === "modal"}
        />
        <p className="text-sm leading-relaxed text-muted">{strings.success.next}</p>
        {variant === "page" && (
          <LocaleLink href="/" locale={locale} className="inline-flex min-h-[44px] items-center self-start">
            <span className="link-underline">{strings.success.home}</span>
          </LocaleLink>
        )}
      </div>
    );
  }

  if (status === "duplicate") {
    const bodyByVariant: Record<DuplicateVariant, string> = {
      email: strings.duplicate.body,
      phone: strings.duplicate.bodyPhone,
      "rate-limited": strings.duplicate.rateLimited,
      "resend-limit": strings.duplicate.resendLimit,
    };
    // Neutral info panel (v5.1: washes are for interactive states, not
    // large informational surfaces).
    return (
      <div className="rounded-card border border-line bg-surface2 p-6">
        <h3
          ref={outcomeHeadingRef}
          tabIndex={-1}
          className="text-lg font-semibold text-content outline-none"
        >
          {strings.duplicate.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-content/80">
          {bodyByVariant[duplicateVariant]}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <div>
        <label htmlFor={`${uid}-name`} className={labelBase}>
          {f.name} *
        </label>
        <input
          id={`${uid}-name`}
          name="name"
          required
          autoComplete="name"
          placeholder={f.namePlaceholder}
          className={fieldBase}
        />
      </div>
      <div>
        <label htmlFor={`${uid}-email`} className={labelBase}>
          {f.email} *
        </label>
        <input
          id={`${uid}-email`}
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder={f.emailPlaceholder}
          dir="ltr"
          className={cn(fieldBase, "text-start")}
        />
      </div>
      <div>
        <label htmlFor={`${uid}-phone`} className={labelBase}>
          {f.phone} *
        </label>
        <input
          id={`${uid}-phone`}
          name="phone"
          type="tel"
          required
          autoComplete="tel"
          defaultValue="+962 "
          dir="ltr"
          className={cn(fieldBase, "text-start")}
        />
        <p className="mt-1.5 text-xs text-muted">{f.phoneHint}</p>
      </div>

      <label className="flex items-start gap-3 text-sm text-content/80">
        <input
          type="checkbox"
          name="marketingConsent"
          className="mt-0.5 h-4 w-4 shrink-0 accent-accent"
        />
        <span>{f.consent}</span>
      </label>

      <div>
        <TurnstileWidget
          key={turnstileKey}
          onToken={setToken}
          locale={locale}
          failText={f.protectionFailed}
        />
        <p className="mt-1.5 text-xs text-muted">{f.protection}</p>
      </div>

      {status === "error" && (
        <p role="alert" className="rounded-chip bg-error/10 px-4 py-3 text-sm text-error-deep">
          {f.errors[errorKey]}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="btn btn-primary w-full text-base disabled:opacity-60"
      >
        {status === "submitting" ? f.submitting : f.submit}
      </button>
    </form>
  );
}
