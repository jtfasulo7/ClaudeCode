import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { animAt, transformOrNone } from "../motion";
import { C, SANS } from "../theme";

/**
 * Diagram primitives that only the onboarding film needs.
 *
 * Kept out of Diagrams.tsx because nothing else uses them: a phone, a bell, a
 * tab bar and a lock that opens are the vocabulary of "here is how to use the
 * app", and that is a conversation this one film has.
 *
 * Everything here follows the stillness rule — animate in, then settle to
 * exactly identity. A transform left at 0.999 resamples every glyph and edge on
 * every frame, which is what reads as a shimmer.
 */

/** Rounded phone body. Children are laid out inside its screen. */
export const Phone: React.FC<{
  p: number;
  w?: number;
  children?: React.ReactNode;
}> = ({ p, w = 300, children }) => {
  const h = w * 2.02;
  const done = p >= 1;
  return (
    <div
      style={{
        opacity: p,
        transform: transformOrNone([`scale(${0.94 + 0.06 * p})`], !done),
        width: w,
        height: h,
        borderRadius: w * 0.13,
        border: `2px solid ${C.line}`,
        background: C.panel,
        padding: w * 0.055,
        display: "flex",
        flexDirection: "column",
        gap: w * 0.05,
        position: "relative",
        boxShadow: "0 40px 90px -30px rgba(0,0,0,0.8)",
      }}
    >
      {/* Speaker slot. Static, so it never draws attention. */}
      <div
        style={{
          position: "absolute",
          top: w * 0.028,
          left: "50%",
          marginLeft: -w * 0.09,
          width: w * 0.18,
          height: 4,
          borderRadius: 2,
          background: C.line,
        }}
      />
      {children}
    </div>
  );
};

/** The Skool app tile, as it sits on a home screen. */
export const AppTile: React.FC<{ p: number; size?: number }> = ({ p, size = 176 }) => {
  const done = p >= 1;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 18,
        opacity: p,
        transform: transformOrNone([`scale(${0.86 + 0.14 * p})`], !done),
      }}
    >
      <div
        style={{
          width: size,
          height: size,
          borderRadius: size * 0.24,
          background: `linear-gradient(160deg, ${C.panel2}, ${C.panel})`,
          border: `1.5px solid ${C.line}`,
          display: "grid",
          placeItems: "center",
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: size * 0.4,
          color: C.goldBright,
          letterSpacing: -2,
          boxShadow: "0 30px 70px -26px rgba(0,0,0,0.85)",
        }}
      >
        S
      </div>
      <div
        style={{
          fontFamily: SANS,
          fontSize: 26,
          fontWeight: 600,
          color: C.textDim,
          letterSpacing: 0.4,
        }}
      >
        Skool
      </div>
    </div>
  );
};

/**
 * Notification bell. Rings on `ring`, which is a frame offset, then settles
 * dead still rather than easing forever toward upright.
 */
export const Bell: React.FC<{ p: number; ring?: number; size?: number }> = ({
  p,
  ring = -1,
  size = 150,
}) => {
  const f = useCurrentFrame();
  // A decaying swing, hard-zeroed once it is spent.
  const since = ring >= 0 ? f - ring : -1;
  const swinging = since >= 0 && since < 26;
  const rot = swinging
    ? Math.sin(since * 0.62) * 13 * Math.exp(-since / 9)
    : 0;
  const done = p >= 1 && !swinging;

  const dot = animAt(f, ring + 8, 18, "overshoot");

  return (
    <div
      style={{
        position: "relative",
        opacity: p,
        transform: transformOrNone(
          [`scale(${0.9 + 0.1 * p})`, `rotate(${rot.toFixed(3)}deg)`],
          !done,
        ),
        transformOrigin: "50% 12%",
      }}
    >
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        <path
          d="M24 6c-6.2 0-11 4.9-11 11v8.4L9.6 31a1.6 1.6 0 0 0 1.4 2.4h26a1.6 1.6 0 0 0 1.4-2.4L35 25.4V17c0-6.1-4.8-11-11-11z"
          stroke={C.text}
          strokeWidth={2.1}
          strokeLinejoin="round"
        />
        <path d="M19.6 38a4.6 4.6 0 0 0 8.8 0" stroke={C.text} strokeWidth={2.1} strokeLinecap="round" />
      </svg>
      {ring >= 0 && (
        <div
          style={{
            position: "absolute",
            top: size * 0.06,
            right: size * 0.08,
            width: size * 0.2,
            height: size * 0.2,
            borderRadius: "50%",
            background: C.gold,
            opacity: dot,
            transform: transformOrNone([`scale(${dot})`], dot < 1),
          }}
        />
      )}
    </div>
  );
};

/**
 * The app's tab bar. `active` names the highlighted tab; the highlight slides
 * on `slide` (0..1) so a cut can move it deliberately rather than teleport.
 */
