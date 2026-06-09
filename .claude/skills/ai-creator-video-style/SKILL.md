---
name: ai-creator-video-style
description: Edit short-form vertical videos (Reels/TikTok/Shorts) in the editing style of AI/automation creators studied from sample footage. Use when the user wants a Remotion-based post-edit pass that mimics the caption system, b-roll treatment, floating-UI composites, and color grade of these creators. Covers two distinct sub-styles (Daylight Apartment and Dark Studio) with copy-paste Remotion recipes for each.
---

# AI Creator Video Style

Codified editing system derived from teardown of 3 Reels in the AI/automation creator niche (n8n, Manus AI, AI automation tutorials). The 3 source videos split across **two different creators** with distinct but related styles. Both are documented here — pick one or blend them per video.

**Source files studied:** `sybago-ads/research/creator-videos/video-1.mp4` (30s, Daylight), `video-2.mp4` (64s, Daylight), `video-3.mp4` (90s, Studio). Extracted frames in `sybago-ads/research/frames/v1–v3/`.

## When to use this skill

- User wants to re-edit footage in this creator's style
- User is building Reels/Shorts/TikToks in the AI/tech-demo niche
- User asks for "premium" polish that matches a specific creator aesthetic
- User provides additional reference videos from this niche and wants the style extended

## The two styles at a glance

| Axis | **Daylight Apartment** (Creator 1, v1+v2) | **Dark Studio** (Creator 2, v3) |
|---|---|---|
| Setting | Modern apartment, floor-to-ceiling windows, natural daylight | Dark studio, vertical LED light bars behind subject |
| Wardrobe | White/cream oversized tee, black over-ear headphones, black-framed glasses | Printed bucket hat (animal print), olive oversized sweatshirt |
| Mood | Clean, bright, professional-calm | Moody, cinematic, late-night-tech |
| Caption style | White, soft drop-shadow, chest-height on subject | White with **outer white glow/bloom**, ALL CAPS with terminal period |
| B-roll technique | **Tilted 3D perspective screens** on dark gradient + huge black text integrated | **Stacked split-screen** (top: full UI screenshot / bottom: A-roll) with caption bridging the seam |
| Signature moves | Floating iMessage bubbles + brand logos composited into A-roll | Captions that glow and feel "lit from within" |
| Pacing | 2-4 word caption phrases, ~0.5-1s each | Single-word emphasis, ALL CAPS bursts |

## Universal DNA (both styles share)

- **23.976 fps** (not 30fps) — cinematic export, not mobile-default
- **1080×1920** vertical output, 9:16
- **Locked camera** — no handheld, no pans, no zoom during A-roll
- **Medium shot** — creator framed waist-up, centered
- **Heavy sans-serif captions** (Inter / SF Pro / similar geometric at 700-800 weight)
- **One thought per caption beat** — captions are the pacing metronome; never full sentences
- **Captions are PART of the composition**, not overlays — they sit within the frame's visual weight, sized to demand attention
- **App UI screenshots** are the primary b-roll — not stock footage, not generic graphics
- **Floating iMessage blue bubbles** used as a signature to highlight brand names or key terms (used by BOTH creators)
- **Brand logo composites** — when naming a product, the product's actual logo floats into the A-roll frame
- **Hook in first 1-2s** is a claim or tease that forces the viewer to stay

## Style 1 — Daylight Apartment (Creator 1, videos v1 + v2)

### A-roll specs
- Locked camera, medium shot, creator centered
- Natural window light (blue/cool cast)
- Background: white wall + floor-to-ceiling window with trees visible outside
- Creator props: black desk pad, MacBook (dark), Magic Mouse, Stanley tumbler, lavalier mic clipped to shirt
- Shirt is always light/cream to contrast the darker desk foreground
- Creator uses **active hand gestures** during delivery — open palms, pointing, explaining

### Caption system
- **Font:** Inter 800 (or SF Pro Display Heavy)
- **Size:** ~110-140px on 1080w canvas (equivalent to ~70-90px on the 720w Instagram-compressed version)
- **Weight:** 800 (heaviest available)
- **Color:** `#FFFFFF`
- **Effect:** soft drop shadow — `text-shadow: 0 4px 12px rgba(0,0,0,0.35)` — NOT a hard stroke, NOT a background box
- **Position:** vertically centered on the subject's upper body, around chest height
- **Timing:** 2-4 words per caption, swap every 0.5-1s
- **Punctuation preserved** — commas and periods appear mid-caption ("a business and", "and receipts,", "an invoice parser.")
- **Never all caps on A-roll** — mixed case with punctuation

