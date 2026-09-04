import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { animAt } from "../motion";
import { C } from "../theme";

/**
 * Deeper backdrop for the new motion language.
 *
 * The stillness rule still holds, but it is enforced by WHAT moves rather than
 * by freezing everything: only wide, soft, edge-free gradients drift. A blurred
 * radial has no glyph edge or hairline to resample, so it can travel
 * continuously without producing a single shimmering pixel — which the 1px dot
 * grid in the original Stage could not.
 *
 * That buys back the sense of depth the first films lost when I pinned
 * everything, without reintroducing the shake.
 */
export const StageV2: React.FC = () => {
  const f = useCurrentFrame();

  // Three pools on long, mutually prime periods so the field never visibly
  // repeats over a 99-second film.
  const a = Math.sin(f / 137) * 0.5 + 0.5;
  const b = Math.sin(f / 191 + 2.1) * 0.5 + 0.5;
  const c = Math.sin(f / 233 + 4.0) * 0.5 + 0.5;

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      {/* Base warmth, bottom-left */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(66% 52% at ${16 + a * 7}% ${74 - a * 5}%, rgba(201,162,39,${0.075 + a * 0.03}) 0%, rgba(201,162,39,0) 64%)`,
        }}
      />
      {/* Counter pool, top-right */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(58% 46% at ${82 - b * 6}% ${22 + b * 6}%, rgba(201,162,39,${0.05 + b * 0.028}) 0%, rgba(201,162,39,0) 60%)`,
        }}
      />
      {/* Cool counterweight so the gold reads as gold rather than as amber wash */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(52% 44% at ${44 + c * 10}% ${44 - c * 8}%, rgba(120,150,190,${0.028 + c * 0.018}) 0%, rgba(120,150,190,0) 62%)`,
        }}
      />

      {/* Static grid — pinned to the pixel grid, never moves. */}
      <AbsoluteFill
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          backgroundPosition: "0px 0px",
          maskImage: "radial-gradient(74% 62% at 50% 50%, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 100%)",
          WebkitMaskImage:
            "radial-gradient(74% 62% at 50% 50%, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 100%)",
        }}
      />

      <AbsoluteFill
        style={{
          background:
            "radial-gradient(122% 90% at 50% 46%, rgba(0,0,0,0) 44%, rgba(0,0,0,0.62) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

/**
 * A single diagonal specular pass, as though a light source crossed the frame.
 * Used once on the biggest gold moments — the thing that makes flat gold read
 * as a material rather than a fill.
 */
export const LightSweep: React.FC<{ at: number; dur?: number; angle?: number }> = ({
  at,
  dur = 46,
  angle = 108,
}) => {
  const f = useCurrentFrame();
  if (f < at || f > at + dur) return null;
  const p = animAt(f, at, dur, "ambient");
  const pos = interpolate(p, [0, 1], [-40, 140]);
  const fade = interpolate(p, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        mixBlendMode: "screen",
        opacity: fade * 0.5,
        background: `linear-gradient(${angle}deg, rgba(233,198,92,0) ${pos - 22}%, rgba(233,198,92,0.16) ${pos}%, rgba(233,198,92,0) ${pos + 22}%)`,
      }}
    />
  );
};

/** Fine grain, fixed offset. */
export const GrainV2: React.FC = () => (
  <AbsoluteFill
    style={{
      opacity: 0.045,
      mixBlendMode: "overlay",
      pointerEvents: "none",
      backgroundImage:
        "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3'/></filter><rect width='160' height='160' filter='url(%23n)' opacity='0.6'/></svg>\")",
      backgroundPosition: "0px 0px",
    }}
  />
);

/** Progress hairline. */
export const ProgressV2: React.FC<{ total: number }> = ({ total }) => {
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
        opacity: 0.7,
      }}
    />
  );
};
