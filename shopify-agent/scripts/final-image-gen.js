import { GoogleGenAI, Modality } from '@google/genai';
import { writeFileSync, mkdirSync } from 'fs';

const ai = new GoogleGenAI({ apiKey: 'AIzaSyAf1hAgFVZth19XPzTBWyymCdtO0xal_8M' });
const OUT = 'C:/Users/jtfas/OneDrive/Documents/ClaudeCode/shopify-agent/generated_imgs';
mkdirSync(OUT, { recursive: true });
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function gen(prompt, filename) {
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      console.log(`[${new Date().toLocaleTimeString()}] Generating: ${filename}...`);
      const r = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: prompt,
        config: { responseModalities: [Modality.TEXT, Modality.IMAGE] }
      });
      for (const part of r.candidates[0].content.parts) {
        if (part.inlineData) {
          const buf = Buffer.from(part.inlineData.data, 'base64');
          writeFileSync(`${OUT}/${filename}`, buf);
          console.log(`  OK (${Math.round(buf.length/1024)}KB)`);
          return true;
        }
      }
      return false;
    } catch(e) {
      if (e.message.includes('429')) {
        const w = (attempt + 1) * 20;
        console.log(`  RATE LIMITED, waiting ${w}s...`);
        await sleep(w * 1000);
      } else {
        console.log(`  ERR: ${e.message.substring(0, 80)}`);
        await sleep(10000);
      }
    }
  }
  return false;
}

const WHITE_MASK = 'a WHITE semi-translucent rigid plastic LED face mask with a separate hinged neck panel below the chin. The white plastic glows when LEDs are on inside. Eye holes and nostril openings visible. Black elastic head strap at temples. A thin black wire runs from the bottom to a small white handheld controller box with buttons';
const BLACK_MASK = 'a BLACK flexible 3D silicone LED face mask with integrated neck coverage in one seamless piece. 352 red LEDs glow through the black silicone surface. The silicone is soft and bends. Wireless with no wires or controller. Compact and modern. Red LED glow visible through the dark material';

