# Regent Goods Wholesale & Liquidation

Marketing site for Regent Goods Wholesale & Liquidation — a cosmetics-focused
wholesale sourcing and liquidation buyer based in Bethlehem, PA. The site
positions the business to brands, liquidators, and retail stores, and routes
all inquiries through a dynamic form that forwards to GoHighLevel.

Live at: <https://regentgoodsliquidation.com>

## Stack

- **Next.js 16** (App Router, Turbopack)
- **React 19**
- **Tailwind CSS v4** (CSS-first config via `@theme`)
- **TypeScript**
- **react-hook-form + zod** (typed conditional form validation)
- **lucide-react** (icons)
- **@next/third-parties/google** (GA4)

## Local development

```bash
npm install
cp .env.example .env.local      # fill in values
npm run dev
```

Visit <http://localhost:3000>.

## Environment variables

See `.env.example`. Set the same values in Vercel for each environment
(Production / Preview / Development).

| Var | Description |
| --- | --- |
| `GHL_WEBHOOK_URL` | Inbound webhook in GoHighLevel that receives inquiry submissions. Required in production. |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | GA4 measurement ID (`G-XXXXXXXXXX`). Optional; analytics is skipped if unset. |

## Project structure

```
app/
  api/submit-inquiry/route.ts   POST endpoint, validates + forwards to GHL
  inquire/page.tsx              /inquire — dynamic conversion form
  layout.tsx                    Fonts, metadata, GA mount
  page.tsx                      Homepage (sections composed below)
  robots.ts                     Generated robots.txt
  sitemap.ts                    Generated sitemap.xml
  globals.css                   Design tokens (@theme), base styles
components/
  Nav.tsx, Footer.tsx, Logo.tsx, Container.tsx, Section.tsx, Button.tsx
  sections/                     Homepage section components
  form/                         Inquiry form + field primitives
lib/
  cn.ts                         Class-name joiner
  inquiry-schema.ts             Zod schemas + constants (file limits, MIME)
```

## Inquiry form behavior

The form on `/inquire` shows three radio options up top — Brand or Distributor,
Liquidator, Retail Store — and conditionally reveals different fields beneath
the shared identity block based on selection. Validation is per-type via a
Zod `discriminatedUnion`.

File uploads (JPG/PNG/WEBP/PDF, ≤10 MB each, ≤25 MB total) are base64-encoded
into the JSON payload sent to `/api/submit-inquiry`. The API route validates
the payload again server-side, then forwards to `GHL_WEBHOOK_URL`.

> **TODO (production scale):** Replace base64 file embedding with direct
> uploads to S3 or Vercel Blob via presigned URLs; the GHL payload should
> then contain only file URLs.

## Deployment (Vercel)

1. Connect the repo to a Vercel project.
2. In **Settings → Environment Variables**, set `GHL_WEBHOOK_URL` and
   (optionally) `NEXT_PUBLIC_GA_MEASUREMENT_ID`.
3. Point the `regentgoodsliquidation.com` domain to the Vercel project.
4. Push to `master` — Vercel auto-builds.

## Asset TODOs

- `public/og-image.jpg` — 1200×630 brand OG image (currently referenced but
  not present).
- `public/logo.png` — referenced from the JSON-LD schema; not yet uploaded.
- Replace the typographic logo placeholder in `components/Logo.tsx` when a
  real mark is provided.
- Replace placeholder dark inventory panel in `AboutSection.tsx` with real
  warehouse / inventory photography if available.

## Scripts

```bash
npm run dev     # local dev server
npm run build   # production build
npm run start   # serve production build
npm run lint    # ESLint
```
