import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, fontFamily} from '../theme';

/**
 * The right-hand card. Always paired with a push-left on the A-roll (see
 * DaveVSL) so it never lands on top of Dave's hands.
 */
export const Panel: React.FC<{
  label: string;
  inAt: number;
  outAt: number;
  children: React.ReactNode;
}> = ({label, inAt, outAt, children}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const enter = spring({frame: frame - inAt, fps, config: {damping: 22, stiffness: 120, mass: 0.8}, durationInFrames: 18});
  const exit = interpolate(frame, [outAt - 8, outAt], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <div
      style={{
        position: 'absolute',
        right: 88,
        top: 150,
        width: 636,
        opacity: enter * exit,
        transform: `translateX(${(1 - enter) * 44}px)`,
        background: C.paper,
        borderRadius: 22,
        border: `1px solid ${C.line}`,
        boxShadow: '0 34px 70px rgba(0,0,0,0.42), 0 4px 12px rgba(0,0,0,0.22)',
        padding: '34px 38px 38px',
        fontFamily,
      }}
    >
      <div
        style={{
          fontSize: 20,
          fontWeight: 700,
          letterSpacing: 2.6,
          textTransform: 'uppercase',
          color: C.muted,
          paddingBottom: 18,
          marginBottom: 26,
          borderBottom: `1px solid ${C.line}`,
        }}
      >
        {label}
      </div>
      {children}
    </div>
  );
};
