import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { animAt, stagger, transformOrNone } from "../motion";
import { C, SANS } from "../theme";

/**
 * Richer motion for the onboarding film.
 *
 * The stillness rule still holds for anything carrying meaning: type and
 * primary graphics animate in and then settle to EXACTLY identity, because a
 * transform parked at 0.999 resamples every glyph on every frame and reads as a
 * shimmer.
 *
 * What is added here is a second, clearly separate layer: ambient motion that
 * never sits under text, stays under about 8% opacity, and moves slowly enough
 * that it reads as depth rather than activity. That is how the frame gets more
 * alive without the letters vibrating.
 */

/* ------------------------------------------------------------- ambient --- */

/**
 * Slow drifting motes. Deliberately continuous — this is the one layer allowed
 * to keep moving, because it is behind everything and carries no information.
 * Deterministic from the index, so it renders identically every time.
 */
export const Motes: React.FC<{ n?: number; opacity?: number }> = ({ n = 26, opacity = 0.06 }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {Array.from({ length: n }).map((_, i) => {
        const seed = i * 97.13;
        const x = (Math.sin(seed) * 0.5 + 0.5) * 1920;
        const baseY = (Math.cos(seed * 1.7) * 0.5 + 0.5) * 1080;
        // Very slow vertical drift with a long period, wrapped smoothly.
        const drift = ((f * (0.16 + (i % 5) * 0.05)) % 1200) - 100;
        const y = (baseY + drift) % 1180;
        const r = 1.4 + (i % 4) * 0.9;
        const tw = 0.55 + 0.45 * Math.sin(f * 0.017 + seed);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: r * 2,
              height: r * 2,
              borderRadius: "50%",
              background: i % 7 === 0 ? C.gold : C.text,
              opacity: opacity * tw,
            }}
          />
        );
      })}
    </div>
  );
};

/** A soft ring that expands once and fades. Used to punctuate an arrival. */
export const Pulse: React.FC<{ at: number; size?: number; colour?: string }> = ({
  at,
  size = 420,
  colour = C.gold,
}) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [at, at + 46], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  if (f < at || p >= 1) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: size,
        height: size,
        marginLeft: -size / 2,
        marginTop: -size / 2,
        borderRadius: "50%",
        border: `2px solid ${colour}`,
        opacity: (1 - p) * 0.5,
        transform: `scale(${0.35 + p * 1.15})`,
        pointerEvents: "none",
      }}
    />
  );
};

/** Accent dots orbiting a centre, easing to a stop rather than spinning on. */
export const Orbit: React.FC<{ p: number; r?: number; n?: number }> = ({ p, r = 210, n = 3 }) => {
  // Eases from a quarter turn to rest, so it arrives with rotation and then
  // holds — no perpetual spin under the type.
  const turn = (1 - p) * 78;
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {Array.from({ length: n }).map((_, i) => {
        const a = ((i / n) * 360 + turn) * (Math.PI / 180);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `calc(50% + ${(Math.cos(a) * r).toFixed(2)}px)`,
              top: `calc(50% + ${(Math.sin(a) * r).toFixed(2)}px)`,
              width: 9,
              height: 9,
              marginLeft: -4.5,
              marginTop: -4.5,
              borderRadius: "50%",
              background: C.gold,
              opacity: p * 0.75,
            }}
          />
        );
      })}
    </div>
  );
};

/* -------------------------------------------------------------- widgets --- */

/** A single feed post: avatar, name line, body lines. */
const FeedRow: React.FC<{ p: number; w: number; gold?: boolean }> = ({ p, w, gold }) => (
  <div
    style={{
      opacity: p,
      transform: transformOrNone([`translate3d(0, ${((1 - p) * 26).toFixed(2)}px, 0)`], p < 1),
      display: "flex",
      gap: 14,
      alignItems: "flex-start",
      width: w,
      padding: "14px 16px",
      borderRadius: 12,
      border: `1px solid ${gold ? C.gold : C.line}`,
      background: gold ? "rgba(201,162,39,0.07)" : C.panel2,
    }}
  >
    <div
      style={{
        width: 30,
        height: 30,
        borderRadius: "50%",
        background: gold ? C.gold : C.line,
        flex: "0 0 30px",
      }}
    />
    <div style={{ display: "flex", flexDirection: "column", gap: 7, flex: 1 }}>
      <div style={{ height: 7, width: "46%", borderRadius: 4, background: gold ? C.goldDim : C.line }} />
      <div style={{ height: 6, width: "88%", borderRadius: 4, background: C.lineSoft }} />
      <div style={{ height: 6, width: "64%", borderRadius: 4, background: C.lineSoft }} />
    </div>
  </div>
);

/**
 * A phone showing a feed that fills in. The posts arrive one at a time, so the
 * screen is doing something rather than being a still mock-up.
 */
