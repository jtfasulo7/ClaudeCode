import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Easing,
  interpolate,
  random,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {C, fontFamily, sec} from './theme';

/**
 * The CTA stinger — a standalone 16:9 clip carrying the recorded voiceover.
 *
 * WHAT "PREMIUM" MEANS HERE. The theme file is explicit that glossy gradients
 * and neon glow would undercut the one thing this brand sells, which is
 * credibility. So the polish is in the material and the timing rather than in
 * effects: paper grain, a rule that draws itself, letter-spacing that settles
 * as the headline lands, a single slow specular pass across the button, and
 * shadows that fall rather than appear. Nothing here glows.
 *
 * TIMED TO THE RECORDING, not to round numbers. The voiceover's RMS envelope
 * was measured before this was written: onset at 0.03s, a gap at 0.11-0.16s,
 * the loudest moment at 0.37-0.42s, another gap at 0.63-0.68s. The button
 * lands on that loudest moment, so the strongest visual beat and the strongest
 * vocal beat are the same instant.
 *
 * NO CAPTION, deliberately. The line is 2.5 seconds long; a subtitle that
 * short is read after it has already been heard, and it competes with the one
 * thing that should be read, which is the button. The card states the action,
 * the voice says it, and the two reinforce instead of duplicating.
 */

const VO_SECONDS = 2.48;

/** Where the voice peaks, in seconds, measured from the file itself. */
const BEAT = {
  onset: 0.03,
  loudest: 0.38,
  settle: 0.68,
};

export const CtaClip: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();

  /* ------------------------------------------------------------ entrance */
  /* Applied to the CONTENT only, never to the background. The paper is opaque
     on every frame: fading the outer fill meant fading paper over nothing,
     which rendered as muddy grey for the first four frames. */
  const cut = interpolate(frame, [0, 4], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // The whole card settles a few pixels, as if it has weight.
  const land = spring({
    frame: frame - 1,
    fps,
    config: {damping: 28, stiffness: 120},
    durationInFrames: 26,
  });

  const eyebrow = spring({
    frame: frame - sec(BEAT.onset),
    fps,
    config: {damping: 26, stiffness: 140},
    durationInFrames: 20,
  });

  const rule = interpolate(frame, [sec(0.12), sec(0.62)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });

  // The button arrives on the loudest syllable of the recording.
  const btn = spring({
    frame: frame - sec(BEAT.loudest),
    fps,
    config: {damping: 15, stiffness: 190},
    durationInFrames: 20,
  });

  const sub = spring({
    frame: frame - sec(BEAT.settle),
    fps,
    config: {damping: 26, stiffness: 150},
    durationInFrames: 18,
  });

  /* A single specular pass over the button, once, slowly, well after it has
     landed. Repeating it would turn a finish into an animation. */
  const sheen = interpolate(frame, [sec(0.95), sec(1.75)], [-140, 240], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });

  /* NO outro fade, deliberately. A call to action that dissolves away ends on
     nothing; this one ends on the button, held. Anyone cutting it into a
     timeline can add a transition there if they want one — that is an editing
     decision, and baking it in removes the choice. */

  // Headline tracking tightens as it lands — a typographic settle rather than
  // a movement, and the reason the word looks "set" instead of placed.
  const tracking = interpolate(land, [0, 1], [2.4, -1.4]);

  return (
    <AbsoluteFill style={{backgroundColor: C.paper, fontFamily}}>
      <Audio src={staticFile('cta-vo.mp3')} />

      {/* Paper grain. Deterministic via Remotion's seeded random so every
          render of a given frame is byte-identical — Math.random() here would
          make frames flicker and break deterministic re-renders. */}
      <AbsoluteFill style={{opacity: 0.045, mixBlendMode: 'multiply'}}>
        {new Array(160).fill(0).map((_, i) => {
          const seed = `grain-${i}`;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: random(seed + 'x') * width,
                top: random(seed + 'y') * height,
                width: 1 + random(seed + 'w') * 2,
                height: 1 + random(seed + 'h') * 2,
                borderRadius: '50%',
                background: C.ink,
              }}
            />
          );
        })}
      </AbsoluteFill>

      {/* A very soft vignette so the centre reads as lit. Two stops at most —
          any more and it becomes an effect rather than a light. */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(1400px 820px at 50% 46%, transparent 40%, rgba(20,24,26,0.055) 100%)`,
        }}
      />

      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity: cut}}>
        <div
          style={{
            textAlign: 'center',
            transform: `translateY(${(1 - land) * 16}px)`,
          }}
        >
          {/* eyebrow */}
          <div
            style={{
              fontSize: 40,
              fontWeight: 600,
              color: C.muted,
              letterSpacing: 1.6,
              textTransform: 'uppercase',
              opacity: eyebrow,
              transform: `translateY(${(1 - eyebrow) * 10}px)`,
            }}
          >
            Done guessing?
          </div>

          {/* The rule draws from the centre outward. */}
          <div
            style={{
              margin: '30px auto 0',
              width: 520 * rule,
              height: 2,
              background: `linear-gradient(90deg, transparent, ${C.line}, transparent)`,
            }}
          />

          {/* the action */}
          <div
            style={{
              position: 'relative',
              marginTop: 40,
              display: 'inline-block',
              overflow: 'hidden',
              borderRadius: 999,
              background: C.green,
              color: C.paper,
              padding: '28px 92px',
              fontSize: 82,
              fontWeight: 800,
              letterSpacing: tracking,
              opacity: Math.min(btn, 1),
              transform: `scale(${0.92 + Math.min(btn, 1) * 0.08})`,
              // The shadow deepens as the button settles, so it reads as
              // landing on the page rather than fading onto it.
              boxShadow: `0 ${10 + btn * 14}px ${24 + btn * 24}px rgba(44,107,78,${0.16 + btn * 0.2})`,
            }}
          >
            Join the community
            {/* specular pass */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: `${sheen}%`,
                width: '38%',
                background:
                  'linear-gradient(100deg, transparent, rgba(245,242,234,0.26), transparent)',
                pointerEvents: 'none',
              }}
            />
          </div>

          {/* reassurance */}
          <div
            style={{
              fontSize: 34,
              fontWeight: 600,
              color: C.muted,
              marginTop: 38,
              letterSpacing: 0.3,
              opacity: sub,
              transform: `translateY(${(1 - sub) * 8}px)`,
            }}
          >
            Free · takes 10 seconds
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* Three seconds: the 2.48s recording, plus a held beat so the button is the
   last thing on screen rather than the cut being the last thing that happens. */
export const CTA_CLIP_FRAMES = Math.round((VO_SECONDS + 0.52) * 30);
