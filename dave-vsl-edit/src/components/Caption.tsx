import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import beats from '../data/captions.json';
import {C, fontFamily, sec} from '../theme';

/** Numbers and money carry the argument in this script — let them pop. */
const accentToken = (t: string) => /^[$\d]/.test(t);

export const Caption: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const active = beats.find((b) => frame >= sec(b.start) && frame < sec(b.end));
  if (!active) return null;

  const inAt = sec(active.start);
  const outAt = sec(active.end);
  const enter = spring({frame: frame - inAt, fps, config: {damping: 200, stiffness: 220}, durationInFrames: 6});
  const exit = interpolate(frame, [outAt - 3, outAt], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 96}}>
      <div
        style={{
          transform: `translateY(${(1 - enter) * 14}px)`,
          opacity: enter * exit,
          maxWidth: 1500,
          textAlign: 'center',
          fontFamily,
          fontWeight: 800,
          fontSize: 78,
          lineHeight: 1.12,
          letterSpacing: -1.4,
          color: C.white,
          textShadow: '0 3px 14px rgba(0,0,0,0.55), 0 1px 3px rgba(0,0,0,0.7)',
        }}
      >
        {active.text.split(' ').map((w, i) => (
          <span key={i} style={{color: accentToken(w) ? '#F0B44A' : C.white}}>
            {w}{i < active.text.split(' ').length - 1 ? ' ' : ''}
          </span>
        ))}
      </div>
    </AbsoluteFill>
  );
};

/** Soft bottom scrim so captions stay legible over the bright house/sky plate. */
export const Scrim: React.FC = () => (
  <AbsoluteFill
    style={{
      background: 'linear-gradient(to top, rgba(8,10,11,0.62) 0%, rgba(8,10,11,0.32) 14%, rgba(8,10,11,0) 32%)',
    }}
  />
);
