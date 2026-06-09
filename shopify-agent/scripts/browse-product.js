import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'fs';

const OUT = 'C:/Users/jtfas/OneDrive/Documents/ClaudeCode/shopify-agent/generated_imgs';
mkdirSync(OUT, { recursive: true });

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

console.log('=== BROWSING ALIEXPRESS PRODUCT ===');
await page.goto('https://www.aliexpress.com/item/3256810127456036.html', {
  waitUntil: 'domcontentloaded', timeout: 30000
});
await page.waitForTimeout(10000);

// Screenshot the product page
await page.screenshot({ path: OUT + '/ali-target-product-1.png', fullPage: false });
console.log('Screenshot 1 saved');

// Get the page title
const title = await page.title();
console.log('Page title: ' + title);

// Get full page text
const bodyText = await page.evaluate(() => document.body.innerText.substring(0, 8000));
console.log('\n=== PAGE TEXT ===\n' + bodyText);

// Get ALL product images
const images = await page.evaluate(() => {
  const imgs = new Set();
  document.querySelectorAll('img').forEach(img => {
    const src = img.src || img.getAttribute('data-src');
    if (src && (src.includes('alicdn') || src.includes('ae01')) && !src.includes('svg') && !src.includes('icon') && !src.includes('flag')) {
      // Get large version
      let clean = src.replace(/_\d+x\d+\./g, '.').replace(/\.\d+x\d+\./g, '.');
      if (clean.includes('/kf/') || clean.includes('/imgextra/')) {
        imgs.add(clean);
      }
    }
  });
  return [...imgs];
});
console.log('\n=== IMAGES FOUND: ' + images.length + ' ===');
images.forEach((img, i) => console.log((i+1) + '. ' + img));

// Look for video URLs
const videos = await page.evaluate(() => {
  const html = document.documentElement.innerHTML;
  const mp4s = html.match(/https?:\/\/[^"'\s]+\.mp4[^"'\s]*/g) || [];
  const m3u8s = html.match(/https?:\/\/[^"'\s]+\.m3u8[^"'\s]*/g) || [];
  // Also check video elements
  const videoEls = [];
  document.querySelectorAll('video, source').forEach(v => {
    if (v.src) videoEls.push(v.src);
  });
  return { mp4: [...new Set(mp4s)], m3u8: [...new Set(m3u8s)], elements: videoEls };
});
console.log('\n=== VIDEOS ===');
console.log('MP4:', videos.mp4.length);
videos.mp4.forEach(v => console.log('  ' + v.substring(0, 150)));
console.log('M3U8:', videos.m3u8.length);
videos.m3u8.forEach(v => console.log('  ' + v.substring(0, 150)));
console.log('Elements:', videos.elements.length);
videos.elements.forEach(v => console.log('  ' + v.substring(0, 150)));

// Scroll down to see more images in product description
await page.evaluate(() => window.scrollTo(0, 3000));
await page.waitForTimeout(3000);
await page.screenshot({ path: OUT + '/ali-target-product-2.png', fullPage: false });

await page.evaluate(() => window.scrollTo(0, 6000));
await page.waitForTimeout(3000);
await page.screenshot({ path: OUT + '/ali-target-product-3.png', fullPage: false });

// Get more images after scroll
const moreImages = await page.evaluate(() => {
  const imgs = new Set();
  document.querySelectorAll('img').forEach(img => {
    const src = img.src || img.getAttribute('data-src');
    if (src && (src.includes('alicdn') || src.includes('ae01') || src.includes('cbu01')) && !src.includes('svg') && !src.includes('icon')) {
      let clean = src.replace(/_\d+x\d+\./g, '.');
      if (clean.includes('/kf/') || clean.includes('/imgextra/')) {
        imgs.add(clean);
      }
    }
  });
  return [...imgs];
});
console.log('\n=== ALL IMAGES AFTER SCROLL: ' + moreImages.length + ' ===');
moreImages.forEach((img, i) => console.log((i+1) + '. ' + img));

// Save all data
const data = {
  title,
  bodyText,
  images: moreImages,
  videos: { mp4: videos.mp4, m3u8: videos.m3u8, elements: videos.elements }
};
writeFileSync(OUT + '/ali-target-data.json', JSON.stringify(data, null, 2));
console.log('\nData saved to ali-target-data.json');

await browser.close();
console.log('DONE');
