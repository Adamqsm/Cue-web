# Privacy Policy: proposed updates (draft for counsel)

Draft 1, 4 October 2026. **Not published.** Nothing in this file is on the website: the live page
`/en/legal/privacy` and `/ar/legal/privacy` (text in `src/i18n/content/en.ts` and `ar.ts`, key
`legal.privacy`) is unchanged. Every item marked **TO CONFIRM** needs a decision by Adam Qasem or
by counsel before any of this is published.

Prepared from the code as it stands on 4 October 2026: Cue-web `main` eab4189 plus the
delete-account page (PR "Add the public /delete-account page"), cue-backend `main` cbb0a17 and
cue-app `main` 92d533c. Nothing was read from the production server.

The full privacy notice for the app is drafted separately in the cue-app repository,
`docs/legal/privacy-notice-en.md` and `privacy-notice-ar.md` (Draft 1, 3 October 2026). This file
does not repeat it. It lists what the **published website policy** gets wrong or leaves out today
and proposes replacement text for those sections, consistent with that notice.

## Recommendation

Publish **one** privacy policy that covers the app and the website, at the existing address
`/legal/privacy`, because the app stores and the website footer both point there. Build it from
the app notice (Draft 1) plus the website-only items in section 4 below. The alternative, two
policies, means two documents to keep in step and two sets of store links.

## 1. Gaps in the published policy

| Published section | What it says today | Problem |
| --- | --- | --- |
| 1. Data We Collect | "Account data: name, email, and optional phone number." | A mobile number is **required** for every new account and is verified by text message. |
| 1. Data We Collect | "Technical data: limited device and usage information" | Does not mention push tokens, device platform and language, IP addresses used for abuse protection, or crash reports. |
| 2. How We Use Data | Four general purposes | No text message verification, push notifications or live updates. |
| 4. Sharing of Data | "trusted service providers (such as hosting and communications)" | No provider is named. **Twilio** (text message codes) and **Sentry** (error reports) are not mentioned at all, and neither are the others in section 3 below. |
| 5. Data Retention & Security | "only for as long as necessary" | No periods. The API already enforces some (section 5 below). |
| 6. Your Rights | "contact us using the details in our Legal Notice" | The Legal Notice gives no address, only the Get Started form. |
| (missing) | | No section on **deleting an account**, which both app stores require the policy to explain. |
| 7. Cross-Border Transfers | General statement | Hosting is in Frankfurt **[TO CONFIRM]**; most processors are in the United States or the EU. No transfer mechanism is named. |
| 8. Children | "intended for users aged 18 and over. We do not knowingly collect data from children without appropriate consent." | "Without appropriate consent" implies a minor may use Cue with a parent's consent. The Terms now say 18 and over with no exception (section 2 of the Terms, changed in the same PR as this draft). |
| (whole policy) | "Cue", "we" | The controller is not named (Adam Qasem trading as Cue, or ADAM QASEM PORTAL L.L.C: **TO CONFIRM**). |

## 2. Proposed replacement text (English)

Arabic follows once counsel approves the English. The section numbers are the proposed new
numbering.

### 1. Who we are

Cue is a restaurant reservation service for Amman, Jordan, provided through the Cue mobile app and
the website www.cue-app.net. In this policy "Cue", "we" and "us" mean **[controller: TO CONFIRM]**,
which decides how your personal data is used. Privacy questions and requests:
**[info@cue-app.net: TO CONFIRM]**.

### 2. The data we collect

**Account.** Your name, email address, mobile number, password (stored only as a one-way hash),
preferred language and notification choice. If you sign in with Google or Apple, we receive an
identifier for that account and the email address and name it shares with us.

**Mobile number.** Every new account needs a mobile number, confirmed by a text message code
before it is saved (section 4).

**Bookings.** The venue, date and time, party size, the guest name and phone given for the booking,
any occasion, special requests and preferred table, and the booking's status history.

**Saved venues, venue teams and notifications.** The venues you save; your role at a venue if you
join its team; the notifications we send you and whether you have read them.

**Devices.** For each signed-in device: a push token, the platform (Android or iOS), the device
language, the app version and when it last connected.

**Technical data.** Our servers process your IP address to protect the service against abuse. Error
reports from our servers, and crash reports from the app **[TO CONFIRM: whether crash reporting is
switched on in the released app]**, contain technical details of the fault but not your name, email
address or mobile number.

