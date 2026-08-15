import { describe, expect, it } from "vitest";
import { sanitizeUtm, utmFromSearch, withUtm } from "../utm";

describe("sanitizeUtm", () => {
  it("keeps only whitelisted utm keys", () => {
    expect(
      sanitizeUtm({
        utm_source: "instagram",
        utm_medium: "paid",
        gclid: "abc",
        email: "a@b.co",
      })
    ).toEqual({ utm_source: "instagram", utm_medium: "paid" });
  });

  it("returns null for non-objects and empty results", () => {
    expect(sanitizeUtm(null)).toBeNull();
    expect(sanitizeUtm("utm_source=x")).toBeNull();
    expect(sanitizeUtm([])).toBeNull();
    expect(sanitizeUtm({})).toBeNull();
    expect(sanitizeUtm({ utm_source: "   " })).toBeNull();
    expect(sanitizeUtm({ utm_source: 42 })).toBeNull();
  });

  it("clamps oversized values and strips control characters", () => {
    const long = "x".repeat(500);
    expect(sanitizeUtm({ utm_campaign: long })).toEqual({
      utm_campaign: "x".repeat(200),
    });
    expect(sanitizeUtm({ utm_source: "ins\x00ta\r\ngram" })).toEqual({
      utm_source: "instagram",
    });
  });
});

describe("utmFromSearch", () => {
  it("parses utm params out of a query string", () => {
    expect(
      utmFromSearch("?utm_source=ig&utm_content=story&ref=ignored")
    ).toEqual({ utm_source: "ig", utm_content: "story" });
  });

  it("returns null when nothing relevant is present", () => {
    expect(utmFromSearch("")).toBeNull();
    expect(utmFromSearch("?ref=x&page=2")).toBeNull();
  });
});

describe("withUtm", () => {
  it("tags a clean href with the internal placement triple", () => {
    expect(withUtm("/claim", "footer")).toBe(
      "/claim?utm_source=cue-site&utm_medium=internal&utm_content=footer"
    );
  });

  it("appends with & when the href already has a query", () => {
    expect(withUtm("/claim?x=1", "footer")).toBe(
      "/claim?x=1&utm_source=cue-site&utm_medium=internal&utm_content=footer"
    );
  });

  it("URL-encodes the placement", () => {
    expect(withUtm("/claim", "early access")).toContain(
      "utm_content=early%20access"
    );
  });
});
