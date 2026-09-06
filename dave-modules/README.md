# dave-modules

Motion-graphics films for the "Peps by Dave" classroom modules. No presenter, no
lip sync — the visuals carry the whole frame and illustrate what the narrator is
saying, beat by beat.

| Composition | Source VO | Runtime | Output |
|---|---|---|---|
| `Module1` | The Gray Market | 115.76s | `out/module-1.mp4` |
| `Module3` | Getting the most from this community | 115.92s | `out/module-3.mp4` |
| `Module5` | Beginner mistakes | 146.08s | `out/module-5.mp4` |
| `Module7` | Where to go from here | 87.12s | `out/module-7.mp4` |
| `StartHere` | New to peptides (v2 motion language + score) | 98.99s | `out/start-here.mp4` |
| `Handling` | Handling basics — storage, sterility, appearance | 107.65s | `out/handling.mp4` |
| `Module2` | Understanding testing — COAs and who selects the sample | 111.66s | `out/module-2.mp4` |
| `Onboarding` | Welcome / how to use the community | 70.72s | `out/onboarding.mp4` |

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
      motion.ts          v2: six asymmetric bezier curves + entrance archetypes
      Shot.tsx           v2 scene wrapper (varied entrances, hard settle)
      Kinetic.tsx        v2 typography — mask reveals, track-in, CountUp, Chip
      StageV2.tsx        v2 backdrop, LightSweep, grain, progress
      Onboard.tsx        Phone, AppTile, Bell, TabBar, UnlockLock, LinkPair, GrowthBars
      Diagrams.tsx       PeptideChain, SearchBar, ThreadPost, NodeNetwork, TierLadder,
                         ChapterNumber, Countdown, WalletAddress, DMCard,
                         VerifyBadge, DocTile
  modules/
    module1/  Module1.tsx + scenes/   (28 scenes)
    module3/  Module3.tsx + scenes/   (32 scenes)
    module5/  Module5.tsx + scenes/   (32 scenes)
    module7/  Module7.tsx + scenes/   (22 scenes)
    start-here/ StartHere.tsx + scenes/ (21 scenes, v2 language)
    handling/   Handling.tsx + scenes/   (22 scenes, v2 language)
    module2/    Module2.tsx + scenes/    (24 scenes, v2 language)
    onboarding/ Onboarding.tsx + scenes/ (20 scenes, v2 language)
  Root.tsx               one <Composition> per module
