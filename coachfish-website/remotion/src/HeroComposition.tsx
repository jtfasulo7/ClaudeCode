import React from 'react';
import { AbsoluteFill, interpolate, Easing, useCurrentFrame } from 'remotion';
import { loadFont as loadUnbounded } from '@remotion/google-fonts/Unbounded';
import { loadFont as loadMontserrat } from '@remotion/google-fonts/Montserrat';
import { loadFont as loadMono } from '@remotion/google-fonts/JetBrainsMono';

const unbounded = loadUnbounded('normal', {
  weights: ['400', '500', '600', '700'],
});
const montserrat = loadMontserrat('normal', {
  weights: ['400', '500', '600', '700'],
});
const mono = loadMono('normal', { weights: ['400', '500'] });

const ease = Easing.bezier(0.22, 1, 0.36, 1);

// brand tokens (synced with styles.css)
const C = {
  white: '#FFFFFF',
  paper: '#FAFAFC',
  ink: '#0A0812',
  inkSoft: 'rgba(10, 8, 18, 0.72)',
  inkMuted: 'rgba(10, 8, 18, 0.5)',
  brand: '#251472',
  brandDeep: '#1A0E52',
  brandTint: '#F4F3FA',
  brandSoft: 'rgba(37, 20, 114, 0.12)',
  rule: 'rgba(10, 8, 18, 0.14)',
};

const F = {
  display: unbounded.fontFamily,
  sans: montserrat.fontFamily,
  mono: mono.fontFamily,
};

type RiseProps = {
  from: number;
  duration?: number;
  distance?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
};