export const PhoneFeed: React.FC<{
  p: number;
  delay?: number;
  step?: number;
  rows?: number;
  goldRow?: number;
  w?: number;
}> = ({ p, delay = 0, step = 9, rows = 3, goldRow = -1, w = 330 }) => {
  const f = useCurrentFrame();
  const h = w * 1.94;
  const done = p >= 1;
  return (
    <div
      style={{
        opacity: p,
        transform: transformOrNone([`scale(${(0.94 + 0.06 * p).toFixed(4)})`], !done),
        width: w,
        height: h,
        borderRadius: w * 0.12,
        border: `2px solid ${C.line}`,
        background: C.panel,
        padding: w * 0.05,
        paddingTop: w * 0.1,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        boxShadow: "0 44px 100px -34px rgba(0,0,0,0.85)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          marginTop: -w * 0.062,
          marginLeft: w * 0.33,
          width: w * 0.18,
          height: 4,
          borderRadius: 2,
          background: C.line,
        }}
      />
      {Array.from({ length: rows }).map((_, i) => (
        <FeedRow
          key={i}
          p={animAt(f, stagger(delay, i, step), 22, "enter")}
          w={w - w * 0.1}
          gold={i === goldRow}
        />
      ))}
    </div>
  );
};

/** Notification cards cascading down, each settling square. */
export const NotifStack: React.FC<{
  items: { title: string; at: number }[];
  w?: number;
}> = ({ items, w = 560 }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {items.map((it, i) => {
        const p = animAt(f, it.at, 24, "overshoot");
        return (
          <div
            key={it.title}
            style={{
              opacity: p,
              transform: transformOrNone(
                [`translate3d(${((1 - p) * 40).toFixed(2)}px, 0, 0)`],
                p < 1,
              ),
              width: w,
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: "20px 22px",
              borderRadius: 16,
              border: `1px solid ${C.line}`,
              background: C.panel2,
              boxShadow: "0 18px 40px -22px rgba(0,0,0,0.9)",
            }}
          >
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: C.gold,
                flex: "0 0 12px",
              }}
            />
            <div
              style={{
                fontFamily: SANS,
                fontSize: 30,
                fontWeight: 600,
                color: C.text,
              }}
            >
              {it.title}
            </div>
          </div>
        );
      })}
    </div>
  );
};

/** Avatars appearing in sequence, as a room filling up. */
export const AvatarRow: React.FC<{
  n?: number;
  delay?: number;
  step?: number;
  size?: number;
  goldAt?: number;
}> = ({ n = 6, delay = 0, step = 5, size = 74, goldAt = -1 }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ display: "flex", gap: 16 }}>
      {Array.from({ length: n }).map((_, i) => {
        const p = animAt(f, stagger(delay, i, step), 22, "overshoot");
        const gold = i === goldAt;
        return (
          <div
            key={i}
            style={{
              opacity: p,
              transform: transformOrNone([`scale(${(0.5 + 0.5 * p).toFixed(4)})`], p < 1),
              width: size,
              height: size,
              borderRadius: "50%",
              border: `2px solid ${gold ? C.gold : C.line}`,
              background: gold ? "rgba(201,162,39,0.10)" : C.panel2,
              display: "grid",
              placeItems: "center",
            }}
          >
            <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="9" r="4" stroke={gold ? C.goldBright : C.textFaint} strokeWidth="1.9" />
              <path
                d="M4 21a8 8 0 0 1 16 0"
                stroke={gold ? C.goldBright : C.textFaint}
                strokeWidth="1.9"
                strokeLinecap="round"
              />
            </svg>
          </div>
        );
      })}
    </div>
  );
};

/** A ring that draws to `p`, with the figure in the middle. */
export const ProgressRing: React.FC<{
  p: number;
  label?: string;
  size?: number;
}> = ({ p, label, size = 240 }) => {
  const r = size / 2 - 12;
  const circ = 2 * Math.PI * r;
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke={C.line} strokeWidth={7} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={C.gold}
          strokeWidth={7}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - p)}
        />
      </svg>
      {label && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "grid",
            placeItems: "center",
            fontFamily: SANS,
            fontSize: size * 0.17,
            fontWeight: 800,
            color: C.goldBright,
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
};

/** Checklist whose ticks draw in, one per beat. */
export const CheckList: React.FC<{
  items: { label: string; at: number; gold?: boolean }[];
  w?: number;
}> = ({ items, w = 720 }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, width: w }}>
      {items.map((it) => {
        const p = animAt(f, it.at, 24, "enter");
        const tick = animAt(f, it.at + 6, 18, "snap");
        return (
          <div
            key={it.label}
            style={{
              opacity: p,
              transform: transformOrNone([`translate3d(${((1 - p) * 26).toFixed(2)}px, 0, 0)`], p < 1),
              display: "flex",
              alignItems: "center",
              gap: 18,
              padding: "22px 26px",
              borderRadius: 14,
              border: `1.5px solid ${it.gold ? C.gold : C.line}`,
              background: it.gold ? "rgba(201,162,39,0.08)" : C.panel,
            }}
          >
            <svg width={30} height={30} viewBox="0 0 24 24" fill="none">
              <path
                d="M4 12.5l5 5L20 6.5"
                stroke={it.gold ? C.goldBright : C.green}
                strokeWidth={2.8}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={26}
                strokeDashoffset={26 * (1 - tick)}
              />
            </svg>
            <div
              style={{
                fontFamily: SANS,
                fontSize: 38,
                fontWeight: 600,
                color: it.gold ? C.goldBright : C.text,
              }}
            >
              {it.label}
            </div>
          </div>
        );
      })}
    </div>
  );
};

