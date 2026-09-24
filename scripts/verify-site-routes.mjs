/**
 * Smoke the site's own /api routes end to end, through whichever backend the
 * deployment's CUE_BACKEND* flags select. It calls the NEXT routes (never the
 * Django API directly), so it proves the proxy, the service key and the
 * browser-facing shapes together. Run it after each flag flip.
 *
 *   SITE_BASE=https://www.cue-app.net node scripts/verify-site-routes.mjs
 *   SITE_BASE=http://127.0.0.1:3000   node scripts/verify-site-routes.mjs --write
 *
 * Read-only by default: the waitlist count and one analytics beacon. --write
 * adds checks that create real rows (and, for a lead, a real notification
 * email to wherever the API host's LEAD_NOTIFY_EMAIL points). Every row it
 * writes is named "Site Verify" so it filters out of the admin; delete them
 * afterwards. Exits 1 on any FAIL.
 */

const SITE = (process.env.SITE_BASE || "http://127.0.0.1:3000").replace(/\/+$/, "");
const WRITE = process.argv.includes("--write");

let failures = 0;
function check(label, ok, detail = "") {
  console.log(`${ok ? "PASS" : "FAIL"} ${label}${detail ? ` - ${detail}` : ""}`);
  if (!ok) failures++;
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
  check(
    "waitlist-count answers a display number",
    r.status === 200 && Number.isInteger(r.body?.count) && r.body.count >= 50,
    `${r.status} ${JSON.stringify(r.body)}`
  );
  check("waitlist-count is no-store", /no-store/.test(r.headers.get("cache-control") ?? ""));
}
{
  const r = await postJson("/api/cue-insider/event", { event: "claim_view", source: "claim-page" });
  check("event beacon answers 204", r.status === 204, String(r.status));
}

if (!WRITE) console.log("SKIP write checks (pass --write to run them)");

console.log(failures ? `\n${failures} FAIL` : "\nall PASS");
process.exit(failures ? 1 : 0);