```

## Pipeline

1. **Audio** — VOs live in `public/` (`vo-module1.mp3`, `vo-module3.mp3`,
   `vo-module5.mp3`, `vo-module7.mp3`);
   Remotion serves that directory. `work/<module>/audio.wav` is a 16kHz mono
   copy used only for transcription.
2. **Transcript** —
   `py work/transcribe.py work/module3/audio.wav work/module3/transcript.json medium`
   (faster-whisper, CPU int8 — no torch, and openai-whisper does not install
   cleanly on Python 3.13).
3. **Render** — `npm run render1` / `render3` / `render5` / `render7`, or
   `npm start` for
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

## The onboarding film

The only welcome piece in the set, and the only one whose job is orientation
rather than teaching. Two halves and one hinge:

- **0 to 38.7s** describes an interface. Install the app, turn notifications
  on, here are the two tabs. The bed stays plain and instructional under it.
- **38.7s is the hinge** — vendor access unlocks through participating. That
  is where the film stops describing a product and starts explaining a
  decision, and the score moves to A minor to ask it.
- **43.2s onward answers it.** F major, the warmest passage in the film, sits
  under "relationships, not a list" — the one idea worth remembering.

G minor arrives exactly once, for the medical-advice line, because a caution
should land differently from a welcome.

**Transcription note.** Whisper hears "school app". The platform is Skool, so
that is what the screen says. The audio is untouched.

**A timing rule this film added.** A beat that settles as its shot begins
fading has not been shown, it has been flashed. Six scenes originally put
their headline on the last word of the line, which placed it under the cut —
`GrowingFast` settled at frame 89 of a shot that starts fading at 84, so it
never finished arriving at all. Where a word lands too near a boundary the
reveal now moves to the start of its phrase, and a graphic carries the word
instead: the final bar turning gold does the work "growing" used to.

The check is worth rerunning after any re-cut — for each scene, compare the
latest animation delay against `dur - 9`. Anything under about 14 frames of
hold is not readable at 30fps.

## Verifying stillness — read this before trusting a measurement

The obvious test is wrong. Extracting a window with

```
ffmpeg -ss 13.3 -t 0.4 -i out/x.mp4 -vsync 0 f%02d.png
```

can hand back **the same frame repeatedly**, and every stillness check then
passes vacuously — identical files are identical. That happened here and the
first "byte-identical, nothing is drifting" result meant nothing.

Select by frame NUMBER instead, and confirm the frames actually differ before
concluding anything from the fact that they do not:

```
ffmpeg -i out/x.mp4 -vf "select='between(n\,399\,408)'" -vsync 0 f%02d.png
```

Ten distinct hashes means the extraction is sound. Only then is a PSNR of
`inf` on a cropped text region evidence of anything.

## Ambient motion vs stillness

The onboarding film adds a `Motes` layer that drifts continuously, so its
frames are deliberately **not** byte-identical any more. The rule did not
change; it got a boundary:

- Anything carrying meaning — type, diagrams, chips — animates in and settles
  to exactly identity. Verified by cropping to a text region and comparing
  true consecutive frames: PSNR `inf`.
- One ambient layer, behind everything, under 6% opacity, carrying no
  information, is allowed to keep moving. That is what makes the frame feel
  alive without the letters vibrating.

**`transformOrNone` has a trap.** It drops the transform once an animation
settles, which is right when the resting state is identity — that is what stops
the element resampling every frame. It is WRONG whenever the resting state is
offset or rotated: `CardFan` fans five cards out to ±168px, and dropping the
transform collapsed all five back onto each other, so the fan rendered as a
single card. A constant transform is not what shimmers; a constantly changing
sub-pixel one is. Keep it applied and release only `willChange`.

**Every shot must be wrapped in `<Stack>`.** `<Shot>` is a plain `AbsoluteFill`,
so a bare `<div>` inside it lands top-left. Two scenes shipped that way before
anyone noticed.

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
- Module 2: the COA row values (Independent / 2026-08-11 / 99.1% / 10.2 mg) are
  illustrative. Its end card also carries the added "not medical advice" line,
  which is not in that script either.
- Handling: the vial graphic is illustrative and always sealed and at rest. No
  needle, syringe, hands, volumes or quantities appear anywhere in the film;
  reconstitution is treated strictly as a terminology definition, per the brief.
  The "not medical advice" line on its end card is NOT in that script — it was
  added for series consistency given the subject, and can be removed.
- Module 7: the vendor rows and "official contact on file" labels.
- Module 5: the COA row values and lab report ID (`LR-88214-C`); the wallet
  address, which is a fabricated string used only to illustrate the "one wrong
  character" point and is **not** a real or usable address; the flash-sale
  countdown and the vendor-review quotes.


## The score (StartHere onward)

`work/score.py` synthesises an original bed. There is no licensed source and
Higgsfield's audio model is speech-only, so the music is generated here — which
means it is unambiguously the client's, and unlike a stock track it is composed
against the cut sheet.

72 BPM, D natural minor, no drums, no build, no drop. Five additive layers:
sustained drone, sub swell every two bars, stacked fifths breathing on
out-of-phase LFOs, struck bells with stretched inharmonic partials, faint tape
air. Nine harmonic sections crossfade on the script's turns rather than on a bar
grid, and the seven bell strikes land on the seven risk words individually — the
same frames the seven nodes land on screen.

It is side-chained to the actual voiceover (envelope derived from the VO's own
RMS, fast attack / slow release), so the bed drops ~5.3 dB under speech and
lifts in the gaps. Baked in, so Remotion just plays it flat.

Each film has its own entry in the `SCORES` dict in score.py — sections, bell
placements and transition hits per module. Handling sits in Gm/Am longer than
Start Here because its subject is risk, and only resolves to F at the recap.

Regenerate with:

```
py work/score.py work/start-here/audio.wav public/score-start-here.wav 98.88
```

Seeded, so reruns are byte-identical.

## What was tried and cut

- **@remotion/light-leaks** — screen-blends a warm bloom; on a near-black
  palette it lifts the blacks and washes the frame orange even at 0.14 opacity.
  Reads as a filter on top rather than light in the scene. `LightSweep` in
  StageV2 does the specular job properly instead.
- **@remotion/sfx** — ships meme sounds (vine-boom, wilhelm-scream). Wrong
  register entirely. Transition punctuation is baked into the score instead.
- **TransitionSeries** — shortens the timeline, which would walk the picture off
  the narration over 99 seconds. Scenes stay absolutely positioned.
