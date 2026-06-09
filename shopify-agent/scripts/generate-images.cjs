const https = require('https');
const fs = require('fs');
const path = require('path');

const GEMINI_KEY = 'AIzaSyAf1hAgFVZth19XPzTBWyymCdtO0xal_8M';
const OUTPUT_DIR = 'C:/Users/jtfas/OneDrive/Documents/ClaudeCode/shopify-agent/generated_imgs';

const PROMPTS = [
  // ENTRY (Starter) - 5 images
  { file: 'starter_front.png', prompt: 'Professional product photography of a white translucent rigid plastic LED face mask with a separate neck panel attached by a hinge, glowing with multicolored LEDs (red, blue, green, yellow, purple, cyan, white). The mask sits on a dark slate surface with soft studio lighting. Gold accents on the mask edges. Clean, premium e-commerce style photo. No text.' },
  { file: 'starter_angle.png', prompt: 'Professional product photography, three-quarter angle view of a white translucent rigid plastic LED face mask showing the hinged neck panel connection, elastic head strap, and controller wire with a small control box. The mask glows with blue and red LEDs. Dark background with soft rim lighting. Premium e-commerce style. No text.' },
  { file: 'starter_detail.png', prompt: 'Extreme close-up macro photography of a white translucent rigid plastic surface with multiple small LED lights glowing in different colors (red, blue, green, purple) visible through the translucent white plastic material. Shallow depth of field, dark background. Premium product detail shot. No text.' },
  { file: 'starter_model.png', prompt: 'A woman in her 30s wearing a white translucent rigid plastic LED face mask that covers her face and neck. The mask glows with soft colored LED light (blue and red hues) illuminating her skin. She is in a minimalist spa setting with soft ambient lighting, wearing a white spa headband. The mask is clearly rigid white plastic, not flexible. Peaceful and premium atmosphere. No text.' },
  { file: 'starter_info.png', prompt: 'Clean product infographic on a dark navy blue background. A white translucent rigid plastic LED face mask with neck panel in the center, glowing with colored LEDs. Around the mask are 5 simple white text labels with thin white lines pointing to features: top left says 7 COLOR MODES, top right says 150 PLUS LEDs, bottom left says FACE PLUS NECK, bottom right says 10 MIN SESSIONS, bottom center says WIRED CONTROLLER. Clean modern sans-serif font. Minimalist design.' },

  // MID (7-Color) - 5 images
  { file: 'mid_front.png', prompt: 'Professional product photography of a premium white translucent rigid plastic LED face mask with integrated neck area, glowing with vibrant multicolored LEDs. Higher density of LED lights visible through the white plastic. The mask sits on a dark marble surface. Soft studio lighting with warm highlights. Clean e-commerce style. No text.' },
  { file: 'mid_angle.png', prompt: 'Professional product photography, three-quarter angle view of a white translucent rigid plastic LED face mask showing the full face and neck coverage, with a wired controller visible. The mask has dense rows of LED lights visible through the white translucent surface, glowing purple and green. Dark background, premium lighting. No text.' },
  { file: 'mid_detail.png', prompt: 'Extreme close-up of densely packed LED lights glowing through white translucent rigid plastic material. Multiple colors visible: red, blue, green, yellow. The LEDs are arranged in neat rows. Shallow depth of field showing the high LED density. Dark background. Premium macro product photography. No text.' },
  { file: 'mid_model.png', prompt: 'A beautiful woman in her early 30s wearing a white translucent rigid plastic LED face mask that covers her entire face and neck area. The mask glows with vivid multicolored LEDs (predominantly red and blue). She is in a luxurious bathroom spa setting with candles and plants in the background. Wearing a plush white robe. The mask is rigid white plastic. Serene premium atmosphere. No text.' },
  { file: 'mid_info.png', prompt: 'Clean product infographic on dark navy background. A white translucent rigid plastic LED face mask with integrated neck area in the center, glowing with colorful LEDs. Simple white text callout labels with thin lines: HIGH DENSITY LEDs on the left, 7 TARGETED WAVELENGTHS on the right, FULL FACE AND NECK at the top, DERMATOLOGIST RECOMMENDED at the bottom, 10 MIN DAILY at bottom right. Clean modern sans-serif font. Minimalist layout.' },

  // PREMIUM (Pro) - 5 images
  { file: 'pro_front.png', prompt: 'Professional product photography of a black flexible 3D silicone LED face mask with integrated neck zone. The mask is soft and flexible, lying on a dark marble surface. Red LED lights glow through the black silicone surface, creating a dramatic red glow pattern. The silicone texture is visible and looks soft. Wireless design with no cords. Premium luxury atmosphere. No text.' },
  { file: 'pro_angle.png', prompt: 'Professional product photography, three-quarter angle view of a black flexible silicone LED face mask showing the soft bendable material and 3D contoured shape. The mask is slightly flexed to demonstrate its flexibility. Red LEDs glow through the black silicone. No wires or cords visible, wireless design. Dark background with dramatic lighting. No text.' },
  { file: 'pro_detail.png', prompt: 'Extreme close-up macro photography of black silicone material with red LED lights glowing through the surface. The texture of the soft flexible silicone is clearly visible. The red 630nm LEDs create a warm glow pattern through the dark material. Shallow depth of field. Premium detail shot showing material quality. No text.' },
  { file: 'pro_model.png', prompt: 'A woman in her 30s wearing a black flexible silicone LED face mask that conforms to her face shape. Red LED lights glow through the black silicone, casting a warm red glow on her skin and neck. She is in a luxury spa setting with dim ambient lighting, dark decor. The mask is clearly black silicone (not white, not rigid). She looks relaxed. Premium and sophisticated atmosphere. No text.' },
  { file: 'pro_info.png', prompt: 'Clean product infographic on dark navy background. A black flexible silicone LED mask with red glowing LEDs in the center. Simple white text callout labels with thin lines: 352 LEDs on the left, DUAL ZONE FACE AND NECK on the right, WIRELESS PORTABLE at the top, 3 BRIGHTNESS LEVELS at the bottom left, 630nm PLUS 830nm WAVELENGTHS at the bottom right. Clean modern sans-serif font. Minimalist layout.' },

  // REFERENCE GRIDS (Task 4) - 3 images
  { file: 'grid_starter.png', prompt: 'A 2x2 grid layout on a clean white background showing 4 different angles of a white translucent rigid plastic LED face mask with neck panel: top-left shows front view, top-right shows side profile view, bottom-left shows back view showing straps, bottom-right shows three-quarter angle. The mask is not glowing, LEDs are off, showing the white translucent plastic material clearly. Each quadrant separated by thin light gray lines. Product reference sheet style. No text.' },
  { file: 'grid_mid.png', prompt: 'A 2x2 grid layout on a clean white background showing 4 different angles of a white translucent rigid plastic LED face mask with integrated neck: top-left shows front view, top-right shows side profile, bottom-left shows the neck area detail, bottom-right shows three-quarter angle. LEDs are off, showing white translucent plastic. Each quadrant separated by thin light gray lines. Product reference sheet style. No text.' },
  { file: 'grid_pro.png', prompt: 'A 2x2 grid layout on a clean white background showing 4 different angles of a black flexible 3D silicone LED face mask: top-left shows front view, top-right shows side profile, bottom-left shows the mask being flexed to demonstrate softness, bottom-right shows three-quarter angle. LEDs are off, showing the black silicone texture. Each quadrant separated by thin light gray lines. Product reference sheet style. No text.' },

  // HERO BANNER (Task 5)
  { file: 'hero_banner.png', prompt: 'Wide 16:9 cinematic product photography showing three LED face masks arranged left to right on a dark navy surface with subtle smoke wisps. Left: a white translucent rigid plastic LED mask glowing with multicolored LEDs. Center: a slightly larger white translucent rigid plastic LED mask with denser LED array glowing colorfully. Right: a black flexible silicone LED mask glowing with deep red LEDs. Each mask has its own pool of colored light reflecting on the surface. Premium spa atmosphere with dark moody lighting. No text overlay. Luxury beauty brand aesthetic.' }
];

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

