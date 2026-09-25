import { describe, expect, it } from "vitest";
import { claimErrorKey } from "../claim-errors";
import en from "../../../i18n/content/en";
import ar from "../../../i18n/content/ar";

describe("claimErrorKey", () => {
  it("asks for a mobile when the API refuses a landline", () => {
    const body = { ok: false, error: "validation", field: "phone", reason: "landline-not-supported" };
    expect(claimErrorKey(422, body)).toBe("phoneLandline");
  });

  it.each([
    ["name", "name"],
    ["email", "email"],
    ["phone", "phone"],
    ["phone-country", "phoneCountry"],
    ["marketingConsent", "server"],
    ["body", "server"],
    ["toString", "server"],
    [undefined, "server"],
  ])("maps a 422 on field %s to %s", (field, key) => {
    expect(claimErrorKey(422, { ok: false, error: "validation", field })).toBe(key);
  });

  it("keeps the generic phone copy for a phone reason it has no copy for", () => {
    expect(claimErrorKey(422, { ok: false, error: "validation", field: "phone", reason: "invalid-number" })).toBe("phone");
  });

  it.each([
    [400, { ok: false, error: "turnstile" }, "turnstile"],
    [429, { ok: false, error: "rate-limited" }, "rateLimited"],
    [503, { ok: false, error: "unavailable" }, "server"],
    [400, { ok: false, error: "validation", field: "name" }, "server"],
    [500, null, "server"],
    [422, "not json", "server"],
  ])("maps %i %j to %s", (status, body, key) => {
    expect(claimErrorKey(status, body)).toBe(key);
  });

  it("has copy in both languages for the landline error", () => {
    expect(en.claim.form.errors.phoneLandline).toBe("Enter a mobile number: landlines aren't accepted.");
    expect(ar.claim.form.errors.phoneLandline).toBe("يُرجى إدخال رقم جوال، لا نقبل أرقام الهاتف الأرضي.");
  });
});