const prompts = [
  // HERO BANNER
  { file: 'v3-hero.jpg', prompt: `Premium product photography showing three LED face masks arranged left to right on dark navy marble with subtle smoke. Left: ${WHITE_MASK} glowing with rainbow LED colors. Center: similar white mask glowing blue, slightly larger with more LEDs. Right: ${BLACK_MASK} glowing red. All three sit on dark navy marble surface. Deep navy background. Dramatic studio rim lighting. Premium spa aesthetic. 16:9 wide landscape. No text. Commercial photography` },

  // ENTRY (white, 7-color)
  { file: 'v3-entry-1.jpg', prompt: `Product photography front view of ${WHITE_MASK}. LEDs glowing red through the white translucent plastic. Controller box beside it with wire connected. Dark surface, dark background, studio lighting. Commercial product photography, no text` },
  { file: 'v3-entry-2.jpg', prompt: `Product photography three quarter angle of ${WHITE_MASK}. Showing the hinged neck panel connection, elastic strap at the temple, and wire running to white controller box. LEDs glowing green through the white plastic. Dark background, studio lighting, no text` },
  { file: 'v3-entry-3.jpg', prompt: `Close-up detail of ${WHITE_MASK}. Macro showing individual colored LEDs in red blue green yellow purple glowing through the white translucent plastic surface. The semi-translucent material texture visible. Dark background, product macro photography, no text` },
  { file: 'v3-entry-4.jpg', prompt: `A woman in her early 30s with dark hair pulled back wearing ${WHITE_MASK} with red LEDs glowing through the white plastic on her face and neck. She is relaxed on a modern sofa, warm living room lighting, the controller rests on the cushion beside her. Red glow illuminates the space around her face. Editorial lifestyle photo, natural skin texture, no text` },
  { file: 'v3-entry-5.jpg', prompt: `Clean infographic on dark navy background showing ${WHITE_MASK} centered with colorful LEDs glowing. Five short labels with thin lines pointing to the mask: 7 COLOR MODES at top, 150 LEDs on left, FACE AND NECK on right, 10 MIN SESSIONS bottom left, SAFE FOR ALL SKIN bottom right. Clean white text on navy. LumiRecover at bottom center. Minimal professional marketing design` },

  // MID (white, 7-color, 192 LEDs)
  { file: 'v3-mid-1.jpg', prompt: `Product photography front view of ${WHITE_MASK} with denser LED arrangement showing 192 LEDs. Glowing bright red through white plastic. Neck panel visible below. Controller beside it. Dark surface, dark background, premium studio lighting, no text` },
  { file: 'v3-mid-2.jpg', prompt: `Product photography three quarter angle of ${WHITE_MASK} with 192 LEDs showing the depth, neck hinge, strap, and wire to controller. Glowing with blue light. Dark background, commercial photography, no text` },
  { file: 'v3-mid-3.jpg', prompt: `Close-up of the neck panel hinge of ${WHITE_MASK}. Showing where the face section connects to the neck section with a hinge. Red LEDs glowing through both sections. Detail of the translucent white plastic material. Dark background, macro product photography, no text` },
  { file: 'v3-mid-4.jpg', prompt: `A woman in her mid 30s lying back on pillows wearing ${WHITE_MASK} with the neck panel covering her neck. Blue LEDs glowing through the white mask. Dark spa setting with candles in background. The wire and controller rest on the pillow. Serene relaxed expression visible around mask edges. Editorial beauty photography, no text` },
  { file: 'v3-mid-5.jpg', prompt: `Clean infographic on dark navy background showing ${WHITE_MASK} with 192 LEDs glowing in multiple colors. Labels: 192 HIGH-DENSITY LEDs at top, 7 WAVELENGTHS on left, FULL NECK COVERAGE on right pointing to neck panel, EASY CONTROLLER at bottom left pointing to controller box, CLINICAL WAVELENGTHS at bottom right. White text on navy. LumiRecover at bottom` },

  // PREMIUM (black silicone, wireless)
  { file: 'v3-pro-1.jpg', prompt: `Product photography front view of ${BLACK_MASK}. Red LEDs glowing through the dark silicone creating a dramatic effect. Sitting on dark marble. Deep navy background with subtle smoke. Premium studio rim lighting from behind. High-end beauty device feel. No text` },
  { file: 'v3-pro-2.jpg', prompt: `Product photography three quarter angle of ${BLACK_MASK}. Showing the flexibility of the silicone material, the seamless face-to-neck integration, no wires visible. Red LED glow. Dark marble, dramatic lighting, no text` },
  { file: 'v3-pro-3.jpg', prompt: `Close-up of ${BLACK_MASK}. A hand gently bending the flexible black silicone edge to demonstrate how soft and bendable it is, while red LEDs glow through the material. Showing the silicone texture and flexibility. Dark background, product macro, no text` },
  { file: 'v3-pro-4.jpg', prompt: `A woman in her late 30s wearing ${BLACK_MASK} with red LEDs glowing through the black silicone on her face and neck. She is reclined in a luxurious dark spa with ambient warm lighting. No wires visible because it is wireless. The red glow creates beautiful ambiance on her skin. Premium editorial beauty photography, no text` },
  { file: 'v3-pro-5.jpg', prompt: `Clean infographic on dark navy background showing ${BLACK_MASK} centered with red LEDs glowing. Labels: 352 LEDs at top, DUAL ZONE FACE AND NECK on left, WIRELESS RECHARGEABLE on right, 3 BRIGHTNESS LEVELS bottom left, 630nm PLUS 830nm INFRARED bottom right. White and rose-red text on navy. LumiRecover at bottom` },

  // 2x2 GRIDS
  { file: 'v3-grid-entry.jpg', prompt: `2x2 grid of 4 photos of the SAME white translucent rigid plastic LED face mask with hinged neck panel on white background. Top-left: front with red LEDs. Top-right: 3/4 angle with LEDs off showing plain white plastic. Bottom-left: back interior showing LED bulbs. Bottom-right: side profile showing neck hinge and strap. All identical mask. Clean studio catalog photography. 1:1 square` },
  { file: 'v3-grid-mid.jpg', prompt: `2x2 grid of 4 photos of the SAME white translucent rigid plastic LED face mask with 192 LEDs and neck panel on white background. Top-left: front with blue LEDs glowing. Top-right: 3/4 angle with red LEDs. Bottom-left: multi-color LEDs showing 7 color capability. Bottom-right: showing controller box and wire. All identical mask. Clean studio. 1:1 square` },
  { file: 'v3-grid-pro.jpg', prompt: `2x2 grid of 4 photos of the SAME black flexible silicone LED face mask with integrated neck on white background. Top-left: front view with red LEDs glowing through black silicone. Top-right: hand bending the mask to show flexibility. Bottom-left: the mask laid flat showing thin flexible profile. Bottom-right: close-up of USB-C charging port. All identical mask. Clean studio. 1:1 square` }
];

async function main() {
  let ok = 0, fail = 0;
  for (let i = 0; i < prompts.length; i++) {
    if (await gen(prompts[i].prompt, prompts[i].file)) ok++; else fail++;
    if (i < prompts.length - 1) {
      console.log(`  [${ok + fail}/${prompts.length}] Waiting 10s...`);
      await sleep(10000);
    }
  }
  console.log(`\nCOMPLETE: ${ok}/${prompts.length} generated, ${fail} failed`);
}
main();
