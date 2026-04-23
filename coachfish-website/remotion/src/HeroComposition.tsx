import React from 'react';
import { AbsoluteFill, interpolate, Easing, useCurrentFrame } from 'remotion';
import { loadFont as loadUnbounded } from '@remotion/google-fonts/Unbounded';
import { loadFont as loadMontserrat } from '@remotion/google-fonts/Montserrat';
import { loadFont as loadMono } from '@remotion/google-fonts/JetBrainsMono';

const unbounded = loadUnbounded('normal', { weights: ['400', '500', '600', '700'] });
const montserrat = loadMontserrat('normal', { weights: ['400', '500', '600', '700'] });
const mono = loadMono('normal', { weights: ['400', '500'] });

const ease = Easing.bezier(0.22, 1, 0.36, 1);

const C = {
  white: '#FFFFFF',
  ink: '#0A0812',
  brand: '#251472',
  brandLight: '#B5A8E8',
  brandSoft: '#7A6DB8',
};

const F = {
  display: unbounded.fontFamily,
  sans: montserrat.fontFamily,
  mono: mono.fontFamily,
};

// Simplified US outline — normalized 0–1 (x goes left→right, y goes top→bottom)
// Ordered clockwise starting from Pacific NW
const US_POLYGON: [number, number][] = [
  [0.05, 0.06], [0.13, 0.03], [0.28, 0.01], [0.44, 0.00], [0.60, 0.01],
  [0.78, 0.02], [0.82, 0.10], [0.87, 0.17], [0.89, 0.23], [0.93, 0.28],
  [0.95, 0.32], [0.98, 0.36], [1.00, 0.40], [0.99, 0.43], [0.97, 0.47],
  [0.95, 0.52], [0.93, 0.58], [0.92, 0.64], [0.91, 0.72], [0.93, 0.80],
  [0.93, 0.88], [0.88, 0.88], [0.80, 0.87], [0.72, 0.88], [0.63, 0.89],
  [0.55, 0.90], [0.48, 0.91], [0.43, 0.93], [0.40, 0.96], [0.37, 0.93],
  [0.32, 0.89], [0.26, 0.86], [0.19, 0.84], [0.13, 0.82], [0.09, 0.80],
  [0.06, 0.73], [0.05, 0.60], [0.04, 0.44], [0.03, 0.28], [0.04, 0.16],
  [0.05, 0.06],
];

// Phoenix, AZ — roughly
const PHOENIX_NORM: [number, number] = [0.21, 0.76];

// Key regional anchor cities to bias dot distribution toward real college density
// (populous college regions)
const ANCHORS: [number, number, number][] = [
  // [x, y, weight]
  [0.95, 0.40, 1.4], // NYC / NJ
  [0.93, 0.45, 1.1], // Philly
  [0.90, 0.48, 1.0], // DC
  [0.88, 0.56, 1.0], // Carolinas
  [0.85, 0.65, 1.0], // Atlanta / GA
  [0.90, 0.82, 0.9], // FL
  [0.75, 0.78, 1.1], // TX triangle
  [0.52, 0.82, 1.0], // Houston / LA
  [0.70, 0.50, 1.1], // Chicago / Midwest
  [0.78, 0.42, 1.0], // Detroit / Ohio
  [0.60, 0.35, 0.9], // Minnesota
  [0.50, 0.55, 1.0], // KC / MO
  [0.40, 0.70, 0.8], // Denver
  [0.22, 0.78, 1.0], // Phoenix / SW
  [0.12, 0.70, 1.1], // LA / Socal
  [0.08, 0.45, 1.1], // SF / Bay
  [0.08, 0.20, 0.9], // PNW
];

const seededRandom = (seed: number) => {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
};

const pointInPolygon = (
  point: [number, number],
  polygon: [number, number][]
): boolean => {
  const [x, y] = point;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];
    if (
      yi > y !== yj > y &&
      x < ((xj - xi) * (y - yi)) / (yj - yi) + xi
    ) {
      inside = !inside;
    }
  }
  return inside;
};

// Generate weighted dot positions biased toward anchors (college metros)
const generateDots = (count: number, seed: number): [number, number][] => {
  const rnd = seededRandom(seed);
  const dots: [number, number][] = [];
  let attempts = 0;
  while (dots.length < count && attempts < count * 40) {
    attempts++;
    // 70% chance: sample near an anchor; 30% uniform for coverage
    let x: number, y: number;
    if (rnd() < 0.72) {
      const a = ANCHORS[Math.floor(rnd() * ANCHORS.length)];
      const spread = 0.09;
      x = a[0] + (rnd() - 0.5) * spread * 2;
      y = a[1] + (rnd() - 0.5) * spread * 2;
    } else {
      x = rnd();
      y = rnd();
    }
    if (x < 0 || x > 1 || y < 0 || y > 1) continue;
    if (pointInPolygon([x, y], US_POLYGON)) {
      dots.push([x, y]);
    }
  }
  return dots;
};

