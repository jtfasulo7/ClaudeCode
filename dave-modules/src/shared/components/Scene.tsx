import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export type Enter = "fade" | "rise" | "scale" | "wipeL" | "hold";

/**
 * Every scene sits in one of these.
 *
 * NOTE ON STILLNESS: an earlier version applied a continuous scale drift across
 * each shot's life. Slowly scaling a layer by a non-integer factor resamples
 * every glyph edge and hairline stroke on every frame, which reads as a
 * persistent shimmer — text appearing to "shake" even though nothing is moving.
 *
 * So scenes now ANIMATE IN AND THEN STOP. The entrance settles to exactly
 * scale 1 / translate 0 and holds there, dead still, until the outgoing fade.
 * All remaining motion is purposeful: elements arriving on their narration cue,
 * bars filling, checks drawing. Ambient motion is confined to the large soft
 * gradients in Stage, which have no edges to shimmer.
 */
export const Scene: React.FC<{
  dur: number;
  enter?: Enter;
  children: React.ReactNode;
}> = ({ dur, enter = "fade", children }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  const IN = 10;
  const OUT = 8;

  const fadeIn = interpolate(f, [0, IN], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(f, [dur - OUT, dur], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const raw = spring({
    frame: f,
    fps,
    config: { damping: 200, stiffness: 130 },
    durationInFrames: 22,
  });
  // Hard-settle: past the entrance the transform is exactly identity, so there
  // is no residual sub-pixel motion for the rest of the shot.
  const s = f >= 22 ? 1 : raw;

  let tx = 0;
  let ty = 0;
  let scale = 1;
  let opacity = fadeIn * fadeOut;

  if (enter === "rise") ty = (1 - s) * 46;
  if (enter === "scale") scale = 0.955 + s * 0.045;
  if (enter === "wipeL") tx = (1 - s) * 64;
  if (enter === "hold") opacity = fadeOut;

  const still = tx === 0 && ty === 0 && scale === 1;

  return (
    <AbsoluteFill
      style={{
        opacity,
        // Once settled, drop the transform entirely rather than writing an
        // identity matrix — that keeps the layer on the pixel grid.
        transform: still ? undefined : `translate3d(${tx}px, ${ty}px, 0) scale(${scale})`,
        willChange: still ? undefined : "transform, opacity",
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/** 0..1 eased progress, `delay` frames in, over `len` frames. Settles at 1. */
export const useIn = (delay: number, len = 16) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f < delay) return 0;
  if (f >= delay + len) return 1;
  return spring({
    frame: f - delay,
    fps,
    config: { damping: 200, stiffness: 140 },
    durationInFrames: len,
  });
};

/** Linear 0..1 ramp — for draws and counters where spring overshoot is wrong. */
export const useRamp = (from: number, to: number) => {
  const f = useCurrentFrame();
  return interpolate(f, [from, to], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
};
