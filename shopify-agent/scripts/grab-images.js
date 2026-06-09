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

await page.goto('https://www.aliexpress.com/item/3256810127456036.html', {
  waitUntil: 'domcontentloaded', timeout: 30000
});
await page.waitForTimeout(10000);

// Get full-size image URLs from the gallery thumbnails
const fullImages = await page.evaluate(() => {
  const imgs = [];

  // Look for gallery/carousel images with larger sizes
  document.querySelectorAll('img').forEach(img => {
    const src = img.src || '';
    // Product gallery images are usually larger
    if (src.includes('alicdn.com/kf/') && img.naturalWidth > 100) {
      // Try to get the full size URL by removing size constraints
      let fullSrc = src
        .replace(/_\d+x\d+\./, '.')
        .replace(/\/\d+x\d+\./, '/');
      imgs.push({ src: fullSrc, width: img.naturalWidth, height: img.naturalHeight, original: src });
    }
  });

  // Also look for image sources in the main gallery specifically
  document.querySelectorAll('[class*="gallery"] img, [class*="slider"] img, [class*="carousel"] img, [class*="magnifier"] img').forEach(img => {
    if (img.src && img.src.includes('alicdn')) {
      imgs.push({ src: img.src, width: img.naturalWidth, height: img.naturalHeight, context: 'gallery' });
    }
  });

  // Look for background images
  document.querySelectorAll('[style*="background-image"]').forEach(el => {
    const match = el.style.backgroundImage.match(/url\(["']?([^"')]+)/);
    if (match && match[1].includes('alicdn')) {
      imgs.push({ src: match[1], context: 'background' });
    }
  });

  return imgs;
});

console.log('Gallery images found: ' + fullImages.length);
fullImages.forEach((img, i) => console.log((i+1) + '. ' + img.src.substring(0, 100) + ' | ' + img.width + 'x' + img.height));

// Click through the gallery thumbnails to load each full image
const thumbs = await page.$$('[class*="thumb"] img, [class*="gallery"] img[class*="thumb"], [class*="slider"] img');
console.log('\nThumbnails found: ' + thumbs.length);

// Try clicking each thumbnail and capturing the main image
const mainImages = [];
for (let i = 0; i < Math.min(thumbs.length, 10); i++) {
  try {
    await thumbs[i].click();
    await page.waitForTimeout(1500);

    const mainImg = await page.evaluate(() => {
      // Find the largest currently visible image
      let biggest = null;
      let maxSize = 0;
      document.querySelectorAll('img').forEach(img => {
        const size = img.naturalWidth * img.naturalHeight;
        if (size > maxSize && img.src.includes('alicdn.com/kf/') && img.offsetWidth > 200) {
          maxSize = size;
          biggest = img.src;
        }
      });
      return biggest;
    });

    if (mainImg && !mainImages.includes(mainImg)) {
      mainImages.push(mainImg);
      console.log('Captured ' + mainImages.length + ': ' + mainImg.substring(0, 80));
    }
  } catch(e) {}
}

// Now screenshot each image
console.log('\n=== DOWNLOADING ' + mainImages.length + ' MAIN IMAGES ===');
for (let i = 0; i < mainImages.length; i++) {
  try {
    const r = await fetch(mainImages[i]);
    if (r.ok) {
      const buf = Buffer.from(await r.arrayBuffer());
      writeFileSync(OUT + '/ali-import-' + (i+1) + '.png', buf);
      console.log('  Saved ali-import-' + (i+1) + '.png (' + Math.round(buf.length/1024) + 'KB)');
    }
  } catch(e) {
    console.log('  Failed ' + (i+1) + ': ' + e.message.substring(0, 50));
  }
}

// If we didn't get enough, screenshot the product gallery area directly
if (mainImages.length < 3) {
  console.log('\nNot enough gallery images. Taking screenshot-based captures...');

  // Get the main product image area and screenshot it
  const mainArea = await page.$('[class*="gallery"], [class*="image-view"], [class*="product-image"]');
  if (mainArea) {
    await mainArea.screenshot({ path: OUT + '/ali-import-main.png' });
    console.log('Saved main image area screenshot');
  }

  // Screenshot each view by clicking thumbnails
  for (let i = 0; i < Math.min(thumbs.length, 8); i++) {
    try {
      await thumbs[i].click();
      await page.waitForTimeout(1000);
      const area = await page.$('[class*="gallery"], [class*="image-view"]');
      if (area) {
        await area.screenshot({ path: OUT + '/ali-import-thumb-' + (i+1) + '.png' });
        console.log('Saved thumbnail view ' + (i+1));
      }
    } catch(e) {}
  }
}

await browser.close();
console.log('\nDONE');
