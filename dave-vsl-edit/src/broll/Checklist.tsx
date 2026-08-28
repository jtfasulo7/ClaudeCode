import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C} from '../theme';

export type Item = {text: string; at: number};

const Check: React.FC<{p: number}> = ({p}) => (
  <svg width="28" height="28" viewBox="0 0 30 30" style={{flexShrink: 0, marginTop: 5}}>
    <circle cx="15" cy="15" r="13.5" fill="none" stroke={C.green} strokeWidth="2.5" opacity={0.35} />
    <path
      d="M8.5 15.5 L13 20 L21.5 10.5"
      stroke={C.green}
      strokeWidth="3.2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray="20"
      strokeDashoffset={20 - p * 20}
    />
  </svg>
);

export const Checklist: React.FC<{items: Item[]}> = ({items}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // Newest row holds in ink, earlier rows settle to muted — keeps an
  // 18-second panel reading as live without adding motion noise.
  const activeIdx = items.reduce((acc, it, i) => (frame >= it.at ? i : acc), -1);

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: 20}}>
      {items.map((it, i) => {
        // Rows are always in the layout, just invisible until their cue. A card
        // that grows as items land reads as unfinished.
        const s = frame < it.at
          ? 0
          : spring({frame: frame - it.at, fps, config: {damping: 24, stiffness: 150}, durationInFrames: 14});
        const draw = interpolate(frame - it.at, [4, 16], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        const isActive = i === activeIdx;
        return (
          <div
            key={i}
            style={{
              display: 'flex',
              gap: 16,
              opacity: s,
              transform: `translateY(${(1 - s) * 12}px)`,
            }}
          >
            <Check p={draw} />
            <div
              style={{
                fontSize: 32,
                fontWeight: isActive ? 700 : 600,
                lineHeight: 1.25,
                letterSpacing: -0.4,
                color: isActive ? C.ink : C.muted,
              }}
            >
              {it.text}
            </div>
          </div>
        );
      })}
    </div>
  );
};
