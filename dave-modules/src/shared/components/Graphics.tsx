import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, SANS } from "../theme";

/* ------------------------------------------------------------------ panel */

export const Panel: React.FC<{
  children: React.ReactNode;
  pad?: number;
  width?: number | string;
  glow?: boolean;
  style?: React.CSSProperties;
}> = ({ children, pad = 34, width, glow = false, style }) => (
  <div
    style={{
      width,
      padding: pad,
      background: `linear-gradient(160deg, ${C.panel2}, ${C.panel})`,
      border: `1px solid ${C.line}`,
      borderRadius: 16,
      boxShadow: glow
        ? `0 30px 70px rgba(0,0,0,0.55), 0 0 0 1px rgba(201,162,39,0.22), 0 0 60px rgba(201,162,39,0.10)`
        : "0 30px 70px rgba(0,0,0,0.55)",
      fontFamily: SANS,
      ...style,
    }}
  >
    {children}
  </div>
);

/* ------------------------------------------------------------------- vial */

/** Simple research vial. Never shown with a needle or in-use context. */
export const Vial: React.FC<{ h?: number; fill?: number; delay?: number }> = ({
  h = 120,
  fill = 0.62,
  delay = 0,
}) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s =
    f < delay
      ? 0
      : spring({ frame: f - delay, fps, config: { damping: 200, stiffness: 140 }, durationInFrames: 18 });
  const w = h * 0.42;
  const bodyH = h * 0.74;
  const liquid = bodyH * fill;
  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      style={{ opacity: s, transform: `translateY(${(1 - s) * 14}px)` }}
    >
      <rect x={w * 0.24} y={2} width={w * 0.52} height={h * 0.1} rx={3} fill={C.goldDim} />
      <rect x={w * 0.16} y={h * 0.1} width={w * 0.68} height={h * 0.07} rx={2} fill={C.gold} />
      <rect
        x={1}
        y={h * 0.17}
        width={w - 2}
        height={bodyH}
        rx={w * 0.16}
        fill="rgba(255,255,255,0.05)"
        stroke={C.line}
        strokeWidth={1.5}
      />
      <rect
        x={2.5}
        y={h * 0.17 + bodyH - liquid}
        width={w - 5}
        height={liquid}
        rx={w * 0.14}
        fill="rgba(201,162,39,0.20)"
      />
      <rect x={w * 0.2} y={h * 0.42} width={w * 0.34} height={2} rx={1} fill="rgba(255,255,255,0.16)" />
      <rect x={w * 0.2} y={h * 0.52} width={w * 0.24} height={2} rx={1} fill="rgba(255,255,255,0.10)" />
    </svg>
  );
};

/* ------------------------------------------------------------------- globe */

/**
 * Wireframe globe with two pins and a travelling arc. An abstract globe beats a
 * literal world map here — it reads as "international supply chain" instantly
 * without needing geographic accuracy the script never claims.
 */
