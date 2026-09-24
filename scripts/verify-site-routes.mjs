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
 * --write adds checks that DO create rows, and send mail: a lead (notified to
 * wherever the API host's LEAD_NOTIFY_EMAIL points) and a partner application
 * with its files (which raises a lead of its own). Everything written is named
 * "Site Verify" so it filters out of the admin; delete it afterwards.
 *
 * Exits 1 on any FAIL.
 */

const SITE = (process.env.SITE_BASE || "http://127.0.0.1:3000").replace(/\/+$/, "");
const WRITE = process.argv.includes("--write");

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

// -- WEB-2 --------------------------------------------------------------------
{
  // Refused by validation, which runs before the API's limiter: nothing is
  // written and no budget is spent. On django it also proves the key: a bad
  // one is a 401 before validation, which the route answers as 503.
  const r = await postJson("/api/lead", { name: "", email: "not-an-email" });
  answeredBy("LEAD", r);
  check(
    "lead rejects an invalid body with the form's 422",
    r.status === 422 && r.body?.error === "Name and a valid email are required.",
    `${r.status} ${JSON.stringify(r.body)}`
  );
}
if (WRITE) {
  const r = await postJson("/api/lead", {
    audience: "operator",
    source: "reach-out",
    locale: "en",
    name: "Site Verify",
    email: "site-verify@example.com",
    establishment: "verify-site-routes.mjs",
    message: "Automated smoke test - safe to delete.",
  });
  check("lead is accepted", r.status === 200 && r.body?.ok === true, `${r.status} ${JSON.stringify(r.body)}`);
}

// -- WEB-3 --------------------------------------------------------------------
// Both claim checks stop before Cloudflare is called, the IP limiter runs or
// anything is stored. Each body is also invalid on purpose: an API running
// with DEBUG and no TURNSTILE_SECRET_KEY skips the challenge entirely, and a
// valid body would then be issued a real code. A script cannot mint a token,
// so the issue and duplicate paths are a manual check: one claim by hand.
{
  const claim = {
    name: "Site Verify",
    email: "site-verify@example.com",
    phone: "+962 79 000 0000",
    locale: "en",
    source: "claim-page",
    marketingConsent: false,
  };
  const short = await postJson("/api/cue-insider/claim", { ...claim, name: "x" });
  answeredBy("CLAIM", short);
  check(
    "claim rejects a one-letter name as 422 field name",
    short.status === 422 && short.body?.error === "validation" && short.body?.field === "name",
    `${short.status} ${JSON.stringify(short.body)}`
  );
  // Turnstile runs before the email check on both backends, so this is 400
  // turnstile; a DEBUG API with no secret answers 422 email and stores nothing.
  const noToken = await postJson("/api/cue-insider/claim", { ...claim, email: "not-an-email" });
  check(
    "claim without a Turnstile token is 400 turnstile",
    noToken.status === 400 && noToken.body?.error === "turnstile",
    `${noToken.status} ${JSON.stringify(noToken.body)}`
  );
}
console.log("SKIP claim issue/duplicate (needs a real Turnstile token: submit the form by hand)");

// -- WEB-4 --------------------------------------------------------------------
// The two-step upload exists only on django, and on firebase the create call
// would write a Firestore application before every upload check failed, so
// probe with a body both backends refuse (400) before writing anything.
const partnerOn = answeredBy("PARTNER", await postJson("/api/partner-apply", []));
if (WRITE && partnerOn !== "django") {
  console.log("SKIP partner write checks (route is on firebase; the two-step upload is Django-only)");
} else if (WRITE) {
  const days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  const r = await postJson("/api/partner-apply", {
    applicationId: crypto.randomUUID().replace(/-/g, "").slice(0, 20),
    locale: "en",
    name: { en: "Site Verify" },
    area: { en: "Jabal Amman" },
    city: "Amman",
    contactName: "Site Verify",
    phone: "+962 79 000 0000",
    email: "site-verify@example.com",
    cuisineIds: ["jordanian"],
    openingHours: Object.fromEntries(days.map((d) => [d, { closed: true }])),
    notes: "verify-site-routes.mjs - automated smoke test, safe to delete.",
    consent: true,
  });
  const upload = r.body?.upload;
  check(
    "partner application is accepted with an upload ticket",
    r.status === 200 && r.body?.ok === true && typeof upload?.url === "string" && typeof upload?.token === "string",
    `${r.status} ${JSON.stringify({ ...r.body, upload: upload ? { url: upload.url, token: "<redacted>" } : upload })}`
  );
  if (upload?.url) {
    // The browser refuses the upload before it leaves the page unless this
    // site's own CSP lists the API origin the ticket points at.
    const apiOrigin = new URL(upload.url).origin;
    const csp = (await fetch(`${SITE}/en/partner/apply`, { cache: "no-store" })).headers.get("content-security-policy") ?? "";
    const connect = csp.split(";").map((d) => d.trim()).find((d) => d.startsWith("connect-src ")) ?? "";
    check(`CSP connect-src allows ${apiOrigin}`, connect.split(/\s+/).includes(apiOrigin), connect || "(no connect-src)");

    // What a browser on SITE_BASE sends before the upload. Only the API's
    // CORS settings can make this pass; it is the one route a browser calls.
    const origin = new URL(SITE).origin;
    const pre = await fetch(upload.url, {
      method: "OPTIONS",
      headers: {
        Origin: origin,
        "Access-Control-Request-Method": "POST",
        "Access-Control-Request-Headers": "x-cue-upload-token",
      },
    });
    const allowed = pre.headers.get("access-control-allow-origin");
    const headers = (pre.headers.get("access-control-allow-headers") ?? "").toLowerCase();
    const methods = (pre.headers.get("access-control-allow-methods") ?? "").toUpperCase();
    check(
      `upload preflight allows ${origin}`,
      pre.ok && (allowed === origin || allowed === "*") && headers.includes("x-cue-upload-token") && methods.includes("POST"),
      `${pre.status} allow-origin=${allowed ?? "(none)"} allow-headers=${headers || "(none)"} allow-methods=${methods || "(none)"}`
    );

    // Not a browser, so no CORS: this proves the token and the API's upload leg.
    const pdf = new Blob(["%PDF-1.4\n1 0 obj<<>>endobj\ntrailer<<>>\n%%EOF\n"], { type: "application/pdf" });
    const png = new Blob(
      [Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==", "base64")],
      { type: "image/png" }
    );
    const files = () => {
      const form = new FormData();
      form.append("menu", pdf, "menu.pdf");
      form.append("photos", png, "photo.png");
      return form;
    };
    const send = () =>
      fetch(upload.url, { method: "POST", headers: { "X-Cue-Upload-Token": upload.token }, body: files() });
    const first = await send();
    const stored = await first.json().catch(() => null);
    check(
      "upload stores the menu and photo",
      first.status === 200 && stored?.menu === true && stored?.photos === 1,
      `${first.status} ${JSON.stringify(stored)}`
    );
    const again = await send();
    const replay = await again.json().catch(() => null);
    check(
      "a second upload with the same token is refused (write-once)",
      again.status === 409 && replay?.reason === "files-already-uploaded",
      `${again.status} ${replay?.code}/${replay?.reason}`
    );
  }
}

if (!WRITE) console.log("SKIP write checks (pass --write to run them)");

console.log(failures ? `\n${failures} FAIL` : "\nall PASS");
process.exit(failures ? 1 : 0);
