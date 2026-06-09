import { chromium } from 'playwright';

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

// Search for more specific products
const searches = [
  { name: 'Entry - face only', url: 'https://www.alibaba.com/trade/search?SearchText=LED+face+mask+3+color+red+blue+light+therapy+no+neck&selectedTab=product_en' },
  { name: 'Mid - 7 color neck', url: 'https://www.alibaba.com/trade/search?SearchText=7+color+LED+face+neck+mask+photon+therapy+192+LED&selectedTab=product_en' },
  { name: 'Premium - silicone wireless', url: 'https://www.alibaba.com/trade/search?SearchText=silicone+LED+face+neck+mask+wireless+rechargeable+red+light+therapy&selectedTab=product_en' }
];

for (const s of searches) {
  console.log('\n=== ' + s.name + ' ===');
  await page.goto(s.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(6000);

  const text = await page.evaluate(() => document.body.innerText.substring(0, 3000));
  console.log(text.substring(0, 1500));

  await page.screenshot({
    path: 'C:/Users/jtfas/OneDrive/Documents/ClaudeCode/shopify-agent/generated_imgs/ali-search-' + s.name.split(' ')[0].toLowerCase() + '.png'
  });
}

// Now visit the best product from the earlier search - the white/gold 7-color for $10.64
console.log('\n=== VISITING WHITE 7-COLOR PRODUCT ===');
await page.goto('https://www.alibaba.com/trade/search?SearchText=7+Color+LED+Face+Neck+Mask+Handheld+Light+Therapy+Anti-Aging+Skin+Tightening+US+Plug&selectedTab=product_en', {
  waitUntil: 'domcontentloaded', timeout: 30000
});
await page.waitForTimeout(6000);

// Click first product
const firstProduct = await page.evaluate(() => {
  const links = document.querySelectorAll('a[href*="alibaba.com/product"]');
  if (links.length > 0) return links[0].href;
  return null;
});

if (firstProduct) {
  console.log('Visiting: ' + firstProduct);
  await page.goto(firstProduct, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(5000);

  await page.screenshot({
    path: 'C:/Users/jtfas/OneDrive/Documents/ClaudeCode/shopify-agent/generated_imgs/ali-white-7color-detail.png',
    fullPage: false
  });

  const details = await page.evaluate(() => document.body.innerText.substring(0, 3000));
  console.log(details.substring(0, 1500));

  // Get all product images
  const images = await page.evaluate(() => {
    const imgs = [];
    document.querySelectorAll('img').forEach(img => {
      const src = img.src || img.getAttribute('data-src');
      if (src && (src.includes('alicdn') || src.includes('cbu01')) && src.includes('/kf/') && !imgs.includes(src)) {
        imgs.push(src);
      }
    });
    return imgs.slice(0, 10);
  });
  console.log('\nImages found: ' + images.length);
  images.forEach((img, i) => console.log('  ' + (i+1) + '. ' + img));
}

// Search for silicone face+neck wireless specifically
console.log('\n=== VISITING SILICONE WIRELESS PRODUCT ===');
await page.goto('https://www.alibaba.com/trade/search?SearchText=silicone+LED+face+neck+mask+wireless+USB+rechargeable+infrared+830nm&selectedTab=product_en', {
  waitUntil: 'domcontentloaded', timeout: 30000
});
await page.waitForTimeout(6000);

const siliconeProduct = await page.evaluate(() => {
  const links = document.querySelectorAll('a[href*="alibaba.com/product"]');
  if (links.length > 0) return links[0].href;
  return null;
});

if (siliconeProduct) {
  console.log('Visiting: ' + siliconeProduct);
  await page.goto(siliconeProduct, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(5000);

  await page.screenshot({
    path: 'C:/Users/jtfas/OneDrive/Documents/ClaudeCode/shopify-agent/generated_imgs/ali-silicone-wireless-detail.png',
    fullPage: false
  });

  const details = await page.evaluate(() => document.body.innerText.substring(0, 2000));
  console.log(details.substring(0, 1500));

  const images = await page.evaluate(() => {
    const imgs = [];
    document.querySelectorAll('img').forEach(img => {
      const src = img.src;
      if (src && (src.includes('alicdn') || src.includes('cbu01')) && src.includes('/kf/') && !imgs.includes(src)) {
        imgs.push(src);
      }
    });
    return imgs.slice(0, 10);
  });
  console.log('\nImages: ' + images.length);
  images.forEach((img, i) => console.log('  ' + (i+1) + '. ' + img));
}

await browser.close();
console.log('\nDONE');
