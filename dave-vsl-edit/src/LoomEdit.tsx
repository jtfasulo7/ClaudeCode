import React from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

/**
 * Dave's Loom walkthrough, re-framed as a directed edit.
 *
 * The source is a flat 1920x1080 screen recording: one locked frame for 68
 * seconds, then the CTA stinger. This adds the camera it never had — pushes
 * into whatever is being discussed, and re-frames on each cut.
 *
 * NO CUTAWAYS. Nothing is inserted and nothing is removed; every frame of the
 * original is still here, in order, with its audio. The only change is which
 * part of the frame you are looking at.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * HOW THE TIMINGS WERE FOUND, and what to trust.
 *
 * The CUTS are measured, not guessed — ffmpeg scene detection puts them at
 * 6.03, 31.27, 50.93, 52.23, 61.93 and 67.97s, and the keyframes below are
 * pinned to those. The COORDINATES are measured too, read off extracted frames
 * at full resolution.
 *
 * What is inferred is WHEN inside each section he talks about each thing. I
 * cannot hear the audio, so the pushes are placed against what is on screen
 * and how long it stays there. If a zoom lands early or late, the fix is a
 * number in SHOTS and nothing else.
 * ────────────────────────────────────────────────────────────────────────────
 */

const SRC_W = 1920;
const SRC_H = 1080;

/** Measured hard cuts in the source, in seconds. */
const CUTS = [6.033, 31.267, 50.933, 52.233, 61.933, 67.967];

/** The CTA card is already baked onto the end. It is left completely alone. */
const CTA_AT = 67.967;

/**
 * A keyframe: at time `t`, centre source pixel (x, y) and magnify by `scale`.
 *
 * TO RETIME A ZOOM, EDIT `t`. To move one, edit x/y. That is the whole
 * interface — nothing below this array needs touching.
 *
 * Two keyframes 0.01s apart are a deliberate step: that is a hard re-frame on
 * a cut, where the camera is somewhere new the instant the picture changes.
 */
type Shot = {t: number; scale: number; x: number; y: number};

const SHOTS: Shot[] = [
  /* ── Opening: the feed, establishing. A slow drift so the first six seconds
        are not visually dead, but nothing is emphasised yet. ── */
  {t: 0.0, scale: 1.0, x: 960, y: 540},
  {t: 6.03, scale: 1.07, x: 950, y: 515},

  /* ── CUT 6.03 · the feed proper ──
        Enters a touch tight and settles — a camera finding its frame. */
  {t: 6.04, scale: 1.15, x: 850, y: 430},
  {t: 7.2, scale: 1.09, x: 850, y: 445},
  {t: 11.5, scale: 1.09, x: 850, y: 445},

  // Into the feed column, off the chrome and onto the posts.
  {t: 14.5, scale: 1.42, x: 850, y: 470},
  {t: 17.5, scale: 1.42, x: 850, y: 470},

  /* ★ TRUSTED VENDOR ACCESS — the post.
       Card measured at x 403-1181, y 765-975 in the source. Centre pushed
       right to 850 rather than the card's true 792: at this magnification a
       centre of 792 puts the left edge at 258, and the webcam bubble's right
       edge is at 290, so a 32px crescent of Dave's head would hang in frame.
       850 clears it and still holds the whole card. */
  {t: 19.5, scale: 1.78, x: 850, y: 858},
  {t: 26.5, scale: 1.78, x: 850, y: 858},

  // Release, so the next cut does not arrive while still tight.
  {t: 29.0, scale: 1.22, x: 850, y: 700},
  {t: 31.26, scale: 1.22, x: 850, y: 700},

  /* ── CUT 31.27 · the Classroom grid ──
        Pull wide on the cut: the grid is the point, so it gets shown whole
        before anything in it is singled out. */
  {t: 31.28, scale: 1.12, x: 950, y: 470},
  {t: 32.6, scale: 1.04, x: 950, y: 470},
  {t: 36.5, scale: 1.04, x: 950, y: 470},

  /* ★ TRUSTED VENDOR ACCESS — the classroom card.
       Measured at x 1144-1499, y 140-495. Centred at 1240 rather than the
       card's true 1321: page content stops at x≈1499, so centring the card
       exactly puts a third of the frame on bare background. 1240 keeps it
       dominant and brings Peptide University in beside it. Held long — one of
       the two beats asked for by name. */
  {t: 39.0, scale: 1.82, x: 1240, y: 330},
  {t: 46.5, scale: 1.82, x: 1240, y: 336},

  {t: 48.8, scale: 1.12, x: 950, y: 520},
  {t: 50.92, scale: 1.12, x: 950, y: 520},

  /* ── CUT 50.93 and 52.23 · brief pass through the feed ──
        Two cuts inside 1.3s. Anything but a flat frame here would read as a
        stutter, so the camera simply stops. */
  {t: 50.94, scale: 1.0, x: 960, y: 540},
  {t: 52.22, scale: 1.0, x: 960, y: 540},

  /* ★ JAMAL'S POST — opened as a modal, with the thread.
       The second beat asked for by name, and the most constrained shot here.

       Loom insets the page during this section: the content box is x 190-1730,
       y 110-970, with white outside it. Scale 1.32 centred (959, 540) puts the
       frame on x 231-1686, y 151-969 — the box almost exactly, filled edge to
       edge. Going tighter, or centring lower to favour the comments, walks the
       frame off the box and paints a white band, which is what the first
       render did.

       So this section is capped near 1.32x by the source, not by taste. The
       drift below is deliberately tiny — enough that the shot breathes,
       small enough to stay on the box. */
  {t: 52.24, scale: 1.38, x: 959, y: 540},
  {t: 53.8, scale: 1.32, x: 959, y: 532},
  {t: 61.92, scale: 1.32, x: 959, y: 556},

  /* ── CUT 61.93 · back to the feed, Jamal's post in place ──
       Post measured at x 403-1181, y 785-1005. Same 850 centre for the same
       webcam-bubble reason. */
  {t: 61.94, scale: 1.28, x: 850, y: 870},
  {t: 63.2, scale: 1.72, x: 850, y: 892},
  {t: 66.9, scale: 1.72, x: 850, y: 892},

  // Ease out so the CTA is not slammed into from a tight push.
  {t: 67.95, scale: 1.16, x: 900, y: 720},

  /* ── CUT 67.97 · the CTA card. Untouched, deliberately: it was composed at
        1920x1080 and any magnification would crop or soften it. ── */
  {t: 67.968, scale: 1.0, x: 960, y: 540},
  {t: 80.0, scale: 1.0, x: 960, y: 540},
];

