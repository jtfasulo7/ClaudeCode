import React from "react";
import { C, SANS } from "../theme";

/* ------------------------------------------------------------ peptide chain */

/**
 * Amino-acid chain — a peptide as a structure, not a product. Beads land one
 * at a time and then hold completely still.
 */
export const PeptideChain: React.FC<{ n?: number; p: number; w?: number }> = ({
  n = 7,
  p,
  w = 900,
}) => {
  const r = 26;
  const gap = (w - r * 2) / (n - 1);
  const h = 150;
  const y = h / 2;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      {Array.from({ length: n - 1 }, (_, i) => {
        const on = p > (i + 0.5) / n;
        return (
          <line
            key={`l${i}`}
            x1={r + i * gap}
            y1={y + (i % 2 === 0 ? -18 : 18)}
            x2={r + (i + 1) * gap}
            y2={y + (i % 2 === 0 ? 18 : -18)}
            stroke={on ? C.goldDim : C.line}
            strokeWidth={3}
          />
        );
      })}
      {Array.from({ length: n }, (_, i) => {
        const on = p > i / n;
        return (
          <circle
            key={`c${i}`}
            cx={r + i * gap}
            cy={y + (i % 2 === 0 ? -18 : 18)}
            r={on ? r : r * 0.6}
            fill={on ? "rgba(201,162,39,0.16)" : "rgba(255,255,255,0.03)"}
            stroke={on ? C.gold : C.line}
            strokeWidth={2.5}
            opacity={on ? 1 : 0.5}
          />
        );
      })}
    </svg>
  );
};

/* ----------------------------------------------------------------- search UI */

export const SearchBar: React.FC<{ query: string; typed: number; w?: number }> = ({
  query,
  typed,
  w = 860,
}) => {
  const shown = query.slice(0, Math.round(typed * query.length));
  return (
    <div
      style={{
        width: w,
        display: "flex",
        alignItems: "center",
        gap: 20,
        padding: "26px 30px",
        borderRadius: 14,
        background: C.panel,
        border: `1px solid ${C.line}`,
        fontFamily: SANS,
      }}
    >
      <svg width="30" height="30" viewBox="0 0 30 30" style={{ flexShrink: 0 }}>
        <circle cx="13" cy="13" r="9" fill="none" stroke={C.gold} strokeWidth="2.6" />
        <path d="M20 20 L27 27" stroke={C.gold} strokeWidth="3" strokeLinecap="round" />
      </svg>
      <span style={{ fontSize: 32, color: shown ? C.text : C.textFaint, letterSpacing: -0.4 }}>
        {shown || "Search the community"}
      </span>
      {/* Caret blinks on a 15-frame grid — a whole pixel, never a sub-pixel nudge. */}
      {typed > 0 && typed < 1 && (
        <span style={{ width: 3, height: 34, background: C.gold, display: "inline-block" }} />
      )}
    </div>
  );
};

export const ResultRow: React.FC<{ title: string; meta: string; p: number; hot?: boolean }> = ({
  title,
  meta,
  p,
  hot = false,
}) => (
  <div
    style={{
      opacity: p,
      display: "flex",
      flexDirection: "column",
      gap: 8,
      padding: "20px 30px",
      borderRadius: 12,
      background: hot ? "rgba(201,162,39,0.09)" : "rgba(255,255,255,0.022)",
      border: `1px solid ${hot ? "rgba(201,162,39,0.34)" : C.lineSoft}`,
      fontFamily: SANS,
    }}
  >
    <span style={{ fontSize: 30, color: C.text, fontWeight: 600 }}>{title}</span>
    <span style={{ fontSize: 22, color: C.textFaint }}>{meta}</span>
  </div>
);

/* ------------------------------------------------------------- thread / post */

