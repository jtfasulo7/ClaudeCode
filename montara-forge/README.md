# Montara Forge — Lead-Gen Landing Page

**Live:** https://www.montaraforge.com (apex redirects to www) · Vercel project `montara-forge`

Single-route Next.js landing page for Meta (Facebook/Instagram) ad traffic.
Cold visitors land on `/`, complete a 5–6 step qualifying form (the hero on
mobile), and the lead is pushed straight into GoHighLevel. The form then ends on
a thank-you card promising a callback.

**There is no booking calendar.** There was one — a GoHighLevel widget shown
after submit — and it was removed deliberately; see *Why the calendar is gone*
below before adding one back.

**Stack:** Next.js 16 (App Router) · React 19 · Tailwind CSS v4 · TypeScript.
No UI libraries, no animation libraries, self-hosted fonts via `next/font`.

---

## Run it

```bash
npm install
cp .env.example .env.local   # fill in values (see below)
npm run dev                  # http://localhost:3000
npm run build && npm start   # production check
```

Without any env vars the form still works and the API route logs the lead
server-side with a loud "NOT pushed to CRM" error. It returns HTTP 200 with
`captured: false`, and the visitor gets the "call us" variant of the thank-you
card rather than a promise of a callback nobody can make.

---

## Environment variables (set in Vercel → Project → Settings → Environment Variables)

| Var | Scope | Purpose |
|---|---|---|
| `GHL_API_TOKEN` | Server only | LeadConnector API v2 token (Private Integration token or Location API key) for the Montara Forge sub-account. |
| `GHL_LOCATION_ID` | Server only | The sub-account (location) ID. |
| `NEXT_PUBLIC_META_PIXEL_ID` | Public | **Leave unset for now.** Set when the Montara Forge Meta Pixel is created → redeploy. With it unset, no pixel code renders at all. |
| `NEXT_PUBLIC_SHOW_PLACEHOLDERS` | Optional | Set to `1` to show the gallery's gray placeholder tiles in production before photos exist (off by default — section is hidden instead). |

`.env.example` documents all of these. `NEXT_PUBLIC_*` values are baked in
at build time, so changing them always requires a redeploy.

---

## Where to drop assets

| Asset | Path | Notes |
|---|---|---|
| Logo | `public/images/logo.svg` **or** `public/images/logo.png` | Either works; SVG is preferred. Until a file exists the header renders the styled "MONTARA FORGE" wordmark. Checked at build time → redeploy after adding. |
| Job photos | `public/images/jobs/job-1.jpg` … `job-6.jpg` | `jpg`, `jpeg`, `png`, or `webp`. Missing slots are skipped. |
| Before/after pairs | `public/images/jobs/job-N-before.jpg` + `job-N-after.jpg` | If both exist for a slot, that tile renders as a split before/after. |

With zero photos the gallery shows neutral placeholders in `npm run dev` and is
hidden entirely in production. Captions per slot live in
`components/sections/Gallery.tsx` (`CAPTIONS`) — edit to match the real photos.

---

## GoHighLevel integration

### Lead submission — `app/api/submit-lead/route.ts`

1. Validates/sanitizes the payload, normalizes phone to E.164.
2. **One required call:** `POST https://services.leadconnectorhq.com/contacts/upsert`
   (Version `2021-07-28`, Bearer auth) with name, phone, email, source, tags
   and custom fields.
3. Best-effort follow-up: writes the full estimate sheet as a **note** on the
   contact (the upsert endpoint has no free-text field). If the note call
   fails, the contact still exists with its tags.
4. Always returns `{ ok: true }` to the browser, even if GHL fails — the
   failure is logged with the full lead so it can be recovered from Vercel logs.

What the owner sees on every contact, with **zero** GHL configuration:

- Tag `website-lead-montara` (triggers the Workflow — see below)
- Answer tags: `project-driveway-replacement`, `tear-out-yes|no`,
  `size-medium`, `timeline-asap`, etc. (filterable in Smart Lists)
- A note formatted like a mini estimate sheet:
  ```
  PROJECT: Driveway Replacement | TEAR-OUT: Yes (replacing existing) | SIZE: Medium — ~400–1,000 sq ft | TIMELINE: ASAP | LOCATION: Cedar City 84720
  ```

### Custom fields (by key)

`CUSTOM_FIELD_KEYS` at the top of `app/api/submit-lead/route.ts` maps each
answer to a GHL custom field **key** (no IDs needed). These six Single-line
contact fields exist in the sub-account under the "Additional Info" folder:

| Field name in GHL | Key | Merge field for SMS / email |
|---|---|---|
| Project Type (Web) | `project_type_web` | `{{contact.project_type_web}}` |
| Tear-Out (Web) | `tearout_web` | `{{contact.tearout_web}}` |
| Approx Size (Web) | `approx_size_web` | `{{contact.approx_size_web}}` |
| Timeline (Web) | `timeline_web` | `{{contact.timeline_web}}` |
| Project Location (Web) | `project_location_web` | `{{contact.project_location_web}}` |
| Estimate Summary (Web) | `estimate_summary_web` | `{{contact.estimate_summary_web}}` |

If a field is renamed in GHL its key stays the same; if one is deleted, set
its entry to `""` to skip it.

### Notifications are a GHL Workflow, not code

Build a Workflow in the sub-account triggered by **Contact Tag Added →
`website-lead-montara`** that texts the owner (and optionally the lead). This
route deliberately does not send SMS/email itself.

### Why the calendar is gone