const DOT_COUNT = 520;
const DOTS = generateDots(DOT_COUNT, 42);

// Map layout in canvas pixels — generous centering
const MAP = { x: 80, y: 360, w: 920, h: 620 };
const toCanvas = ([nx, ny]: [number, number]): [number, number] => [
  MAP.x + nx * MAP.w,
  MAP.y + ny * MAP.h,
];

const [PHX_X, PHX_Y] = toCanvas(PHOENIX_NORM);

// Pick line targets: ~130 dots spread across the polygon for connectivity
const LINE_TARGETS = DOTS.filter((_, i) => i % 4 === 0).slice(0, 130);

// Pre-compute SVG path `d` for US outline
const usPathD =
  US_POLYGON
    .map((p, i) => {
      const [x, y] = toCanvas(p);
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ') + ' Z';

// Pre-compute total approximate polygon perimeter for stroke animation
const PATH_POINTS = US_POLYGON.map(toCanvas);
const PATH_LENGTH = PATH_POINTS.reduce((total, p, i) => {
  if (i === 0) return 0;
  const [px, py] = PATH_POINTS[i - 1];
  const [x, y] = p;
  return total + Math.hypot(x - px, y - py);
}, 0);

type RiseProps = {
  from: number;
  duration?: number;
  distance?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
};

const Rise: React.FC<RiseProps> = ({ from, duration = 26, distance = 24, children, style }) => {
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
      mixBlendMode: 'overlay',
    }}
  >
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <filter id="n">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
        <feColorMatrix values="0 0 0 0 0.039 0 0 0 0 0.031 0 0 0 0 0.07 0 0 0 0.35 0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#n)" />
    </svg>
  </AbsoluteFill>
);

