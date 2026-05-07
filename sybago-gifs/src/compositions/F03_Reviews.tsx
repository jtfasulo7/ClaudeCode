import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { T, FONT, SIZE } from '../tokens';
import { Phone, SmsBubble, SmsHeader } from '../components/Phone';

/* ──────────────────────────────────────────────────────────────────────
   Feature 03 — 5-Star Reviews, Without The Awkward Ask
   Beats:
     0.0–1.4s   SMS text "How was the work?" arrives
     1.4–2.0s   Customer taps stars — they fill in one by one
     2.0–3.0s   Cuts to a fresh Google review with 5★ + a real-sounding line
   ────────────────────────────────────────────────────────────────────── */

export const F03_Reviews: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const phoneW = 400;

  // Cross-fade SMS view → Google review at frame 60 (2.0s)
  const transition = interpolate(frame, [60, 70], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // SMS bubble in
  const smsT = spring({
    frame: frame - 8, fps, config: { damping: 18, mass: 0.8 },
  });
  const smsY = interpolate(smsT, [0, 1], [16, 0], { extrapolateRight: 'clamp' });
  const smsOp = interpolate(smsT, [0, 1], [0, 1], { extrapolateRight: 'clamp' });

  // Star fill-in begins at frame 32 (~1.07s), one star per ~3 frames
  const starsFilled = Math.max(0, Math.min(5, Math.floor((frame - 32) / 3)));

  // Tap-feedback ring on whichever star is currently being lit
  const tapFrame = 32 + starsFilled * 3;
  const tapPulse = (() => {
    const f = frame - tapFrame;
    if (f < 0 || f > 8) return 0;
    return 1 - f / 8;
  })();

  return (
    <AbsoluteFill style={{
      background: T.bg2,
      fontFamily: FONT,
      padding: SIZE.pad,
    }}>
      <AbsoluteFill style={{
        background:
          'radial-gradient(ellipse at 25% 25%, rgba(232,176,74,0.10), transparent 55%),' +
          'radial-gradient(ellipse at 75% 75%, rgba(47,103,121,0.06), transparent 55%)',
      }} />

      {/* Caption (cycles across the 3 beats) */}
      <Caption frame={frame} />

      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Phone width={phoneW} carrier="Sybago Roofing">

          {/* SMS view */}
          <div style={{
            position: 'absolute',
            inset: 0,
            opacity: 1 - transition,
          }}>
            <SmsHeader name="Sybago Roofing" sub="Job complete · Today" width={phoneW} />
            <div style={{ paddingTop: phoneW * 0.030 }}>
              <div style={{
                opacity: smsOp,
                transform: `translateY(${smsY}px)`,
              }}>
                <SmsBubble side="in" width={phoneW}
                  text={"Hey Mike — thanks for choosing Sybago Roofing. How'd we do? Tap a rating and we'll go from there."}
                />
              </div>

              {/* Stars row */}
              <div style={{
                marginTop: phoneW * 0.05,
                display: 'flex',
                justifyContent: 'center',
                gap: phoneW * 0.025,
              }}>
                {[0,1,2,3,4].map(i => {
                  const filled = i < starsFilled;
                  const active = i === starsFilled - 1 && tapPulse > 0;
                  return (
                    <div key={i} style={{ position: 'relative' }}>
                      <Star size={phoneW * 0.08} filled={filled} />
                      {active && (
                        <span style={{
                          position: 'absolute',
                          inset: -8,
                          borderRadius: '50%',
                          border: `2px solid ${T.warn}`,
                          opacity: tapPulse,
                          transform: `scale(${1 + (1 - tapPulse) * 0.6})`,
                        }} />
                      )}
                    </div>
                  );
                })}
              </div>
              <div style={{
                textAlign: 'center',
                fontSize: phoneW * 0.026,
                color: T.ink3,
                fontWeight: 600,
                marginTop: phoneW * 0.02,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}>
                {starsFilled === 0 ? 'Tap to rate' : `${starsFilled} of 5`}
              </div>
            </div>
          </div>

          {/* Google review confirmation view */}
          <div style={{
            position: 'absolute',
            inset: 0,
            opacity: transition,
            background: T.bg,
            display: 'flex',
            flexDirection: 'column',
          }}>
            {/* Google-ish header */}
            <div style={{
              padding: `${phoneW * 0.04}px ${phoneW * 0.05}px`,
              borderBottom: `1px solid ${T.line}`,
              display: 'flex',
              alignItems: 'center',
              gap: phoneW * 0.03,
            }}>
              <span style={{
                fontSize: phoneW * 0.060,
                fontWeight: 800,
                letterSpacing: '-0.02em',
                background: 'linear-gradient(90deg,#4285F4,#EA4335,#FBBC04,#34A853)',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
              }}>
                Google
              </span>
              <span style={{
                fontSize: phoneW * 0.030,
                color: T.ink3,
                fontWeight: 600,
                marginLeft: 'auto',
              }}>
                Review submitted ✓
              </span>
            </div>

            <div style={{ padding: `${phoneW * 0.05}px ${phoneW * 0.045}px` }}>
              {/* Business card */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: phoneW * 0.030,
                marginBottom: phoneW * 0.04,
              }}>
                <div style={{
                  width: phoneW * 0.10, height: phoneW * 0.10,
                  borderRadius: '50%',
                  background: T.teal,
                  color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: phoneW * 0.048,
                  fontWeight: 800,
                }}>S</div>
                <div>
                  <div style={{
                    fontWeight: 700, fontSize: phoneW * 0.034, color: T.ink,
                  }}>Sybago Roofing</div>
                  <div style={{
                    fontSize: phoneW * 0.026, color: T.ink3, fontWeight: 500,
                  }}>Roofer · 4.9 (87)</div>
                </div>
              </div>

              {/* 5 stars row */}
              <div style={{
                display: 'flex', gap: phoneW * 0.012, marginBottom: phoneW * 0.030,
              }}>
                {[0,1,2,3,4].map(i => (
                  <Star key={i} size={phoneW * 0.06} filled={true} />
                ))}
              </div>

              {/* Review body */}
              <div style={{
                fontSize: phoneW * 0.030,
                lineHeight: 1.5,
                color: T.ink,
                fontWeight: 500,
              }}>
                "Mike came out the same week, fixed the leak in 90 minutes,
                cleaned up after himself. Texted me a photo of the finished
                job. Will absolutely call him again."
              </div>

              <div style={{
                marginTop: phoneW * 0.04,
                fontSize: phoneW * 0.024,
                color: T.ink3,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                fontWeight: 600,
              }}>
                ✓ Posted publicly · Just now
              </div>
            </div>
          </div>
        </Phone>
      </div>

    </AbsoluteFill>
  );
};

