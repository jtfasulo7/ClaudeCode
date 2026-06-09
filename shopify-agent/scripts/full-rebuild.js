import { readFileSync } from 'fs';
const TOKEN = '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';
const SHOP = 'https://3dq16a-uc.myshopify.com/admin/api/2024-01';
const IMG = 'C:/Users/jtfas/OneDrive/Documents/ClaudeCode/shopify-agent/generated_imgs';
const sleep = ms => new Promise(r => setTimeout(r, ms));

// STEP 1: Create product
console.log('Creating product...');
const cr = await fetch(SHOP + '/products.json', {
  method: 'POST',
  headers: { 'X-Shopify-Access-Token': TOKEN, 'Content-Type': 'application/json' },
  body: JSON.stringify({
    product: {
      title: '7-in-1 LED Photon Face & Neck Massager | Microcurrent Lifting Device',
      body_html: '<p>Professional facial sculpting. At home. In 10 minutes.</p><p>The LumiRecover 7-in-1 Photon Facial Device combines seven advanced skin treatments in one elegant tool.</p><ul><li><strong>7 Professional Treatments in 1</strong> \u2014 LED photon therapy, EMS microcurrent, RF tightening, electroporation, vibration massage, ionic cleansing, and thermal therapy.</li><li><strong>Face & Neck Coverage</strong> \u2014 Ergonomic design reaches jawline, cheeks, forehead, under-eyes, and neck.</li><li><strong>LED Photon Therapy</strong> \u2014 Multiple light modes: red for collagen, blue for acne, green for brightening.</li><li><strong>EMS Microcurrent Lifting</strong> \u2014 Gentle electrical pulses tone facial muscles and improve jawline definition.</li><li><strong>Smart LCD Display</strong> \u2014 Shows mode, intensity, and treatment time.</li><li><strong>USB Rechargeable</strong> \u2014 Wireless. Full charge lasts 2+ weeks of daily sessions.</li></ul><p>Everything your aesthetician uses. Nothing your wallet dreads.</p>',
      vendor: 'LumiRecover',
      product_type: 'Facial Beauty Device',
      tags: 'facial massager,LED photon therapy,microcurrent device,face lifting,neck massager,EMS facial,anti aging device,skin care tool,beauty device,red light therapy,face sculpting',
      status: 'active',
      published: true,
      variants: [{ price: '33.99', compare_at_price: '67.99', sku: 'LR-7IN1-WHT', inventory_management: 'shopify', inventory_policy: 'continue' }]
    }
  })
}).then(r => r.json());

if (!cr.product) { console.log('ERROR:', JSON.stringify(cr).substring(0, 300)); process.exit(1); }
const PID = cr.product.id;
console.log('Created: ID ' + PID);

// STEP 2: Upload images
const files = ['ali-import-main.png', 'ali-import-thumb-3.png', 'ali-import-thumb-4.png', 'ali-import-thumb-5.png', 'ali-import-thumb-6.png', 'ali-import-thumb-7.png', 'ali-import-thumb-8.png'];
for (let i = 0; i < files.length; i++) {
  try {
    const b64 = readFileSync(IMG + '/' + files[i]).toString('base64');
    const r = await fetch(SHOP + '/products/' + PID + '/images.json', {
      method: 'POST',
      headers: { 'X-Shopify-Access-Token': TOKEN, 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: { attachment: b64, filename: files[i], alt: 'LumiRecover 7-in-1 LED Facial Device', position: i + 1 } })
    }).then(r => r.json());
    console.log(r.image ? 'OK: ' + files[i] : 'FAIL: ' + files[i] + ' ' + JSON.stringify(r.errors || '').substring(0, 80));
  } catch(e) { console.log('ERR: ' + e.message.substring(0, 50)); }
  await sleep(2000);
}

// STEP 3: Add to collections
await fetch(SHOP + '/collects.json', { method: 'POST', headers: { 'X-Shopify-Access-Token': TOKEN, 'Content-Type': 'application/json' }, body: JSON.stringify({ collect: { product_id: PID, collection_id: 444844376296 } }) });
await fetch(SHOP + '/collects.json', { method: 'POST', headers: { 'X-Shopify-Access-Token': TOKEN, 'Content-Type': 'application/json' }, body: JSON.stringify({ collect: { product_id: PID, collection_id: 444451324136 } }) });
console.log('Added to collections');

// STEP 4: Update theme product grid
const tplRes = await fetch(SHOP + '/themes/154966360296/assets.json?asset[key]=templates/index.json', { headers: { 'X-Shopify-Access-Token': TOKEN } }).then(r => r.json());
let tpl = JSON.parse(tplRes.asset.value);
tpl.sections.product_list_themegen.settings.collection = 'led-light-therapy';

// STEP 5: Upload hero and update theme
const heroData = readFileSync(IMG + '/hero-7in1.jpg');
const staged = await fetch(SHOP + '/graphql.json', {
  method: 'POST',
  headers: { 'X-Shopify-Access-Token': TOKEN, 'Content-Type': 'application/json' },
  body: JSON.stringify({ query: `mutation { stagedUploadsCreate(input: [{ resource: FILE filename: "hero-7in1-final.jpg" mimeType: "image/jpeg" httpMethod: POST fileSize: "${heroData.length}" }]) { stagedTargets { url resourceUrl parameters { name value } } } }` })
}).then(r => r.json());
const target = staged.data.stagedUploadsCreate.stagedTargets[0];
const form = new FormData();
for (const p of target.parameters) form.append(p.name, p.value);
form.append('file', new Blob([heroData], { type: 'image/jpeg' }), 'hero-7in1-final.jpg');
await fetch(target.url, { method: 'POST', body: form });
await fetch(SHOP + '/graphql.json', {
  method: 'POST',
  headers: { 'X-Shopify-Access-Token': TOKEN, 'Content-Type': 'application/json' },
  body: JSON.stringify({ query: `mutation { fileCreate(files: [{ alt: "LumiRecover hero" contentType: IMAGE originalSource: "${target.resourceUrl}" }]) { files { id } userErrors { field message } } }` })
});
console.log('Hero uploaded');

await sleep(5000);

tpl.sections.hero_p9CmMG.settings.image_1 = 'shopify://shop_images/hero-7in1-final.jpg';
tpl.sections.hero_pjNAy4.settings.image_1 = 'shopify://shop_images/hero-7in1-final.jpg';
tpl.sections.hero_Ha3FDU.settings.image_1 = 'shopify://shop_images/hero-7in1-final.jpg';

await fetch(SHOP + '/themes/154966360296/assets.json', {
  method: 'PUT',
  headers: { 'X-Shopify-Access-Token': TOKEN, 'Content-Type': 'application/json' },
  body: JSON.stringify({ asset: { key: 'templates/index.json', value: JSON.stringify(tpl, null, 2) } })
}).then(r => r.json()).then(d => console.log(d.asset ? 'Theme updated' : 'Theme error'));

// Verify
const verify = await fetch(SHOP + '/products.json?limit=10', { headers: { 'X-Shopify-Access-Token': TOKEN } }).then(r => r.json());
console.log('\nVERIFY: ' + verify.products.length + ' products');
verify.products.forEach(p => console.log('  ' + p.title + ' | $' + p.variants[0].price + ' | ' + p.status + ' | imgs: ' + p.images.length + ' | published: ' + p.published_at));
console.log('\nDONE');
