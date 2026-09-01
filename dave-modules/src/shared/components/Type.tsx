import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, SANS, SERIF } from "../theme";

/** Small gold-cap label. Used to name what the viewer is looking at. */
export const Eyebrow: React.FC<{
  children: React.ReactNode;
  color?: string;
  delay?: number;
}> = ({ children, color = C.gold, delay = 0 }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [delay, delay + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        opacity: o,
        fontFamily: SANS,
        fontSize: 20,
        fontWeight: 700,
        letterSpacing: 4.2,
        textTransform: "uppercase",
        color,
      }}
    >
      {children}
    </div>
  );
};

/**
 * Kinetic typography. Deliberately 2-5 words — the brief calls for key phrases,
 * not subtitles, and short bursts are what let the viewer read the screen and
 * listen to the narrator at the same time.
 */
export const KeyWords: React.FC<{
  words: string[];
  /** Indices rendered in gold. */
  accent?: number[];
  size?: number;
  delay?: number;
  align?: "center" | "left";
  serif?: boolean;
  color?: string;
}> = ({
  words,
  accent = [],
  size = 108,
  delay = 0,
  align = "center",
  serif = false,
  color = C.text,
}) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: `${size * 0.1}px ${size * 0.26}px`,
        justifyContent: align === "center" ? "center" : "flex-start",
        maxWidth: 1500,
      }}
    >
      {words.map((w, i) => {
        const at = delay + i * 3.2;
        const s =
          f < at
            ? 0
            : spring({
                frame: f - at,
                fps,
                config: { damping: 200, stiffness: 150 },
                durationInFrames: 18,
              });
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: s,
              transform: `translateY(${(1 - s) * size * 0.22}px)`,
              fontFamily: serif ? SERIF : SANS,
              fontWeight: serif ? 600 : 800,
              fontSize: size,
              lineHeight: 1.02,
              letterSpacing: serif ? -0.5 : -size * 0.022,
              color: accent.includes(i) ? C.goldBright : color,
              textTransform: serif ? "none" : "uppercase",
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};

/** Quieter serif line for the reflective / principle moments. */
export const Statement: React.FC<{
  children: React.ReactNode;
  size?: number;
  delay?: number;
}> = ({ children, size = 62, delay = 0 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s =
    f < delay
      ? 0
      : spring({
          frame: f - delay,
          fps,
          config: { damping: 200, stiffness: 120 },
          durationInFrames: 24,
        });
  return (
    <div
      style={{
        opacity: s,
        transform: `translateY(${(1 - s) * 22}px)`,
        fontFamily: SERIF,
        fontWeight: 400,
        fontSize: size,
        lineHeight: 1.26,
        letterSpacing: -0.4,
        color: C.text,
        maxWidth: 1320,
        textAlign: "center",
      }}
    >
      {children}
    </div>
  );
};

/** Gold hairline that draws itself out from the centre. */
export const Rule: React.FC<{ delay?: number; width?: number }> = ({
  delay = 0,
  width = 300,
}) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [delay, delay + 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        height: 2,
        width: width * p,
        background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`,
      }}
    />
  );
};