const Caption: React.FC<{ frame: number }> = ({ frame }) => {
  const lines = [
    { from: 0,  to: 32, text: 'Job done. Friendly automated text goes out.' },
    { from: 32, to: 60, text: 'Customer taps a rating.' },
    { from: 60, to: 90, text: 'Real review. Posted publicly. No gating.' },
  ];
  const active = lines.find(l => frame >= l.from && frame < l.to) ?? lines[lines.length - 1];
  const localT = (frame - active.from) / 6;
  const op = Math.min(1, Math.max(0, localT));

  return (
    <div style={{
      position: 'absolute',
      bottom: SIZE.pad,
      left: SIZE.pad, right: SIZE.pad,
      textAlign: 'center',
      opacity: op, pointerEvents: 'none',
    }}>
      <div style={{
        display: 'inline-block',
        background: 'rgba(15,20,25,0.04)',
        border: `1px solid ${T.line}`,
        borderRadius: 999,
        padding: '14px 28px',
        fontSize: 22, fontWeight: 600, color: T.ink,
        letterSpacing: '-0.005em',
      }}>
        {active.text}
      </div>
    </div>
  );
};

const Star: React.FC<{ size: number; filled: boolean }> = ({ size, filled }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"
    fill={filled ? T.warn : 'none'}
    stroke={filled ? T.warn : T.ink4}
    strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
