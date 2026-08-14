"use client";

import { useEffect, useRef, useState } from "react";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";

export type ClaimTicketProps = {
  code: string;
  name: string;
  email: string;
  strings: Dictionary["claim"]["success"];
  locale: Locale;
  issuedAt: Date;
  compact?: boolean;
};

const metaLabel = "text-xs font-semibold uppercase tracking-[0.14em] text-muted";

/**
 * The claim success card: a service-docket ledger ticket. The code is the
 * hero; everything else is quiet meta, split off by a perforation tear.
 */
export default function ClaimTicket({
  code,
  name,
  email,
  strings,
  locale,
  issuedAt,
  compact = false,
}: ClaimTicketProps) {
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => () => clearTimeout(copyTimer.current), []);

  function onCopy() {
    navigator.clipboard
      ?.writeText(code)
      .then(() => {
        setCopied(true);
        clearTimeout(copyTimer.current);
        copyTimer.current = setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {});
  }

  const issued = issuedAt.toLocaleDateString(
    locale === "ar" ? "ar-EG" : "en-GB",
    { day: "numeric", month: "short", year: "numeric" }
  );
  const [emailedPre, emailedPost] = strings.emailedTo.split("{email}");

  return (
    <div className="overflow-hidden rounded-panel border border-line bg-surface shadow-card">
      {/* Top strip */}
      <div className="flex items-center justify-between gap-3 px-6 pt-5">
        <span className="eyebrow">{strings.ticket.label}</span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-spark-wash ps-2.5 pe-3 py-1 text-[11px] font-semibold text-spark-deep">
          <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
          {strings.eyebrow}
        </span>
      </div>

      {/* Code hero */}
      <div className={cn("px-6 text-center", compact ? "py-8" : "py-10 md:py-12")}>
        <span className={metaLabel}>{strings.ticket.codeLabel}</span>
        <p
          dir="ltr"
          className={cn(
            "mt-3 font-mono tabular-nums tracking-[0.18em] text-content",
            compact ? "text-2xl" : "text-3xl md:text-4xl"
          )}
        >
          {code}
        </p>
        <button
          type="button"
          onClick={onCopy}
          className="btn btn-outline mt-5 min-h-0 px-4 py-2 text-xs"
        >
          {copied ? strings.copied : strings.copy}
        </button>
      </div>

      {/* Perforation tear */}
      <div className="relative" aria-hidden>
        <div className="border-t border-dashed border-line-strong" />
        <span className="absolute -start-2.5 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full border border-line bg-bg" />
        <span className="absolute -end-2.5 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full border border-line bg-bg" />
      </div>

      {/* Docket meta */}
      <div className={cn("px-6 pb-6", compact ? "pt-5" : "pt-6")}>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
          <div>
            <dt className={metaLabel}>{strings.ticket.nameLabel}</dt>
            <dd className="mt-1 text-sm text-content">{name}</dd>
          </div>
          <div>
            <dt className={metaLabel}>{strings.ticket.issuedLabel}</dt>
            <dd className="mt-1 text-sm tabular-nums text-content">{issued}</dd>
          </div>
          <div className="col-span-2">
            <dt className={metaLabel}>{strings.ticket.statusLabel}</dt>
            <dd className="mt-1 text-sm text-content">{strings.ticket.statusIssued}</dd>
          </div>
        </dl>
        <p className="mt-4 border-t border-line pt-4 text-sm text-muted">
          {emailedPre}
          <span dir="ltr" className="font-medium text-content">
            {email}
          </span>
          {emailedPost}
        </p>
      </div>
    </div>
  );
}
