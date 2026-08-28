import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {C} from '../theme';

const Row: React.FC<{k: string; v: string; color: string; strike?: boolean; big?: boolean; at: number}> = ({
  k, v, color, strike, big, at,
}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [at, at + 9], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div style={{opacity: o, transform: `translateY(${(1 - o) * 10}px)`}}>
      <div style={{fontSize: 21, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: C.muted}}>{k}</div>
      <div
        style={{
          fontSize: big ? 92 : 68,
          fontWeight: 800,
          letterSpacing: -2,
          color,
          lineHeight: 1.08,
          marginTop: 4,
          textDecoration: strike ? 'line-through' : 'none',
          textDecorationThickness: strike ? 5 : undefined,
        }}
      >
        {v}
      </div>
    </div>
  );
};

const REVEAL_H = 178;

/**
 * ats = [frame the "thousands" row lands, frame the "$15" row lands] — each
 * timed to its exact word in the VO. The VO leaves ~2.6s between them, so
 * rather than sit on a half-empty card the second half is collapsed and grows
 * into place. Here the growth IS the reveal, which is why this card animates
 * its height and the list cards deliberately do not.
 */
export const PriceGap: React.FC<{ats: [number, number]}> = ({ats}) => {
  const frame = useCurrentFrame();
  const grow = interpolate(frame, [ats[1] - 12, ats[1] + 3], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <div>
      <Row k="Big pharma" v="Thousands" color={C.rust} strike at={ats[0]} />
      <div style={{height: REVEAL_H * grow, overflow: 'hidden'}}>
        <div style={{height: 26, display: 'flex', alignItems: 'center', opacity: grow}}>
          <svg width="30" height="34" viewBox="0 0 30 34" style={{marginTop: 14}}>
            <path d="M15 2 V26 M6 18 L15 28 L24 18" stroke={C.muted} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div style={{height: 22}} />
        <Row k="Same stuff" v="$15 / mo" color={C.green} big at={ats[1]} />
      </div>
    </div>
  );
};
