import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { statSet } = vi.hoisted(() => ({ statSet: vi.fn() }));

vi.mock("@/lib/firebase-admin", () => ({
  getAdminDb: () => ({
    collection: () => ({ doc: () => ({ set: (...args: unknown[]) => statSet(...args) }) }),
  }),
}));

import { POST } from "../route";

const fetchMock = vi.fn();

function beacon(body: string) {
  return POST(
    new Request("https://www.cue-app.net/api/cue-insider/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    })
  );
}

const sent = () => JSON.parse(String((fetchMock.mock.calls[0][1] as RequestInit).body));

beforeEach(() => {
  fetchMock.mockReset();
  statSet.mockReset().mockResolvedValue(undefined);
  vi.stubGlobal("fetch", fetchMock);
  vi.stubEnv("CUE_API_BASE_URL", "https://api.example.test/api/v1");
  vi.stubEnv("CUE_API_KEY", "k-service");
  vi.spyOn(console, "warn").mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("POST /api/cue-insider/event on django", () => {
  beforeEach(() => vi.stubEnv("CUE_BACKEND_EVENT", "django"));

  it("forwards event + source with the service key and answers 204", async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 204 }));
    const res = await beacon(JSON.stringify({ event: "claim_view", source: "claim-page", locale: "en" }));
    expect(res.status).toBe(204);
    expect(fetchMock.mock.calls[0][0]).toBe("https://api.example.test/api/v1/insider/events");
    const init = fetchMock.mock.calls[0][1] as RequestInit;
    expect(init.method).toBe("POST");
    expect((init.headers as Record<string, string>)["X-Cue-Api-Key"]).toBe("k-service");
    // Only the two strings the API reads; locale and anything else stay behind.
    expect(sent()).toEqual({ event: "claim_view", source: "claim-page" });
    expect(statSet).not.toHaveBeenCalled();
  });

  it("lets props.source win over the top-level source", async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 204 }));
    await beacon(JSON.stringify({ event: "claim_submit", source: "nav-cta", props: { source: "claim-modal" } }));
    expect(sent()).toEqual({ event: "claim_submit", source: "claim-modal" });
  });

  it("omits a non-string source rather than forwarding it", async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 204 }));
    await beacon(JSON.stringify({ event: "claim_view", source: 7 }));
    expect(sent()).toEqual({ event: "claim_view" });
  });

  it.each([
    ["a 401 (wrong key)", () => fetchMock.mockResolvedValue(new Response(JSON.stringify({ code: "unauthenticated", reason: "invalid-service-key", message: "x", fields: null }), { status: 401 }))],
    ["a 5xx", () => fetchMock.mockResolvedValue(new Response("<html>502</html>", { status: 502 }))],
    ["a network failure", () => fetchMock.mockRejectedValue(new TypeError("fetch failed"))],
  ])("still answers 204 on %s, and says so in the log", async (_label, arrange) => {
    arrange();
    const res = await beacon(JSON.stringify({ event: "claim_view" }));
    expect(res.status).toBe(204);
    expect(console.warn).toHaveBeenCalled();
  });

  it.each([
    ["malformed JSON", "{nope"],
    ["a JSON null", "null"],
    ["a non-string event", JSON.stringify({ event: 42 })],
  ])("answers 204 without calling the API for %s", async (_label, body) => {
    const res = await beacon(body);
    expect(res.status).toBe(204);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe("POST /api/cue-insider/event with the flag unset", () => {
  it("stays on Firebase and never calls the API", async () => {
    const res = await beacon(JSON.stringify({ event: "claim_view", source: "claim-page" }));
    expect(res.status).toBe(204);
    expect(statSet).toHaveBeenCalledTimes(1);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
