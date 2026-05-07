import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { T, FONT, SIZE } from '../tokens';
import { Browser } from '../components/Browser';
import { Phone, SmsHeader, SmsBubble } from '../components/Phone';

/* ──────────────────────────────────────────────────────────────────────
   Feature 01 — A Website That Texts Customers For You
   Beats:
     0.0–1.2s   Visitor types name + phone into the contact form, hits Send
     1.2–1.8s   Animated arrow from website → phone
     1.8–3.0s   Phone vibrates, SMS thread shows the auto-reply landing
   ────────────────────────────────────────────────────────────────────── */

export const F01_WebsiteToSms: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Beat 1: type the form (0–1.2s = frames 0–36) ──
  const nameLen = Math.min(11, Math.max(0, Math.floor((frame - 4) * 0.55)));
  const phoneLen = Math.min(12, Math.max(0, Math.floor((frame - 18) * 0.85)));
  const fullName = 'Mike Allen';
  const fullPhone = '(617) 555-0188';

  // Submit button click pulse near t=1.0s (frame 30)
  const clickT = spring({
    frame: frame - 30, fps,
    config: { damping: 14, mass: 0.6 },
  });
  const clickScale = interpolate(clickT, [0, 1], [1, 0.94], {
    extrapolateRight: 'clamp',
  });
  const clicked = frame >= 30;

  // Arrow appears 1.0–1.7s
  const arrowProgress = interpolate(frame, [32, 50], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Phone shake (vibrate) 1.6–2.0s
  const shake = (() => {
    const f = frame - 48;
    if (f < 0 || f > 14) return 0;
    return Math.sin(f * 1.6) * (1 - f / 14) * 6;
  })();

  // SMS bubble drop in at 1.9s
  const smsT = spring({
    frame: frame - 56, fps,
    config: { damping: 18, mass: 0.8 },
  });
  const smsY = interpolate(smsT, [0, 1], [16, 0], {
    extrapolateRight: 'clamp',
  });
  const smsOp = interpolate(smsT, [0, 1], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Phone width
  const phoneW = 360;

  return (
    <AbsoluteFill style={{
      background: T.bg2,
      fontFamily: FONT,
      padding: SIZE.pad,
    }}>
      {/* Soft brand background gradient */}
      <AbsoluteFill style={{
        background:
          'radial-gradient(ellipse at 20% 20%, rgba(47,103,121,0.08), transparent 55%),' +
          'radial-gradient(ellipse at 85% 80%, rgba(77,191,122,0.07),  transparent 60%)',
      }} />

      <div style={{
        position: 'absolute',
        inset: SIZE.pad,
        display: 'flex',
        alignItems: 'center',
        gap: 64,
      }}>

        {/* LEFT — Browser with form */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
          <Browser width={680} height={520}>
            <div style={{
              padding: '36px 44px',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: 24,
            }}>
              <div style={{
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: '0.32em',
                textTransform: 'uppercase',
                color: T.tealB,
              }}>
                Get a free roof inspection
              </div>
              <div style={{
                fontSize: 30,
                fontWeight: 800,
                color: T.ink,
                lineHeight: 1.1,
                letterSpacing: '-0.015em',
              }}>
                Tell us about the job.<br/>
                We'll text you back today.
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 12 }}>
                <FormInput label="Name"  value={fullName.slice(0, nameLen)} />
                <FormInput label="Phone" value={fullPhone.slice(0, phoneLen)} />
              </div>

              <button style={{
                marginTop: 6,
                background: clicked ? T.tealB : T.teal,
                color: '#fff',
                fontFamily: FONT,
                fontWeight: 700,
                fontSize: 14,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                padding: '18px 28px',
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
                transform: `scale(${clickScale})`,
                alignSelf: 'flex-start',
                boxShadow: clicked
                  ? `0 0 0 4px ${T.tealG}`
                  : '0 6px 18px rgba(47,103,121,0.18)',
                transition: 'box-shadow .2s, background .2s',
              }}>
                Send → I'll text you back
              </button>
            </div>
          </Browser>
        </div>

        {/* RIGHT — Phone with SMS */}
        <div style={{
          width: phoneW,
          flexShrink: 0,
          transform: `translateX(${shake}px)`,
        }}>
          <Phone width={phoneW} carrier="Sybago">
            <SmsHeader name="New Lead — Mike A." sub="iMessage" width={phoneW} />
            <div style={{ paddingTop: 18 }}>
              <div style={{
                textAlign: 'center',
                fontSize: phoneW * 0.025,
                color: T.ink3,
                fontWeight: 600,
                margin: `${phoneW * 0.025}px 0 ${phoneW * 0.025}px`,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}>
                Just now
              </div>
              <div style={{
                opacity: smsOp,
                transform: `translateY(${smsY}px)`,
              }}>
                <SmsBubble
                  side="out"
                  width={phoneW}
                  text={"Hey Mike — got your message. I'll be in touch in the next 5 min to set up the inspection. Anything I should know?"}
                />
              </div>
            </div>
          </Phone>
        </div>

      </div>

      {/* Arrow / motion line from form → phone */}
      {arrowProgress > 0 && (
        <Arrow
          progress={arrowProgress}
          fromX={SIZE.pad + 680 - 40}
          fromY={SIZE.height / 2 + 80}
          toX={SIZE.width - SIZE.pad - phoneW + 18}
          toY={SIZE.height / 2 - 60}
        />
      )}

    </AbsoluteFill>
  );
};

const FormInput: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    <span style={{
      fontSize: 11, fontWeight: 700, letterSpacing: '0.18em',
      textTransform: 'uppercase', color: T.ink3,
    }}>{label}</span>
    <span style={{
      fontFamily: FONT,
      fontSize: 18,
      fontWeight: 500,
      color: T.ink,
      padding: '14px 16px',
      background: T.bg,
      border: `1.5px solid ${value ? T.tealB : T.line}`,
      borderRadius: 8,
      minHeight: 50,
      transition: 'border-color .2s',
    }}>
      {value}
      {value.length > 0 && (
        <span style={{
          display: 'inline-block',
          width: 2, height: 18,
          background: T.tealB,
          marginLeft: 2,
          verticalAlign: 'middle',
          animation: 'none',
        }} />
      )}
    </span>
  </label>
);

