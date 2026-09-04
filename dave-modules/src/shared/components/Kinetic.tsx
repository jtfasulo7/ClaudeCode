import React from "react";
import { useCurrentFrame } from "remotion";
import { animAt, maskRight, maskUp, stagger, trackIn, transformOrNone } from "../motion";
import { C, SANS, SERIF } from "../theme";

/**
 * Typography for the new motion language.
 *
 * The old `KeyWords` faded and slid whole words on one spring. Everything here
 * reveals behind a MASK instead: the glyphs themselves never move, only the
 * clip edge does. That is what makes it read as designed rather than as a
 * fade — and because nothing is sub-pixel translated or scaled, it is
 * completely shimmer-free, which the old approach could not promise.
 */

/** Words wipe up one after another from behind their own baseline. */
export const MaskWords: React.FC<{
  words: string[];
  accent?: number[];
  size?: number;
  delay?: number;
  step?: number;
  serif?: boolean;
  color?: string;
  align?: "center" | "left";
}> = ({
  words,
  accent = [],
  size = 104,
  delay = 0,
  step = 5,
  serif = false,
  color = C.text,
  align = "center",
}) => {
  const f = useCurrentFrame();
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: `${size * 0.06}px ${size * 0.26}px`,
        justifyContent: align === "center" ? "center" : "flex-start",
        maxWidth: 1560,
      }}
    >
      {words.map((w, i) => {
        const p = animAt(f, stagger(delay, i, step), 24, "enter");
        return (
          // Outer clips, inner carries the glyph. The overflow box has to be a
          // separate element or the clip would crop the descenders.
          <span key={i} style={{ display: "inline-block", overflow: "hidden", paddingBottom: size * 0.12 }}>
            <span
              style={{
                display: "inline-block",
                ...maskUp(p),
                fontFamily: serif ? SERIF : SANS,
                fontWeight: serif ? 600 : 800,
                fontSize: size,
                lineHeight: 1.0,
                letterSpacing: serif ? -1 : -size * 0.024,
                color: accent.includes(i) ? C.goldBright : color,
                textTransform: serif ? "none" : "uppercase",
              }}
            >
              {w}
            </span>
          </span>
        );
      })}
    </div>
  );
};

/** Label whose tracking settles inward as it arrives. */
export const TrackLabel: React.FC<{
  children: React.ReactNode;
  delay?: number;
  color?: string;
  size?: number;
}> = ({ children, delay = 0, color = C.gold, size = 21 }) => {
  const f = useCurrentFrame();
  const p = animAt(f, delay, 30, "enter");
  return (
    <div
      style={{
        ...trackIn(p, 16, 4.4),
        fontFamily: SANS,
        fontSize: size,
        fontWeight: 700,
        textTransform: "uppercase",
        color,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </div>
  );
};

/** Serif statement, revealed line-by-line behind a mask. */
export const MaskStatement: React.FC<{
  lines: (React.ReactNode)[];
  size?: number;
  delay?: number;
  step?: number;
}> = ({ lines, size = 66, delay = 0, step = 8 }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: size * 0.24, maxWidth: 1400 }}>
      {lines.map((l, i) => {
        const p = animAt(f, stagger(delay, i, step), 28, "enter");
        return (
          <span key={i} style={{ display: "block", overflow: "hidden", paddingBottom: size * 0.16 }}>
            <span
              style={{
                display: "block",
                ...maskUp(p),
                fontFamily: SERIF,
                fontWeight: 400,
                fontSize: size,
                lineHeight: 1.22,
                letterSpacing: -0.4,
                color: C.text,
                textAlign: "center",
              }}
            >
              {l}
            </span>
          </span>
        );
      })}
    </div>
  );
};

/** Gold hairline that wipes outward from centre. */
export const WipeRule: React.FC<{ delay?: number; width?: number }> = ({
  delay = 0,
  width = 420,
}) => {
  const f = useCurrentFrame();
  const p = animAt(f, delay, 26, "enter");
  return (
    <div
      style={{
        width,
        height: 2,
        background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`,
        ...maskRight(p),
      }}
    />
  );
};

/**
 * A numeral that counts up. Tabular figures so the row never reflows, which
 * would otherwise nudge neighbouring layout every frame.
 */
export const CountUp: React.FC<{
  to: number;
  delay?: number;
  dur?: number;
  prefix?: string;
  suffix?: string;
  size?: number;
  color?: string;
}> = ({ to, delay = 0, dur = 36, prefix = "", suffix = "", size = 120, color = C.goldBright }) => {
  const f = useCurrentFrame();
  const p = animAt(f, delay, dur, "snap");
  return (
    <span
      style={{
        fontFamily: SANS,
        fontSize: size,
        fontWeight: 800,
        letterSpacing: -size * 0.03,
        color,
        fontVariantNumeric: "tabular-nums",
        opacity: p > 0 ? 1 : 0,
      }}
    >
      {prefix}
      {Math.round(to * p)}
      {suffix}
    </span>
  );
};

/**
 * Chip that scales in from slightly large with a gold edge that lights up.
 * Used for the enumerated lists that carry most of this film.
 */
export const Chip: React.FC<{
  label: string;
  p: number;
  tone?: "neutral" | "gold" | "red" | "green";
  size?: number;
}> = ({ label, p, tone = "neutral", size = 38 }) => {
  const edge =
    tone === "gold" ? C.gold : tone === "red" ? C.red : tone === "green" ? C.green : C.line;
  const bg =
    tone === "gold"
      ? "rgba(201,162,39,0.10)"
      : tone === "red"
        ? "rgba(180,72,60,0.09)"
        : tone === "green"
          ? "rgba(62,158,106,0.09)"
          : "rgba(255,255,255,0.022)";
  const done = p >= 1;
  return (
    <div
      style={{
        opacity: p,
        transform: transformOrNone([`scale(${1.06 + (1 - 1.06) * p})`], !done),
        padding: `${size * 0.5}px ${size * 0.95}px`,
        borderRadius: 999,
        border: `1.5px solid ${edge}`,
        background: bg,
        fontFamily: SANS,
        fontSize: size,
        fontWeight: 600,
        color: tone === "neutral" ? C.textDim : C.text,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </div>
  );
};
