import { GoogleGenAI, Modality } from '@google/genai';
import { writeFileSync, mkdirSync } from 'fs';

const ai = new GoogleGenAI({ apiKey: 'AIzaSyAf1hAgFVZth19XPzTBWyymCdtO0xal_8M' });
const OUT = 'C:/Users/jtfas/OneDrive/Documents/ClaudeCode/shopify-agent/generated_imgs';
mkdirSync(OUT, { recursive: true });
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function gen(prompt, filename, model = 'gemini-2.5-flash-image') {
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      console.log(`Generating: ${filename}...`);
      const response = await ai.models.generateContent({
        model,
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
      return false;
    } catch(e) {
      if (e.message.includes('429')) {
        const wait = (attempt + 1) * 20000;
        console.log(`  RATE LIMITED, waiting ${wait/1000}s...`);
        await sleep(wait);
      } else {
        console.log(`  ERR: ${e.message.substring(0, 120)}`);
        if (attempt < 3) { await sleep(10000); } else return false;
      }
    }
  }
  return false;
}

// REAL PRODUCT DESCRIPTIONS
const ENTRY = 'a WHITE semi-translucent rigid plastic LED face mask that covers only the face with no neck panel. The mask is a smooth white plastic face shield shape with eye holes and nostril openings. When the red LEDs are on, the entire face section glows red through the translucent white plastic. It has a simple black elastic head strap. A thin wire runs from the bottom of the mask to a small white handheld controller box with buttons. The controller connects to a wall plug. 150 LED beads inside. When the LEDs are OFF it looks like a plain white plastic face shield';

const MID = 'a WHITE semi-translucent rigid plastic LED face mask with a SEPARATE neck panel that hinges below the chin. Both the face section and neck section are white translucent rigid plastic. When the LEDs are on, both face and neck glow the selected color through the white plastic. 192 LED beads total. Black elastic head strap. A wire runs from the mask to a small white controller box then to a wall plug. The neck panel hangs below the chin and covers the front of the neck. 7 color modes available. When glowing red, the entire mask and neck piece emit a warm red light through the white plastic';

const PREMIUM = 'a FLEXIBLE white or light pink translucent SILICONE LED face mask with integrated neck coverage that bends and conforms to the face shape. The silicone material is soft and flexible, not rigid. LEDs glow through the silicone surface. 168 LED beads. WIRELESS design with no external wires, rechargeable via USB-C. No controller box needed. When the red LEDs are on, the soft silicone glows warmly. The neck portion is integrated seamlessly with the face section, not a separate hinged piece. Comfortable enough to wear while relaxing';

