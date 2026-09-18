import { afterEach, describe, expect, it, vi } from "vitest";
import { backendFor } from "../backend-flag";

describe("backendFor", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("defaults to firebase when nothing is set", () => {
    expect(backendFor("lead", {})).toBe("firebase");
  });

  it("applies CUE_BACKEND to every route", () => {
    const env = { CUE_BACKEND: "django" };
    for (const route of ["waitlist", "event", "lead", "claim", "partner"] as const) {
      expect(backendFor(route, env)).toBe("django");
    }
  });

  it("lets a per-route override win in both directions and only for its own route", () => {
    expect(backendFor("lead", { CUE_BACKEND: "firebase", CUE_BACKEND_LEAD: "django" })).toBe(
      "django"
    );
    expect(backendFor("lead", { CUE_BACKEND: "django", CUE_BACKEND_LEAD: "firebase" })).toBe(
      "firebase"
    );
    expect(backendFor("claim", { CUE_BACKEND: "django", CUE_BACKEND_LEAD: "firebase" })).toBe(
      "django"
    );
  });

  it("tolerates case and whitespace from the Vercel UI", () => {
    expect(backendFor("event", { CUE_BACKEND_EVENT: " Django " })).toBe("django");
  });

  it("ignores an unrecognised value with a warning and falls through to the next level", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(backendFor("partner", { CUE_BACKEND: "django", CUE_BACKEND_PARTNER: "on" })).toBe(
      "django"
    );
    expect(backendFor("partner", { CUE_BACKEND: "djnago" })).toBe("firebase");
    expect(warn).toHaveBeenCalledTimes(2);
  });

  it("reads process.env by default", () => {
    vi.stubEnv("CUE_BACKEND_WAITLIST", "django");
    expect(backendFor("waitlist")).toBe("django");
    expect(backendFor("lead")).toBe("firebase");
  });
});
