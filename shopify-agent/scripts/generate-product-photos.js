import { GoogleGenAI, Modality } from '@google/genai';
import { writeFileSync, mkdirSync } from 'fs';

const ai = new GoogleGenAI({ apiKey: 'AIzaSyAf1hAgFVZth19XPzTBWyymCdtO0xal_8M' });
const MODEL = 'gemini-3.1-flash-image-preview';
const OUT = 'C:/Users/jtfas/OneDrive/Documents/ClaudeCode/shopify-agent/generated_imgs';

mkdirSync(OUT, { recursive: true });

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function gen(prompt, filename) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      console.log(`Generating: ${filename}...`);
      const response = await ai.models.generateContent({
        model: MODEL,
        contents: prompt,
        config: { responseModalities: [Modality.TEXT, Modality.IMAGE] }
      });
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const buf = Buffer.from(part.inlineData.data, 'base64');
          writeFileSync(`${OUT}/${filename}`, buf);
          console.log(`  OK ${filename} (${Math.round(buf.length/1024)}KB)`);
          return true;
        }
      }
      console.log(`  WARN No image in response for ${filename}`);
      return false;
    } catch(e) {
      if (e.message.includes('429')) {
        const wait = (attempt + 1) * 15000;
        console.log(`  RATE_LIMITED waiting ${wait/1000}s...`);
        await sleep(wait);
      } else {
        console.log(`  FAIL ${filename}: ${e.message.substring(0, 100)}`);
        return false;
      }
    }
  }
  return false;
}

const STARTER = 'a sleek matte black LED face mask with red and blue LED lights visible through small circular holes across the face area, with a black adjustable head strap, simple and compact design';
const SEVEN_C = 'a premium white and pearl LED face mask with multiple rows of colorful LED lights showing 7 different colors through the mask surface, lightweight USB-rechargeable design with adjustable strap';
const PRO = 'a professional-grade matte black LED face mask WITH an attached neck panel below the chin, full coverage face and neck, glowing with warm red and near-infrared LEDs, wireless rechargeable, premium build with rose-gold accents';

const prompts = [
  // LFM-STARTER
  { file: 'starter-1-front.jpg', prompt: `Ultra premium product photography front view of ${STARTER}. Centered on dark navy marble, dramatic red and blue LED glow, deep navy background, studio lighting, photorealistic, no text, luxury beauty device` },
  { file: 'starter-2-angle.jpg', prompt: `Ultra premium product photography three quarter angle view of ${STARTER}. Side angle showing depth and contours, dark marble surface, warm red LED glow, navy background with subtle smoke, commercial photography, no text` },
  { file: 'starter-3-detail.jpg', prompt: `Close-up detail shot of ${STARTER}. Macro focus on the LED lights showing the red and blue individual LEDs glowing, dark background, dramatic lighting, commercial product detail photography, no text` },
  { file: 'starter-4-model.jpg', prompt: `Beautiful woman in her early 30s wearing ${STARTER} on her face, eyes closed relaxed, red and blue LED lights glowing through the mask onto her skin, dark spa bathroom, soft warm ambient lighting, editorial beauty photography, realistic, no text` },
  { file: 'starter-5-info.jpg', prompt: `Clean product infographic layout on dark navy background showing ${STARTER} in the center. Four labeled callout boxes: top left says 415nm Blue Light Kills Acne Bacteria, top right says 630nm Red Light Boosts Collagen, bottom left says 10 Min Sessions, bottom right says Safe for All Skin Types. Professional marketing material, clean white and rose-red text on navy, LumiRecover brand` },

  // LFM-7C
  { file: '7c-1-front.jpg', prompt: `Ultra premium product photography front view of ${SEVEN_C}. Centered on dark navy marble, multiple LED colors glowing creating rainbow prism effect, deep navy background, studio lighting, photorealistic, no text` },
  { file: '7c-2-angle.jpg', prompt: `Ultra premium product photography three quarter angle view of ${SEVEN_C}. Side angle showing lightweight profile, LEDs cycling through colors creating spectrum glow, dark marble, navy background, commercial photography, no text` },
  { file: '7c-3-detail.jpg', prompt: `Close-up detail of ${SEVEN_C}. Macro showing individual colored LEDs in red blue green yellow purple cyan white arranged across mask surface, all simultaneously lit, dark background, commercial photography, no text` },
  { file: '7c-4-model.jpg', prompt: `Beautiful woman in her mid 30s wearing ${SEVEN_C} on her face, eyes closed, multicolored LED lights casting soft colorful glow on her skin, modern minimalist bathroom, soft ambient lighting, editorial beauty photography, realistic, no text` },
  { file: '7c-5-info.jpg', prompt: `Clean product infographic on dark navy background showing ${SEVEN_C} in center. Seven color-coded callout lines: Red Anti-Aging, Blue Acne Control, Green Brightening, Yellow Calm Redness, Purple Repair, Cyan Firming, White Full Rejuvenation. Each label in its LED color, professional marketing layout, LumiRecover brand` },

  // LFM-PRO
  { file: 'pro-1-front.jpg', prompt: `Ultra premium product photography front view of ${PRO}. Centered on dark navy marble, full face and neck coverage with warm red LED glow, deep navy background with smoke, studio rim lighting, photorealistic, no text, flagship product` },
  { file: 'pro-2-angle.jpg', prompt: `Ultra premium product photography three quarter angle of ${PRO}. Side angle revealing neck extension panel and wireless design, warm red glow, dark marble, navy background, dramatic commercial photography, no text` },
  { file: 'pro-3-detail.jpg', prompt: `Close-up detail of ${PRO}. Focus on neck panel transition where face mask meets neck coverage, multiple LED wavelengths glowing, rose-gold trim visible, USB-C port, dark background, luxury product photography, no text` },
  { file: 'pro-4-model.jpg', prompt: `Beautiful woman in her late 30s wearing ${PRO} covering both face and neck, eyes closed, warm red glow illuminating jaw and neck, dark luxurious spa, relaxed and pampered look, editorial beauty photography, realistic, no text` },
  { file: 'pro-5-info.jpg', prompt: `Clean product infographic on dark navy background showing ${PRO} in center with neck panel visible. Callouts: Full Spectrum LED at top, Near-Infrared 830nm Deep Tissue pointing to forehead, Neck Coverage Where Aging Shows First pointing to neck, Wireless Rechargeable bottom left, 10 and 20 Min Modes bottom right. Rose-red and white text, LumiRecover brand` }
];

async function main() {
  let success = 0;
  let failed = 0;

  for (let i = 0; i < prompts.length; i++) {
    const { file, prompt } = prompts[i];
    const ok = await gen(prompt, file);
    if (ok) success++; else failed++;
    if (i < prompts.length - 1) {
      console.log(`  Waiting 8s (${i+1}/${prompts.length} done)...`);
      await sleep(8000);
    }
  }
  console.log(`\nCOMPLETE: ${success} generated, ${failed} failed`);
}

main().catch(console.error);
