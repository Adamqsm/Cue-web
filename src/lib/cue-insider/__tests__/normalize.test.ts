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
  });

  it("maps Arabic-Indic digits before parsing", () => {
    expect(normalizePhone("٠٧٩١٢٣٤٥٦٧")).toEqual({
      ok: true,
      e164: "+962791234567",
      country: "JO",
    });
  });

  it("accepts GCC mobiles with + and 00 prefixes", () => {
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

  it("rejects unsupported countries", () => {
    expect(normalizePhone("+15551234567")).toEqual({
      ok: false,
      reason: "unsupported-country",
    });
  });

  it("rejects too-short and too-long numbers", () => {
    expect(normalizePhone("0791234")).toEqual({ ok: false, reason: "invalid-length" });
    expect(normalizePhone("+9627912345678")).toEqual({ ok: false, reason: "invalid-length" });
  });

  it("rejects empty and non-numeric input", () => {
    expect(normalizePhone("   ")).toEqual({ ok: false, reason: "empty" });
    expect(normalizePhone("+9627ABCD567")).toEqual({ ok: false, reason: "invalid-characters" });
  });

  it("rejects landlines", () => {
    // Amman landline: 8-digit national number, so it fails the length gate
    // before the mobile-prefix check ever runs.
    expect(normalizePhone("+96265551234")).toEqual({ ok: false, reason: "invalid-length" });
    // 9-digit number outside the 77/78/79 mobile ranges hits not-mobile.
    expect(normalizePhone("+962701234567")).toEqual({ ok: false, reason: "not-mobile" });
  });
});
