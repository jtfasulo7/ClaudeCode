# dave-modules

Motion-graphics films for the "Peps by Dave" classroom modules. No presenter, no
lip sync — the visuals carry the whole frame and illustrate what the narrator is
saying, beat by beat.

| Composition | Source VO | Runtime | Output |
|---|---|---|---|
| `Module1` | The Gray Market | 115.76s | `out/module-1.mp4` |
| `Module3` | Getting the most from this community | 115.92s | `out/module-3.mp4` |
| `Module5` | Beginner mistakes | 146.08s | `out/module-5.mp4` |

All are 1920x1080, 30fps.

## Why one project

Every module shares `src/shared` — palette, fonts, scene wrapper, typography and
diagram primitives. That is what keeps the modules visually identical to each
other, and it means a fix lands in every module at once rather than having to be
re-applied per film.

```
src/
  shared/
    theme.ts             palette, fonts, sec()
    components/
      Stage.tsx          global backdrop, grain, progress hairline
      Scene.tsx          per-scene entrance; settles dead still
      Type.tsx           Eyebrow / KeyWords / Statement / Rule
      Graphics.tsx       Vial, Globe, CoaSheet, PriceBar, CheckRow, Lock
      Diagrams.tsx       PeptideChain, SearchBar, ThreadPost, NodeNetwork, TierLadder,
                         ChapterNumber, Countdown, WalletAddress, DMCard, VerifyBadge
  modules/
    module1/  Module1.tsx + scenes/   (28 scenes)
    module3/  Module3.tsx + scenes/   (32 scenes)
    module5/  Module5.tsx + scenes/   (32 scenes)
  Root.tsx               one <Composition> per module
```

## Pipeline

1. **Audio** — VOs live in `public/` (`vo-module1.mp3`, `vo-module3.mp3`,
   `vo-module5.mp3`);
   Remotion serves that directory. `work/<module>/audio.wav` is a 16kHz mono
   copy used only for transcription.
2. **Transcript** —
   `py work/transcribe.py work/module3/audio.wav work/module3/transcript.json medium`
   (faster-whisper, CPU int8 — no torch, and openai-whisper does not install
   cleanly on Python 3.13).
3. **Render** — `npm run render1` / `render3` / `render5`, or `npm start` for
   the studio.

## How the timing works

Every scene boundary in each module's `ModuleN.tsx` is a **word timestamp**
read out of the module's `transcript.json` — not a guess, not a fixed cadence.
The same is true inside scenes: Module 1's `$600 / $800 / $1,000` bars land on
frames 117 / 155 / 213 because that is where those numbers are spoken, and
Module 3's three struck-through sources land on "Dave said it", "a member said
it" and "a vendor said it" individually. Module 5's COA row spotlights fire on
"compound", "batch number", "test date" and "sample information".

Scenes overlap by 8 frames so each outgoing fade cross-dissolves into the
incoming one instead of cutting through black.

## Stillness

Text and graphics **animate in, then stop dead**. This was a deliberate rewrite:
the first version applied a slow continuous scale drift to every shot, and
scaling a layer by a non-integer factor resamples every glyph edge and hairline
on every frame — which reads as a persistent shimmer, text appearing to shake
even though nothing is moving. Three things were changed:

- `Scene` hard-settles to exactly `scale 1 / translate 0` after its entrance and
  drops the transform entirely, keeping layers on the pixel grid.
- The backdrop dot grid is pinned, not drifting. A 1px dot moving by fractions of
  a pixel shimmers badly behind text.
- Film grain is held at a fixed offset instead of cycling per frame.

Ambient life comes only from two wide, soft gold gradients, which have no edges
to shimmer. Verified by PSNR between consecutive settled frames: **78.3 dB**
(visible shimmer sits in the 30-45 dB range).

All remaining motion is purposeful — elements arriving on their narration cue,
bars filling, checks drawing, a lock swinging open.

## Design decisions

- **Colour is rationed.** Gold is emphasis. Green appears *only* for
  verification/success, red *only* for warnings. Everything else stays on the
  neutral ramp. That restraint is what keeps it documentary rather than
  infographic-y.
- **2-5 key words, never subtitles**, so the viewer can read the screen and
  listen at the same time.
- **Long scenes are deliberate.** Where a shot runs 6-9s it carries 3-4 internal
  builds; cutting away mid-chart or mid-document would break the thought the
  narrator is still finishing.
- **No dead air before a data beat.** Where narration sets something up before
  the first number lands, the shot fills that time with its own build.
- **Cards reserve their full height up front.** Rows fade in at their cue rather
  than being added to the layout, so a card never grows mid-shot.

## Compliance notes

Education/research framing throughout, matching the VOs. No dosing, no
administration, no injection imagery, no instruction to buy — the vial graphic is
a sealed research vial, never shown in use. Modules 1 and 5 close on the
"nothing here is medical advice" line from their scripts.

**Illustrative placeholders**, not real data — swap before publishing if that
matters for the classroom:

- Module 1: the `$92 / $168 / $385` vendor price listings; COA values
  (`99.1%`, `10.2 mg`, batch `A-2291`).
- Module 3: the same COA values; the search results and comment text on the
  thread scene; the tier names on the engagement ladder.
- Module 5: the COA row values and lab report ID (`LR-88214-C`); the wallet
  address, which is a fabricated string used only to illustrate the "one wrong
  character" point and is **not** a real or usable address; the flash-sale
  countdown and the vendor-review quotes.
