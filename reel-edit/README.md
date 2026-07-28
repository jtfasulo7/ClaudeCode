# reel-edit

Pipeline that turned a raw talking-head offer video (Meta ads for contractors)
into a finished Instagram Reel. Video files are gitignored; scripts and
generated subtitle/transcript artifacts are committed.

## Pipeline

1. `work/transcribe.py <video> <out.json>` — faster-whisper (small.en) word-level transcript
2. Cut plan: ffmpeg `silencedetect` + waveform RMS analysis; pause trims applied with
   trim/atrim + concat (see git history for exact filters)
3. `work/make_captions.py` — builds `work/captions.ass` from the rough-cut transcript:
   2-4 word caption chunks (Montserrat ExtraBold, active word in amber) + four teal
   header cards with slide/fade pop-in
4. `work/gfx.py` — renders 8 branded motion-graphic segments (Pillow -> ffmpeg rawvideo pipe)
   - `python work/gfx.py preview` renders one PNG per segment; no args renders all mp4s
5. Final: ffmpeg overlay chain + ass filter + two-pass loudnorm (-14 LUFS), CRF 18

## Brand

Teal #2D6679, cream #FBFBF9, ink #16282F, amber accent #F2A33C, Montserrat EB/Bold.
Safe zones: no text above y=220 / below y=1600 (1080x1920), middle ~80% width.

## Requirements

ffmpeg 8+, Python 3.13 with `faster-whisper` and `pillow`. Fonts: Montserrat
ExtraBold/Bold TTFs in `work/fonts/` (gitignored; OFL, from JulietaUla/Montserrat).
