import { GoogleGenAI, Modality } from '@google/genai';
import { writeFileSync } from 'fs';

const ai = new GoogleGenAI({ apiKey: 'AIzaSyAf1hAgFVZth19XPzTBWyymCdtO0xal_8M' });
const OUT = 'C:/Users/jtfas/OneDrive/Documents/ClaudeCode/shopify-agent/generated_imgs';
const sleep = ms => new Promise(r => setTimeout(r, ms));

const MASK = 'a premium matte black LED face mask with dense rows of small circular glowing red LED lights arranged in a grid pattern across the forehead cheeks nose and chin. Thin rose-gold metallic trim along the outer edge. A small circular power button on the right cheek. Black elastic strap at the temples. Smooth matte black surface. No text or branding on the mask. The mask extends with a connected neck panel below the chin that also has rows of red LEDs and rose-gold trim separating it from the face section';

const prompts = [
  { file: 'pro-new-1-front.jpg', prompt: `Ultra premium product photography straight front view of ${MASK}. The mask sits upright on a dark navy marble surface with subtle smoke wisps. All red LEDs are glowing brightly creating warm ambient light on the marble. Deep navy background with dramatic studio rim lighting from behind. Centered composition, commercial beauty device photography, photorealistic, sharp focus, no text, 4:3 aspect ratio` },
  
  { file: 'pro-new-2-angle.jpg', prompt: `Ultra premium product photography three quarter angle view from the right side of ${MASK}. The mask sits on dark navy marble showing the depth profile, the strap attachment at the temple, and the power button. Red LEDs glowing warmly, rose-gold trim catching the light. Navy background with subtle smoke, studio rim lighting, commercial photography, photorealistic, no text, 4:3` },
  
  { file: 'pro-new-3-detail.jpg', prompt: `Close-up macro detail shot of ${MASK} focusing on the junction where the face panel meets the neck panel. Rose-gold trim divider clearly visible between face and neck sections. Individual red LED lights in sharp focus showing the grid arrangement. The matte black texture of the surface visible. Dark moody background, dramatic side lighting highlighting the rose-gold accents, product detail photography, photorealistic, no text, 4:3` },
  
  { file: 'pro-new-4-model.jpg', prompt: `A woman in her early 30s with dark hair pulled back wearing ${MASK} on her face and neck. She is reclined on a modern couch in a cozy dimly lit living room. The red LED glow illuminates her skin warmly around the mask edges on her temples and jawline. She looks relaxed with hands resting, serene spa atmosphere, warm golden ambient light, candles in soft background blur, editorial lifestyle photography, photorealistic natural skin texture, no text, 4:3` },
  
  { file: 'pro-new-5-info.jpg', prompt: `Clean product infographic on deep navy background showing ${MASK} centered at a slight angle. Five labeled feature callouts with thin white lines pointing to specific areas of the mask: FULL SPECTRUM LED pointing to the forehead area, NEAR-INFRARED 830nm pointing to the cheek LEDs, NECK COVERAGE pointing to the neck panel, WIRELESS RECHARGEABLE with a battery icon at bottom left, 10 AND 20 MIN MODES at bottom right. Text in clean white and rose-red on navy. LumiRecover brand name at the bottom center. Professional marketing infographic style, premium and minimal` }
];

async function gen(prompt, filename) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      console.log('Generating: ' + filename + '...');
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: prompt,
        config: { responseModalities: [Modality.TEXT, Modality.IMAGE] }
      });
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const buf = Buffer.from(part.inlineData.data, 'base64');
          writeFileSync(OUT + '/' + filename, buf);
          console.log('  OK ' + filename + ' (' + Math.round(buf.length/1024) + 'KB)');
          return true;
        }
      }
      return false;
    } catch(e) {
      if (e.message.includes('429')) {
        console.log('  RATE LIMITED, waiting ' + ((attempt+1)*15) + 's...');
        await sleep((attempt+1) * 15000);
      } else {
        console.log('  ERR: ' + e.message.substring(0,100));
        return false;
      }
    }
  }
  return false;
}

async function main() {
  let ok = 0;
  for (let i = 0; i < prompts.length; i++) {
    if (await gen(prompts[i].prompt, prompts[i].file)) ok++;
    if (i < prompts.length - 1) {
      console.log('  Waiting 10s (' + (i+1) + '/5)...');
      await sleep(10000);
    }
  }
  console.log('\nDONE: ' + ok + '/5 generated');
}
main();