const Arrow: React.FC<{
  progress: number;
  fromX: number; fromY: number;
  toX:   number; toY:   number;
}> = ({ progress, fromX, fromY, toX, toY }) => {
  // Bezier control points for a gentle arc
  const cx1 = fromX + 100;
  const cy1 = fromY - 30;
  const cx2 = toX   - 100;
  const cy2 = toY   + 80;

  // Sample point at `progress` along the cubic bezier to draw the arrow head
  const t = progress;
  const omt = 1 - t;
  const headX = omt*omt*omt*fromX + 3*omt*omt*t*cx1 + 3*omt*t*t*cx2 + t*t*t*toX;
  const headY = omt*omt*omt*fromY + 3*omt*omt*t*cy1 + 3*omt*t*t*cy2 + t*t*t*toY;

  // Tangent at t for arrow rotation
  const tx = 3*omt*omt*(cx1-fromX) + 6*omt*t*(cx2-cx1) + 3*t*t*(toX-cx2);
  const ty = 3*omt*omt*(cy1-fromY) + 6*omt*t*(cy2-cy1) + 3*t*t*(toY-cy2);
  const angle = Math.atan2(ty, tx) * 180 / Math.PI;

  return (
    <svg style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      <defs>
        <linearGradient id="arrowGrad" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor={T.tealB} stopOpacity={0} />
          <stop offset="40%" stopColor={T.tealB} stopOpacity={0.7} />
          <stop offset="100%" stopColor={T.tealB} stopOpacity={1} />
        </linearGradient>
      </defs>
      <path
        d={`M ${fromX} ${fromY} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${toX} ${toY}`}
        stroke="url(#arrowGrad)"
        strokeWidth={3}
        fill="none"
        strokeLinecap="round"
        strokeDasharray="900"
        strokeDashoffset={900 - progress * 900}
      />
      {progress > 0.05 && (
        <g transform={`translate(${headX} ${headY}) rotate(${angle})`}>
          <polygon
            points="0,0 -14,-7 -14,7"
            fill={T.tealB}
          />
        </g>
      )}
    </svg>
  );
};
