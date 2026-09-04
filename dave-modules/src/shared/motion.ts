import { Easing, interpolate, useCurrentFrame } from "remotion";

/**
 * THE MOTION LANGUAGE
 *
 * The first four films animated everything with `spring({ damping: 200 })`.
 * That is Remotion's "smooth, no bounce" preset: near-symmetric, gentle in,
 * gentle out. Applied to 114 scenes it is the single clearest tell that the
 * work is templated rather than designed — every element, regardless of size,
 * weight or role, moved on the same curve at the same rate.
 *
 * Real motion design is ASYMMETRIC. Things leave their start state fast and
 * take a long time to arrive. The ratio of that asymmetry is what communicates
 * mass: a chapter numeral and a hairline rule should not settle at the same
 * rate, because one implies weight and the other doesn't.
 *
 * Every curve here is aggressive on the way out and long on the settle, and
 * every helper HARD-SETTLES — past its duration it returns exactly 1, and
 * callers drop the transform entirely. Dramatic arrival, dead-still hold.
 */
export const CURVE = {
  /** Workhorse entrance. Expo-out: violent start, long luxurious tail. */
  enter: Easing.bezier(0.16, 1, 0.3, 1),
  /** Precise and mechanical — data, UI, numerals. Arrives with authority. */
  snap: Easing.bezier(0.22, 1, 0.36, 1),
  /** Implied mass. Slower off the mark, settles late. Big type, panels. */
  heavy: Easing.bezier(0.4, 0.85, 0.25, 1),
  /** Leaves fast and keeps accelerating — the mirror of `enter`. */
  exit: Easing.bezier(0.7, 0, 0.84, 0),
  /** A touch of overshoot. Use sparingly, on small accents only. */
  overshoot: Easing.bezier(0.34, 1.42, 0.64, 1),
  /** Symmetric. ONLY for continuous ambient values that never settle. */
  ambient: Easing.inOut(Easing.sin),
} as const;

export type CurveName = keyof typeof CURVE;

/**
 * 0..1 progress starting at `delay`, over `dur` frames, on the named curve.
 * Returns exactly 0 before and exactly 1 after — no residual sub-pixel motion.
 */
export const useAnim = (delay: number, dur = 22, curve: CurveName = "enter") => {
  const f = useCurrentFrame();
  if (f <= delay) return 0;
  if (f >= delay + dur) return 1;
  return interpolate(f, [delay, delay + dur], [0, 1], {
    easing: CURVE[curve],
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
};

/** Same, but as a plain function for when the frame is already in hand. */
export const animAt = (f: number, delay: number, dur = 22, curve: CurveName = "enter") => {
  if (f <= delay) return 0;
  if (f >= delay + dur) return 1;
  return interpolate(f, [delay, delay + dur], [0, 1], {
    easing: CURVE[curve],
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
};

/**
 * Stagger. Index `i` of `n` items starting at `delay`, each `step` frames
 * apart. Returns the delay for that item — deliberately a delay rather than a
 * progress value so callers can pick their own curve per element type.
 */
export const stagger = (delay: number, i: number, step = 4) => delay + i * step;

/**
 * Only emit a transform while it is doing something. An identity matrix still
 * forces the compositor to resample the layer, which is what produced the
 * shimmer in the first cut.
 */
export const transformOrNone = (parts: string[], active: boolean) =>
  active ? parts.join(" ") : undefined;

/* ------------------------------------------------------------ archetypes */

/**
 * Entrance archetypes. Each returns a style object that settles to nothing.
 * `p` is 0..1 from useAnim.
 */

/** Rises into place with a slight scale — general purpose. */
export const rise = (p: number, distance = 34) => {
  const done = p >= 1;
  return {
    opacity: p,
    transform: transformOrNone([`translateY(${(1 - p) * distance}px)`], !done),
  };
};

/** Slides in horizontally. For list rows and side panels. */
export const slideIn = (p: number, distance = 40) => {
  const done = p >= 1;
  return {
    opacity: p,
    transform: transformOrNone([`translateX(${(1 - p) * distance}px)`], !done),
  };
};

/**
 * Wipes up behind a mask — the type reveal that reads most "designed".
 * The glyphs do not move at all; the mask edge does. Because nothing is
 * scaled or sub-pixel translated, this is completely shimmer-free.
 */
export const maskUp = (p: number) => ({
  clipPath: p >= 1 ? undefined : `inset(${(1 - p) * 105}% 0% 0% 0%)`,
  WebkitClipPath: p >= 1 ? undefined : `inset(${(1 - p) * 105}% 0% 0% 0%)`,
});

/** Horizontal mask wipe — for rules, bars and underlines. */
export const maskRight = (p: number) => ({
  clipPath: p >= 1 ? undefined : `inset(0% ${(1 - p) * 100}% 0% 0%)`,
  WebkitClipPath: p >= 1 ? undefined : `inset(0% ${(1 - p) * 100}% 0% 0%)`,
});

/**
 * Letter-spacing settles inward as opacity comes up. Cheap, and it reads as
 * genuinely typographic rather than as a generic fade.
 */
export const trackIn = (p: number, from = 18, to = -1.4) => ({
  opacity: p,
  letterSpacing: `${from + (to - from) * p}px`,
});

/** Scales down into place, as though settling from closer to camera. */
export const settleIn = (p: number, from = 1.06) => {
  const done = p >= 1;
  return {
    opacity: p,
    transform: transformOrNone([`scale(${from + (1 - from) * p})`], !done),
  };
};