export const HeroCredentials: React.FC = () => {
  const frame = useCurrentFrame();

  // seamless loop fade
  const loopFade = interpolate(frame, [0, 8, 205, 215], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // map outline draw
  const mapDraw = interpolate(frame, [20, 80], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: ease,
  });

  // map fade-down as number resolves
  const mapDim = interpolate(frame, [150, 185], [1, 0.35], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: ease,
  });

  // Phoenix node
  const phxScale = interpolate(frame, [100, 132], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.back(1.4)),
  });
  // pulsing rings (three waves)
  const ringPulse = (offset: number) => {
    const localFrame = (frame - 130 - offset) % 45;
    if (frame < 130 + offset) return { r: 0, o: 0 };
    const r = interpolate(localFrame, [0, 45], [10, 70], { extrapolateRight: 'clamp' });
    const o = interpolate(localFrame, [0, 45], [0.6, 0], { extrapolateRight: 'clamp' });
    return { r, o };
  };

  // Big number reveal
  const numberOpacity = interpolate(frame, [158, 182], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: ease,
  });
  const numberScale = interpolate(frame, [158, 200], [0.72, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  // Count-up animation
  const countProgress = interpolate(frame, [160, 202], [0, 52000], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const displayedCount = Math.round(countProgress).toLocaleString();

  const subtitleOpacity = interpolate(frame, [190, 210], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: ease,
  });

  return (
    <AbsoluteFill style={{ background: C.ink, opacity: loopFade, overflow: 'hidden' }}>
      {/* Ambient purple glow radiating from Phoenix */}
      <div
        style={{
          position: 'absolute',
          width: 1400,
          height: 1400,
          left: PHX_X - 700,
          top: PHX_Y - 700,
          background: `radial-gradient(circle, ${C.brand} 0%, transparent 58%)`,
          opacity: 0.28,
          pointerEvents: 'none',
          filter: 'blur(24px)',
        }}
      />

      {/* Secondary glow — adds depth */}
      <div
        style={{
          position: 'absolute',
          width: 900,
          height: 900,
          right: -260,
          top: -260,
          background: `radial-gradient(circle, ${C.brand} 0%, transparent 65%)`,
          opacity: 0.16,
          pointerEvents: 'none',
        }}
      />

      {/* Inset editorial hairline frame */}
      <div
        style={{
          position: 'absolute',
          inset: 36,
          border: `1px solid ${C.brand}`,
          opacity: interpolate(frame, [0, 24], [0, 0.6], { extrapolateRight: 'clamp' }),
          pointerEvents: 'none',
        }}
      />

      {/* Main SVG stage — map, dots, lines, phoenix */}
      <svg
        width={1080}
        height={1350}
        style={{ position: 'absolute', inset: 0 }}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* US map outline — subtle, behind everything */}
        <path
          d={usPathD}
          fill="none"
          stroke={C.brandLight}
          strokeWidth={1.3}
          strokeOpacity={0.32 * mapDim}
          strokeDasharray={PATH_LENGTH}
          strokeDashoffset={PATH_LENGTH * (1 - mapDraw)}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Connection lines from Phoenix — drawn outward */}
        {LINE_TARGETS.map((t, i) => {
          const [tx, ty] = toCanvas(t);
          const lineStart = 130 + (i / LINE_TARGETS.length) * 36;
          const progress = interpolate(frame, [lineStart, lineStart + 18], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: ease,
          });
          const endX = PHX_X + (tx - PHX_X) * progress;
          const endY = PHX_Y + (ty - PHX_Y) * progress;
          const lineOpacity = 0.28 * mapDim * (progress > 0.2 ? 1 : progress / 0.2);
          return (
            <line
              key={`L${i}`}
              x1={PHX_X}
              y1={PHX_Y}
              x2={endX}
              y2={endY}
              stroke={C.brandLight}
              strokeWidth={0.7}
              strokeOpacity={lineOpacity}
            />
          );
        })}

        {/* Dots — bloom across the map */}
        {DOTS.map((d, i) => {
          const [x, y] = toCanvas(d);
          const dotStart = 80 + (i / DOT_COUNT) * 52;
          const scale = interpolate(
            frame,
            [dotStart, dotStart + 14],
            [0, 1],
            {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: Easing.out(Easing.back(1.8)),
            }
          );
          // subtle breathing after they settle
          const breath =
            frame > 150 ? 1 + Math.sin((frame + i * 2.7) / 14) * 0.22 : 1;
          const baseR = 1.9;
          const r = baseR * scale * breath;
          const hue = (i * 37) % 100 > 80 ? C.white : C.brandLight;
          const op = 0.72 * mapDim;
          return (
            <circle
              key={`D${i}`}
              cx={x}
              cy={y}
              r={r}
              fill={hue}
              opacity={op}
            />
          );
        })}

        {/* Phoenix pulse rings (staggered) */}
        {[0, 14, 28].map((offset, i) => {
          const { r, o } = ringPulse(offset);
          return (
            <circle
              key={`R${i}`}
              cx={PHX_X}
              cy={PHX_Y}
              r={r}
              fill="none"
              stroke={C.brandLight}
              strokeWidth={1.4}
              opacity={o}
            />
          );
        })}

        {/* Phoenix node — glowing center */}
        <circle
          cx={PHX_X}
          cy={PHX_Y}
          r={14 * phxScale}
          fill={C.brand}
          opacity={0.45}
        />
        <circle
          cx={PHX_X}
          cy={PHX_Y}
          r={8 * phxScale}
          fill={C.white}
        />
        <circle
          cx={PHX_X}
          cy={PHX_Y}
          r={3.5 * phxScale}
          fill={C.brand}
        />

        {/* Phoenix label */}
        <g opacity={interpolate(frame, [132, 158], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) * mapDim}>
          <line
            x1={PHX_X - 22}
            y1={PHX_Y + 2}
            x2={PHX_X - 70}
            y2={PHX_Y + 2}
            stroke={C.brandLight}
            strokeWidth={1}
            opacity={0.6}
          />
          <text
            x={PHX_X - 78}
            y={PHX_Y + 6}
            fontFamily={F.mono}
            fontSize={13}
            fontWeight={500}
            fill={C.brandLight}
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
              color: C.brandLight,
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
              color: 'rgba(255, 255, 255, 0.5)',
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
                background: C.brandLight,
                marginTop: 10,
                marginLeft: 'auto',
                opacity: 0.8,
              }}
            />
          </div>
        </Rise>
      </div>

      {/* Mid caption — the story line */}
      <div
        style={{
          position: 'absolute',
          top: 156,
          left: 0,
          right: 0,
          textAlign: 'center',
          opacity: interpolate(frame, [36, 60], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        }}
      >
        <div
          style={{
            fontFamily: F.mono,
            fontSize: 13,
            letterSpacing: '0.32em',
            color: 'rgba(255, 255, 255, 0.55)',
            textTransform: 'uppercase',
            fontWeight: 500,
          }}
        >
          Independent coach network · Nationwide
        </div>
      </div>

      {/* FINALE — Big number + subtitle, centered over map */}
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
            fontSize: 200,
            lineHeight: 0.95,
            letterSpacing: '-0.05em',
            color: C.white,
            textShadow: '0 6px 60px rgba(37, 20, 114, 0.75)',
            fontFeatureSettings: '"tnum" 1',
          }}
        >
          {displayedCount}
        </div>
        <div
          style={{
            marginTop: 12,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: 110,
              height: 2,
              background: C.brandLight,
              opacity: numberOpacity,
            }}
          />
        </div>
        <div
          style={{
            marginTop: 22,
            fontFamily: F.sans,
            fontSize: 22,
            letterSpacing: '0.32em',
            color: C.brandLight,
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
            color: 'rgba(255, 255, 255, 0.55)',
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
          color: 'rgba(255, 255, 255, 0.45)',
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

      <Grain />
    </AbsoluteFill>
  );
};