export const ThreadPost: React.FC<{
  post: string;
  comments: { who: string; text: string; p: number }[];
  highlight: number;
  w?: number;
}> = ({ post, comments, highlight, w = 980 }) => (
  <div style={{ width: w, fontFamily: SANS }}>
    <div
      style={{
        padding: "28px 32px",
        borderRadius: 14,
        background: C.panel,
        border: `1px solid ${C.line}`,
        opacity: 1 - highlight * 0.55,
      }}
    >
      <div style={{ fontSize: 20, letterSpacing: 2.4, color: C.textFaint, textTransform: "uppercase" }}>
        Original post
      </div>
      <div style={{ fontSize: 32, color: C.text, marginTop: 12, fontWeight: 500 }}>{post}</div>
    </div>

    <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 20, paddingLeft: 56 }}>
      {comments.map((c, i) => (
        <div
          key={i}
          style={{
            opacity: c.p,
            padding: "22px 28px",
            borderRadius: 12,
            background: highlight > 0.4 ? "rgba(201,162,39,0.10)" : "rgba(255,255,255,0.025)",
            borderLeft: `3px solid ${highlight > 0.4 ? C.gold : C.line}`,
          }}
        >
          <div style={{ fontSize: 20, color: C.gold, letterSpacing: 1.6 }}>{c.who}</div>
          <div style={{ fontSize: 27, color: C.text, marginTop: 6 }}>{c.text}</div>
        </div>
      ))}
    </div>
  </div>
);

/* ---------------------------------------------------------------- node graph */

/** Members connected to members — nodes and links, no centre authority. */
export const NodeNetwork: React.FC<{ p: number; size?: number }> = ({ p, size = 460 }) => {
  const cx = size / 2;
  const cy = size / 2;
  const R = size * 0.36;
  const nodes = Array.from({ length: 7 }, (_, i) => {
    const a = (i / 7) * Math.PI * 2 - Math.PI / 2;
    return { x: cx + Math.cos(a) * R, y: cy + Math.sin(a) * R };
  });
  const links: [number, number][] = [
    [0, 2],
    [0, 3],
    [1, 4],
    [1, 5],
    [2, 5],
    [3, 6],
    [4, 6],
    [0, 4],
    [2, 6],
  ];
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {links.map(([a, b], i) => {
        const on = p > (i + 1) / (links.length + 2);
        return (
          <line
            key={i}
            x1={nodes[a].x}
            y1={nodes[a].y}
            x2={nodes[b].x}
            y2={nodes[b].y}
            stroke={on ? "rgba(201,162,39,0.45)" : C.lineSoft}
            strokeWidth={2}
          />
        );
      })}
      {nodes.map((n, i) => {
        const on = p > i / (nodes.length + 3);
        return (
          <g key={i}>
            <circle cx={n.x} cy={n.y} r={20} fill={on ? "rgba(201,162,39,0.18)" : "rgba(255,255,255,0.03)"} />
            <circle cx={n.x} cy={n.y} r={20} fill="none" stroke={on ? C.gold : C.line} strokeWidth={2.4} />
          </g>
        );
      })}
    </svg>
  );
};

/* ------------------------------------------------------------------- tiers */

export const TierLadder: React.FC<{
  tiers: { name: string; unlocked: boolean }[];
  p: number;
  w?: number;
}> = ({ tiers, p, w = 720 }) => (
  <div style={{ width: w, display: "flex", flexDirection: "column", gap: 16, fontFamily: SANS }}>
    {tiers.map((t, i) => {
      const shown = p > i / (tiers.length + 1);
      return (
        <div
          key={i}
          style={{
            opacity: shown ? 1 : 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "24px 30px",
            borderRadius: 12,
            background: t.unlocked ? "rgba(201,162,39,0.09)" : "rgba(255,255,255,0.022)",
            border: `1px solid ${t.unlocked ? "rgba(201,162,39,0.34)" : C.lineSoft}`,
          }}
        >
          <span style={{ fontSize: 30, fontWeight: 600, color: t.unlocked ? C.text : C.textDim }}>{t.name}</span>
          <span
            style={{
              fontSize: 20,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: t.unlocked ? C.gold : C.textFaint,
            }}
          >
            {t.unlocked ? "Open" : "Locked"}
          </span>
        </div>
      );
    })}
  </div>
);
