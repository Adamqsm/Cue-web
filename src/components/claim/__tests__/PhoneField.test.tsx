import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import PhoneField from "../PhoneField";

/**
 * SSR-markup regression tests for the country code picker contract: the dial
 * code lives on the tap-only trigger button (flag + "+NNN"), never as
 * editable text inside the number input. Rendering server-side keeps these
 * dependency-free (no DOM library) while still exercising the real
 * react-phone-number-input wiring.
 */

const strings = {
  label: "Country code",
  searchPlaceholder: "Type a country name…",
  noResults: "No matching countries.",
};

function render(value: string | undefined, locale: "en" | "ar" = "en") {
  return renderToStaticMarkup(
    <PhoneField
      id="phone"
      value={value}
      onChange={() => {}}
      locale={locale}
      strings={strings}
      placeholder="07 9012 3456"
    />
  );
}

/** The number <input> tag (the only input rendered while the picker is closed). */
function numberInputTag(html: string): string {
  const match = html.match(/<input[^>]*id="phone"[^>]*>/);
  expect(match, "number input should render").not.toBeNull();
  return match![0];
}

describe("PhoneField", () => {
  it("shows the default Jordan dial code on the trigger, not in the input", () => {
    const html = render(undefined);
    expect(html).toContain(">+962<");
    expect(numberInputTag(html)).not.toMatch(/value="[^"]*\+/);
  });

  it("shows the selected country's dial code on the trigger and keeps the input national", () => {
    const html = render("+12125550123");
    expect(html).toContain(">+1<");
    const input = numberInputTag(html);
    expect(input).toContain('value="(212) 555-0123"');
    expect(input).not.toMatch(/value="[^"]*\+/);
  });

  it("names the trigger with the localized country name in Arabic", () => {
    const html = render(undefined, "ar");
    expect(html).toContain("الأردن");
    expect(html).toContain(">+962<");
  });
});