/** Smooth both ways. Linear moves are what make a zoom look automated. */
const EASE = Easing.bezier(0.4, 0, 0.2, 1);

function valueAt(t: number, key: 'scale' | 'x' | 'y'): number {
  if (t <= SHOTS[0].t) return SHOTS[0][key];
  for (let i = 0; i < SHOTS.length - 1; i++) {
    const a = SHOTS[i];
    const b = SHOTS[i + 1];
    if (t >= a.t && t <= b.t) {
      // A pair closer together than a frame is a step, not a move.
      if (b.t - a.t < 0.004) return b[key];
      return interpolate(t, [a.t, b.t], [a[key], b[key]], {
        easing: EASE,
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
    }
  }
  return SHOTS[SHOTS.length - 1][key];
}

/**
 * A focus-pull on each cut: a few frames of softness resolving to sharp.
 *
 * This is the "transition" the edit has. A hard cut between two static
 * screenshots reads as a jump; the same cut with the frame resolving into
 * focus reads as a camera being re-pointed. Six frames, and never on the CTA
 * hand-off, which should land clean.
 */
function cutBlur(t: number): number {
  let b = 0;
  for (const c of CUTS) {
    if (c === CTA_AT) continue;
    if (t >= c && t < c + 0.24) {
      b = Math.max(
        b,
        interpolate(t, [c, c + 0.24], [5.5, 0], {
          easing: Easing.out(Easing.quad),
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        }),
      );
    }
  }
  return b;
}

export const LoomEdit: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const t = frame / fps;

  const scale = valueAt(t, 'scale');
  const px = valueAt(t, 'x');
  const py = valueAt(t, 'y');

  /* Put source pixel (px,py) at the centre of the output, then clamp so the
     frame edge can never come into view. Without the clamp a zoom near an edge
     shows black bars, which is the single most obvious tell of an automated
     crop. */
  const rawX = width / 2 - px * scale;
  const rawY = height / 2 - py * scale;
  const tx = Math.min(0, Math.max(width * (1 - scale), rawX));
  const ty = Math.min(0, Math.max(height * (1 - scale), rawY));

  const blur = cutBlur(t);

  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <AbsoluteFill
        style={{
          transformOrigin: '0 0',
          transform: `translate(${tx}px, ${ty}px) scale(${scale})`,
          // Only pay for the blur filter on the handful of frames that use it.
          filter: blur > 0.01 ? `blur(${blur.toFixed(2)}px)` : undefined,
          width: SRC_W,
          height: SRC_H,
        }}
      >
        <OffthreadVideo
          src={staticFile('loom-source.mp4')}
          style={{width: SRC_W, height: SRC_H, objectFit: 'cover'}}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** 71.296s of source at 30fps. */
export const LOOM_FRAMES = Math.floor(71.296 * 30);
