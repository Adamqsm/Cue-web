/**
 * Smoke the site's own /api routes, through whichever backend each route's
 * CUE_BACKEND* flag selects. It calls the NEXT routes, never the API directly,
 * so it checks the proxy and the browser-facing shapes together.
 *
 *   SITE_BASE=https://www.cue-app.net EXPECT_BACKEND_WAITLIST=django node scripts/verify-site-routes.mjs
 *
 * Every check says which backend answered (a Django answer carries
 * X-Cue-Backend: django). EXPECT_BACKEND (every route) or
 * EXPECT_BACKEND_<WAITLIST|EVENT|LEAD|CLAIM|PARTNER> (one route) turns a
 * mismatch into a FAIL: after a flag flip, name the route you flipped, since
 * a Vercel env change only lands with a redeploy and a typo'd value quietly
 * means firebase. The event beacon always answers 204, so on django its
 * X-Cue-Event header is what proves CUE_API_KEY works.
 *
 * The default run stores nothing and moves no counter: the beacon sends an
 * event neither backend counts, and every other default check is refused by
 * validation before anything is written or rate limited.
 *
 * Exits 1 on any FAIL.
 */

const SITE = (process.env.SITE_BASE || "http://127.0.0.1:3000").replace(/\/+$/, "");

let failures = 0;
function check(label, ok, detail = "") {
  console.log(`${ok ? "PASS" : "FAIL"} ${label}${detail ? ` - ${detail}` : ""}`);
  if (!ok) failures++;
}

/** Report (and, with EXPECT_BACKEND*, enforce) which backend answered. */
function answeredBy(route, res) {
  const got = res.headers.get("x-cue-backend") === "django" ? "django" : "firebase";
  const want = process.env[`EXPECT_BACKEND_${route}`] || process.env.EXPECT_BACKEND;
  check(`${route.toLowerCase()} answered by ${got}`, !want || want === got, want ? `expected ${want}` : "");
  return got;
}

async function call(path, init = {}) {
  const res = await fetch(`${SITE}${path}`, { cache: "no-store", ...init });
  const text = await res.text();
  let body = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }
  return { status: res.status, headers: res.headers, body };
}

const postJson = (path, body) =>
  call(path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });

// -- WEB-1 --------------------------------------------------------------------
{
  const r = await call("/api/waitlist-count");
  answeredBy("WAITLIST", r);
  check(
    "waitlist-count answers a display number",
    r.status === 200 && Number.isInteger(r.body?.count) && r.body.count >= 50,
    `${r.status} ${JSON.stringify(r.body)}`
  );
  check("waitlist-count is no-store", /no-store/.test(r.headers.get("cache-control") ?? ""));
}
{
  // Not an event either backend counts, so no funnel number moves.
  const r = await postJson("/api/cue-insider/event", { event: "site_verify" });
  check("event beacon answers 204", r.status === 204, String(r.status));
  if (answeredBy("EVENT", r) === "django") {
    check(
      "event reached the API with a working service key",
      r.headers.get("x-cue-event") === "forwarded",
      `X-Cue-Event: ${r.headers.get("x-cue-event")} (dropped = see "[cue-insider/event] not recorded" in the logs)`
    );
  }
}

console.log(failures ? `\n${failures} FAIL` : "\nall PASS");
process.exit(failures ? 1 : 0);
