# Concrete / Paving — Client Landing Page Template

**Read this first before working on any client instance.**

## What this is

A reusable, per-client landing page **template** for Sybago's concrete/paving
contractor clients (NOT for Sybago itself). Each client gets their **own
instance** (their own copy of this project, their own deploy). It's where the
client's Meta ad traffic lands, and its one job is converting homeowners into
**estimate requests + booked estimates**.

Stack: **Vite + React 18**, plain CSS, zero UI libraries. Mobile-first —
assume ~90% of traffic is phones in the Meta/Instagram in-app browser.

## The one file you edit per client: `src/client.config.js`

Every client-specific value lives in `src/client.config.js`. **Nothing
client-specific is hardcoded anywhere else.** It exports a single `config`
object:

| Key | What it is |
|---|---|
| `businessName`, `city`, `serviceArea`, `yearEstablished` | Identity / trust copy |
| `googleRating`, `reviewCount`, `licenseNumber` | Trust strip (`licenseNumber` optional — `''` hides it) |
| `phone` | Tracked number (shown + `tel:` linked) |
| `reviews` | Array of `{ stars, text, name }` (2–3 shown) |
| `projectPhotos` | Array of image paths under `/public` (3–4 shown) |
| `ghlCalendarEmbedUrl` | Client's GHL booking widget (Step 5 iframe) |
| `ghlWebhookUrl` | Where the Step-4 lead payload is POSTed |
| `primaryColor`, `accentColor` | Per-client theming (accents only — never layout) |
| `logoPath` | Logo under `/public` |

Placeholders contain `REPLACE_ME` — the app detects those and skips
the real POST / shows a calendar placeholder, so the template runs standalone.

## The form flow (`src/components/MultiStepForm.jsx`)

One question per screen; tapping a tile auto-advances with a flip transition.
Progress shows "Step N of 4". Back navigation is allowed and **retains all
entered data** (state is plain React `useState` — **no localStorage/
sessionStorage**, which aren't available in this environment).

1. **What's your project?** — tap tiles (Driveway / Patio / Stamped / Walkway / Other)
2. **When?** — tap tiles (ASAP / Next month or two / This season / Just planning)
3. **Where?** — ZIP or city + Continue
4. **Contact** — Name, Phone, **required** consent checkbox → "Get My Free Estimate"
5. **Booking flip** — GHL calendar embed (`ghlCalendarEmbedUrl`)

### ⚠️ CRITICAL SEQUENCING — do not reorder

On **Step 4 submit**, the full lead payload (all answers + name + phone +
consent + timestamp) is **POSTed to `ghlWebhookUrl` FIRST, then** the UI flips
to Step 5 (the calendar). The lead must be captured **even if the visitor
never books** — the capture and the booking are two separate events, in that
order. See `src/lead.js` (`submitLead`) and `handleSubmit` in
`MultiStepForm.jsx`:

- `submitLead` POSTs a `text/plain` body (skips the CORS preflight GHL inbound
  webhooks don't answer), `keepalive: true`, with an 8s timeout.
- `handleSubmit` does `await submitLead(...)` inside `try`, and advances to
  Step 5 in `finally` — so a POST failure is logged but **still advances**.
- Verified: on submit, the webhook received the full payload before the flip;
  and with the webhook unreachable, the form still advanced.

## Spin up a new client instance

1. **Duplicate this whole folder** → `concrete contractors/<client-slug>/`
   (or a new repo).
2. Edit **every** value in `src/client.config.js`.
3. Drop the client's photos into `public/photos/` and list them in
   `projectPhotos`. Replace `public/logo-placeholder.svg` (or point `logoPath`
   at the client's logo).
4. Paste the client's **GHL calendar embed URL** (`ghlCalendarEmbedUrl`) and
   **inbound-webhook URL** (`ghlWebhookUrl`).
5. Set `primaryColor` / `accentColor` to the client's brand.
6. `npm install` → `npm run dev` to preview → deploy (Vercel auto-detects Vite).

## What stays manual per client

- Real **project photos** (placeholders ship in `public/photos/`).
- Real **reviews** (`reviews` array).
- **GHL IDs**: `ghlCalendarEmbedUrl` + `ghlWebhookUrl` (both `REPLACE_ME` until set).
- Tracked **phone** number and **colors/logo**.

## Commands

```
npm install     # once
npm run dev     # local dev (http://localhost:5173)
npm run build   # production build -> dist/
npm run preview # preview the production build
```

## Files

```
src/client.config.js            ← THE per-client config (edit this)
src/lead.js                     ← submitLead(): Step-4 POST, fires before the flip
src/App.jsx                     ← page + theming; Sections 2–6 (trust, photos, how, reviews, CTA, footer)
src/components/MultiStepForm.jsx← Steps 1–5, state, flip, progress, back, critical submit sequence
src/styles.css                  ← mobile-first, themed via --primary/--accent
public/logo-placeholder.svg     ← replace per client
public/photos/work-1..4.svg     ← replace per client
```