### B-roll system
- **Dark purple/navy gradient background** — `linear-gradient(135deg, #1a0f2e, #2d1a4d)` approximates it
- **Tilted 3D perspective** on screen captures — rotate X: 12-18°, rotate Y: -8 to -15°, rotate Z: -4 to -8°
- **Huge black text** integrated into the b-roll composition — this is NOT the standard caption treatment; it's a separate layer that partially overlaps the tilted UI
  - Font: same sans-serif, 800 weight, but BLACK color
  - Size: even larger than A-roll captions (~160-200px on 1080w)
  - Positioning: breaks the 4th wall — crosses the tilted screen, making it look like one unified composition
- **Animated cursor graphics** on screen captures (pointing at key rows)
- **Occasional spherical/wrap distortion** for emphasis (see the Google Sheets "globe" frame at v1 t18s)
- **Brand logos** appear composited into A-roll (e.g., "manus" wordmark floats over creator's tee at v2 t4s)

### Color grade
- **Saturation:** 1.05 (slightly muted)
- **Contrast:** 1.04
- **Temperature:** slight cool shift (toward blue)
- **Lifted blacks** — not crushed, cinematic feel
- **Skin tones:** preserved but desaturated ~10%

### CSS filter recipe
```css
filter: saturate(1.05) contrast(1.04) brightness(1.01) hue-rotate(-3deg);
```

## Style 2 — Dark Studio (Creator 2, video v3)

### A-roll specs
- Dark studio set, vertical LED light bars (white/blue) behind subject as key visual element
- Rim lighting on creator, moody low-key
- Creator framed with bucket hat signature (instantly recognizable)
- MacBook visible bottom of frame — Apple logo centered
- Creator often **looks down at laptop during b-roll split-screens**

### Caption system (DIFFERENT from Style 1)
- **Font:** bold condensed sans-serif (think Impact or a heavy condensed geometric)
- **Size:** ~100-130px on 1080w canvas
- **Color:** `#FFFFFF`
- **Effect:** **outer glow/bloom** — this is the key distinguishing feature — `text-shadow: 0 0 20px rgba(255,255,255,0.9), 0 0 40px rgba(255,255,255,0.5), 0 4px 10px rgba(0,0,0,0.5)`
- **Style:** ALL CAPS, often ending with a terminal period for emphasis (`"CASE."`, `"TRIGGER."`, `"SPREADSHEET."`)
- **Position:** on the horizontal line between A-roll and B-roll in split-screen shots, OR at chest level in pure A-roll shots
- **Timing:** single word or 2-word punch, hit hard on the key word of a sentence

### B-roll system — Split-Screen (signature technique)
The defining move of this style. Most b-roll shots are structured as:

```
┌─────────────────────┐
│                     │
│   App UI screenshot │  ← top half, full-width, white bg
│   (full screen)     │
│                     │
├─── CAPTION ─────────┤  ← caption sits on the seam
│                     │
│   Creator A-roll    │  ← bottom half, dark studio
│   (bucket hat)      │
│                     │
└─────────────────────┘
```

- Split ratio: ~50/50 vertical
- Seam is sharp (no blend)
- Caption straddles the seam — caption's vertical center sits right on the horizontal boundary
- Caption provides narrative glue between what the UI is showing and what the creator is saying

### Pure A-roll (between split-screens)
- Still the same dark studio
- Caption at chest height
- Same glow treatment
- Used for transitions and emotional beats

### Color grade
- **Deep blacks** (crushed, 0.95 lift)
- **High contrast** (1.15)
- **Cool temperature** — LED panels push blue
- **Warm highlights** — key light on skin is warm, creating teal-and-orange separation

### CSS filter recipe
```css
filter: saturate(1.15) contrast(1.15) brightness(0.95);
```

Combined with a subtle teal-orange split-tone (can be done with a color overlay layer set to `mix-blend-mode: color` at 10% opacity).

## Shared signature techniques (used by BOTH styles)

### 1. Floating iMessage bubble
Both creators use a blue iMessage bubble composited into A-roll to emphasize brand names or key terms.

- Asset: SF Pro rendered iMessage bubble, blue gradient (`linear-gradient(#0099ff, #0066cc)`)
- White text inside, SF Pro 500 weight
- Sits in mid-chest area of the creator
- Usually has a subtle drop shadow to feel floaty
- Enters with a spring scale-in animation
- Examples: v1 t29.5s "Invoice", v2 t63s "Manus", v3 t88s "Lead"

### 2. Brand logo composite
When saying a product name, the product's actual logo + wordmark floats into frame.

- Positioned lower-chest to waist area
- Scale-in spring animation (damping ~10)
- Held for ~1-2 seconds then exits (opacity fade or scale-out)
- Example: v2 t4s "manus" logo integrated

### 3. Caption-as-b-roll-title
For the big reveal moments, the caption becomes oversized and merges with the b-roll into one composition rather than sitting as a separate layer (Style 1 version).

## Remotion recipes (copy-paste)

### Style 1 caption component

```tsx
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

export const DaylightCaption: React.FC<{text: string; enterAt: number; exitAt: number}> = ({text, enterAt, exitAt}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame: frame - enterAt, fps, config: {damping: 14, stiffness: 180}, durationInFrames: 8});
  const exit = interpolate(frame, [exitAt - 4, exitAt], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  if (frame < enterAt || frame > exitAt) return null;
  return (
    <div style={{
      position: 'absolute', top: '55%', left: 0, right: 0, textAlign: 'center',
      transform: `scale(${0.9 + enter * 0.1}) translateY(${(1 - enter) * 20}px)`,
      opacity: enter * exit,
    }}>
      <span style={{
        fontFamily: 'Inter, sans-serif', fontWeight: 800,
        fontSize: 128, color: '#fff', letterSpacing: -1,
        textShadow: '0 4px 14px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.6)',
      }}>{text}</span>
    </div>
  );
};
```

### Style 2 caption component (glow)

```tsx
export const StudioCaption: React.FC<{text: string; enterAt: number; exitAt: number}> = ({text, enterAt, exitAt}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame: frame - enterAt, fps, config: {damping: 12, stiffness: 220}, durationInFrames: 6});
  const exit = interpolate(frame, [exitAt - 3, exitAt], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  if (frame < enterAt || frame > exitAt) return null;
  return (
    <div style={{
      position: 'absolute', top: '50%', left: 0, right: 0, textAlign: 'center',
      transform: `translateY(-50%) scale(${0.85 + enter * 0.15})`,
      opacity: enter * exit,
    }}>
      <span style={{
        fontFamily: 'Inter, sans-serif', fontWeight: 900,
        fontSize: 120, color: '#fff', letterSpacing: 2,
        textTransform: 'uppercase',
        textShadow: '0 0 20px rgba(255,255,255,0.9), 0 0 42px rgba(255,255,255,0.55), 0 4px 10px rgba(0,0,0,0.5)',
      }}>{text}</span>
    </div>
  );
};
```

### Style 2 split-screen composite

```tsx
export const SplitScreenShot: React.FC<{uiImage: string; aRollVideo: string; caption: string}> = ({uiImage, aRollVideo, caption}) => {
  return (
    <AbsoluteFill>
      {/* Top half — UI screenshot */}
      <div style={{position: 'absolute', top: 0, left: 0, right: 0, height: '50%', overflow: 'hidden'}}>
        <Img src={uiImage} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top'}} />
      </div>
      {/* Bottom half — A-roll */}
      <div style={{position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%', overflow: 'hidden'}}>
        <OffthreadVideo src={aRollVideo} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      </div>
      {/* Caption on the seam */}
      <StudioCaption text={caption} enterAt={0} exitAt={45} />
    </AbsoluteFill>
  );
};
```

### Floating iMessage bubble component

```tsx
export const iMessageBubble: React.FC<{text: string; enterAt: number; position?: {top: string; left: string}}> = ({text, enterAt, position = {top: '62%', left: '32%'}}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - enterAt, fps, config: {damping: 10, stiffness: 180}});
  if (frame < enterAt) return null;
  return (
    <div style={{
      position: 'absolute', top: position.top, left: position.left,
      transform: `scale(${s})`,
      background: 'linear-gradient(180deg, #0099ff, #0077dd)',
      color: '#fff', padding: '14px 22px', borderRadius: 24,
      fontFamily: 'SF Pro Display, -apple-system, sans-serif', fontWeight: 500,
      fontSize: 38, boxShadow: '0 8px 24px rgba(0,119,221,0.4)',
      maxWidth: 320,
    }}>
      {text}
    </div>
  );
};
```

### Style 1 tilted b-roll composite

```tsx
export const TiltedBRoll: React.FC<{uiImage: string; overlayText: string}> = ({uiImage, overlayText}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 16, stiffness: 140}, durationInFrames: 20});
  return (
    <AbsoluteFill style={{background: 'linear-gradient(135deg, #1a0f2e 0%, #2d1a4d 60%, #1a0f2e 100%)'}}>
      {/* Tilted UI screenshot */}
      <div style={{
        position: 'absolute', top: '15%', left: '50%',
        transform: `translateX(-50%) perspective(1200px) rotateX(14deg) rotateY(-10deg) rotateZ(-5deg) scale(${0.8 + enter * 0.2})`,
        width: '95%', opacity: enter,
      }}>
        <Img src={uiImage} style={{width: '100%', boxShadow: '0 40px 80px rgba(0,0,0,0.5)'}} />
      </div>
      {/* HUGE BLACK overlay text integrated with the b-roll */}
      <div style={{
        position: 'absolute', top: '28%', left: 0, right: 0, textAlign: 'center',
        opacity: interpolate(frame, [10, 20], [0, 1], {extrapolateRight: 'clamp'}),
      }}>
        <span style={{
          fontFamily: 'Inter, sans-serif', fontWeight: 900,
          fontSize: 180, color: '#000', letterSpacing: -4,
          textShadow: '0 8px 30px rgba(0,0,0,0.3)',
        }}>
          {overlayText}
        </span>
      </div>
    </AbsoluteFill>
  );
};
```

## Structural template for a full video

Typical structure observed across all 3 source videos:

1. **[0-2s] HOOK** — Pure A-roll, caption baits the claim. Usually a surprising statement or a "this will blow your mind" tease.
2. **[2-5s] SETUP** — A-roll continues, explains WHAT the thing is. Caption swaps every ~0.7s.
3. **[5-15s] DEMO** — B-roll heavy: tilted UI screenshots (Style 1) or split-screens (Style 2), showing the tool/workflow step by step. Big integrated text or glowing captions label each step.
4. **[15-25s] EMOTIONAL PEAK** — Back to A-roll. Creator makes the "this is crazy" or "you can use this for X" claim. iMessage bubble or brand logo composites appear.
5. **[25-30s+] CTA** — "Comment X for the link" / "Follow for more" / "Link in bio" — caption reinforces the action.

For videos >30s (v2 = 64s, v3 = 90s), the DEMO section expands proportionally. Hook/CTA lengths stay constant.

## Applying this to Sybago UGC

If the user wants to re-edit `sybago_video_2.mp4` in this style:

1. **Pick a sub-style**:
   - **Daylight** if the user shot in natural light at a desk setup
   - **Studio** if the shoot is dark/moody with strong backlights
2. Use the appropriate caption component per the recipes above
3. Identify 3-5 moments for b-roll cutaways based on the script beats
4. Build corresponding b-roll scenes using tilted composites (Style 1) or split-screens (Style 2)
5. Overlay iMessage bubbles at product-name moments (e.g., when user says "GoHighLevel" → bubble "GHL"... though we scrubbed GHL from user-facing branding, so use "Sybago" instead)
6. Apply the appropriate CSS filter color grade
7. Export at 23.976fps for the cinematic feel

## Known gaps / future-study items

- **Music/audio treatment** — can't be analyzed from frames alone. Both styles likely use upbeat instrumental tracks; Style 2 probably syncs harder to musical beats.
- **Exact caption font** — inferred from visual match to Inter 800 / Impact; for an exact match the user would need to identify the font from the creator's workflow (ask them, or inspect any downloadable asset).
- **Transition frames between cuts** — my sample frames were 2-4 seconds apart so I missed any micro-transitions (flashes, zoom-punches). Worth a second-pass frame extraction at cut points if transition style matters.
- **Scene-detection data** — bundled ffmpeg couldn't produce scene-cut timestamps in this session; a manual review (or a separate ffmpeg install) would let us quantify exact cut frequency.
