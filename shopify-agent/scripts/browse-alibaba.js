import { chromium } from 'playwright';

const browser = await chromium.launch({
  headless: false,  // visible browser to avoid bot detection
  args: ['--disable-blink-features=AutomationControlled']
});

const context = await browser.newContext({
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  viewport: { width: 1920, height: 1080 }
});

// Remove webdriver flag
await context.addInitScript(() => {
  Object.defineProperty(navigator, 'webdriver', { get: () => false });
});

const page = await context.newPage();

// Try Alibaba (less strict than AliExpress)
console.log('=== SEARCHING ALIBABA ===');
await page.goto('https://www.alibaba.com/trade/search?SearchText=LED+face+mask+7+color+red+light+therapy+neck&selectedTab=product_en', {
  waitUntil: 'domcontentloaded', timeout: 30000
});
await page.waitForTimeout(8000);

await page.screenshot({
  path: 'C:/Users/jtfas/OneDrive/Documents/ClaudeCode/shopify-agent/generated_imgs/alibaba-search.png',
  fullPage: false
});

const alibabaText = await page.evaluate(() => document.body.innerText?.substring(0, 5000) || '');
console.log(alibabaText);

// Get product URLs
const alibabaUrls = await page.evaluate(() => {
  const links = document.querySelectorAll('a[href*="alibaba.com/product"]');
  return [...links].slice(0, 10).map(l => l.href);
});
console.log('\n=== ALIBABA PRODUCT URLS ===');
alibabaUrls.forEach((u, i) => console.log((i+1) + '. ' + u));

// Visit top 3 Alibaba products
for (let i = 0; i < Math.min(3, alibabaUrls.length); i++) {
  console.log('\n--- Alibaba Product ' + (i+1) + ' ---');
  await page.goto(alibabaUrls[i], { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(5000);

  await page.screenshot({
    path: 'C:/Users/jtfas/OneDrive/Documents/ClaudeCode/shopify-agent/generated_imgs/alibaba-product-' + (i+1) + '.png',
    fullPage: false
  });

  const details = await page.evaluate(() => {
    const title = document.querySelector('h1, [class*="title"]')?.textContent?.trim();
    const bodyText = document.body.innerText.substring(0, 3000);
    const priceMatch = bodyText.match(/\$[\d.]+\s*-?\s*\$?[\d.]*/);
    const moqMatch = bodyText.match(/(\d+)\s*(?:Piece|Set|Unit)/i);

    // Get images
    const images = [];
    const imgs = document.querySelectorAll('img[src*="alicdn"], img[src*="cbu01"]');
    for (const img of imgs) {
      const src = img.src;
      if (src && (src.includes('alicdn') || src.includes('cbu01')) && !images.includes(src) && images.length < 8) {
        images.push(src);
      }
    }

    return { title, price: priceMatch?.[0], moq: moqMatch?.[0], images, bodyText };
  });

  console.log('Title: ' + (details.title || 'N/A'));
  console.log('Price: ' + (details.price || 'N/A'));
  console.log('MOQ: ' + (details.moq || 'N/A'));
  console.log('Images: ' + details.images?.length);
  details.images?.forEach((img, j) => console.log('  ' + img.substring(0, 120)));
  console.log('Body excerpt: ' + details.bodyText?.substring(0, 500));
}

// Also try Temu for cross-reference
console.log('\n=== SEARCHING TEMU ===');
await page.goto('https://www.temu.com/search_result.html?search_key=LED+face+mask+red+light+therapy&search_method=user', {
  waitUntil: 'domcontentloaded', timeout: 30000
});
await page.waitForTimeout(8000);

await page.screenshot({
  path: 'C:/Users/jtfas/OneDrive/Documents/ClaudeCode/shopify-agent/generated_imgs/temu-search.png',
  fullPage: false
});

const temuText = await page.evaluate(() => document.body.innerText?.substring(0, 3000) || '');
console.log(temuText.substring(0, 1500));

await browser.close();
console.log('\nDONE - Check screenshots in generated_imgs/');