const prompts = [
  // === HERO BANNER ===
  { file: 'hero-real-mask.jpg', prompt: `Ultra premium product photography of ${MID} sitting upright on a dark navy marble surface with subtle smoke wisps. The mask is glowing bright red through its white translucent plastic, creating a beautiful warm glow on the marble surface. Deep navy #1A1A2E background with dramatic studio rim lighting from behind creating a halo effect. The white mask contrasts beautifully against the dark background. The red LED glow is the hero visual. Premium spa atmosphere. Commercial photography, photorealistic, 16:9 landscape, no text` },

  // === ENTRY MASK (5 photos) ===
  { file: 'real-starter-1-front.jpg', prompt: `Product photography front view of ${ENTRY} with LEDs glowing red. The mask sits upright on a dark surface. The white translucent plastic glows warmly with red light from inside. Clean dark background with soft studio lighting. Commercial product photography, photorealistic, no text` },
  { file: 'real-starter-2-angle.jpg', prompt: `Product photography three quarter angle of ${ENTRY} with LEDs glowing red. Showing the depth of the mask, the elastic strap visible on the side, and the wire running to the controller box which sits beside the mask. Dark background, studio lighting, photorealistic, no text` },
  { file: 'real-starter-3-detail.jpg', prompt: `Close-up detail shot of ${ENTRY} with LEDs glowing. Macro focus on the translucent white plastic surface showing the individual LED beads glowing red through the plastic. The texture of the semi-translucent material is visible. Dark background, product photography, no text` },
  { file: 'real-starter-4-model.jpg', prompt: `A woman in her early 30s with dark hair pulled back wearing ${ENTRY} with the red LEDs glowing on her face. The white translucent mask sits on her face, the red glow illuminates her skin around the edges. She is relaxed on a couch in a modern living room with warm ambient lighting. The elastic strap visible behind her head. The wire and controller visible resting on the couch beside her. Editorial lifestyle photography, natural skin texture, no text` },
  { file: 'real-starter-5-info.jpg', prompt: `Clean product infographic on deep navy background showing ${ENTRY} centered with LEDs glowing red. Three labeled callouts: 630nm RED LIGHT pointing to the face area, 415nm BLUE LIGHT pointing to another area, 150 LED BEADS at the bottom. Text says 3 COLOR MODES at top. Clean white text on navy background. LumiRecover brand name at bottom. Professional marketing infographic, minimal clean design` },

  // === MID MASK (5 photos) ===
  { file: 'real-7c-1-front.jpg', prompt: `Product photography front view of ${MID} with all LEDs glowing in different colors showing the 7-color capability. The white translucent face section glows with mixed colorful light, the neck panel below glows separately. Sitting upright on a dark surface. Dark background with studio lighting. Commercial photography, photorealistic, no text` },
  { file: 'real-7c-2-angle.jpg', prompt: `Product photography three quarter angle of ${MID} with LEDs glowing red. Showing how the neck panel hinges below the chin, the elastic strap, and the controller wire. The white plastic glows warmly. Dark background, studio lighting, photorealistic, no text` },
  { file: 'real-7c-3-detail.jpg', prompt: `Close-up detail of ${MID} showing the hinge connection between the face section and the neck panel. Both sections are white translucent plastic with red LEDs glowing through. The seam and hinge mechanism visible. Dark background, macro product photography, no text` },
  { file: 'real-7c-4-model.jpg', prompt: `A woman in her mid 30s wearing ${MID} with red LEDs glowing on both her face and neck. The white translucent mask covers her face, the neck panel covers her neck below the chin. Red glow illuminates her skin around the mask edges. She is lying back on pillows in a dark spa-like setting with candles in soft background. The controller rests beside her. Editorial beauty photography, realistic, no text` },
  { file: 'real-7c-5-info.jpg', prompt: `Clean product infographic on deep navy background showing ${MID} centered with colorful LEDs glowing. Seven color-coded callout lines: Red Anti-Aging, Blue Acne Control, Green Brightening, Yellow Calm Redness, Purple Repair, Cyan Firming, White Full Rejuvenation. Text says 192 LED BEADS and FACE plus NECK COVERAGE. Clean design, each label in its LED color. LumiRecover brand at bottom` },

  // === PREMIUM MASK (5 photos) ===
  { file: 'real-pro-1-front.jpg', prompt: `Product photography front view of ${PREMIUM} with LEDs glowing red. The soft flexible silicone mask sits on a dark surface, its translucent material glowing warmly with red light. The integrated neck portion visible below. No wires visible because it is wireless. Dark background with studio lighting. Premium feel, photorealistic, no text` },
  { file: 'real-pro-2-angle.jpg', prompt: `Product photography three quarter angle of ${PREMIUM} with LEDs glowing red. Showing the flexible silicone material slightly bending and conforming, the integrated seamless neck coverage, and the clean wireless design with no wires or controller. Small USB-C port visible on the side. Dark background, studio lighting, photorealistic, no text` },
  { file: 'real-pro-3-detail.jpg', prompt: `Close-up detail of ${PREMIUM} showing the soft flexible silicone material texture with LED beads glowing red through it. The silicone surface has a soft matte finish. Fingers gently bending the edge to show flexibility. Dark background, macro product photography, no text` },
  { file: 'real-pro-4-model.jpg', prompt: `A woman in her late 30s wearing ${PREMIUM} with red LEDs glowing softly through the flexible silicone on her face and neck. The mask conforms naturally to her face contours because it is flexible silicone. No wires visible. She is relaxed in a luxurious dark spa setting. The soft red glow creates a beautiful ambiance. Editorial beauty photography, realistic natural skin, no text` },
  { file: 'real-pro-5-info.jpg', prompt: `Clean product infographic on deep navy background showing ${PREMIUM} centered with red LEDs glowing through the soft silicone. Callouts: FULL SPECTRUM LED at top, FLEXIBLE SILICONE MATERIAL pointing to the surface, WIRELESS RECHARGEABLE with USB-C icon at bottom left, FACE plus NECK INTEGRATED pointing to the neck area, 10 AND 20 MIN MODES at bottom right. 168 LED BEADS. Clean white text on navy. LumiRecover brand at bottom` },

  // === 2x2 REFERENCE GRIDS ===
  { file: 'ref-grid-entry.jpg', prompt: `A 2x2 grid of 4 product photos of the EXACT SAME white translucent rigid plastic LED face mask (face only, no neck). All on white background. Top-left: front view with red LEDs glowing. Top-right: three quarter angle with LEDs off showing plain white plastic. Bottom-left: back/interior view showing LED bulbs. Bottom-right: side profile showing depth. All 4 must be the identical mask, same white translucent plastic, consistent design. Clean studio product photography. 1:1 square grid` },
  { file: 'ref-grid-mid.jpg', prompt: `A 2x2 grid of 4 product photos of the EXACT SAME white translucent rigid plastic LED face mask WITH attached neck panel. All on white background. Top-left: front view with red LEDs glowing through white plastic, neck panel visible. Top-right: three quarter angle showing neck hinge. Bottom-left: the mask with different color LEDs (showing 7-color capability). Bottom-right: side view showing strap and wire to controller. All 4 identical mask. Studio photography. 1:1 square grid` },
  { file: 'ref-grid-pro.jpg', prompt: `A 2x2 grid of 4 product photos of the EXACT SAME flexible silicone LED face mask with integrated neck coverage. All on white background. Top-left: front view with red LEDs glowing through flexible silicone. Top-right: someone bending the mask to show flexibility. Bottom-left: the mask flat showing how thin and flexible the silicone is. Bottom-right: view showing the USB-C charging port. All 4 identical mask, same flexible translucent silicone. Clean studio photography. 1:1 square grid` }
];

async function main() {
  let ok = 0, fail = 0;
  for (let i = 0; i < prompts.length; i++) {
    const success = await gen(prompts[i].prompt, prompts[i].file);
    if (success) ok++; else fail++;
    if (i < prompts.length - 1) {
      console.log(`  Waiting 10s (${i+1}/${prompts.length})...`);
      await sleep(10000);
    }
  }
  console.log(`\nCOMPLETE: ${ok} generated, ${fail} failed out of ${prompts.length}`);
}
main();
