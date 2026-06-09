import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {fontFamily, theme} from '../Theme';

export const Scene2TextBack: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // Phone entrance (0-0.5s)
  const phoneY = spring({frame, fps, config: {damping: 18, stiffness: 140}, durationInFrames: 18});
  const phoneTransform = interpolate(phoneY, [0, 1], [400, 0]);

  // Counter 1-2-3 (0.5-2s): transitions from 1 at 0.5s → 2 at ~1.17s → 3 at ~1.83s
  const currentCount = frame < 15 ? 0 : frame < 35 ? 1 : frame < 55 ? 2 : 3;
  const countScale = spring({
    frame: frame - (currentCount === 1 ? 15 : currentCount === 2 ? 35 : currentCount === 3 ? 55 : 0),
    fps,
    config: {damping: 9, stiffness: 200},
  });

  // Text appears (2-3s)
  const smsSlide = spring({frame: frame - 60, fps, config: {damping: 20, stiffness: 160}, durationInFrames: 20});
  const smsOpacity = interpolate(frame, [60, 75], [0, 1], {extrapolateRight: 'clamp'});
  const smsY = interpolate(smsSlide, [0, 1], [-120, 0]);

  // "YES" reply (2.5-3s)
  const yesSpring = spring({frame: frame - 72, fps, config: {damping: 10, stiffness: 180}});
  const yesOpacity = interpolate(frame, [72, 80], [0, 1], {extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{background: theme.paper, fontFamily, justifyContent: 'center', alignItems: 'center', overflow: 'hidden'}}>
      {/* Side headline */}
      <div style={{position: 'absolute', top: 120, left: 0, right: 0, textAlign: 'center'}}>
        <div style={{color: theme.teal, fontSize: 36, fontWeight: 800, letterSpacing: 8, textTransform: 'uppercase'}}>Sybago Text-Back</div>
      </div>

      {/* Phone with text sequence */}
      <div style={{transform: `translateY(${phoneTransform}px) scale(0.95)`, position: 'relative'}}>
        <div
          style={{
            width: 640,
            height: 1320,
            borderRadius: 72,
            background: '#000',
            border: `8px solid ${theme.ink}`,
            position: 'relative',
            boxShadow: '0 40px 120px rgba(47,103,121,0.25)',
            overflow: 'hidden',
          }}
        >
          <div style={{position: 'absolute', top: 18, left: '50%', transform: 'translateX(-50%)', width: 180, height: 32, borderRadius: 20, background: '#000', zIndex: 3}} />
          <div style={{position: 'absolute', inset: 20, borderRadius: 52, background: '#0f0f0f', overflow: 'hidden'}}>
            {/* Background: missed call indicator */}
            <div style={{padding: '80px 36px 0', color: 'rgba(255,255,255,0.5)', fontSize: 26, fontWeight: 500, letterSpacing: 2}}>MISSED CALL</div>
            <div style={{padding: '10px 36px', color: '#fff', fontSize: 40, fontWeight: 700}}>Mike Johnson</div>
            <div style={{padding: '4px 36px 30px', color: 'rgba(255,255,255,0.4)', fontSize: 24}}>2:47 PM · Smithtown, NY</div>

            {/* Counter overlay 0.5-2s */}
            {frame < 60 && currentCount > 0 && (
              <div style={{position: 'absolute', top: '38%', left: 0, right: 0, textAlign: 'center'}}>
                <div style={{color: 'rgba(255,255,255,0.4)', fontSize: 24, fontWeight: 600, letterSpacing: 4, marginBottom: 20}}>TEXTING BACK IN...</div>
                <div style={{color: theme.gold, fontSize: 280, fontWeight: 800, lineHeight: 1, transform: `scale(${countScale})`}}>{currentCount}s</div>
              </div>
            )}

            {/* SMS bubble */}
            {frame >= 60 && (
              <div style={{position: 'absolute', top: 200, left: 36, right: 36, opacity: smsOpacity, transform: `translateY(${smsY}px)`}}>
                <div style={{color: 'rgba(255,255,255,0.5)', fontSize: 22, fontWeight: 500, marginBottom: 12}}>SYBAGO · just now</div>
                <div
                  style={{
                    background: theme.teal,
                    color: '#fff',
                    padding: '28px 34px',
                    borderRadius: 28,
                    borderBottomLeftRadius: 8,
                    fontSize: 34,
                    lineHeight: 1.4,
                    fontWeight: 500,
                    maxWidth: '92%',
                  }}
                >
                  Hey Mike — sorry we missed you! Want to book a free estimate?
                </div>

                {/* User's YES reply */}
                {frame >= 72 && (
                  <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: 24, opacity: yesOpacity, transform: `scale(${yesSpring})`}}>
                    <div
                      style={{
                        background: '#2c2c2e',
                        color: '#fff',
                        padding: '24px 36px',
                        borderRadius: 28,
                        borderBottomRightRadius: 8,
                        fontSize: 44,
                        fontWeight: 700,
                      }}
                    >
                      YES
                    </div>
                  </div>
                )}

                {/* Booking confirmation */}
                {frame >= 80 && (
                  <div
                    style={{
                      marginTop: 26,
                      background: 'rgba(46,177,88,0.15)',
                      border: `2px solid ${theme.success}`,
                      borderRadius: 24,
                      padding: 24,
                      color: theme.success,
                      fontSize: 30,
                      fontWeight: 700,
                      textAlign: 'center',
                      transform: `scale(${spring({frame: frame - 80, fps, config: {damping: 12}})})`,
                    }}
                  >
                    ✓ Booked · Thu 10am
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
