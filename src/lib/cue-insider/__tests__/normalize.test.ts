import { describe, expect, it } from "vitest";
import { isValidEmail, normalizeEmail, normalizePhone } from "../normalize";

describe("normalizeEmail", () => {
  it("trims and lowercases", () => {
    expect(normalizeEmail("  Adam@Qasem-Group.COM  ")).toBe("adam@qasem-group.com");
    expect(normalizeEmail("plain@example.com")).toBe("plain@example.com");
  });
});

describe("isValidEmail", () => {
  it("accepts ordinary addresses", () => {
    expect(isValidEmail("adam@qasem-group.com")).toBe(true);
    expect(isValidEmail("a.b+tag@sub.example.co")).toBe(true);
  });

  it("rejects structurally broken addresses", () => {
    expect(isValidEmail("no-at.example.com")).toBe(false);
    expect(isValidEmail("a@b")).toBe(false); // no dot in domain
    expect(isValidEmail("two words@example.com")).toBe(false);
    expect(isValidEmail("a@@example.com")).toBe(false);
    expect(isValidEmail("")).toBe(false);
  });

  it("rejects addresses over 254 characters", () => {
    const local = "a".repeat(250);
    expect(isValidEmail(`${local}@example.com`)).toBe(false);
  });
});

describe("normalizePhone", () => {
  it("accepts Jordanian mobiles in every common input form", () => {
    const expected = { ok: true, e164: "+962791234567", country: "JO" };
    expect(normalizePhone("+962791234567")).toEqual(expected);
    expect(normalizePhone("0791234567")).toEqual(expected);
    expect(normalizePhone("791234567")).toEqual(expected);
    expect(normalizePhone("07 9123 4567")).toEqual(expected);
    expect(normalizePhone("962791234567")).toEqual(expected);
  });

  it("maps Arabic-Indic digits before parsing", () => {
    expect(normalizePhone("٠٧٩١٢٣٤٥٦٧")).toEqual({
      ok: true,
      e164: "+962791234567",
      country: "JO",
    });
  });

  it("accepts numbers from any country, not just Jordan + GCC", () => {
    // The US case is the real-world regression: a +1 claim was hard-blocked.
    expect(normalizePhone("+1 (212) 555-0123")).toEqual({
      ok: true,
      e164: "+12125550123",
      country: "US",
    });
    expect(normalizePhone("+442071838750")).toEqual({
      ok: true,
      e164: "+442071838750",
      country: "GB",
    });
    expect(normalizePhone("+971501234567")).toEqual({
      ok: true,
      e164: "+971501234567",
      country: "AE",
    });
    expect(normalizePhone("00971501234567")).toEqual({
      ok: true,
      e164: "+971501234567",
      country: "AE",
    });
    expect(normalizePhone("+96551234567")).toEqual({
      ok: true,
      e164: "+96551234567",
      country: "KW",
    });
  });

  it("retries bare international digits as if the + had been typed", () => {
    // Not a readable Jordanian number, so the +-prefixed reading wins.
    expect(normalizePhone("12125550123")).toEqual({
      ok: true,
      e164: "+12125550123",
      country: "US",
    });
  });

  it("accepts landlines now that validity is per-country isValid, not mobile ranges", () => {
    // Amman fixed line — previously rejected by the 9-digit mobile gate.
    expect(normalizePhone("+96265551234")).toEqual({
      ok: true,
      e164: "+96265551234",
      country: "JO",
    });
  });

  it("rejects unassigned country codes", () => {
    expect(normalizePhone("+999123456")).toEqual({
      ok: false,
      reason: "unsupported-country",
    });
  });

  it("rejects numbers that fail their country's validity pattern", () => {
    // 555 is not an assigned NANP area code.
    expect(normalizePhone("+15551234567")).toEqual({
      ok: false,
      reason: "invalid-number",
    });
    // 10-digit Jordanian national number (max is 9).
    expect(normalizePhone("+9627912345678")).toEqual({
      ok: false,
      reason: "invalid-number",
    });
  });

  it("rejects too-short input", () => {
    // 7 national digits parse but fail Jordan's validity pattern…
    expect(normalizePhone("0791234")).toEqual({ ok: false, reason: "invalid-number" });
    // …while input below the parser's absolute floor is a length error.
    expect(normalizePhone("1")).toEqual({ ok: false, reason: "invalid-length" });
  });

  it("rejects empty and non-numeric input", () => {
    expect(normalizePhone("   ")).toEqual({ ok: false, reason: "empty" });
    expect(normalizePhone("+9627ABCD567")).toEqual({ ok: false, reason: "invalid-characters" });
  });
});
