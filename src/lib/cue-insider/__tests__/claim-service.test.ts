import { describe, expect, it } from "vitest";
import {
  RESEND_LIMIT,
  RESEND_RESET_MS,
  RESEND_WINDOW_MS,
  decideResend,
} from "../claim-service";

// Transactional behavior (dedupe, code collision retry, atomic index writes)
// is covered by the emulator E2E suite — here we only pin the pure resend
// policy and its exact boundaries.

const now = new Date("2026-07-31T12:00:00.000Z");
const msAgo = (ms: number) => new Date(now.getTime() - ms);

describe("decideResend", () => {
  it("resends for a fresh duplicate with no prior queued email", () => {
    expect(decideResend(0, null, now)).toBe("resend");
  });

  it("rate-limits inside the window", () => {
    expect(decideResend(0, msAgo(1), now)).toBe("rate-limited");
    expect(decideResend(2, msAgo(RESEND_WINDOW_MS - 1), now)).toBe("rate-limited");
  });

  it("allows resend at exactly the window boundary (within is strict)", () => {
    expect(decideResend(0, msAgo(RESEND_WINDOW_MS), now)).toBe("resend");
    expect(decideResend(2, msAgo(RESEND_WINDOW_MS + 1), now)).toBe("resend");
  });

  it("stops at exactly the resend limit", () => {
    expect(decideResend(RESEND_LIMIT - 1, null, now)).toBe("resend");
    expect(decideResend(RESEND_LIMIT, null, now)).toBe("resend-limit");
    expect(decideResend(RESEND_LIMIT + 1, msAgo(RESEND_WINDOW_MS * 2), now)).toBe("resend-limit");
  });

  it("limit takes precedence over the window", () => {
    expect(decideResend(RESEND_LIMIT, msAgo(1), now)).toBe("resend-limit");
  });

  it("rolls the cap over after RESEND_RESET_MS", () => {
    const hour = 60 * 60 * 1000;
    // 23h ago is still inside the rolling window — the cap holds.
    expect(decideResend(RESEND_LIMIT, msAgo(RESEND_RESET_MS - hour), now)).toBe("resend-limit");
    // 25h ago is past it — allowed, with the count restarting at 1.
    expect(decideResend(RESEND_LIMIT, msAgo(RESEND_RESET_MS + hour), now)).toBe("resend-reset");
    // Boundary is inclusive: exactly RESEND_RESET_MS resets.
    expect(decideResend(RESEND_LIMIT, msAgo(RESEND_RESET_MS), now)).toBe("resend-reset");
  });
});
