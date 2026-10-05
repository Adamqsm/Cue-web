/**
 * The application id the /partner/apply form sends to /api/partner-apply.
 *
 * SHAPE IS LOAD-BEARING — do not switch this to `crypto.randomUUID()`. The
 * API accepts only a 20-char alphanumeric id (APPLICATION_ID_RE) and uses it
 * as an idempotency key: a replay is a 409, never a second application. A
 * UUID (36 chars, hyphens) would be refused as invalid.
 */

export const APPLICATION_ID_RE = /^[A-Za-z0-9]{20}$/;

const ID_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const ID_LENGTH = 20;
// 248 = 4 * 62: rejecting the tail of the byte range keeps every character
// equally likely (256 is not a multiple of the alphabet size).
const REJECT_AT = 248;

/** A cryptographically random 20-char alphanumeric id (~119 bits of entropy). */
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

/** What /api/partner-apply answers: where, and with what, to upload. */
export type UploadTicket = { url: string; token: string };

/** Why the files did not land, as a partnerApply.form.errors key ("upload" = no specific copy). */
export type FilesError = "menuSize" | "photoSize" | "menuType" | "photoType" | "photoCount" | "upload";

/**
 * Second leg: the browser posts the files straight to the API, because
 * Vercel caps a function body at 4.5 MB. The token is the only credential
 * involved (15 minutes, this one application, this one route).
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
 * The partner flow from the form's side: submit the application to our own
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
  // Stored, but no ticket (the route never answers so; defensive): the files
  // have nowhere to go from here.
  if (!created?.upload) return { filesError: "upload" };
  return { filesError: await uploadApplicationFiles(created.upload, menu, photos) };
}
