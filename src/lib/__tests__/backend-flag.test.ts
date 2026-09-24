import { afterEach, describe, expect, it, vi } from "vitest";
import { answerFrom, backendFor } from "../backend-flag";

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

  it("treats an empty per-route value (the .env.example shape) as unset, silently", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(backendFor("lead", { CUE_BACKEND: "django", CUE_BACKEND_LEAD: "" })).toBe("django");
    expect(backendFor("lead", { CUE_BACKEND: "", CUE_BACKEND_LEAD: "  " })).toBe("firebase");
    expect(warn).not.toHaveBeenCalled();
  });

  it("pins firebase on an unrecognised value at either level, with a warning", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    // A typo in a per-route pin must never leave the route on Django.
    expect(backendFor("partner", { CUE_BACKEND: "django", CUE_BACKEND_PARTNER: "firebsae" })).toBe(
      "firebase"
    );
    expect(backendFor("partner", { CUE_BACKEND: "djnago" })).toBe("firebase");
    // ...but a valid per-route value still wins over a broken global one.
    expect(backendFor("lead", { CUE_BACKEND: "djnago", CUE_BACKEND_LEAD: "django" })).toBe("django");
    expect(warn).toHaveBeenCalledTimes(2);
  });

  it("reads process.env by default", () => {
    vi.stubEnv("CUE_BACKEND", undefined);
    vi.stubEnv("CUE_BACKEND_LEAD", undefined);
    vi.stubEnv("CUE_BACKEND_WAITLIST", "django");
    expect(backendFor("waitlist")).toBe("django");
    expect(backendFor("lead")).toBe("firebase");
  });
});

describe("answerFrom", () => {
  afterEach(() => vi.unstubAllEnvs());

  const handlers = () => ({
    firebase: vi.fn(() => new Response("fb", { status: 200 })),
    django: vi.fn(async () => new Response("dj", { status: 201 })),
  });

  it("runs only the Firebase handler, untouched, when the route is on firebase", async () => {
    const h = handlers();
    const res = await answerFrom("lead", h);
    expect(await res.text()).toBe("fb");
    expect(res.headers.get("x-cue-backend")).toBeNull();
    expect(h.django).not.toHaveBeenCalled();
  });

  it("runs only the Django handler and tags its answer when the route is on django", async () => {
    vi.stubEnv("CUE_BACKEND_LEAD", "django");
    const h = handlers();
    const res = await answerFrom("lead", h);
    expect(res.status).toBe(201);
    expect(await res.text()).toBe("dj");
    expect(res.headers.get("x-cue-backend")).toBe("django");
    expect(h.firebase).not.toHaveBeenCalled();
  });
});