async function generateImage(prompt, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const result = await new Promise((resolve, reject) => {
        const body = JSON.stringify({
          contents: [{
            parts: [{ text: prompt + ' High resolution, photorealistic, 8K quality.' }]
          }],
          generationConfig: {
            responseModalities: ['IMAGE', 'TEXT']
          }
        });

        const options = {
          hostname: 'generativelanguage.googleapis.com',
          path: '/v1beta/models/gemini-2.5-flash-image:generateContent?key=' + GEMINI_KEY,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(body)
          }
        };

        const req = https.request(options, res => {
          let data = '';
          res.on('data', c => data += c);
          res.on('end', () => {
            if (res.statusCode === 429) {
              reject(new Error('RATE_LIMIT'));
              return;
            }
            try {
              const parsed = JSON.parse(data);
              if (parsed.candidates && parsed.candidates[0] && parsed.candidates[0].content) {
                const parts = parsed.candidates[0].content.parts;
                for (const part of parts) {
                  if (part.inlineData) {
                    resolve(part.inlineData.data);
                    return;
                  }
                }
              }
              reject(new Error('No image in response: ' + data.substring(0, 500)));
            } catch (e) {
              reject(new Error('Parse error: ' + e.message + ' data: ' + data.substring(0, 300)));
            }
          });
        });
        req.on('error', reject);
        req.setTimeout(120000, () => { req.destroy(); reject(new Error('Timeout')); });
        req.write(body);
        req.end();
      });
      return result;
    } catch (err) {
      console.log(`  Attempt ${attempt}/${retries} failed: ${err.message}`);
      if (attempt < retries) {
        const backoff = err.message === 'RATE_LIMIT' ? 30000 * attempt : 10000 * attempt;
        console.log(`  Waiting ${backoff/1000}s before retry...`);
        await delay(backoff);
      } else {
        return null;
      }
    }
  }
}

async function main() {
  console.log(`Starting generation of ${PROMPTS.length} images...`);
  const results = { success: [], failed: [] };

  for (let i = 0; i < PROMPTS.length; i++) {
    const { file, prompt } = PROMPTS[i];
    const filePath = path.join(OUTPUT_DIR, file);
    console.log(`\n[${i+1}/${PROMPTS.length}] Generating ${file}...`);

    const imageData = await generateImage(prompt);
    if (imageData) {
      fs.writeFileSync(filePath, Buffer.from(imageData, 'base64'));
      const size = fs.statSync(filePath).size;
      console.log(`  SUCCESS: ${file} (${(size/1024).toFixed(0)} KB)`);
      results.success.push(file);
    } else {
      console.log(`  FAILED: ${file} - skipping`);
      results.failed.push(file);
    }

    if (i < PROMPTS.length - 1) {
      console.log('  Waiting 10s before next generation...');
      await delay(10000);
    }
  }

  console.log('\n=== GENERATION COMPLETE ===');
  console.log(`Success: ${results.success.length}/${PROMPTS.length}`);
  console.log(`Failed: ${results.failed.length}`);
  if (results.failed.length > 0) console.log('Failed files:', results.failed);
}

main().catch(console.error);
