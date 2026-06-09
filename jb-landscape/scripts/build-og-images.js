// Builds branded 1200x630 Open Graph images for J.B. Landscape.
// Takes AI-generated landscaping photos, crops to OG size, and composites
// the real /logo.png on a clean white card so every image is on-brand and
// self-hosted (no Unsplash hotlinking).
//
// Usage: node scripts/build-og-images.js
// Source photos live in scripts/og-src/<name>.jpg ; outputs go to /images/og/<name>.jpg
// (homepage output is /og-image.jpg).

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const SRC_DIR = path.join(__dirname, 'og-src');
const OG_DIR = path.join(ROOT, 'images', 'og');
const LOGO = path.join(ROOT, 'logo.png');

const W = 1200, H = 630;

// name -> output path (relative to project root). "home" is special.
const OUTPUTS = {
  home: path.join(ROOT, 'og-image.jpg'),
};
const SERVICE_SLUGS = [
  'lawn-cutting', 'tree-planting-removal', 'bush-planting-trimming', 'flower-planting',
  'mulch-installation', 'cobblestone-patio', 'gravel-patio', 'lawn-seeding',
  'sod-installation', 'spring-cleanup', 'snow-removal', 'junk-removal',
];
for (const slug of SERVICE_SLUGS) OUTPUTS[slug] = path.join(OG_DIR, `${slug}.jpg`);

async function build(name, outPath) {
  const src = path.join(SRC_DIR, `${name}.jpg`);
  if (!fs.existsSync(src)) { console.warn(`SKIP ${name} — no source at ${src}`); return false; }

  // Logo card geometry (bottom-left).
  const logoH = 140;
  const logoMeta = await sharp(LOGO).metadata();
  const logoW = Math.round((logoMeta.width / logoMeta.height) * logoH);
  const pad = 26, margin = 40;
  const cardW = logoW + pad * 2, cardH = logoH + pad * 2;
  const cardX = margin, cardY = H - margin - cardH;

  // Resized logo buffer.
  const logoBuf = await sharp(LOGO).resize(logoW, logoH).png().toBuffer();

  // Overlay: soft bottom gradient for depth + white rounded card.
  const overlay = Buffer.from(`
    <svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#000000" stop-opacity="0"/>
          <stop offset="1" stop-color="#0e1b0e" stop-opacity="0.42"/>
        </linearGradient>
      </defs>
      <rect x="0" y="${H - 280}" width="${W}" height="280" fill="url(#g)"/>
      <rect x="${cardX}" y="${cardY}" width="${cardW}" height="${cardH}" rx="16" ry="16"
            fill="#ffffff" stroke="#2d6a3a" stroke-width="3"/>
    </svg>`);

  await sharp(src)
    .resize(W, H, { fit: 'cover', position: 'centre' })
    .composite([
      { input: overlay, top: 0, left: 0 },
      { input: logoBuf, top: cardY + pad, left: cardX + pad },
    ])
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(outPath);

  const kb = Math.round(fs.statSync(outPath).size / 1024);
  console.log(`OK  ${name.padEnd(24)} -> ${path.relative(ROOT, outPath)} (${kb} KB)`);
  return true;
}

(async () => {
  if (!fs.existsSync(OG_DIR)) fs.mkdirSync(OG_DIR, { recursive: true });
  const only = process.argv[2]; // optional: build a single name
  for (const [name, outPath] of Object.entries(OUTPUTS)) {
    if (only && name !== only) continue;
    await build(name, outPath);
  }
})();
