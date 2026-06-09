import { chromium } from 'playwright';
import { writeFileSync } from 'fs';

const OUT = 'C:/Users/jtfas/OneDrive/Documents/ClaudeCode/shopify-agent/generated_imgs';

const browser = await chromium.launch({
  headless: false,
  args: ['--disable-blink-features=AutomationControlled']
});
const context = await browser.newContext({
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  viewport: { width: 1920, height: 1080 }
});
await context.addInitScript(() => { Object.defineProperty(navigator, 'webdriver', { get: () => false }); });
const page = await context.newPage();

// Dismiss any popups automatically
page.on('dialog', dialog => dialog.dismiss());

await page.goto('https://www.aliexpress.com/item/3256810127456036.html', {
  waitUntil: 'domcontentloaded', timeout: 30000
});
await page.waitForTimeout(8000);

// Dismiss cookie/notification popups by clicking common dismiss buttons
try {
  const dismissSelectors = ['[class*="close"]', '[class*="dismiss"]', 'button[aria-label="Close"]', '[class*="cookie"] button'];
  for (const sel of dismissSelectors) {
    const btn = await page.$(sel);
    if (btn) { await btn.click(); await page.waitForTimeout(500); }
  }
} catch(e) {}

// Wait for product gallery to fully load
await page.waitForTimeout(3000);

// Find the main product image gallery - look for the large displayed image
const mainImageSrc = await page.evaluate(() => {
  // Find the largest product image on screen
  let best = null;
  let maxArea = 0;
  document.querySelectorAll('img').forEach(img => {
    const area = img.naturalWidth * img.naturalHeight;
    if (area > maxArea && img.src.includes('alicdn.com/kf/') && img.offsetWidth > 300) {
      maxArea = area;
      best = img;
    }
  });
  return best ? { src: best.src, width: best.naturalWidth, height: best.naturalHeight } : null;
});

console.log('Main image:', mainImageSrc);

// Find all gallery thumbnail elements
const thumbElements = await page.$$('img[class*="thumb"], [class*="gallery"] img, [class*="slider"] img, [class*="pic-rater"] img');
console.log('Thumb elements found: ' + thumbElements.length);

// Also try finding by the image gallery container
const galleryImages = await page.evaluate(() => {
  const results = [];
  // AliExpress uses various gallery selectors
  const gallery = document.querySelector('[class*="image-view"], [class*="gallery"], [class*="pic-rater-Image"]');
  if (gallery) {
    gallery.querySelectorAll('img').forEach(img => {
      if (img.src.includes('alicdn.com') && img.naturalWidth > 50) {
        results.push({ src: img.src, w: img.naturalWidth, h: img.naturalHeight, display: img.offsetWidth + 'x' + img.offsetHeight });
      }
    });
  }

  // Also get ALL product images including in the scrollable thumbnail strip
  document.querySelectorAll('[class*="slider"] img, [class*="thumbnail"] img').forEach(img => {
    if (img.src.includes('alicdn.com/kf/') && img.naturalWidth >= 40) {
      results.push({ src: img.src, w: img.naturalWidth, h: img.naturalHeight, context: 'thumb-strip' });
    }
  });
  return results;
});

console.log('Gallery images: ' + galleryImages.length);
galleryImages.forEach((g, i) => console.log('  ' + (i+1) + '. ' + g.src.substring(0, 80) + ' | ' + g.w + 'x' + g.h));

// Strategy: Click each thumbnail, wait, then screenshot JUST the main image area
// First find the main image display area
const mainImageEl = await page.$('img[class*="magnifier"], img[class*="main-image"], [class*="image-view"] img');

// Get all thumbnail-like small images in the gallery strip
const thumbs = await page.$$('[class*="slider"] img[src*="alicdn.com/kf/"]');
console.log('\nClickable thumbs: ' + thumbs.length);

const capturedImages = [];
for (let i = 0; i < Math.min(thumbs.length, 10); i++) {
  try {
    await thumbs[i].click();
    await page.waitForTimeout(2000);

    // Now find the currently displayed large image
    const currentLarge = await page.evaluate(() => {
      let best = null;
      let maxW = 0;
      document.querySelectorAll('img[src*="alicdn.com/kf/"]').forEach(img => {
        if (img.offsetWidth > maxW && img.offsetWidth > 200) {
          maxW = img.offsetWidth;
          best = { src: img.src, w: img.naturalWidth, h: img.naturalHeight, displayW: img.offsetWidth };
        }
      });
      return best;
    });

    if (currentLarge && !capturedImages.includes(currentLarge.src)) {
      capturedImages.push(currentLarge.src);

      // Download the image directly
      const imgUrl = currentLarge.src.replace(/_\d+x\d+/, ''); // Remove size constraints
      try {
        const resp = await fetch(imgUrl);
        if (resp.ok) {
          const buf = Buffer.from(await resp.arrayBuffer());
          if (buf.length > 10000) {
            writeFileSync(OUT + '/clean-img-' + capturedImages.length + '.jpg', buf);
            console.log('Saved clean-img-' + capturedImages.length + '.jpg (' + Math.round(buf.length/1024) + 'KB, ' + currentLarge.w + 'x' + currentLarge.h + ')');
          } else {
            // Try .jpg extension variants
            for (const ext of ['.jpg', '.png', '.webp']) {
              const altUrl = imgUrl.replace(/\.\w+$/, ext);
              const r2 = await fetch(altUrl);
              if (r2.ok) {
                const b2 = Buffer.from(await r2.arrayBuffer());
                if (b2.length > 10000) {
                  writeFileSync(OUT + '/clean-img-' + capturedImages.length + ext, b2);
                  console.log('Saved clean-img-' + capturedImages.length + ext + ' (' + Math.round(b2.length/1024) + 'KB)');
                  break;
                }
              }
            }
          }
        }
      } catch(e) {
        // Screenshot fallback - crop just the main image
        const imgEl = await page.$('img[src="' + currentLarge.src.replace(/"/g, '\\"') + '"]');
        if (imgEl) {
          await imgEl.screenshot({ path: OUT + '/clean-img-' + capturedImages.length + '.png' });
          console.log('Screenshot fallback: clean-img-' + capturedImages.length + '.png');
        }
      }
    }
  } catch(e) {
    console.log('Thumb ' + i + ' error: ' + e.message.substring(0, 50));
  }
}

console.log('\nTotal unique images captured: ' + capturedImages.length);
capturedImages.forEach((src, i) => console.log('  ' + (i+1) + '. ' + src.substring(0, 100)));

await browser.close();
console.log('DONE');
