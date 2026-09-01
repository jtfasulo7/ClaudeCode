import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C } from "../theme";

/**
 * Global backdrop for the whole film.
 *
 * NOTE ON STILLNESS: the dot grid used to drift a cell every 14s. A 1px dot
 * moving by fractions of a pixel per frame shimmers badly, and behind text it
 * reads as the whole frame vibrating. The grid is now pinned to the pixel grid
 * and does not move.
 *
 * Ambient life comes only from the two large gold pools. They are wide, soft
 * gradients with no hard edges, so they can breathe continuously without
 * producing a single shimmering pixel.
 */
export const Stage: React.FC = () => {
  const f = useCurrentFrame();

  const b1 = Math.sin(f / 92) * 0.5 + 0.5;
  const b2 = Math.sin(f / 131 + 1.7) * 0.5 + 0.5;

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(58% 44% at 22% ${28 + b1 * 6}%, rgba(201,162,39,${0.055 + b1 * 0.035}) 0%, rgba(201,162,39,0) 62%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(52% 40% at 80% ${72 - b2 * 6}%, rgba(201,162,39,${0.035 + b2 * 0.028}) 0%, rgba(201,162,39,0) 60%)`,
        }}
      />

      {/* Static — locked to the pixel grid. */}
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(rgba(255,255,255,0.055) 1px, transparent 1px)`,
          backgroundSize: "44px 44px",
          backgroundPosition: "0px 0px",
          maskImage:
            "radial-gradient(78% 66% at 50% 50%, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 100%)",
          WebkitMaskImage:
            "radial-gradient(78% 66% at 50% 50%, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 100%)",
        }}
      />

      <AbsoluteFill
        style={{
          background:
            "radial-gradient(118% 88% at 50% 46%, rgba(0,0,0,0) 46%, rgba(0,0,0,0.55) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

/**
 * Fine grain, held at a FIXED offset. Cycling the pattern per frame is what
 * film grain normally does, but over static type at this contrast it reads as
 * the text buzzing, so it stays put.
 */
export const Grain: React.FC = () => (
  <AbsoluteFill
    style={{
      opacity: 0.04,
      mixBlendMode: "overlay",
      pointerEvents: "none",
      backgroundImage:
        "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/></filter><rect width='140' height='140' filter='url(%23n)' opacity='0.55'/></svg>\")",
      backgroundPosition: "0px 0px",
    }}
  />
);

/** Thin gold progress hairline along the very bottom of frame. */
export const Progress: React.FC<{ total: number }> = ({ total }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [0, total], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        bottom: 0,
        height: 2,
        width: `${p * 100}%`,
        background: `linear-gradient(90deg, ${C.goldDim}, ${C.gold})`,
        opacity: 0.75,
      }}
    />
  );
};
