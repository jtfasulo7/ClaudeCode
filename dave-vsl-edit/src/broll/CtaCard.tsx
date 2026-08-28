import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, fontFamily} from '../theme';

/** The last frame of a VSL should be the action, not a face. */
export const CtaCard: React.FC<{inAt: number}> = ({inAt}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (frame < inAt) return null;

  const local = frame - inAt;
  const cut = interpolate(local, [0, 4], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const rise = spring({frame: local - 2, fps, config: {damping: 26, stiffness: 130}, durationInFrames: 20});
  const btn = spring({frame: local - 12, fps, config: {damping: 15, stiffness: 190}, durationInFrames: 18});

  return (
    <AbsoluteFill
      style={{background: C.paper, opacity: cut, alignItems: 'center', justifyContent: 'center', fontFamily}}
    >
      <div style={{textAlign: 'center', transform: `translateY(${(1 - rise) * 14}px)`, opacity: rise}}>
        <div style={{fontSize: 44, fontWeight: 600, color: C.muted, letterSpacing: -0.6}}>Done guessing?</div>
        <div
          style={{
            marginTop: 26,
            display: 'inline-block',
            transform: `scale(${0.9 + Math.min(btn, 1) * 0.1})`,
            background: C.green,
            color: C.paper,
            borderRadius: 999,
            padding: '26px 82px',
            fontSize: 76,
            fontWeight: 800,
            letterSpacing: -1,
            boxShadow: '0 18px 40px rgba(44,107,78,0.35)',
          }}
        >
          Join the community
        </div>
        <div style={{fontSize: 32, fontWeight: 600, color: C.muted, marginTop: 34, letterSpacing: 0.2}}>
          Free · takes 10 seconds
        </div>
      </div>
    </AbsoluteFill>
  );
};
