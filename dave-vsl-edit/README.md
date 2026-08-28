# dave-vsl-edit

Remotion edit of the "Peps by Dave" 70s VSL. Source plate is a 4K HEVC
talking-head from Higgsfield; output is a 1920x1080 H.264 VSL for the Skool
join page.

## Pipeline

1. **Proxy** — the 4K HEVC master will not decode reliably in Chromium, so it is
   transcoded once to `public/aroll.mp4` (1080p H.264, 30fps, CRF 17):
   ```
   ffmpeg -i "Dave - VSL.mp4" -vf scale=1920:1080:flags=lanczos \
     -c:v libx264 -preset slow -crf 17 -pix_fmt yuv420p -r 30 \
     -c:a aac -b:a 192k public/aroll.mp4
   ```
2. **Transcript** — `py work/transcribe.py [model]` writes `work/transcript.json`
   with word-level timestamps (faster-whisper, CPU int8, no torch).
3. **Captions** — `node work/build_captions.mjs` writes `src/data/captions.json`.
   Beats are hand-broken on meaning inside that script, then aligned back to the
   whisper word timeline. It asserts the authored text matches the transcript
   word-for-word, so a typo fails loudly instead of silently desyncing.
4. **Render** — `npx remotion render src/index.ts DaveVSL out/dave-vsl-v1.mp4`
   (or `npm start` for the studio).

## Edit decisions

- **The plate is never cut.** Every b-roll beat is an overlay, so the VO stays
  continuous and nothing can drift out of sync.
- **Cards pair with a push-left.** Dave gestures out to ~72% of frame width, so a
  right-hand card would collide with his hands. When a card is up the plate
  punches in to 1.16 and shifts left. The shift is *derived* from the scale
  (`-0.96 * 960 * (scale - 1)`) so it can never exceed the overflow the punch-in
  bought — that is what produces a black edge if you hardcode it.
- **Cards reserve their full height up front.** Rows fade in at their cue rather
  than being added to the layout, so the card never grows mid-shot.
- **Two full-frame cards only** — the brand mention (25.2s) and the CTA (67.6s).
  The last frame of a VSL should be the action, not a face.
- **Palette is editorial, not "AI hype."** The script sells credibility
  ("I'm not a doctor", "no miracle promises, no hype"); neon glow and purple
  gradients would undercut the one thing it is selling. Colours are pulled from
  the plate: cedar, foliage, overcast sky.
- **No fabricated numbers.** The script says "thousands", so the card says
  Thousands — not an invented dollar figure.

## Cut sheet

| Time | Beat | Treatment |
|---|---|---|
| 1.35-9.1s | price claim | side card: Thousands -> $15/mo |
| 16.9-20.9s | bad product | side card: Underdosed / Fake / Unsafe stamps |
| 25.2-28.35s | brand mention | **full frame**: Peps by Dave |
| 40.0-58.7s | the benefit list | side card: 6-row checklist, one row per phrase |
| 67.62s-end | CTA | **full frame**: Join the community |

Everything else is plate + captions.