The flow used to end in the LeadConnector booking widget `REVIxrBeiG6KXr4keDf6`
(`components/BookingCalendar.tsx`, deleted — recoverable from git history).
Leads now get a callback instead of self-scheduling.

**Removing it did not touch lead capture**, and that was checked rather than
assumed: the POST to `/api/submit-lead` fires on the contact step, is awaited,
and only then does `status` become `"done"`. The calendar was purely downstream
of that state. Nothing in it fed back into the submission.

**What it DID change is the failure path, and this is the part worth
remembering.** The route used to swallow a failed CRM push and return success,
on the explicit reasoning that *"the booking widget captures their contact a
second time, so nothing is lost"*. That second capture no longer exists — the
API push is now the only one there is. So:

- `pushToGhl()` returns a **boolean**, not void. It must mean "the contact
  reached the CRM", which is why the missing-credentials branch returns `false`
  rather than just logging: that branch returns early WITHOUT throwing, so a
  try/catch alone would have called it a success.
- The route answers `{ ok: true, captured }`. Still never an error status — a
  cold lead can do nothing with a 500 — but the flag travels back.
- `ThankYou` renders a different card when `captured` is false: the phone
  number, and no promise of a call. Promising a callback for a lead we never
  saved is a lie the visitor acts on by waiting.
- The client defaults `captured` to **false** and only a good response sets it
  true, so a thrown fetch and a non-OK status land on the same honest screen.

If you put a calendar back, revert the copy with it — the hero, How It Works
step 2, `ContactStep`'s teaser and `/terms` all describe a callback now.

---

## Meta Pixel (dormant)

`lib/pixel.ts` + `components/MetaPixel.tsx`. With `NEXT_PUBLIC_META_PIXEL_ID`
unset nothing renders and every `pixel.*()` call is a no-op.

When set:

| Event | Fires when |
|---|---|
| `PageView` | On load (inline in the base snippet) |
| `Lead` | After `/api/submit-lead` returns AND reports `captured: true` — never for a lead that failed to save |
| `Contact` | Tap-to-call clicks |

`pixel.schedule()` still exists in `lib/pixel.ts` but **nothing calls it** —
it was fired by the booking widget. It is kept because `Schedule` is the right
event for a confirmed appointment and would be needed again if booking returns.
If you wire it back up, fire it on a real confirmation, never on a component
rendering.

---

## Enabling the reviews section

Montara Forge has no reviews yet, so the section is built but not rendered.

1. Open `components/sections/Reviews.tsx` and replace every placeholder entry
   in `REVIEWS` with a real, attributable review.
2. In `lib/site.ts`, set `SHOW_REVIEWS = true`.
3. Redeploy.

No star rating or review count is displayed anywhere; add those only when a
real Google rating exists.

---

## Project structure

```
app/
  layout.tsx              fonts, noindex metadata, <MetaPixel />
  page.tsx                the one route — section order = conversion argument
  globals.css             design tokens (Tailwind v4 @theme), utilities, animations
  privacy/page.tsx        privacy policy (TODO: business address + email)
  api/submit-lead/route.ts GHL upsert + note
components/
  Header / Footer / StickyBar / Logo / CallLink / icons / SectionHeading
  MetaPixel.tsx           base code (renders null when unset)
  ThankYou.tsx            success state — callback promise, or "call us" if capture failed
  ScrollToFormButton.tsx  every repeated CTA scrolls to #estimate-form
  form/LeadForm.tsx       multi-step state machine (conditional step 2)
  form/OptionStep.tsx     tap-card radio group
  form/LocationStep.tsx   soft service-area validation
  form/ContactStep.tsx    name / masked phone / email / SMS consent / honeypot
  sections/               Hero, TrustStrip, Gallery, HowItWorks, ServiceArea, SeasonCta, Reviews
lib/
  site.ts                 business constants + SHOW_REVIEWS flag
  form.ts                 option vocab shared by client + server
  service-area.ts         towns + ZIPs for the soft match
  phone.ts                US phone mask / E.164
  pixel.ts                Meta Pixel helper (no-op when unset)
```

### Design notes

- Palette: near-black `#0e0e10` base, warm bone text, a single gold accent
  `#d4a73a`. All text pairings clear WCAG AA (gold is never used on light
  surfaces; body copy is never low-contrast gray).
- Fonts: **Big Shoulders** (display) + **Barlow** (body), self-hosted.
- The hero form is the LCP element. No images above the fold, no animation
  libraries, CSS-only transitions that respect `prefers-reduced-motion`.
- Zero exits: no nav, no external links. Only `tel:` and `/privacy`.

---

## Deploy

1. Create a new Vercel project from this directory (root = `montara-forge/`).
   Framework preset: Next.js. No special build settings.
2. Add the env vars above.
3. Custom domain `montaraforge.com` is attached (GoDaddy DNS → Vercel A/CNAME);
   apex 308-redirects to `www`. Manage in **Vercel → Project → Settings → Domains**.
4. After the pixel exists, set `NEXT_PUBLIC_META_PIXEL_ID` and redeploy.

Privacy-policy contact details live in `app/privacy/page.tsx` (`BUSINESS_ADDRESS`, `CONTACT_EMAIL`).

### Vercel project settings that must stay default

In **Settings → Build and Deployment**, keep Build Command, Output Directory
and Install Command **Override = off** (Next.js defaults) and Root Directory
= `montara-forge`. The repo-root `vercel.json` belongs to `jtfasulo-website`;
if its values ever show up here as overrides, the build fails with
"No Next.js version detected".
