import { describe, expect, it } from "vitest";
import { isValidEmail } from "../normalize";

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
