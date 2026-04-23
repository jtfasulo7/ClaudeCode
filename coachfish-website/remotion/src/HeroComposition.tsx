import React, { useMemo } from 'react';
import { AbsoluteFill, interpolate, Easing, useCurrentFrame } from 'remotion';
import { loadFont as loadUnbounded } from '@remotion/google-fonts/Unbounded';
import { loadFont as loadMontserrat } from '@remotion/google-fonts/Montserrat';
import { loadFont as loadMono } from '@remotion/google-fonts/JetBrainsMono';
import { geoAlbersUsa, geoPath, geoContains } from 'd3-geo';
import { feature } from 'topojson-client';
// @ts-ignore — us-atlas ships a single json file
import usNation from 'us-atlas/nation-10m.json';

const unbounded = loadUnbounded('normal', { weights: ['400', '500', '600', '700'] });
const montserrat = loadMontserrat('normal', { weights: ['400', '500', '600', '700'] });
const mono = loadMono('normal', { weights: ['400', '500'] });

const ease = Easing.bezier(0.22, 1, 0.36, 1);

const C = {
  paper: '#FAFAFC',
  white: '#FFFFFF',
  ink: '#0A0812',
  inkSoft: 'rgba(10, 8, 18, 0.72)',
  inkMuted: 'rgba(10, 8, 18, 0.5)',
  inkFaint: 'rgba(10, 8, 18, 0.3)',
  brand: '#251472',
  brandDeep: '#1A0E52',
  brandSoft: 'rgba(37, 20, 114, 0.55)',
  brandHaze: 'rgba(37, 20, 114, 0.18)',
};

const F = {
  display: unbounded.fontFamily,
  sans: montserrat.fontFamily,
  mono: mono.fontFamily,
};

// ── canvas + projection ─────────────────────────────────────────
const CANVAS_W = 1080;
const CANVAS_H = 1350;

// d3 Albers USA — positioned to center the CONUS in the canvas
// with room for text above and below the map
const projection = geoAlbersUsa()
  .scale(1380)
  .translate([CANVAS_W / 2, 650]);

const pathGen = geoPath(projection);

// nation outline geometry (single multipolygon)
// @ts-ignore — topojson typing is loose
const nationFeature = feature(usNation, usNation.objects.nation);
const nationPathD = pathGen(nationFeature) || '';

// ── anchor cities for realistic coach-density distribution ──────
const ANCHORS: [number, number, number][] = [
  // [lng, lat, weight]
  [-74.0, 40.71, 1.5],   // NYC
  [-75.17, 39.95, 1.0],  // Philadelphia
  [-77.04, 38.90, 1.0],  // DC / Baltimore
  [-71.06, 42.36, 1.0],  // Boston
  [-80.19, 25.76, 1.0],  // Miami
  [-82.46, 27.95, 0.9],  // Tampa
  [-84.39, 33.75, 1.2],  // Atlanta
  [-81.69, 41.50, 0.9],  // Cleveland
  [-83.05, 42.33, 0.9],  // Detroit
  [-87.63, 41.88, 1.3],  // Chicago
  [-90.2, 38.63, 0.8],   // St. Louis
  [-93.27, 44.98, 0.9],  // Minneapolis
  [-96.80, 32.78, 1.1],  // Dallas
  [-95.37, 29.76, 1.1],  // Houston
  [-90.07, 29.95, 0.8],  // New Orleans
  [-86.78, 36.16, 0.9],  // Nashville
  [-104.99, 39.74, 0.9], // Denver
  [-111.89, 40.76, 0.6], // Salt Lake City
  [-112.07, 33.45, 1.0], // Phoenix
  [-118.24, 34.05, 1.4], // LA
  [-117.16, 32.72, 0.8], // San Diego
  [-122.42, 37.77, 1.2], // SF Bay
  [-122.68, 45.52, 0.7], // Portland
  [-122.33, 47.60, 0.9], // Seattle
  [-97.74, 30.27, 0.8],  // Austin
  [-106.48, 31.76, 0.6], // El Paso
  [-78.64, 35.78, 0.7],  // Raleigh
  [-81.66, 30.33, 0.7],  // Jacksonville
  [-79.99, 40.44, 0.7],  // Pittsburgh
];

