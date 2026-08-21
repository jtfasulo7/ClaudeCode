# Montara Forge — Lead-Gen Landing Page

Single-route Next.js landing page for Meta (Facebook/Instagram) ad traffic.
Cold visitors land on `/`, complete a 5–6 step qualifying form (the hero on
mobile), and immediately book an on-site estimate in an embedded GoHighLevel
calendar. The lead is captured in GHL **before** the calendar shows.

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

Without any env vars the page is fully functional: the form works, the API
route logs the lead server-side (with a loud "NOT pushed to CRM" error) and
still returns success, and the visitor reaches the calendar.

---

## Environment variables (set in Vercel → Project → Settings → Environment Variables)

| Var | Scope | Purpose |
|---|---|---|
| `GHL_API_TOKEN` | Server only | LeadConnector API v2 token (Private Integration token or Location API key) for the Montara Forge sub-account. |
| `GHL_LOCATION_ID` | Server only | The sub-account (location) ID. |
| `NEXT_PUBLIC_META_PIXEL_ID` | Public | **Leave unset for now.** Set when the Montara Forge Meta Pixel is created → redeploy. With it unset, no pixel code renders at all. |
| `NEXT_PUBLIC_DEBUG_GHL_MESSAGES` | Dev only | Set to `1` locally to log every `postMessage` from the booking iframe (used to verify the Schedule event — see below). |
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

### ✅ TODO — custom field IDs

At the top of `app/api/submit-lead/route.ts`, `CUSTOM_FIELD_IDS` holds
placeholder IDs (`TODO_CUSTOM_FIELD_ID_…`). Create these custom fields in the
sub-account (Settings → Custom Fields), then paste each field's ID:

| Key | Suggested field name | Type |
|---|---|---|
| `projectType` | Project Type | Text / dropdown |
| `newOrReplacement` | New or Replacement | Text / dropdown |
| `sizeRange` | Approx. Size | Text / dropdown |
| `timeline` | Timeline | Text / dropdown |
| `location` | Project Location | Text |
| `estimateSummary` | Estimate Summary | Large text |

Any entry still starting with `TODO` is skipped automatically, so the route
works before this is done.

### Notifications are a GHL Workflow, not code

Build a Workflow in the sub-account triggered by **Contact Tag Added →
`website-lead-montara`** that texts the owner (and optionally the lead). This
route deliberately does not send SMS/email itself.

### Booking calendar

The post-submit calendar is the LeadConnector booking widget
`REVIxrBeiG6KXr4keDf6`, loaded via `link.msgsndr.com/js/form_embed.js`
(`components/BookingCalendar.tsx`). The widget auto-resizes the iframe on
mobile via postMessage; a 640px min-height keeps the card from collapsing
before the script runs.

---

## Meta Pixel (dormant)

`lib/pixel.ts` + `components/MetaPixel.tsx`. With `NEXT_PUBLIC_META_PIXEL_ID`
unset nothing renders and every `pixel.*()` call is a no-op.

When set:

| Event | Fires when |
|---|---|
| `PageView` | On load (inline in the base snippet) |
| `Lead` | After `/api/submit-lead` returns — i.e. once the lead is captured, **not** on calendar render |
| `Schedule` | When the booking iframe posts a booking-confirmation message |
| `Contact` | Tap-to-call clicks |

**TODO — verify the Schedule trigger.** The booking widget's confirmation
`postMessage` shape is undocumented. `BookingCalendar.tsx` uses a conservative
detector (message type mentions *booking/appointment* **and**
*confirm/success/booked/complete*). To verify: run locally with
`NEXT_PUBLIC_DEBUG_GHL_MESSAGES=1`, complete a test booking, read the console
log of iframe messages, and tighten `looksLikeBookingConfirmation()` to the
exact string. It is guaranteed **not** to fire merely because the calendar
rendered.

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
  BookingCalendar.tsx     success state + GHL widget + Schedule listener
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
3. Attach the custom domain in **Vercel → Project → Settings → Domains**
   and point DNS as Vercel instructs.
4. After the pixel exists, set `NEXT_PUBLIC_META_PIXEL_ID` and redeploy.

Before launch, fill in the two `TODO`s in `app/privacy/page.tsx`
(`BUSINESS_ADDRESS`, `CONTACT_EMAIL`).

### Vercel project settings that must stay default

In **Settings → Build and Deployment**, keep Build Command, Output Directory
and Install Command **Override = off** (Next.js defaults) and Root Directory
= `montara-forge`. The repo-root `vercel.json` belongs to `jtfasulo-website`;
if its values ever show up here as overrides, the build fails with
"No Next.js version detected".
