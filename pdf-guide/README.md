# Build $10k Websites With Claude Code — PDF guide

A 100-page playbook for building production websites with Claude Code, branded in Sybago teal. Designed to be sold for $19.99 via Stripe.

## Files

- `guide.html` — the source HTML (single file, print-CSS, embeds the Sybago logo)
- `Build-10k-Websites-With-Claude-Code.pdf` — the rendered PDF (output)
- `render.js` — Puppeteer-based renderer (headless Chrome → PDF)
- `logo.png` — Sybago brand mark

## Rebuilding the PDF

After editing `guide.html`:

```bash
npm install
npm run render
```

This regenerates `Build-10k-Websites-With-Claude-Code.pdf` from the HTML.

## Brand tokens

The HTML mirrors the Sybago `:root` block from `sybago-website/index.html`:

- `--teal`     `#2F6779`  primary brand
- `--teal-b`   `#3a7d93`  accent
- `--teal-d`   `#244e5b`  deep teal
- Typography: Inter 400/500/600/700/800 + JetBrains Mono for code
- Tight headline tracking (-0.02em), wide eyebrow tracking (+0.32em uppercase)

## Structure

- Cover (1 page)
- Colophon (1 page)
- Table of Contents (1 page)
- 10 parts × ~4 chapters each = 42 chapters
- ~100 pages, US Letter