**Website forms.** What you type into the website's forms: the waitlist and contact form, the Cue
Insider early-access claim form, and the partner application form (including any photos you
upload).

We do not collect your location, contacts or calendar. The app has no advertising or analytics
software and we do not track you across other companies' apps or websites.

### 3. How we use it

To create and secure your account; to send your booking request to the venue and show you its
status; to let the venue contact you about the booking; to send you notifications about your
bookings and venue invitations; to keep the app up to date while it is open; to let venue teams
manage their venue; to answer the website forms; to protect the service against fraud and abuse;
to fix faults; and to meet our legal obligations. We do not sell personal data and we do not use it
for advertising.

Legal bases: **[TO CONFIRM; the app notice, section 4, proposes one per use]**.

### 4. Text message (SMS) verification

When you create an account, sign in with your mobile number or add a number to your account, we
send a one-time code to that number by text message, using **Twilio Verify**. Twilio receives
your mobile number and your language and tells us whether the code you entered is correct; Cue
does not store the code. For each code we keep the number, when the code was requested, how many
attempts were made, whether it was used, and a salted one-way hash of the IP address that asked for
it, so that we can limit repeated requests. Codes expire after five minutes and allow five
attempts. These records are kept for **[TO CONFIRM; no period is set today]**.

### 5. Push notifications

After you sign in, the app asks whether it may send you notifications. If you allow it, we register
your device's push token with our server and deliver notifications through **Google Firebase Cloud
Messaging** (on iPhone and iPad, through the **Apple Push Notification service**). A notification
holds its title and text and the identifiers of the booking it is about, not your name or phone.
You can switch notifications off in your device settings at any time. Signing out or deleting your
account deletes the token from our server.

### 6. Live updates

While you are signed in and the app is open, it keeps a secure connection to our server so that
changes to your bookings, notifications and account appear without refreshing. The connection
uses your existing sign-in, carries only data you could otherwise load in the app, and closes when
you sign out or close the app.

### 7. Who receives your data

**The venue you book with** receives the booking details it needs to seat you and to contact you.
Venue teams see your account email address and mobile number only if you accept an invitation to
join their team.

**Service providers** process data on our instructions only. See the table in section 3 of this
draft (the policy reproduces it).

We may also disclose data where the law requires it.

### 8. International transfers

Our servers are hosted by DigitalOcean in **[Frankfurt, Germany: TO CONFIRM]**. Our providers may
process data in **[the United States and the European Union: TO CONFIRM per provider]**. Where data
leaves Jordan, we rely on **[transfer mechanism: TO CONFIRM]**.

### 9. How long we keep data

The table in section 5 of this draft. Every period is **TO CONFIRM**.

### 10. Deleting your account

You can delete your account at any time in the app: open the **Profile** tab and tap **Delete
account**. Deletion takes effect at once and signs you out on every device. If you can't use the
app, email **[info@cue-app.net: TO CONFIRM]** and we will delete it for you after confirming the
account is yours, within **[30 days: TO CONFIRM]**. Full details, including what we delete and what
we keep, are at **www.cue-app.net/en/delete-account**.

When an account is deleted we remove its name, email address, mobile number, password, profile
photo, Google and Apple sign-in links, push tokens, venue team roles and invitations, and end every
session. Bookings stay with the venues as their record, including the guest name and phone given on
each booking, which are removed **[24 months after the reservation time: TO CONFIRM]**. You can ask
us to erase what remains. **[TO CONFIRM: saved venues and the notifications list are also removed;
today they are kept (see section 6, item 2).]**

### 11. Your rights

Subject to the applicable law, you may ask for a copy of your personal data, and ask us to correct
or delete it, restrict or object to its use, or withdraw consent where we rely on it. Write to
**[info@cue-app.net: TO CONFIRM]**. We answer within **[TO CONFIRM]** days. You may also complain to
**[the competent data protection authority: TO CONFIRM]**.

### 12. Children

Cue is only for people aged 18 and over. We do not knowingly collect personal data from anyone under
18. If you believe someone under 18 has given us personal data, contact us and we will delete it.

### 13. Changes

We will update this policy when our practices change and tell you in the app before a material
change takes effect.

## 3. Processors

The published policy names none. Proposed table:

