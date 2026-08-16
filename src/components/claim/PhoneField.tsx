"use client";

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ComponentType,
} from "react";
import PhoneInput from "react-phone-number-input";
import flags from "react-phone-number-input/flags";
import enLabels from "react-phone-number-input/locale/en.json";
import arLabels from "react-phone-number-input/locale/ar.json";
import { getCountryCallingCode, type CountryCode } from "libphonenumber-js";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";
import { DEFAULT_PHONE_COUNTRY } from "@/lib/cue-insider/normalize";
import {
  searchCountries,
  type CountryOption,
} from "@/lib/phone/country-search";

type CountrySelectStrings = Dictionary["claim"]["form"]["countrySelect"];

type FlagIcon = ComponentType<{ country?: CountryCode; label: string }>;

type SelectOption = { value?: CountryCode; label: string; divider?: boolean };

type CountrySearchSelectProps = {
  value?: CountryCode;
  onChange: (value?: CountryCode) => void;
  options: SelectOption[];
  iconComponent: FlagIcon;
  disabled?: boolean;
  readOnly?: boolean;
  "aria-label"?: string;
  // Injected through countrySelectProps below.
  strings: CountrySelectStrings;
  numberInputId: string;
};

// Sized wrapper for the library's inline-SVG flags (3:2 aspect).
const flagFrame =
  "w-6 shrink-0 overflow-hidden rounded-[3px] leading-none [&_img]:block [&_img]:w-full [&_svg]:block [&_svg]:w-full";

/**
 * Searchable replacement for react-phone-number-input's native <select>:
 * a flag button opening a panel where typing filters the country list live,
 * with the top match pre-highlighted (Enter confirms, arrows move).
 */