const Rise: React.FC<RiseProps> = ({ from, duration = 26, distance = 28, children, style }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [from, from + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: ease,
  });
  return (
    <div
      style={{
        opacity: t,
        transform: `translateY(${(1 - t) * distance}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

const Grain: React.FC = () => (
  <AbsoluteFill
    style={{
      pointerEvents: 'none',
      opacity: 0.14,
      mixBlendMode: 'multiply',
    }}
  >
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <filter id="n">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
        <feColorMatrix values="0 0 0 0 0.039 0 0 0 0 0.031 0 0 0 0 0.07 0 0 0 0.5 0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#n)" />
    </svg>
  </AbsoluteFill>
);

export const HeroCredentials: React.FC = () => {
  const frame = useCurrentFrame();

  // ambient breathing (very subtle)
  const breath = 1 + Math.sin(frame / 38) * 0.004;

  // loop seamless fade
  const loopFade = interpolate(
    frame,
    [0, 6, 170, 180],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const creds = [
    { num: '15', unit: 'YEARS', label: 'Sport evaluation', from: 70 },
    { num: 'NFL', unit: 'SCOUT', label: 'Pro-grade eye', from: 86 },
    { num: '52K+', unit: 'NETWORK', label: 'College coaches', from: 102 },
    { num: 'ALL', unit: 'SPORTS', label: 'Every division', from: 118 },
  ];

  return (
    <AbsoluteFill style={{ background: C.white, opacity: loopFade }}>
      {/* brand purple radial glow — subtle top-right */}
      <AbsoluteFill style={{ pointerEvents: 'none' }}>
        <div
          style={{
            position: 'absolute',
            width: 800,
            height: 800,
            right: -200,
            top: -260,
            background: `radial-gradient(circle, ${C.brand} 0%, transparent 60%)`,
            opacity: 0.12,
          }}
        />
      </AbsoluteFill>

      {/* Brand hairline inset frame */}
      <div
        style={{
          position: 'absolute',
          inset: 36,
          border: `1px solid ${C.brand}`,
          opacity: interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp', easing: ease }),
          pointerEvents: 'none',
        }}
      />

      {/* inner hairline */}
      <div
        style={{
          position: 'absolute',
          inset: 40,
          border: `1px solid ${C.rule}`,
          pointerEvents: 'none',
        }}
      />

      {/* Main stage */}
      <AbsoluteFill
        style={{
          transform: `scale(${breath})`,
          transformOrigin: 'center center',
          padding: '72px 80px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        {/* top row — editorial marker */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Rise from={6} distance={14}>
            <div
              style={{
                fontFamily: F.mono,
                fontSize: 20,
                letterSpacing: '0.22em',
                color: C.brand,
                textTransform: 'uppercase',
                fontWeight: 500,
              }}
            >
              № 01 &nbsp;·&nbsp; Credentials
            </div>
          </Rise>

          <Rise from={10} distance={14}>
            <div
              style={{
                fontFamily: F.sans,
                fontSize: 18,
                letterSpacing: '0.22em',
                color: C.inkMuted,
                textTransform: 'uppercase',
                textAlign: 'right',
                fontWeight: 500,
              }}
            >
              Coach Fish Services
              <div
                style={{
                  width: 56,
                  height: 1,
                  background: C.brand,
                  marginTop: 10,
                  marginLeft: 'auto',
                }}
              />
            </div>
          </Rise>
        </div>

        {/* middle — name and title */}
        <div style={{ textAlign: 'center' }}>
          <Rise from={24} duration={32} distance={38}>
            <div
              style={{
                fontFamily: F.display,
                fontWeight: 700,
                fontSize: 106,
                lineHeight: 1.0,
                letterSpacing: '-0.045em',
                color: C.ink,
              }}
            >
              Kiyoshi
            </div>
            <div
              style={{
                fontFamily: F.display,
                fontWeight: 400,
                fontSize: 106,
                lineHeight: 1.0,
                letterSpacing: '-0.045em',
                color: C.brand,
                marginTop: 4,
              }}
            >
              “Terrell”
            </div>
            <div
              style={{
                fontFamily: F.display,
                fontWeight: 700,
                fontSize: 106,
                lineHeight: 1.0,
                letterSpacing: '-0.045em',
                color: C.ink,
                marginTop: 4,
              }}
            >
              Fish.
            </div>
          </Rise>

          {/* brand rule */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 28 }}>
            <div
              style={{
                height: 2,
                background: C.brand,
                width: interpolate(frame, [42, 66], [0, 220], {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                  easing: ease,
                }),
              }}
            />
          </div>

          <Rise from={50} duration={28} distance={18}>
            <div
              style={{
                fontFamily: F.sans,
                fontSize: 20,
                letterSpacing: '0.32em',
                color: C.inkSoft,
                textTransform: 'uppercase',
                marginTop: 28,
                fontWeight: 600,
              }}
            >
              Independent College Recruiter
            </div>
          </Rise>
        </div>

        {/* credentials block */}
        <div>
          <Rise from={62} duration={20} distance={14}>
            <div
              style={{
                fontFamily: F.mono,
                fontSize: 15,
                letterSpacing: '0.24em',
                color: C.brand,
                textTransform: 'uppercase',
                marginBottom: 20,
                fontWeight: 500,
              }}
            >
              The record
            </div>
          </Rise>

          <div
            style={{
              borderTop: `1px solid ${C.rule}`,
            }}
          >
            {creds.map((c, i) => {
              const rowOpacity = interpolate(
                frame,
                [c.from, c.from + 22],
                [0, 1],
                { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease }
              );
              const rowY = interpolate(
                frame,
                [c.from, c.from + 22],
                [18, 0],
                { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease }
              );
              const ruleWidth = interpolate(
                frame,
                [c.from + 4, c.from + 28],
                [0, 100],
                { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease }
              );
              return (
                <div
                  key={i}
                  style={{
                    position: 'relative',
                    display: 'grid',
                    gridTemplateColumns: '1fr auto 2fr',
                    alignItems: 'baseline',
                    padding: '18px 0',
                    borderBottom: `1px solid ${C.rule}`,
                    opacity: rowOpacity,
                    transform: `translateY(${rowY}px)`,
                  }}
                >
                  <div
                    style={{
                      fontFamily: F.display,
                      fontWeight: 600,
                      fontSize: 52,
                      letterSpacing: '-0.045em',
                      color: C.ink,
                      lineHeight: 1,
                    }}
                  >
                    {c.num}
                  </div>
                  <div
                    style={{
                      fontFamily: F.mono,
                      fontSize: 12,
                      letterSpacing: '0.26em',
                      textTransform: 'uppercase',
                      color: C.brand,
                      padding: '0 28px',
                      whiteSpace: 'nowrap',
                      fontWeight: 500,
                    }}
                  >
                    {c.unit}
                  </div>
                  <div
                    style={{
                      fontFamily: F.sans,
                      fontWeight: 500,
                      fontSize: 24,
                      color: C.inkSoft,
                      letterSpacing: '-0.005em',
                    }}
                  >
                    {c.label}
                  </div>
                  {/* brand accent rule — animated left to right */}
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      bottom: -1,
                      height: 1.5,
                      background: C.brand,
                      width: `${ruleWidth}%`,
                      opacity: 0.65,
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* footer tag */}
          <div
            style={{
              marginTop: 28,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontFamily: F.mono,
              fontSize: 13,
              letterSpacing: '0.22em',
              color: C.inkMuted,
              textTransform: 'uppercase',
              fontWeight: 500,
              opacity: interpolate(frame, [140, 160], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
                easing: ease,
              }),
            }}
          >
            <span>Phoenix, AZ</span>
            <span>Est. Fifteen Years</span>
          </div>
        </div>
      </AbsoluteFill>

      <Grain />
    </AbsoluteFill>
  );
};