export const TabBar: React.FC<{
  tabs: string[];
  active: number;
  p: number;
  slide?: number;
  w?: number;
}> = ({ tabs, active, p, slide = 1, w = 860 }) => {
  const cell = w / tabs.length;
  const done = p >= 1;
  return (
    <div
      style={{
        opacity: p,
        transform: transformOrNone([`translate3d(0, ${(1 - p) * 16}px, 0)`], !done),
        width: w,
        position: "relative",
        display: "flex",
        border: `1.5px solid ${C.line}`,
        borderRadius: 18,
        background: C.panel,
        overflow: "hidden",
      }}
    >
      {/* Highlight sits behind the labels and slides between cells. */}
      <div
        style={{
          position: "absolute",
          top: 6,
          bottom: 6,
          left: 6,
          width: cell - 12,
          borderRadius: 13,
          background: "rgba(201,162,39,0.13)",
          border: `1px solid ${C.gold}`,
          transform: `translate3d(${(active * cell * slide).toFixed(2)}px, 0, 0)`,
        }}
      />
      {tabs.map((t, i) => (
        <div
          key={t}
          style={{
            position: "relative",
            width: cell,
            padding: "26px 0",
            textAlign: "center",
            fontFamily: SANS,
            fontSize: 27,
            fontWeight: i === active ? 700 : 500,
            letterSpacing: 0.6,
            color: i === active ? C.goldBright : C.textFaint,
          }}
        >
          {t}
        </div>
      ))}
    </div>
  );
};

/** A padlock whose shackle lifts as `open` goes 0 to 1. */
export const UnlockLock: React.FC<{ p: number; open: number; size?: number }> = ({
  p,
  open,
  size = 190,
}) => {
  const lift = open * 15;
  const colour = open > 0.55 ? C.gold : C.textDim;
  const done = p >= 1;
  return (
    <div
      style={{
        opacity: p,
        transform: transformOrNone([`scale(${0.92 + 0.08 * p})`], !done),
      }}
    >
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        {/* Shackle — the only part that moves. */}
        <path
          d={`M20 ${30 - lift}v-6a12 12 0 0 1 24 0v6`}
          stroke={colour}
          strokeWidth={3.4}
          strokeLinecap="round"
        />
        <rect
          x={14}
          y={29}
          width={36}
          height={27}
          rx={5}
          stroke={colour}
          strokeWidth={3.4}
        />
        <circle cx={32} cy={42.5} r={3.4} fill={colour} />
      </svg>
    </div>
  );
};

/**
 * Two figures with a link that draws between them. Stands in for
 * "relationships" without resorting to a stock handshake.
 */
export const LinkPair: React.FC<{ p: number; draw: number; w?: number }> = ({
  p,
  draw,
  w = 460,
}) => {
  const r = 44;
  const done = p >= 1;
  return (
    <svg
      width={w}
      height={160}
      viewBox="0 0 460 160"
      fill="none"
      style={{
        opacity: p,
        transform: transformOrNone([`scale(${0.95 + 0.05 * p})`], !done),
      }}
    >
      <line
        x1={110}
        y1={80}
        x2={350}
        y2={80}
        stroke={C.gold}
        strokeWidth={2.6}
        strokeDasharray={240}
        strokeDashoffset={240 * (1 - draw)}
      />
      {[110, 350].map((cx, i) => (
        <g key={i}>
          <circle cx={cx} cy={80} r={r} fill={C.panel} stroke={C.line} strokeWidth={2} />
          <circle cx={cx} cy={68} r={13} stroke={C.text} strokeWidth={2.2} />
          <path
            d={`M${cx - 20} 104a20 20 0 0 1 40 0`}
            stroke={C.text}
            strokeWidth={2.2}
            strokeLinecap="round"
          />
        </g>
      ))}
    </svg>
  );
};

/** A rising bar set, for "growing fast". Bars settle at their final height. */
export const GrowthBars: React.FC<{ p: number; n?: number; w?: number }> = ({
  p,
  n = 6,
  w = 520,
}) => {
  const gap = 18;
  const bw = (w - gap * (n - 1)) / n;
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap, height: 240 }}>
      {Array.from({ length: n }).map((_, i) => {
        const target = 58 + i * 33;
        const local = interpolate(p, [i * 0.09, i * 0.09 + 0.42], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <div
            key={i}
            style={{
              width: bw,
              height: Math.round(target * local),
              borderRadius: 6,
              background:
                i === n - 1
                  ? `linear-gradient(180deg, ${C.goldBright}, ${C.gold})`
                  : `linear-gradient(180deg, ${C.panel2}, ${C.panel})`,
              border: `1px solid ${i === n - 1 ? C.gold : C.line}`,
            }}
          />
        );
      })}
    </div>
  );
};
