import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { animAt, CURVE, transformOrNone } from "../motion";
import { interpolate } from "remotion";

export type ShotEnter = "fade" | "rise" | "settle" | "pushL" | "pushR" | "hold";

/**
 * Scene wrapper for the new motion language.
 *
 * Kept separate from the original `Scene` on purpose — modules 1/3/5/7 are
 * finished and rendered, and they should not shift under a component change.
 *
 * Differences from the original:
 *   - asymmetric bezier curves instead of one symmetric spring
 *   - varied entrance archetypes so consecutive shots do not arrive identically
 *   - an optional exit push, so cuts have direction rather than just dissolving
 *   - still hard-settles and drops the transform (the stillness rule holds)
 */
export const Shot: React.FC<{
  dur: number;
  enter?: ShotEnter;
  /** Frames the entrance takes. Longer = heavier. */
  len?: number;
  children: React.ReactNode;
}> = ({ dur, enter = "fade", len = 26, children }) => {
  const f = useCurrentFrame();

  const IN = len;
  const OUT = 9;

  const p = animAt(f, 0, IN, enter === "settle" ? "heavy" : "enter");
  const fadeIn = interpolate(f, [0, Math.min(11, IN)], [0, 1], {
    easing: CURVE.enter,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(f, [dur - OUT, dur], [1, 0], {
    easing: CURVE.exit,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  let tx = 0;
  let ty = 0;
  let scale = 1;

  if (enter === "rise") ty = (1 - p) * 52;
  if (enter === "settle") scale = 1.045 + (1 - 1.045) * p;
  if (enter === "pushL") tx = (1 - p) * 74;
  if (enter === "pushR") tx = (1 - p) * -74;

  const moving = tx !== 0 || ty !== 0 || scale !== 1;
  const opacity = enter === "hold" ? fadeOut : fadeIn * fadeOut;

  return (
    <AbsoluteFill
      style={{
        opacity,
        transform: transformOrNone(
          [`translate3d(${tx}px, ${ty}px, 0)`, `scale(${scale})`],
          moving,
        ),
        willChange: moving ? "transform, opacity" : undefined,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/** Standard centred column. */
export const Stack: React.FC<{ children: React.ReactNode; gap?: number }> = ({
  children,
  gap = 30,
}) => (
  <AbsoluteFill
    style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap }}
  >
    {children}
  </AbsoluteFill>
);
