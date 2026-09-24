/**
 * The application id shared by the /partner/apply form, its Storage uploads
 * and the /api/partner-apply route.
 *
 * SHAPE IS LOAD-BEARING — do not switch this to `crypto.randomUUID()`.
 * The deployed Storage rules (cue-app/storage.rules, security audit
 * 2026-08-14) gate every anonymous upload on:
 *
 *   function idOk() { return applicationId.matches('^[A-Za-z0-9]{20}$'); }
 *   match /partner-applications/{applicationId}/menu.pdf  { ... }
 *   match /partner-applications/{applicationId}/photos/{photo} { ... }
 *
 * i.e. exactly the 20-char alphanumeric shape of a Firestore auto-id, which is
 * what `doc(collection(db, ...)).id` used to mint client-side. A UUID (36
 * chars, hyphens) fails `idOk()` and every menu/photo upload would be denied.
 * So the id is still generated on the client — just without touching
 * Firestore — and the server re-checks the same shape before using it as a
 * document id. The Django API (WEB-4) checks the same shape, where the id is
 * only an idempotency key: a replay is a 409, never a second application.
 */

export const APPLICATION_ID_RE = /^[A-Za-z0-9]{20}$/;

/** Storage prefix every uploaded file for an application must live under. */
export function storagePrefix(applicationId: string): string {
  return `partner-applications/${applicationId}/`;
}

const ID_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const ID_LENGTH = 20;
// 248 = 4 * 62: rejecting the tail of the byte range keeps every character
// equally likely (256 is not a multiple of the alphabet size).
const REJECT_AT = 248;

/**
 * A cryptographically random 20-char alphanumeric id — the same ~119 bits of
 * entropy a Firestore auto-id carries, which is what the Storage rules lean on
 * when they accept an unauthenticated upload (an attacker cannot guess a real
 * application's path).
 */
export function newApplicationId(): string {
  const out: string[] = [];
  const buf = new Uint8Array(ID_LENGTH * 2);
  while (out.length < ID_LENGTH) {
    crypto.getRandomValues(buf);
    for (let i = 0; i < buf.length && out.length < ID_LENGTH; i++) {
      if (buf[i] < REJECT_AT) out.push(ID_ALPHABET[buf[i] % ID_ALPHABET.length]);
    }
  }
  return out.join("");
}

/** What /api/partner-apply answers on the Django backend: where, and with what, to upload. */
export type UploadTicket = { url: string; token: string };

/** Why the files did not land, as a partnerApply.form.errors key ("upload" = no specific copy). */
export type FilesError = "menuSize" | "photoSize" | "menuType" | "photoType" | "photoCount" | "upload";

/**
 * Second leg of the Django flow: the browser posts the files straight to the
 * API, because Vercel caps a function body at 4.5 MB. The token is the only
 * credential involved (15 minutes, this one application, this one route).
 * Uploads are write-once, so a failure is reported, never retried here.
 * Resolves null once the API stored the files, else why it did not, keyed on
 * the envelope's reason (contract 3.6). A size or type refusal is only
 * attributable when a single kind of file was sent.
 */
export async function uploadApplicationFiles(
  ticket: UploadTicket,
  menu: File | null,
  photos: File[]
): Promise<FilesError | null> {
  const body = new FormData();
  if (menu) body.append("menu", menu);
  for (const photo of photos) body.append("photos", photo);
  try {
    const res = await fetch(ticket.url, {
      method: "POST",
      headers: { "X-Cue-Upload-Token": ticket.token },
      body,
    });
    if (res.ok) return null;
    const reason = ((await res.json().catch(() => null)) as { reason?: unknown } | null)?.reason;
    console.error("[partner-apply] upload rejected:", res.status, reason);
    const only = menu && !photos.length ? "menu" : !menu ? "photo" : null;
    if (reason === "too-many-photos") return "photoCount";
    if (reason === "file-too-large" && only) return only === "menu" ? "menuSize" : "photoSize";
    if (reason === "unsupported-media-type" && only) return only === "menu" ? "menuType" : "photoType";
    return "upload";
  } catch (err) {
    // Offline, or refused by the API's CORS allow-list / this site's CSP.
    console.error("[partner-apply] upload failed:", err);
    return "upload";
  }
}

export type SubmitResult = "rate-limited" | "failed" | { filesError: FilesError | null };

/**
 * The Django flow from the form's side: submit the application to our own
 * route, then send its files straight to the API with the ticket it returns.
 * Once the route says the application is stored, the outcome is a success;
 * a file problem is reported alongside, never as a failure, because a resubmit
 * would file a second application. Throws only when the network is down.
 */
export async function submitApplication(
  application: Record<string, unknown>,
  menu: File | null,
  photos: File[]
): Promise<SubmitResult> {
  const res = await fetch("/api/partner-apply", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(application),
  });
  // The IP budget is shared with everyone behind the same address.
  if (res.status === 429) return "rate-limited";
  if (!res.ok) return "failed";
  if (!menu && !photos.length) return { filesError: null };
  const created = (await res.json().catch(() => null)) as { upload?: UploadTicket } | null;
  // Stored, but no ticket: the route answered from Firebase (this page was
  // built before a rollback), so the files have nowhere to go from here.
  if (!created?.upload) return { filesError: "upload" };
  return { filesError: await uploadApplicationFiles(created.upload, menu, photos) };
}