const PHOENIX_LL: [number, number] = [-112.074, 33.448];

// ── PRNG + dot generation ───────────────────────────────────────
const seededRandom = (seed: number) => {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
};

type Dot = { x: number; y: number; lng: number; lat: number };

const generateDots = (count: number, seed: number): Dot[] => {
  const rnd = seededRandom(seed);
  const out: Dot[] = [];
  let attempts = 0;
  const totalWeight = ANCHORS.reduce((a, b) => a + b[2], 0);

  while (out.length < count && attempts < count * 60) {
    attempts++;
    let lng: number, lat: number;
    const mode = rnd();
    if (mode < 0.75) {
      // cluster around a weighted anchor
      let pick = rnd() * totalWeight;
      let a = ANCHORS[0];
      for (const anchor of ANCHORS) {
        pick -= anchor[2];
        if (pick <= 0) { a = anchor; break; }
      }
      const spread = 2.4;
      lng = a[0] + (rnd() - 0.5) * spread * 2;
      lat = a[1] + (rnd() - 0.5) * spread;
    } else {
      // uniform across CONUS bounding box for coverage
      lng = -125 + rnd() * 58;
      lat = 25 + rnd() * 24;
    }
    if (!geoContains(nationFeature, [lng, lat])) continue;
    const p = projection([lng, lat]);
    if (!p) continue;
    out.push({ x: p[0], y: p[1], lng, lat });
  }
  return out;
};

const DOT_COUNT = 520;
const DOTS = generateDots(DOT_COUNT, 42);

const phxProj = projection(PHOENIX_LL) || [0, 0];
const PHX_X = phxProj[0];
const PHX_Y = phxProj[1];

// Line targets — every fourth dot, up to ~130, avoiding the Phoenix point
const LINE_TARGETS = DOTS
  .filter((_, i) => i % 4 === 0)
  .filter(d => Math.hypot(d.x - PHX_X, d.y - PHX_Y) > 40)
  .slice(0, 130);

// ── helpers ────────────────────────────────────────────────────
type RiseProps = {
  from: number;
  duration?: number;
  distance?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
};