export const Globe: React.FC<{
  r?: number;
  arc?: number;
  pinA?: number;
  pinB?: number;
}> = ({ r = 210, arc = 0, pinA = 0, pinB = 0 }) => {
  const f = useCurrentFrame();
  // Slow enough to be a deliberate rotation rather than a shimmer on the wires.
  const rot = (f / 620) % 1;

  const lats = [-0.66, -0.34, 0, 0.34, 0.66];
  const meridians = [0, 0.2, 0.4, 0.6, 0.8];

  const size = r * 2 + 8;
  const cx = size / 2;
  const cy = size / 2;

  // Pin positions on the sphere face (fixed — the wire rotates behind them).
  const ax = cx - r * 0.52;
  const ay = cy - r * 0.12;
  const bx = cx + r * 0.46;
  const by = cy + r * 0.3;

  const mx = (ax + bx) / 2;
  const my = (ay + by) / 2 - r * 0.62;

  // Point along the quadratic bezier, for the travelling dot.
  const t = arc;
  const px = (1 - t) * (1 - t) * ax + 2 * (1 - t) * t * mx + t * t * bx;
  const py = (1 - t) * (1 - t) * ay + 2 * (1 - t) * t * my + t * t * by;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <radialGradient id="gsphere" cx="34%" cy="30%">
          <stop offset="0%" stopColor="rgba(201,162,39,0.10)" />
          <stop offset="70%" stopColor="rgba(255,255,255,0.02)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
      </defs>

      <circle cx={cx} cy={cy} r={r} fill="url(#gsphere)" stroke={C.line} strokeWidth={1.4} />

      {lats.map((L, i) => {
        const ry = r * 0.14;
        const rx = r * Math.sqrt(Math.max(0, 1 - L * L));
        return (
          <ellipse
            key={`lat${i}`}
            cx={cx}
            cy={cy + L * r}
            rx={rx}
            ry={ry * Math.sqrt(Math.max(0.08, 1 - L * L))}
            fill="none"
            stroke="rgba(255,255,255,0.10)"
            strokeWidth={1}
          />
        );
      })}

      {meridians.map((m, i) => {
        const phase = (m + rot) % 1;
        const rx = Math.abs(Math.cos(phase * Math.PI * 2)) * r;
        return (
          <ellipse
            key={`mer${i}`}
            cx={cx}
            cy={cy}
            rx={Math.max(1, rx)}
            ry={r}
            fill="none"
            stroke="rgba(255,255,255,0.10)"
            strokeWidth={1}
          />
        );
      })}

      <path
        d={`M ${ax} ${ay} Q ${mx} ${my} ${bx} ${by}`}
        fill="none"
        stroke={C.gold}
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeDasharray={900}
        strokeDashoffset={900 - arc * 900}
        opacity={0.95}
      />

      {arc > 0.02 && arc < 0.995 && (
        <circle cx={px} cy={py} r={6} fill={C.goldBright}>
          <animate attributeName="opacity" values="1;0.5;1" dur="1.2s" repeatCount="indefinite" />
        </circle>
      )}

      <Pin x={ax} y={ay} p={pinA} />
      <Pin x={bx} y={by} p={pinB} />
    </svg>
  );
};

const Pin: React.FC<{ x: number; y: number; p: number }> = ({ x, y, p }) => (
  <g opacity={p}>
    <circle cx={x} cy={y} r={16 * p} fill="rgba(201,162,39,0.16)" />
    <circle cx={x} cy={y} r={6} fill={C.goldBright} />
  </g>
);

/* --------------------------------------------------------------- COA sheet */

export type CoaRow = { label: string; value: string };

/**
 * Stylised certificate of analysis. Rows can be spotlit one at a time as the
 * narrator names them.
 */
