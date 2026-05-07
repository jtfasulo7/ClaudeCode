import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { T, FONT, SIZE } from '../tokens';
import { Phone, SmsBubble, SmsHeader } from '../components/Phone';

/* ──────────────────────────────────────────────────────────────────────
   Feature 02 — Missed The Call? We'll Text Them Back
   Beats:
     0.0–1.4s   Phone shows "Incoming call" — buttons (Decline/Accept)
     1.4–1.8s   Call goes unanswered → "Missed call" badge appears
     1.8–3.0s   Cuts to SMS thread; outbound auto-reply lands on Mike's phone
   ────────────────────────────────────────────────────────────────────── */

export const F02_MissedCall: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const phoneW = 440;

  // Cross-fade between two screens at frame 42 (1.4s)
  const stage = frame < 42 ? 'incoming' : 'sms';
  const transitionT = interpolate(frame, [40, 48], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Pulse for incoming-call avatar
  const pulse = (Math.sin(frame * 0.35) + 1) / 2;

  // Vibrate shake on the phone during ringing
  const shake = (() => {
    if (frame > 38) return 0;
    return Math.sin(frame * 1.2) * 3;
  })();

  // Outbound SMS spring in at frame 60 (~2s)
  const smsT = spring({
    frame: frame - 60, fps, config: { damping: 18, mass: 0.8 },
  });
  const smsY = interpolate(smsT, [0, 1], [16, 0], { extrapolateRight: 'clamp' });
  const smsOp = interpolate(smsT, [0, 1], [0, 1], { extrapolateRight: 'clamp' });

  // The "Missed call" toast that briefly slides in at frame 36
  const missedT = spring({
    frame: frame - 36, fps, config: { damping: 18, mass: 0.7 },
  });
  const missedY = interpolate(missedT, [0, 1], [-40, 0], { extrapolateRight: 'clamp' });
  const missedOp = (() => {
    if (frame < 36) return 0;
    if (frame < 50) return interpolate(frame, [36, 42], [0, 1], { extrapolateRight: 'clamp' });
    return interpolate(frame, [50, 56], [1, 0], { extrapolateRight: 'clamp' });
  })();

  return (
    <AbsoluteFill style={{
      background: T.bg2,
      fontFamily: FONT,
      padding: SIZE.pad,
    }}>
      {/* Brand atmosphere */}
      <AbsoluteFill style={{
        background:
          'radial-gradient(ellipse at 30% 20%, rgba(232,176,74,0.06), transparent 55%),' +
          'radial-gradient(ellipse at 70% 80%, rgba(47,103,121,0.10), transparent 55%)',
      }} />

      {/* Caption */}
      <Caption frame={frame} />

      {/* Center the phone */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: `translateX(${shake}px)`,
      }}>
        <Phone width={phoneW} carrier={stage === 'incoming' ? 'Mike Allen' : 'Sybago'}>
          {/* Incoming call view */}
          <div style={{
            position: 'absolute',
            inset: 0,
            opacity: 1 - transitionT,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: `${phoneW * 0.06}px 0 ${phoneW * 0.08}px`,
            background: 'linear-gradient(180deg, #faf6ed 0%, #fff 50%)',
          }}>
            <div style={{
              fontSize: phoneW * 0.030,
              fontWeight: 700,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: T.ink3,
              marginTop: phoneW * 0.04,
            }}>
              Incoming call
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: phoneW * 0.030,
            }}>
              {/* Pulsing avatar */}
              <div style={{
                width: phoneW * 0.34,
                height: phoneW * 0.34,
                borderRadius: '50%',
                background: T.teal,
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: phoneW * 0.13,
                fontWeight: 800,
                position: 'relative',
                boxShadow: `0 0 0 ${4 + pulse * 14}px rgba(47,103,121,${0.18 - pulse * 0.10})`,
              }}>
                MA
              </div>
              <div style={{
                fontSize: phoneW * 0.060,
                fontWeight: 700,
                color: T.ink,
                letterSpacing: '-0.01em',
              }}>
                Mike Allen
              </div>
              <div style={{
                fontSize: phoneW * 0.030,
                color: T.ink2,
                fontWeight: 500,
              }}>
                (617) 555-0188 · mobile
              </div>
            </div>

            {/* Decline / Accept */}
            <div style={{
              display: 'flex',
              gap: phoneW * 0.12,
            }}>
              <CallBtn color="#E5484D" icon="decline" size={phoneW * 0.16} />
              <CallBtn color="#30A46C" icon="accept"  size={phoneW * 0.16} />
            </div>
          </div>

          {/* Missed-call toast (appears just before transition) */}
          <div style={{
            position: 'absolute',
            top: phoneW * 0.04,
            left: phoneW * 0.06,
            right: phoneW * 0.06,
            background: 'rgba(15,20,25,0.88)',
            color: '#fff',
            borderRadius: phoneW * 0.04,
            padding: `${phoneW * 0.030}px ${phoneW * 0.040}px`,
            display: 'flex',
            gap: phoneW * 0.030,
            alignItems: 'center',
            opacity: missedOp,
            transform: `translateY(${missedY}px)`,
            zIndex: 20,
            boxShadow: '0 14px 30px rgba(0,0,0,0.18)',
            backdropFilter: 'blur(12px)',
          }}>
            <span style={{
              width: phoneW * 0.06, height: phoneW * 0.06,
              borderRadius: '50%',
              background: '#E5484D',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
              fontSize: phoneW * 0.030,
            }}>
              {/* phone-missed icon */}
              <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none"
                stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0 1 22 16.92z"/>
                <line x1="23" y1="1"  x2="17" y2="7" />
                <line x1="17" y1="1"  x2="23" y2="7" />
              </svg>
            </span>
            <div style={{
              display: 'flex', flexDirection: 'column', gap: 2,
            }}>
              <div style={{
                fontSize: phoneW * 0.030,
                fontWeight: 700,
                lineHeight: 1.1,
              }}>
                Missed call · Mike Allen
              </div>
              <div style={{
                fontSize: phoneW * 0.024,
                color: 'rgba(255,255,255,0.7)',
              }}>
                Sybago is texting them back…
              </div>
            </div>
          </div>

          {/* SMS view */}
          <div style={{
            position: 'absolute',
            inset: 0,
            opacity: transitionT,
            background: T.bg,
          }}>
            <SmsHeader name="Mike Allen" sub="iMessage · text" width={phoneW} />

            <div style={{ paddingTop: phoneW * 0.030 }}>
              <div style={{
                textAlign: 'center',
                fontSize: phoneW * 0.024,
                color: T.ink3,
                fontWeight: 600,
                margin: `0 0 ${phoneW * 0.025}px`,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}>
                30 seconds after missed call
              </div>

              <div style={{
                opacity: smsOp,
                transform: `translateY(${smsY}px)`,
              }}>
                <SmsBubble
                  side="out"
                  width={phoneW}
                  text={"Hey Mike — sorry I missed that. On a roof right now. What can I help you with?"}
                />
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
    { from: 0,  to: 42, text: 'Phone rings. You\'re on a job.' },
    { from: 42, to: 60, text: '30 seconds later — they get a text from you.' },
    { from: 60, to: 90, text: 'About 1 in 3 turn into booked jobs.' },
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
      opacity: op,
      pointerEvents: 'none',
    }}>
      <div style={{
        display: 'inline-block',
        background: 'rgba(15,20,25,0.04)',
        border: `1px solid ${T.line}`,
        borderRadius: 999,
        padding: '14px 28px',
        fontSize: 22,
        fontWeight: 600,
        color: T.ink,
        letterSpacing: '-0.005em',
      }}>
        {active.text}
      </div>
    </div>
  );
};

const CallBtn: React.FC<{ color: string; icon: 'accept'|'decline'; size: number }> = ({
  color, icon, size,
}) => (
  <div style={{
    width: size, height: size,
    borderRadius: '50%',
    background: color,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: `0 8px 20px ${color}55`,
  }}>
    <svg width="46%" height="46%" viewBox="0 0 24 24" fill="none"
      stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      style={{ transform: icon === 'decline' ? 'rotate(135deg)' : 'none' }}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0 1 22 16.92z"/>
    </svg>
  </div>
);