/** A map pin that drops and lands. */
export const MapPin: React.FC<{ p: number; size?: number }> = ({ p, size = 130 }) => {
  // Drops from above and stops flat — no bounce loop.
  const drop = interpolate(p, [0, 0.72], [-120, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const squash = interpolate(p, [0.68, 0.82, 1], [1, 0.9, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const done = p >= 1;
  return (
    <div style={{ position: "relative", display: "grid", placeItems: "center" }}>
      <div
        style={{
          opacity: p,
          transform: transformOrNone(
            [`translate3d(0, ${drop.toFixed(2)}px, 0)`, `scaleY(${squash.toFixed(3)})`],
            !done,
          ),
          transformOrigin: "50% 100%",
        }}
      >
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
          <path
            d="M16 29s10-9.4 10-16A10 10 0 0 0 6 13c0 6.6 10 16 10 16z"
            stroke={C.gold}
            strokeWidth={2.2}
            strokeLinejoin="round"
          />
          <circle cx="16" cy="13" r="3.6" fill={C.goldBright} />
        </svg>
      </div>
      {/* Ground shadow settles as the pin lands. */}
      <div
        style={{
          width: size * 0.5,
          height: 8,
          borderRadius: "50%",
          background: "rgba(0,0,0,0.55)",
          opacity: p * 0.8,
          marginTop: -6,
          filter: "blur(4px)",
        }}
      />
    </div>
  );
};

/** Cards fanning out, for "we're building this out". */
export const CardFan: React.FC<{ p: number; n?: number; w?: number }> = ({ p, n = 5, w = 150 }) => {
  const h = w * 1.34;
  return (
    // Wide enough to hold the full spread: the outer cards sit 84px * 2 from
    // centre, so a container sized to one card would place them outside it.
    <div style={{ position: "relative", width: w + 84 * (n - 1), height: h + 40 }}>
      {Array.from({ length: n }).map((_, i) => {
        const mid = (n - 1) / 2;
        const off = i - mid;
        const local = interpolate(p, [i * 0.07, i * 0.07 + 0.5], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const rot = off * 8 * local;
        const tx = off * 84 * local;
        const done = local >= 1;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: "50%",
              top: 18,
              marginLeft: -w / 2,
              width: w,
              height: h,
              borderRadius: 12,
              // The outer cards were C.line on C.panel2, which is barely a
              // shade apart on this ground and read as empty space.
              border: `1.5px solid ${i === Math.round(mid) ? C.gold : "#3A3F47"}`,
              background: i === Math.round(mid) ? "rgba(201,162,39,0.10)" : "#23262B",
                opacity: local,
              // NOT transformOrNone. That helper drops the transform once an
              // animation settles, which is right when the resting state is
              // identity — it stops the element resampling every frame. A fanned
              // card's resting state is offset and rotated, so dropping the
              // transform collapsed all five back onto each other and the fan
              // rendered as a single card.
              //
              // A CONSTANT transform is not the thing that shimmers; a
              // constantly-CHANGING sub-pixel one is. So this stays applied and
              // only willChange is released.
              transform: `translate3d(${tx.toFixed(2)}px, 0, 0) rotate(${rot.toFixed(2)}deg)`,
              willChange: done ? undefined : "transform, opacity",
              transformOrigin: "50% 120%",
              display: "flex",
              flexDirection: "column",
              gap: 9,
              padding: 16,
            }}
          >
            <div style={{ height: 6, width: "70%", borderRadius: 3, background: C.line }} />
            <div style={{ height: 5, width: "92%", borderRadius: 3, background: C.lineSoft }} />
            <div style={{ height: 5, width: "80%", borderRadius: 3, background: C.lineSoft }} />
          </div>
        );
      })}
    </div>
  );
};

/** Speech bubbles popping in, for a room that talks. */
export const Bubbles: React.FC<{ items: { at: number; w: number; side: -1 | 1 }[] }> = ({
  items,
}) => {
  const f = useCurrentFrame();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "center" }}>
      {items.map((it, i) => {
        const p = animAt(f, it.at, 22, "overshoot");
        return (
          <div
            key={i}
            style={{
              opacity: p,
              transform: transformOrNone(
                [`translate3d(${(it.side * (1 - p) * 34).toFixed(2)}px, 0, 0)`, `scale(${(0.86 + 0.14 * p).toFixed(4)})`],
                p < 1,
              ),
              alignSelf: it.side < 0 ? "flex-start" : "flex-end",
              width: it.w,
              height: 46,
              borderRadius: 23,
              border: `1px solid ${i === items.length - 1 ? C.gold : C.line}`,
              background: i === items.length - 1 ? "rgba(201,162,39,0.08)" : C.panel2,
              display: "flex",
              alignItems: "center",
              paddingLeft: 20,
              gap: 8,
            }}
          >
            {[0, 1, 2].map((d) => (
              <div
                key={d}
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: i === items.length - 1 ? C.gold : C.textFaint,
                }}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
};
