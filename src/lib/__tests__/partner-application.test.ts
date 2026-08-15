import { describe, expect, it } from "vitest";
import { APPLICATION_ID_RE, newApplicationId, storagePrefix } from "../partner-application";

// The invariant under test is not cosmetic: cue-app/storage.rules gates every
// anonymous /partner/apply upload on `applicationId.matches('^[A-Za-z0-9]{20}$')`.
// An id that drifts from that shape (a UUID, say) silently breaks menu and
// photo uploads in production with a rules denial.
describe("newApplicationId", () => {
  it("matches the shape storage.rules accepts", () => {
    for (let i = 0; i < 500; i++) {
      const id = newApplicationId();
      expect(id).toHaveLength(20);
      expect(APPLICATION_ID_RE.test(id)).toBe(true);
    }
  });

  it("does not repeat", () => {
    const ids = new Set(Array.from({ length: 2000 }, () => newApplicationId()));
    expect(ids.size).toBe(2000);
  });

  it("uses the whole alphabet", () => {
    const seen = new Set(Array.from({ length: 2000 }, () => newApplicationId()).join(""));
    expect(seen.size).toBe(62);
  });
});

describe("APPLICATION_ID_RE", () => {
  it("rejects ids the Storage rules would reject", () => {
    for (const bad of [
      "550e8400-e29b-41d4-a716-446655440000", // crypto.randomUUID()
      "short",
      "a".repeat(21),
      "abcdefghijklmnopqrs/", // path segment escape
      "abcdefghijklmnopqr.s",
      "abcdefghijklmnopqr s",
      "",
    ]) {
      expect(APPLICATION_ID_RE.test(bad)).toBe(false);
    }
  });
});

describe("storagePrefix", () => {
  it("is the prefix the form uploads under", () => {
    const id = newApplicationId();
    expect(storagePrefix(id)).toBe(`partner-applications/${id}/`);
  });
});
