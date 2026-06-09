import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36' });

console.log('Searching AliExpress for best-selling LED masks...');
await page.goto('https://www.aliexpress.com/w/wholesale-LED-face-mask-red-light-therapy.html?sortType=total_tranpro_desc', { waitUntil: 'domcontentloaded', timeout: 30000 });
await page.waitForTimeout(8000);

// Scroll to load more
for (let i = 0; i < 3; i++) {
  await page.evaluate((y) => window.scrollTo(0, y), (i + 1) * 2000);
  await page.waitForTimeout(2000);
}

// Get all item URLs
const urls = await page.evaluate(() => {
  const links = document.querySelectorAll('a[href*="/item/"]');
  const seen = new Set();
  const results = [];
  for (const l of links) {
    const m = l.href.match(/item\/(\d+)\.html/);
    if (m && !seen.has(m[1])) {
      seen.add(m[1]);
      results.push(m[1]);
    }
  }
  return results.slice(0, 15);
});

// Get full text for product info
const allText = await page.evaluate(() => document.body.innerText);
console.log('\n=== PAGE TEXT (first 4000 chars) ===\n');
console.log(allText.substring(0, 4000));
console.log('\n=== ITEM IDS FOUND (' + urls.length + ') ===');
urls.forEach((id, i) => console.log((i+1) + '. https://www.aliexpress.com/item/' + id + '.html'));

// Now visit top 3 product pages for details
console.log('\n=== VISITING TOP 3 PRODUCTS ===\n');

for (let i = 0; i < Math.min(3, urls.length); i++) {
  const url = 'https://www.aliexpress.com/item/' + urls[i] + '.html';
  console.log('--- Product ' + (i+1) + ': ' + url + ' ---');

  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(5000);

  // Screenshot product page
  await page.screenshot({
    path: 'C:/Users/jtfas/OneDrive/Documents/ClaudeCode/shopify-agent/generated_imgs/ali-product-' + (i+1) + '.png',
    fullPage: false
  });

  // Get product details
  const details = await page.evaluate(() => {
    const title = document.querySelector('[class*="title"], h1')?.textContent?.trim();
    const price = document.querySelector('[class*="price"]')?.textContent?.trim();
    const rating = document.querySelector('[class*="rating"], [class*="star"]')?.textContent?.trim();
    const orders = document.body.innerText.match(/(\d[\d,]*\+?\s*(?:sold|orders))/i)?.[1];
    const reviewCount = document.body.innerText.match(/(\d[\d,]*)\s*(?:review|rating)/i)?.[1];

    // Get image URLs
    const images = [];
    const imgs = document.querySelectorAll('img[src*="alicdn"], img[src*="ae01"]');
    for (const img of imgs) {
      const src = img.src || img.getAttribute('data-src');
      if (src && src.includes('alicdn') && !images.includes(src) && images.length < 5) {
        images.push(src);
      }
    }

    return { title, price, rating, orders, reviewCount, images, bodyText: document.body.innerText.substring(0, 2000) };
  });

  console.log('Title: ' + (details.title || 'N/A'));
  console.log('Price: ' + (details.price || 'N/A'));
  console.log('Rating: ' + (details.rating || 'N/A'));
  console.log('Orders: ' + (details.orders || 'N/A'));
  console.log('Reviews: ' + (details.reviewCount || 'N/A'));
  console.log('Images: ' + (details.images?.length || 0));
  details.images?.forEach((img, j) => console.log('  img' + (j+1) + ': ' + img.substring(0, 100)));
  console.log('');
}

await browser.close();
console.log('DONE');
