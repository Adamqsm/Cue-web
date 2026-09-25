import { describe, expect, it } from "vitest";
import { isJordanLandline } from "../landline";

describe("isJordanLandline", () => {
  it.each([
    ["+96265000000", "an Amman fixed line"],
    ["+962 6 500 0000", "a formatted fixed line"],
    ["+96232012345", "an Aqaba fixed line"],
    ["+96280012345", "a toll-free number"],
    ["+96290012345", "an 8-digit premium-rate number"],
  ])("refuses %s (%s)", (phone) => {
    expect(isJordanLandline(phone)).toBe(true);
  });

  it.each([
    ["+962791234567", "a Zain mobile"],
    ["+962 78 123 4567", "an Umniah mobile"],
    ["+962771234567", "an Orange mobile"],
    ["+962741234567", "a 9-digit 074 number the metadata leaves unknown"],
    ["+12125550123", "a US number"],
    ["+97142345678", "a UAE fixed line (8 national digits, not Jordan)"],
    ["", "an empty value"],
    ["not a phone", "garbage"],
  ])("lets %s through (%s)", (phone) => {
    expect(isJordanLandline(phone)).toBe(false);
  });
});