const Rise: React.FC<RiseProps> = ({ from, duration = 26, distance = 22, children, style }) => {
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

// ── composition ────────────────────────────────────────────────
type Props = { bg?: string };

export const HeroCredentials: React.FC<Props> = ({ bg = 'transparent' }) => {
  const frame = useCurrentFrame();

  // simple fade-in at start, hold forever after
  const fadeIn = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // map outline draw (0 → 1)
  const mapDraw = interpolate(frame, [20, 90], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: ease,
  });

  // map opacity dimming so the final number reads
  const mapDim = interpolate(frame, [150, 185], [1, 0.4], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: ease,
  });

  // Phoenix node reveal
  const phxScale = interpolate(frame, [100, 132], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.back(1.4)),
  });

  // two pulse rings — finite (don't pulse forever, settle after the last one)
  const pulseRing = (startFrame: number, duration: number) => {
    if (frame < startFrame) return { r: 0, o: 0 };
    if (frame > startFrame + duration) return { r: 0, o: 0 };
    const local = frame - startFrame;
    const r = interpolate(local, [0, duration], [12, 60], { extrapolateRight: 'clamp' });
    const o = interpolate(local, [0, duration], [0.45, 0], { extrapolateRight: 'clamp' });
    return { r, o };
  };

  // Big number reveal + count-up
  const numberOpacity = interpolate(frame, [158, 184], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: ease,
  });
  const numberScale = interpolate(frame, [158, 200], [0.74, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const countProgress = interpolate(frame, [160, 202], [0, 52000], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const displayedCount = Math.round(countProgress).toLocaleString();

  const subtitleOpacity = interpolate(frame, [190, 212], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: ease,
  });

  return (
    <AbsoluteFill style={{ background: bg, opacity: fadeIn }}>
      {/* soft purple wash behind Phoenix — radial, fades to transparent so it never reads as a rectangle */}
      <div
        style={{
          position: 'absolute',
          width: 900,
          height: 900,
          left: PHX_X - 450,
          top: PHX_Y - 450,
          background: `radial-gradient(circle, ${C.brand} 0%, transparent 62%)`,
          opacity: 0.07,
          pointerEvents: 'none',
          filter: 'blur(22px)',
        }}
      />

      {/* Main SVG — real US map + dots + lines */}
      <svg
        width={CANVAS_W}
        height={CANVAS_H}
        viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
        style={{ position: 'absolute', inset: 0 }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* subtle glow for dots */}
          <filter id="dotGlow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="1.3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* soft line halo */}
          <filter id="lineGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="0.8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* bigger glow on Phoenix node */}
          <filter id="phxGlow" x="-120%" y="-120%" width="340%" height="340%">
            <feGaussianBlur stdDeviation="6" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* US map outline — geographically accurate via d3 Albers */}
        <path
          d={nationPathD}
          fill="none"
          stroke={C.brand}
          strokeWidth={2.4}
          strokeOpacity={0.52 * mapDim}
          strokeLinejoin="round"
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - mapDraw}
        />

        {/* Connection lines from Phoenix — subtle halo */}
        <g filter="url(#lineGlow)">
          {LINE_TARGETS.map((t, i) => {
            const lineStart = 130 + (i / LINE_TARGETS.length) * 38;
            const progress = interpolate(frame, [lineStart, lineStart + 20], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: ease,
            });
            const endX = PHX_X + (t.x - PHX_X) * progress;
            const endY = PHX_Y + (t.y - PHX_Y) * progress;
            const lineOpacity = 0.26 * mapDim * (progress > 0.2 ? 1 : progress / 0.2);
            return (
              <line
                key={`L${i}`}
                x1={PHX_X}
                y1={PHX_Y}
                x2={endX}
                y2={endY}
                stroke={C.brand}
                strokeWidth={0.8}
                strokeOpacity={lineOpacity}
              />
            );
          })}
        </g>

        {/* Dots — bloom across map, subtle static glow (no pulsing) */}
        <g filter="url(#dotGlow)">
          {DOTS.map((d, i) => {
            const dotStart = 80 + (i / DOT_COUNT) * 52;
            const scale = interpolate(
              frame,
              [dotStart, dotStart + 14],
              [0, 1],
              {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
                easing: Easing.out(Easing.back(1.6)),
              }
            );
            const r = 2.2 * scale;
            const op = 0.78 * mapDim;
            return (
              <circle
                key={`D${i}`}
                cx={d.x}
                cy={d.y}
                r={r}
                fill={C.brand}
                opacity={op}
              />
            );
          })}
        </g>

        {/* Phoenix pulse rings — finite, stop before end */}
        {[
          pulseRing(130, 36),
          pulseRing(150, 38),
        ].map((ring, i) => (
          <circle
            key={`R${i}`}
            cx={PHX_X}
            cy={PHX_Y}
            r={ring.r}
            fill="none"
            stroke={C.brand}
            strokeWidth={1.3}
            opacity={ring.o}
          />
        ))}

        {/* Phoenix node — glowing */}
        <g filter="url(#phxGlow)">
          <circle cx={PHX_X} cy={PHX_Y} r={11 * phxScale} fill={C.brand} opacity={0.5} />
        </g>
        <circle cx={PHX_X} cy={PHX_Y} r={6 * phxScale} fill={C.brand} />
        <circle cx={PHX_X} cy={PHX_Y} r={3 * phxScale} fill={C.white} />

        {/* Phoenix label (appears once Phoenix lands) */}
        <g
          opacity={
            interpolate(frame, [132, 158], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }) * Math.min(mapDim * 1.3, 1)
          }
        >
          <line
            x1={PHX_X - 18}
            y1={PHX_Y + 2}
            x2={PHX_X - 70}
            y2={PHX_Y + 2}
            stroke={C.brand}
            strokeWidth={1}
            opacity={0.7}
          />
          <text
            x={PHX_X - 78}
            y={PHX_Y + 6}
            fontFamily={F.mono}
            fontSize={13}
            fontWeight={500}
            fill={C.brand}
            textAnchor="end"
            letterSpacing="2"
          >
            PHOENIX
          </text>
        </g>
      </svg>

      {/* Top editorial markers */}
      <div
        style={{
          position: 'absolute',
          top: 72,
          left: 80,
          right: 80,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <Rise from={8} distance={12}>
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
            № 01 &nbsp;·&nbsp; The Network
          </div>
        </Rise>

        <Rise from={12} distance={12}>
          <div
            style={{
              fontFamily: F.sans,
              fontSize: 18,
              letterSpacing: '0.24em',
              color: C.inkMuted,
              textTransform: 'uppercase',
              textAlign: 'right',
              fontWeight: 500,
            }}
          >
            Coach Fish Services
            <div
              style={{
                width: 64,
                height: 1,
                background: C.brand,
                marginTop: 10,
                marginLeft: 'auto',
                opacity: 0.8,
              }}
            />
          </div>
        </Rise>
      </div>

      {/* Mid caption */}
      <div
        style={{
          position: 'absolute',
          top: 156,
          left: 0,
          right: 0,
          textAlign: 'center',
          opacity: interpolate(frame, [36, 60], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      >
        <div
          style={{
            fontFamily: F.mono,
            fontSize: 13,
            letterSpacing: '0.32em',
            color: C.inkMuted,
            textTransform: 'uppercase',
            fontWeight: 500,
          }}
        >
          Independent coach network · Nationwide
        </div>
      </div>

      {/* FINALE — 52,000 counts up, holds */}
      <div
        style={{
          position: 'absolute',
          top: 520,
          left: 0,
          right: 0,
          textAlign: 'center',
          opacity: numberOpacity,
          transform: `scale(${numberScale})`,
          transformOrigin: 'center center',
        }}
      >
        <div
          style={{
            fontFamily: F.display,
            fontWeight: 700,
            fontSize: 196,
            lineHeight: 0.95,
            letterSpacing: '-0.05em',
            color: C.ink,
            fontFeatureSettings: '"tnum" 1',
            textShadow: `0 4px 28px rgba(37, 20, 114, 0.25)`,
          }}
        >
          {displayedCount}
        </div>
        <div
          style={{
            marginTop: 14,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <div style={{ width: 110, height: 2, background: C.brand, opacity: 0.85 }} />
        </div>
        <div
          style={{
            marginTop: 24,
            fontFamily: F.sans,
            fontSize: 22,
            letterSpacing: '0.32em',
            color: C.brand,
            textTransform: 'uppercase',
            fontWeight: 600,
            opacity: subtitleOpacity,
          }}
        >
          College Coaches
        </div>
        <div
          style={{
            marginTop: 8,
            fontFamily: F.sans,
            fontSize: 15,
            letterSpacing: '0.3em',
            color: C.inkMuted,
            textTransform: 'uppercase',
            fontWeight: 500,
            opacity: subtitleOpacity,
          }}
        >
          One phone call away
        </div>
      </div>

      {/* Bottom footer */}
      <div
        style={{
          position: 'absolute',
          bottom: 72,
          left: 80,
          right: 80,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontFamily: F.mono,
          fontSize: 13,
          letterSpacing: '0.22em',
          color: C.inkFaint,
          textTransform: 'uppercase',
          fontWeight: 500,
          opacity: interpolate(frame, [148, 178], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      >
        <span>15 Years · Scout-level eye</span>
        <span>Every Sport · Every Division</span>
      </div>
    </AbsoluteFill>
  );
};