export const CoaSheet: React.FC<{
  w?: number;
  rows: CoaRow[];
  /** Index of the row currently being named, or -1. */
  active?: number;
  reveal?: number;
  stamp?: "none" | "verified" | "unverified";
}> = ({ w = 560, rows, active = -1, reveal = 1, stamp = "none" }) => {
  const h = w * 1.3;
  return (
    <div
      style={{
        width: w,
        height: h,
        background: "linear-gradient(165deg, #F6F4EE, #E9E5DB)",
        borderRadius: 8,
        boxShadow: "0 40px 90px rgba(0,0,0,0.6)",
        padding: w * 0.075,
        fontFamily: SANS,
        color: "#1A1B1D",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: w * 0.026, fontWeight: 700, letterSpacing: 2.4, color: "#7A6A2E" }}>
            CERTIFICATE OF ANALYSIS
          </div>
          <div style={{ fontSize: w * 0.021, color: "#6B6E74", marginTop: 5 }}>
            Independent analytical laboratory
          </div>
        </div>
        <div
          style={{
            width: w * 0.1,
            height: w * 0.1,
            borderRadius: "50%",
            border: `2px solid ${C.goldDim}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: w * 0.02,
            fontWeight: 800,
            color: "#7A6A2E",
          }}
        >
          LAB
        </div>
      </div>

      <div style={{ height: 1, background: "#CFC9B8", margin: `${w * 0.045}px 0` }} />

      <div style={{ display: "flex", flexDirection: "column", gap: w * 0.032 }}>
        {rows.map((r, i) => {
          const on = i === active;
          const shown = reveal > i / Math.max(1, rows.length);
          return (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: `${w * 0.018}px ${w * 0.022}px`,
                borderRadius: 6,
                background: on ? "rgba(201,162,39,0.20)" : "transparent",
                outline: on ? `1.5px solid ${C.gold}` : "1.5px solid transparent",
                opacity: shown ? 1 : 0.18,
                transition: "none",
              }}
            >
              <span style={{ fontSize: w * 0.028, color: "#4A4D53", fontWeight: 500 }}>{r.label}</span>
              <span style={{ fontSize: w * 0.03, fontWeight: 700, color: "#1A1B1D" }}>{r.value}</span>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: w * 0.05, display: "flex", flexDirection: "column", gap: w * 0.018 }}>
        {[0.92, 0.78, 0.86, 0.54].map((ln, i) => (
          <div key={i} style={{ height: w * 0.012, width: `${ln * 100}%`, background: "#D3CDBD", borderRadius: 2 }} />
        ))}
      </div>

      {stamp !== "none" && (
        <div
          style={{
            position: "absolute",
            right: w * 0.08,
            bottom: w * 0.1,
            transform: "rotate(-11deg)",
            border: `3px solid ${stamp === "verified" ? C.green : C.red}`,
            color: stamp === "verified" ? C.green : C.red,
            borderRadius: 8,
            padding: `${w * 0.016}px ${w * 0.032}px`,
            fontSize: w * 0.038,
            fontWeight: 800,
            letterSpacing: 1.6,
            opacity: 0.92,
          }}
        >
          {stamp === "verified" ? "VERIFIED" : "UNVERIFIED"}
        </div>
      )}
    </div>
  );
};

/* --------------------------------------------------------------- price bar */

export const PriceBar: React.FC<{
  label: string;
  value: string;
  /** 0..1 of the track. */
  frac: number;
  p: number;
  color?: string;
  dim?: boolean;
}> = ({ label, value, frac, p, color = C.textDim, dim = false }) => (
  <div style={{ opacity: dim ? 0.42 : 1, fontFamily: SANS }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
      <span style={{ fontSize: 24, color: C.textDim, letterSpacing: 1.2 }}>{label}</span>
      <span style={{ fontSize: 42, fontWeight: 800, color, letterSpacing: -1 }}>{value}</span>
    </div>
    <div style={{ height: 16, background: "rgba(255,255,255,0.05)", borderRadius: 8, overflow: "hidden" }}>
      <div
        style={{
          height: "100%",
          width: `${frac * p * 100}%`,
          background:
            color === C.gold || color === C.goldBright
              ? `linear-gradient(90deg, ${C.goldDim}, ${C.goldBright})`
              : `linear-gradient(90deg, #3A3D44, #6E747E)`,
          borderRadius: 8,
        }}
      />
    </div>
  </div>
);

/* ---------------------------------------------------------------- check row */

export const CheckRow: React.FC<{ text: string; p: number; tone?: "green" | "gold" }> = ({
  text,
  p,
  tone = "green",
}) => {
  const col = tone === "green" ? C.green : C.gold;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 22,
        opacity: p,
        transform: `translateX(${(1 - p) * 26}px)`,
        fontFamily: SANS,
      }}
    >
      <svg width="46" height="46" viewBox="0 0 46 46" style={{ flexShrink: 0 }}>
        <circle cx="23" cy="23" r="21" fill="none" stroke={col} strokeWidth="2" opacity={0.42} />
        <path
          d="M13 23.5 L20 30.5 L33 15.5"
          fill="none"
          stroke={col}
          strokeWidth="3.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={34}
          strokeDashoffset={34 - Math.min(1, p * 1.4) * 34}
        />
      </svg>
      <span style={{ fontSize: 44, fontWeight: 600, color: C.text, letterSpacing: -0.6 }}>{text}</span>
    </div>
  );
};

/* -------------------------------------------------------------------- lock */

export const Lock: React.FC<{ open: number; size?: number }> = ({ open, size = 150 }) => {
  const col = open > 0.5 ? C.gold : C.textFaint;
  // The shackle stays hinged on its right leg and swings out, the way a real
  // padlock opens. Lifting the whole shackle straight up just reads as broken.
  const swing = open * 26;
  return (
    <svg width={size} height={size * 1.16} viewBox="0 0 100 116">
      <g transform={`rotate(${swing} 70 46)`}>
        <path d="M30 46 v-12 a20 20 0 0 1 40 0 v12" fill="none" stroke={col} strokeWidth="8" strokeLinecap="round" />
      </g>
      <rect x="18" y="46" width="64" height="54" rx="10" fill={open > 0.5 ? "rgba(201,162,39,0.10)" : "none"} stroke={col} strokeWidth="7" />
      <circle cx="50" cy="70" r="6" fill={col} />
      <rect x="47" y="74" width="6" height="14" rx="3" fill={col} />
    </svg>
  );
};
