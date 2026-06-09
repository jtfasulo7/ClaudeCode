import { chromium } from 'playwright';
import { writeFileSync } from 'fs';

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

console.log('=== BROWSING ALIBABA PRODUCT PAGE ===');
await page.goto('https://www.alibaba.com/product-detail/Led-Light-Face-Mask-Led-Therapy_1601680995753.html?spm=a2700.prosearch.normal_offer.d_image.4b8d67afYmP0eq&priceId=a6bf72f4ce8041698a4a72b66db3cab5', {
  waitUntil: 'domcontentloaded', timeout: 30000
});
await page.waitForTimeout(8000);

// Screenshot the full product page
await page.screenshot({
  path: 'C:/Users/jtfas/OneDrive/Documents/ClaudeCode/shopify-agent/generated_imgs/alibaba-import-page.png',
  fullPage: false
});

// Get product title and details
const productInfo = await page.evaluate(() => {
  const title = document.querySelector('h1, [class*="title"]')?.textContent?.trim();
  const bodyText = document.body.innerText.substring(0, 5000);
  return { title, bodyText };
});
console.log('\nTitle: ' + productInfo.title);
console.log('\nBody text:\n' + productInfo.bodyText.substring(0, 3000));

// Get ALL images from the page - product images, gallery images, detail images
const images = await page.evaluate(() => {
  const imgs = new Set();

  // Get all image elements
  document.querySelectorAll('img').forEach(img => {
    const src = img.src || img.getAttribute('data-src') || img.getAttribute('data-lazy-src');
    if (src && (src.includes('alicdn') || src.includes('cbu01')) && src.includes('/kf/')) {
      // Get the largest version by removing size suffixes
      let cleanSrc = src.replace(/_\d+x\d+\./, '.').replace(/\.(\d+x\d+)\./, '.');
      if (!cleanSrc.includes('svg') && !cleanSrc.includes('icon')) {
        imgs.add(cleanSrc);
      }
    }
  });

  // Also check for video
  const videos = [];
  document.querySelectorAll('video, source[type*="video"]').forEach(v => {
    const src = v.src || v.getAttribute('data-src');
    if (src) videos.push(src);
  });

  // Check for video in data attributes
  document.querySelectorAll('[data-video], [data-video-url]').forEach(el => {
    const src = el.getAttribute('data-video') || el.getAttribute('data-video-url');
    if (src) videos.push(src);
  });

  return { images: [...imgs], videos };
});

console.log('\n=== IMAGES FOUND: ' + images.images.length + ' ===');
images.images.forEach((img, i) => console.log((i+1) + '. ' + img));

console.log('\n=== VIDEOS FOUND: ' + images.videos.length + ' ===');
images.videos.forEach((v, i) => console.log((i+1) + '. ' + v));

// Try to find video by looking at page source
const videoUrls = await page.evaluate(() => {
  const html = document.documentElement.innerHTML;
  const videoMatches = html.match(/https?:\/\/[^"'\s]+\.mp4[^"'\s]*/g) || [];
  const m3u8Matches = html.match(/https?:\/\/[^"'\s]+\.m3u8[^"'\s]*/g) || [];
  return { mp4: [...new Set(videoMatches)], m3u8: [...new Set(m3u8Matches)] };
});
console.log('\nMP4 URLs: ' + videoUrls.mp4.length);
videoUrls.mp4.forEach((v, i) => console.log('  ' + (i+1) + '. ' + v));
console.log('M3U8 URLs: ' + videoUrls.m3u8.length);
videoUrls.m3u8.forEach((v, i) => console.log('  ' + (i+1) + '. ' + v));

// Scroll down to find more images in the product description
await page.evaluate(() => window.scrollTo(0, 3000));
await page.waitForTimeout(3000);
await page.evaluate(() => window.scrollTo(0, 6000));
await page.waitForTimeout(3000);

// Screenshot lower part of page
await page.screenshot({
  path: 'C:/Users/jtfas/OneDrive/Documents/ClaudeCode/shopify-agent/generated_imgs/alibaba-import-page-2.png',
  fullPage: false
});

// Get more images after scroll
const moreImages = await page.evaluate(() => {
  const imgs = new Set();
  document.querySelectorAll('img').forEach(img => {
    const src = img.src || img.getAttribute('data-src');
    if (src && (src.includes('alicdn') || src.includes('cbu01')) && src.includes('/kf/') && !src.includes('svg')) {
      imgs.add(src);
    }
  });
  return [...imgs];
});
console.log('\n=== TOTAL IMAGES AFTER SCROLL: ' + moreImages.length + ' ===');
moreImages.forEach((img, i) => console.log((i+1) + '. ' + img));

// Save all data to JSON for the next step
const data = {
  title: productInfo.title,
  bodyText: productInfo.bodyText,
  images: moreImages,
  videos: [...videoUrls.mp4, ...videoUrls.m3u8, ...images.videos]
};
writeFileSync('C:/Users/jtfas/OneDrive/Documents/ClaudeCode/shopify-agent/generated_imgs/alibaba-product-data.json', JSON.stringify(data, null, 2));
console.log('\nProduct data saved to alibaba-product-data.json');

await browser.close();
console.log('DONE');
