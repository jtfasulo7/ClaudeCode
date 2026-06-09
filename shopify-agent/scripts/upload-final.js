import { readFileSync } from 'fs';

const TOKEN = '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';
const SHOP = 'https://3dq16a-uc.myshopify.com/admin/api/2024-01';
const IMG = 'C:/Users/jtfas/OneDrive/Documents/ClaudeCode/shopify-agent/generated_imgs';
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function deleteAllImages(pid) {
  const r = await fetch(`${SHOP}/products/${pid}/images.json`, { headers: { 'X-Shopify-Access-Token': TOKEN } }).then(r => r.json());
  for (const img of (r.images || [])) {
    await fetch(`${SHOP}/products/${pid}/images/${img.id}.json`, { method: 'DELETE', headers: { 'X-Shopify-Access-Token': TOKEN } });
    await sleep(300);
  }
  return (r.images || []).length;
}

async function upload(pid, file, alt, pos) {
  const b64 = readFileSync(`${IMG}/${file}`).toString('base64');
  const r = await fetch(`${SHOP}/products/${pid}/images.json`, {
    method: 'POST',
    headers: { 'X-Shopify-Access-Token': TOKEN, 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: { attachment: b64, filename: file, alt, position: pos } })
  }).then(r => r.json());
  return r.image?.id;
}

const products = [
  { id: 9357481607400, prefix: 'v3-entry', alt: 'LumiRecover LED Face Mask 7 Color' },
  { id: 9357481640168, prefix: 'v3-mid', alt: 'LumiRecover LED Face Mask 7 Color Pro' },
  { id: 9357481705704, prefix: 'v3-pro', alt: 'LumiRecover LED Face Mask Pro Wireless Silicone' }
];
const suffixes = ['1', '2', '3', '4', '5'];

async function run() {
  for (const p of products) {
    console.log(`\n--- ${p.alt} ---`);
    const del = await deleteAllImages(p.id);
    console.log(`Deleted ${del} old images`);

    for (const s of suffixes) {
      const file = `${p.prefix}-${s}.jpg`;
      const id = await upload(p.id, file, `${p.alt} photo ${s}`, parseInt(s));
      console.log(id ? `  OK: ${file}` : `  FAIL: ${file}`);
      await sleep(1000);
    }
  }

  // Upload hero banner
  console.log('\n--- HERO BANNER ---');
  const heroData = readFileSync(`${IMG}/v3-hero.jpg`);
  const staged = await fetch(`${SHOP}/graphql.json`, {
    method: 'POST',
    headers: { 'X-Shopify-Access-Token': TOKEN, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: `mutation { stagedUploadsCreate(input: [{ resource: FILE filename: "v3-hero.jpg" mimeType: "image/jpeg" httpMethod: POST fileSize: "${heroData.length}" }]) { stagedTargets { url resourceUrl parameters { name value } } } }` })
  }).then(r => r.json());

  const t = staged.data.stagedUploadsCreate.stagedTargets[0];
  const form = new FormData();
  for (const p of t.parameters) form.append(p.name, p.value);
  form.append('file', new Blob([heroData], { type: 'image/jpeg' }), 'v3-hero.jpg');
  await fetch(t.url, { method: 'POST', body: form });

  await fetch(`${SHOP}/graphql.json`, {
    method: 'POST',
    headers: { 'X-Shopify-Access-Token': TOKEN, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: `mutation { fileCreate(files: [{ alt: "LumiRecover hero banner" contentType: IMAGE originalSource: "${t.resourceUrl}" }]) { files { id } userErrors { field message } } }` })
  });
  console.log('Hero uploaded to Shopify files');

  await sleep(5000);

  // Update theme heroes
  const tplRes = await fetch(`${SHOP}/themes/154966360296/assets.json?asset[key]=templates/index.json`, {
    headers: { 'X-Shopify-Access-Token': TOKEN }
  }).then(r => r.json());
  let tpl = JSON.parse(tplRes.asset.value);

  tpl.sections.hero_p9CmMG.settings.image_1 = 'shopify://shop_images/v3-hero.jpg';
  tpl.sections.hero_pjNAy4.settings.image_1 = 'shopify://shop_images/v3-hero.jpg';
  tpl.sections.hero_Ha3FDU.settings.image_1 = 'shopify://shop_images/v3-hero.jpg';

  const save = await fetch(`${SHOP}/themes/154966360296/assets.json`, {
    method: 'PUT',
    headers: { 'X-Shopify-Access-Token': TOKEN, 'Content-Type': 'application/json' },
    body: JSON.stringify({ asset: { key: 'templates/index.json', value: JSON.stringify(tpl, null, 2) } })
  }).then(r => r.json());

  console.log(save.asset ? 'Theme hero images updated' : 'Theme error');
  console.log('\nALL DONE');
}
run().catch(console.error);
