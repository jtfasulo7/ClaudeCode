import React from 'react';
import { AbsoluteFill, interpolate, Easing, useCurrentFrame } from 'remotion';
import { loadFont as loadFraunces } from '@remotion/google-fonts/Fraunces';
import { loadFont as loadSans } from '@remotion/google-fonts/InstrumentSans';
import { loadFont as loadMono } from '@remotion/google-fonts/IBMPlexMono';

const fraunces = loadFraunces('normal', {
  weights: ['400', '500', '600'],
  style: 'normal',
});
const frauncesItalic = loadFraunces('normal', {
  weights: ['400', '500'],
  style: 'italic',
});
const sans = loadSans('normal', { weights: ['400', '500'] });
const mono = loadMono('normal', { weights: ['400', '500'] });

const ease = Easing.bezier(0.22, 1, 0.36, 1);

// tokens
const C = {
  cream: '#F4EFE6',
  paper: '#FAF7F1',
  ink: '#0B1D2E',
  inkSoft: 'rgba(11, 29, 46, 0.7)',
  inkMuted: 'rgba(11, 29, 46, 0.5)',
  gold: '#C8A15A',
  goldDeep: '#9B7B3F',
  rule: 'rgba(11, 29, 46, 0.14)',
};

const F = {
  display: fraunces.fontFamily,
  displayItalic: frauncesItalic.fontFamily,
  sans: sans.fontFamily,
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
      opacity: 0.22,
      mixBlendMode: 'multiply',
    }}
  >
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <filter id="n">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
        <feColorMatrix values="0 0 0 0 0.043 0 0 0 0 0.113 0 0 0 0 0.18 0 0 0 0.5 0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#n)" />
    </svg>
  </AbsoluteFill>
);

export const HeroCredentials: React.FC = () => {
  const frame = useCurrentFrame();

  // ambient breathing on the whole composition (extremely subtle)
  const breath = 1 + Math.sin(frame / 38) * 0.004;

  // overall loop fade-in/out (imperceptible for seamless loop)
  const loopFade = interpolate(
    frame,
    [0, 6, 170, 180],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // credentials stagger timings
  const creds = [
    { num: '15', unit: 'YEARS', label: 'Sport evaluation', from: 70 },
    { num: 'NFL', unit: 'SCOUT', label: 'Pro-grade eye', from: 86 },
    { num: '52,000+', unit: 'NETWORK', label: 'College coaches', from: 102 },
    { num: 'ALL', unit: 'SPORTS', label: 'Every division', from: 118 },
  ];

  return (
    <AbsoluteFill style={{ background: C.cream, opacity: loopFade }}>
      {/* Gold hairline inset frame */}
      <div
        style={{
          position: 'absolute',
          inset: 36,
          border: `1px solid ${C.gold}`,
          opacity: interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp', easing: ease }),
          pointerEvents: 'none',
        }}
      />

      {/* inner ink frame on frame */}
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
                fontSize: 22,
                letterSpacing: '0.22em',
                color: C.goldDeep,
                textTransform: 'uppercase',
              }}
            >
              № 01 &nbsp;·&nbsp; Credentials
            </div>
          </Rise>

          <Rise from={10} distance={14}>
            <div
              style={{
                fontFamily: F.mono,
                fontSize: 20,
                letterSpacing: '0.24em',
                color: C.inkMuted,
                textTransform: 'uppercase',
                textAlign: 'right',
              }}
            >
              Coach Fish Services
              <div
                style={{
                  width: 56,
                  height: 1,
                  background: C.gold,
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
                fontVariationSettings: '"opsz" 144, "SOFT" 30',
                fontWeight: 500,
                fontSize: 120,
                lineHeight: 0.9,
                letterSpacing: '-0.025em',
                color: C.ink,
              }}
            >
              Kiyoshi <span style={{ fontFamily: F.displayItalic, fontStyle: 'italic', fontWeight: 400 }}>“Terrell”</span>
            </div>
            <div
              style={{
                fontFamily: F.display,
                fontVariationSettings: '"opsz" 144, "SOFT" 30',
                fontWeight: 500,
                fontSize: 120,
                lineHeight: 0.9,
                letterSpacing: '-0.025em',
                color: C.ink,
                marginTop: 6,
              }}
            >
              Fish.
            </div>
          </Rise>

          {/* gold rule */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 28 }}>
            <div
              style={{
                height: 1,
                background: C.gold,
                width: interpolate(frame, [42, 66], [0, 200], {
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
                fontSize: 22,
                letterSpacing: '0.32em',
                color: C.inkSoft,
                textTransform: 'uppercase',
                marginTop: 28,
                fontWeight: 500,
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
                fontSize: 16,
                letterSpacing: '0.22em',
                color: C.goldDeep,
                textTransform: 'uppercase',
                marginBottom: 20,
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
                  {/* left: number */}
                  <div
                    style={{
                      fontFamily: F.display,
                      fontVariationSettings: '"opsz" 144',
                      fontWeight: 500,
                      fontSize: 56,
                      letterSpacing: '-0.02em',
                      color: C.ink,
                      lineHeight: 1,
                    }}
                  >
                    {c.num}
                  </div>
                  {/* middle: unit */}
                  <div
                    style={{
                      fontFamily: F.mono,
                      fontSize: 13,
                      letterSpacing: '0.24em',
                      textTransform: 'uppercase',
                      color: C.gold,
                      padding: '0 28px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {c.unit}
                  </div>
                  {/* right: label */}
                  <div
                    style={{
                      fontFamily: F.display,
                      fontStyle: 'italic',
                      fontWeight: 400,
                      fontSize: 26,
                      color: C.inkSoft,
                      letterSpacing: '-0.005em',
                    }}
                  >
                    {c.label}
                  </div>
                  {/* animated reveal rule — left to right accent below each row */}
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      bottom: -1,
                      height: 1,
                      background: C.gold,
                      width: `${ruleWidth}%`,
                      opacity: 0.55,
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
              fontSize: 14,
              letterSpacing: '0.22em',
              color: C.inkMuted,
              textTransform: 'uppercase',
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
