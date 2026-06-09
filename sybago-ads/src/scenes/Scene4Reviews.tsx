import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {fontFamily, theme} from '../Theme';

const Star: React.FC<{filled: number; size: number}> = ({filled, size}) => (
  <svg viewBox="0 0 24 24" width={size} height={size} style={{display: 'block'}}>
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" fill={theme.gold} opacity={filled} />
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" fill="none" stroke={theme.inkFaint} strokeWidth="1" />
  </svg>
);

export const Scene4Reviews: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const cardSpring = spring({frame, fps, config: {damping: 18}, durationInFrames: 14});
  const cardTransform = interpolate(cardSpring, [0, 1], [100, 0]);

  // Review notification (0.2-0.8s)
  const notifOpacity = interpolate(frame, [6, 12, 30, 36], [0, 1, 1, 0], {extrapolateRight: 'clamp'});
  const notifSpring = spring({frame: frame - 6, fps, config: {damping: 12}});

  // 5 stars animate in sequentially (0.8-1.5s = frames 24-45)
  const starFrames = [24, 29, 34, 39, 44];

  // Rating interpolates from 4.7 to 4.9
  const rating = interpolate(frame, [45, 58], [4.7, 4.9], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const reviewCount = Math.floor(interpolate(frame, [45, 58], [47, 48], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));

  return (
    <AbsoluteFill style={{background: theme.paper, fontFamily, justifyContent: 'center', alignItems: 'center', overflow: 'hidden'}}>
      <div style={{textAlign: 'center', marginBottom: 60}}>
        <div style={{color: theme.teal, fontSize: 36, fontWeight: 800, letterSpacing: 8, textTransform: 'uppercase'}}>5-Star Autopilot</div>
        <div style={{color: theme.ink, fontSize: 56, fontWeight: 800, marginTop: 16, letterSpacing: -1}}>Every job becomes a review.</div>
      </div>

      {/* Google-style review card */}
      <div
        style={{
          width: 820,
          background: theme.paper,
          borderRadius: 24,
          padding: '52px 60px',
          boxShadow: '0 30px 80px rgba(47,103,121,0.18)',
          border: '1px solid rgba(17,17,17,0.08)',
          transform: `translateY(${cardTransform}px)`,
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', gap: 20, marginBottom: 36}}>
          <div style={{width: 72, height: 72, borderRadius: '50%', background: theme.teal, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, fontWeight: 800}}>S</div>
          <div>
            <div style={{fontSize: 34, fontWeight: 700, color: theme.ink, letterSpacing: -0.3}}>Sybago Customer</div>
            <div style={{fontSize: 24, color: theme.inkFaint, fontWeight: 500, marginTop: 4}}>Posted to Google · just now</div>
          </div>
        </div>

        <div style={{display: 'flex', gap: 12, marginBottom: 30}}>
          {starFrames.map((startFrame, i) => {
            const s = spring({frame: frame - startFrame, fps, config: {damping: 10, stiffness: 200}});
            return (
              <div key={i} style={{transform: `scale(${s})`}}>
                <Star filled={interpolate(frame, [startFrame, startFrame + 6], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} size={72} />
              </div>
            );
          })}
        </div>

        <div style={{fontSize: 32, color: theme.ink, fontWeight: 500, lineHeight: 1.5}}>
          Showed up on time, professional crew, roof looks fantastic.
        </div>
      </div>

      {/* Review request notification */}
      {frame >= 6 && frame < 38 && (
        <div
          style={{
            position: 'absolute',
            top: 360,
            left: '50%',
            transform: `translateX(-50%) scale(${notifSpring})`,
            background: theme.teal,
            color: '#fff',
            padding: '22px 40px',
            borderRadius: 18,
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: 0.5,
            opacity: notifOpacity,
            boxShadow: '0 20px 50px rgba(47,103,121,0.4)',
          }}
        >
          ✓ Job complete → review request sent
        </div>
      )}

      {/* Rating aggregate */}
      <div
        style={{
          marginTop: 60,
          display: 'flex',
          gap: 80,
          alignItems: 'center',
          opacity: interpolate(frame, [42, 50], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
        }}
      >
        <div style={{textAlign: 'center'}}>
          <div style={{color: theme.gold, fontSize: 110, fontWeight: 800, lineHeight: 1}}>{rating.toFixed(1)}</div>
          <div style={{color: theme.inkMuted, fontSize: 22, fontWeight: 600, letterSpacing: 3, textTransform: 'uppercase', marginTop: 6}}>AVG RATING</div>
        </div>
        <div style={{width: 2, height: 100, background: 'rgba(17,17,17,0.1)'}} />
        <div style={{textAlign: 'center'}}>
          <div style={{color: theme.teal, fontSize: 110, fontWeight: 800, lineHeight: 1}}>{reviewCount}</div>
          <div style={{color: theme.inkMuted, fontSize: 22, fontWeight: 600, letterSpacing: 3, textTransform: 'uppercase', marginTop: 6}}>REVIEWS</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