| Provider | Purpose | Data | Location |
| --- | --- | --- | --- |
| DigitalOcean | Hosting of the API servers and database | Everything the API stores | **[Frankfurt: TO CONFIRM]** |
| **Twilio** (Verify) | Text message verification codes | Mobile number, language | **TO CONFIRM** |
| **Sentry** | Error reports from the API servers, and crash reports from the app when switched on | Technical error data; the user appears only as an internal number; email addresses and phone numbers are masked before sending | **TO CONFIRM** |
| Google (Firebase Cloud Messaging) | Push notification delivery | Push token, notification content | **TO CONFIRM** |
| Apple (Push Notification service, Sign in with Apple) | iOS notification delivery and sign-in | Push payload; Apple sign-in token | **TO CONFIRM** |
| Google (Google Sign-In) | Sign-in | Google sign-in token | **TO CONFIRM** |
| Resend | Sending email (password reset, Cue Insider codes, form notifications) | Email address, message content | **TO CONFIRM** |
| Vercel | Hosting of the website | Requests to the website, including IP address, and the website forms in transit to the API | **TO CONFIRM** |
| Cloudflare (Turnstile) | Bot check on the Cue Insider claim form | Browser and device signals, IP address | **TO CONFIRM** |

Sentry facts, from the code: the API sends errors only when a DSN is configured (production
settings), with `send_default_pii=False` and a `before_send` scrubber
(`apps/core/logging.py`). The app turns Sentry on only in builds that set `SENTRY_DSN`
(`codemagic.yaml`), with no PII, no tracing and no screenshots. **TO CONFIRM** whether the release
builds set it, and Sentry's retention period.

## 4. Website-only items

1. **Consent banner.** The site's first-visit banner says it uses "essential cookies and similar
   technologies". The Cookie Policy also lists "Performance" cookies; no analytics script is in the
   code today. **TO CONFIRM** whether the Performance category should stay.
2. **Cloudflare Turnstile** and **Vercel** are not mentioned anywhere in the published policy
   (section 3 table above).
3. **Legal Notice, section 2 (Contact)** sends legal and privacy matters to the Get Started form.
   Once a privacy address is chosen, it should appear there too.
4. When the new policy is published, bump `CONSENT_VERSION` in `src/components/ConsentBanner.tsx`
   so returning visitors see the banner again (its comment asks for this on a substantive change).

## 5. Retention periods (all TO CONFIRM)

Periods marked "in code" are the `RETENTION_*` settings in cue-backend
`cue_api/settings/base.py`, enforced nightly at 04:30 Amman by `core.retention_sweep`. They are
defaults nobody has confirmed. The sweep first removes something around 28 December 2026 (mail rows
at 90 days), so these need confirming before then.

| Data | Period | Source |
| --- | --- | --- |
| Account data | Until the account is deleted | Behaviour of the API |
| Deleted-account record (internal number, role, dates; no name, email or phone) | None set | |
| Guest name and phone on a booking | 24 months after the reservation time | In code |
| Other booking details, special requests, status history | None set | |
| Saved venues, notifications list | None set; kept after deletion today | |
| Text message verification records | None set | |
| Push tokens | Until sign-out, deletion, or the token stops working | Behaviour of the API |
| Copies of emails sent | 90 days after sending | In code |
| Cue Insider claims | Unredeemed: anonymised 24 months after issue. Redeemed: name and phone removed 12 months after the entitlement ends | In code |
| Website contact and waitlist submissions (leads) | Anonymised 12 months after arrival | In code |
| Rejected partner applications | Files removed after 6 months, contact details after 12 | In code |
| Database backups | 7 days | Backup job |
| Server logs | Rotated by size, normally a few days | Server configuration |
| Error and crash reports (Sentry) | Sentry's retention | **TO CONFIRM** |

## 6. Open points for Adam and counsel

1. **Controller** and **privacy contact address**. The delete-account page uses info@cue-app.net
   (Adam's instruction, 4 October 2026); the app notice draft has support@cue-app.net. Pick one and
   use it everywhere.
2. **Saved venues and notifications survive deletion** (bug B1). The app's deletion dialog says
   saved venues are removed. Either the API deletes them at deletion (recommended) or the dialog,
   the delete-account page and this policy say they are kept.
3. **Sign in with Apple token revocation** at deletion is not implemented (bug B2, register item
   R5). The policy should not promise it until it is.
4. **Email deletion requests**: the proposed answer time (30 days) and how the account holder
   proves the account is theirs.
5. **Legal bases**, **transfer mechanism**, **supervisory authority**, and whether laws beyond
   Jordan's PDPL apply (UAE entity, EU visitors).
6. Every period in section 5.