function CountrySearchSelect({
  value,
  onChange,
  options,
  iconComponent: Icon,
  disabled,
  readOnly,
  "aria-label": ariaLabel,
  strings,
  numberInputId,
}: CountrySearchSelectProps) {
  const uid = useId();
  const listboxId = `${uid}-countries`;
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const countries = useMemo<(CountryOption & { code: CountryCode })[]>(
    () =>
      options
        .filter(
          (o): o is SelectOption & { value: CountryCode } =>
            Boolean(o.value) && !o.divider
        )
        .map((o) => ({
          code: o.value,
          label: o.label,
          callingCode: getCountryCallingCode(o.value),
        })),
    [options]
  );

  const results = useMemo(
    () => searchCountries(countries, query),
    [countries, query]
  );
  const clampedIndex = Math.min(activeIndex, Math.max(results.length - 1, 0));
  const active = results[clampedIndex];
  const activeOptionId = active ? `${listboxId}-${active.code}` : undefined;
  const current = countries.find((c) => c.code === value);

  function openPanel() {
    if (disabled || readOnly) return;
    setQuery("");
    const idx = countries.findIndex((c) => c.code === value);
    setActiveIndex(idx >= 0 ? idx : 0);
    setOpen(true);
  }

  function select(code: CountryCode) {
    onChange(code);
    setOpen(false);
    // The user's next act is typing digits — hand focus to the number input.
    document.getElementById(numberInputId)?.focus();
  }

  useEffect(() => {
    if (open) searchRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open || !activeOptionId) return;
    document.getElementById(activeOptionId)?.scrollIntoView({ block: "nearest" });
  }, [open, activeOptionId]);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  function onSearchKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex(Math.min(clampedIndex + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex(Math.max(clampedIndex - 1, 0));
    } else if (e.key === "Home") {
      e.preventDefault();
      setActiveIndex(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setActiveIndex(Math.max(results.length - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (active) select(active.code);
    } else if (e.key === "Escape") {
      // Swallow it — inside the claim modal, Escape would otherwise also
      // close the whole dialog.
      e.preventDefault();
      e.stopPropagation();
      setOpen(false);
      triggerRef.current?.focus();
    } else if (e.key === "Tab") {
      setOpen(false);
    }
  }

  const label = ariaLabel ?? strings.label;

  return (
    <div ref={rootRef} className="relative flex">
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={current ? `${label}: ${current.label}` : label}
        onClick={() => (open ? setOpen(false) : openPanel())}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" && !open) {
            e.preventDefault();
            openPanel();
          }
        }}
        className="flex h-full items-center gap-1.5 rounded-chip border border-line-strong bg-surface px-3 transition-colors hover:border-accent focus:border-accent"
      >
        <span className={flagFrame}>
          <Icon country={value} label={current?.label ?? label} />
        </span>
        <svg
          viewBox="0 0 12 12"
          aria-hidden
          className={cn("h-3 w-3 text-muted transition-transform", open && "rotate-180")}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M3 4.5 6 7.5 9 4.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div
          data-swallows-escape=""
          className="absolute start-0 top-[calc(100%+0.4rem)] z-50 w-[19rem] max-w-[calc(100vw-2.5rem)] rounded-card border border-line bg-surface p-2 shadow-card"
        >
          <input
            ref={searchRef}
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls={listboxId}
            aria-activedescendant={activeOptionId}
            aria-autocomplete="list"
            aria-label={strings.searchPlaceholder}
            placeholder={strings.searchPlaceholder}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={onSearchKeyDown}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            className="w-full rounded-chip border border-line bg-surface2 px-3 py-2 text-sm text-content placeholder:text-muted transition-colors focus:border-accent"
          />
          <ul
            id={listboxId}
            role="listbox"
            aria-label={label}
            className="mt-2 max-h-64 overflow-y-auto overscroll-contain"
          >
            {results.map((c, i) => (
              <li
                key={c.code}
                id={`${listboxId}-${c.code}`}
                role="option"
                aria-selected={i === clampedIndex}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => select(c.code)}
                onMouseMove={() => setActiveIndex(i)}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-chip px-3 py-2 text-sm text-content",
                  i === clampedIndex && "bg-accent/10"
                )}
              >
                <span className={flagFrame}>
                  <Icon country={c.code} label={c.label} />
                </span>
                <span className="min-w-0 flex-1 truncate text-start">{c.label}</span>
                <span dir="ltr" className="shrink-0 text-xs text-muted">
                  +{c.callingCode}
                </span>
              </li>
            ))}
          </ul>
          {results.length === 0 && (
            <p className="px-3 py-4 text-center text-sm text-muted">{strings.noResults}</p>
          )}
        </div>
      )}
    </div>
  );
}

export type PhoneFieldProps = {
  /** id for the number <input>, so the field's <label htmlFor> keeps working. */
  id: string;
  /** E.164 value ("+962791234567"), or undefined while empty. */
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  locale: Locale;
  strings: CountrySelectStrings;
  placeholder?: string;
  /** Classes for the number input — pass the form's shared field styling. */
  className?: string;
};

/**
 * International phone input for the claim form: searchable country selector
 * (defaulting to Jordan) + E.164-valued number input. Country names come
 * from react-phone-number-input's locale files, so /ar lists them in Arabic.
 */
export default function PhoneField({
  id,
  value,
  onChange,
  locale,
  strings,
  placeholder,
  className,
}: PhoneFieldProps) {
  return (
    <PhoneInput
      id={id}
      name="phone"
      international
      defaultCountry={DEFAULT_PHONE_COUNTRY}
      flags={flags}
      labels={locale === "ar" ? arLabels : enLabels}
      value={value}
      onChange={onChange}
      countrySelectComponent={CountrySearchSelect}
      countrySelectProps={{ strings, numberInputId: id }}
      numberInputProps={{
        required: true,
        autoComplete: "tel",
        placeholder,
        className: cn(className, "text-start"),
      }}
      // The number itself always reads LTR; the selector/input pair still
      // mirrors as a whole in RTL.
      dir="ltr"
      className="flex items-stretch gap-2 [&>*:last-child]:min-w-0 [&>*:last-child]:flex-1"
    />
  );
}
