import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, fontFamily} from '../theme';

/** Full-frame hard cut on the brand mention — the one moment the video stops. */
export const BrandCard: React.FC<{inAt: number; outAt: number}> = ({inAt, outAt}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (frame < inAt || frame >= outAt) return null;

  const local = frame - inAt;
  const cut = interpolate(local, [0, 3], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const out = interpolate(frame, [outAt - 4, outAt], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const rise = spring({frame: local - 2, fps, config: {damping: 26, stiffness: 130}, durationInFrames: 22});
  const rule = interpolate(local, [10, 26], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill
      style={{
        background: C.paper,
        opacity: cut * out,
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily,
      }}
    >
      <div style={{textAlign: 'center', transform: `translateY(${(1 - rise) * 16}px)`, opacity: rise}}>
        <div style={{fontSize: 26, fontWeight: 700, letterSpacing: 6, textTransform: 'uppercase', color: C.green}}>
          That's why
        </div>
        <div
          style={{
            fontSize: 148,
            fontWeight: 800,
            letterSpacing: -5,
            color: C.ink,
            lineHeight: 1.02,
            marginTop: 14,
          }}
        >
          Peps by Dave
        </div>
        <div
          style={{
            height: 3,
            background: C.green,
            width: `${rule * 340}px`,
            margin: '30px auto 0',
            borderRadius: 2,
          }}
        />
        <div style={{fontSize: 34, fontWeight: 600, color: C.muted, marginTop: 28, letterSpacing: -0.4}}>
          Peptide research, in plain English.
        </div>
      </div>
    </AbsoluteFill>
  );
};
