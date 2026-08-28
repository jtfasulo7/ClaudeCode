import React from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C} from '../theme';

const Stamp: React.FC<{text: string; at: number; tilt: number}> = ({text, at, tilt}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  // Held in the layout from the start so the card never changes height.
  const s = frame < at
    ? 0
    : spring({frame: frame - at, fps, config: {damping: 13, stiffness: 260, mass: 0.7}, durationInFrames: 14});
  return (
    <div
      style={{
        transform: `scale(${0.86 + s * 0.14}) rotate(${tilt * (1 - s * 0.55)}deg)`,
        opacity: s,
        border: `4px solid ${C.rust}`,
        color: C.rust,
        borderRadius: 12,
        padding: '14px 26px',
        fontSize: 52,
        fontWeight: 800,
        letterSpacing: 1,
        textTransform: 'uppercase',
        alignSelf: 'flex-start',
      }}
    >
      {text}
    </div>
  );
};

export const FailureStamps: React.FC<{ats: [number, number, number]}> = ({ats}) => (
  <div style={{display: 'flex', flexDirection: 'column', gap: 20}}>
    <Stamp text="Underdosed" at={ats[0]} tilt={-3.5} />
    <Stamp text="Fake" at={ats[1]} tilt={2.5} />
    <Stamp text="Unsafe" at={ats[2]} tilt={-2} />
  </div>
);
