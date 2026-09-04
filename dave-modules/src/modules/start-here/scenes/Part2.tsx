import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Shot, Stack } from "../../../shared/components/Shot";
import { MaskStatement, MaskWords, TrackLabel, WipeRule } from "../../../shared/components/Kinetic";
import { LightSweep } from "../../../shared/components/StageV2";
import { animAt, maskRight, maskUp, stagger, transformOrNone } from "../../../shared/motion";
import { C, SANS, SERIF } from "../../../shared/theme";

/* 12 — 46.30-49.35  "does not automatically prove what's inside that product" */
export const DoesNotProve: React.FC<{ dur: number }> = ({ dur }) => (
  <Shot dur={dur} enter="settle">
    <Stack gap={28}>
      <MaskWords words={["It", "proves", "nothing"]} accent={[2]} size={118} delay={3} step={5} />
      <TrackLabel delay={38} color={C.textFaint}>
        About what is actually inside
      </TrackLabel>
    </Stack>
  </Shot>
);

/* 13 — 49.35-55.25  "products outside regulated pharmacy channels — you have to start thinking about" */
export const OutsideRegulated: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const a = animAt(f, 6, 30, "enter");
  const b = animAt(f, 47, 30, "enter");
  return (
    <Shot dur={dur} enter="fade">
      <Stack gap={40}>
        <div style={{ opacity: a }}>
          <TrackLabel delay={6} color={C.textFaint}>
            Outside regulated pharmacy channels
          </TrackLabel>
        </div>
        <div style={{ opacity: b }}>
          <MaskWords
            words={["You", "have", "to", "start", "thinking"]}
            accent={[4]}
            size={86}
            delay={47}
            step={5}
          />
        </div>
        <WipeRule delay={134} width={520} />
      </Stack>
    </Shot>
  );
};

/* 14 — 55.25-62.75  identity / purity / quantity / contamination / storage / sterility / testing
 *
 * The showpiece. Seven nodes converge on a single point, and each one lands on
 * the exact frame its bell strikes in the score — so picture and music hit
 * together rather than merely coexisting.
 */
export const TheSeven: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();

  // Frames derived from the word timestamps, and matched by the score's bells.
  const CUES = [2, 35, 65, 89, 125, 149, 179];
  const NAMES = ["Identity", "Purity", "Quantity", "Contamination", "Storage", "Sterility", "Testing"];

  const W = 1180;
  const H = 860;
  const cx = W / 2;
  const cy = H / 2;
  const R = 236;
  const LR = R + 96;

  const pts = NAMES.map((_, i) => {
    const a = (-90 + i * (360 / 7)) * (Math.PI / 180);
    return { a, x: cx + Math.cos(a) * R, y: cy + Math.sin(a) * R, c: Math.cos(a), s: Math.sin(a) };
  });

  const hub = animAt(f, 0, 26, "heavy");

  return (
    <Shot dur={dur} enter="fade">
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "relative", width: W, height: H }}>
          <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
            <defs>
              <radialGradient id="hubglow" cx="50%" cy="50%">
                <stop offset="0%" stopColor="rgba(201,162,39,0.30)" />
                <stop offset="100%" stopColor="rgba(201,162,39,0)" />
              </radialGradient>
            </defs>

            <circle cx={cx} cy={cy} r={120 * hub} fill="url(#hubglow)" />
            <circle
              cx={cx}
              cy={cy}
              r={16}
              fill="none"
              stroke={C.gold}
              strokeWidth={2}
              opacity={hub}
            />

            {pts.map((p, i) => {
              const t = animAt(f, CUES[i], 22, "enter");
              const len = R;
              return (
                <line
                  key={`ln${i}`}
                  x1={cx}
                  y1={cy}
                  x2={p.x}
                  y2={p.y}
                  stroke="rgba(201,162,39,0.42)"
                  strokeWidth={1.6}
                  strokeDasharray={len}
                  strokeDashoffset={len * (1 - t)}
                />
              );
            })}

            {pts.map((p, i) => {
              const t = animAt(f, CUES[i], 20, "snap");
              return (
                <g key={`nd${i}`} opacity={t}>
                  <circle cx={p.x} cy={p.y} r={26 * (1.5 - 0.5 * t)} fill="rgba(201,162,39,0.14)" />
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={11}
                    fill={C.goldBright}
                  />
                </g>
              );
            })}
          </svg>

          {pts.map((p, i) => {
            const t = animAt(f, CUES[i] + 3, 24, "enter");
            const lx = cx + p.c * LR;
            const ly = cy + p.s * LR;
            const align = p.c > 0.2 ? "left" : p.c < -0.2 ? "right" : "center";
            const tx = align === "left" ? "0%" : align === "right" ? "-100%" : "-50%";
            return (
              <div
                key={`lb${i}`}
                style={{
                  position: "absolute",
                  left: lx,
                  top: ly,
                  transform: `translate(${tx}, -50%)`,
                  textAlign: align as React.CSSProperties["textAlign"],
                  whiteSpace: "nowrap",
                }}
              >
                <span style={{ display: "block", overflow: "hidden", paddingBottom: 10 }}>
                  <span
                    style={{
                      display: "block",
                      ...maskUp(t),
                      fontFamily: SANS,
                      fontSize: 40,
                      fontWeight: 700,
                      letterSpacing: -0.6,
                      color: C.text,
                    }}
                  >
                    {NAMES[i]}
                  </span>
                </span>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
      <LightSweep at={186} dur={50} />
    </Shot>
  );
};

/* 15 — 62.75-68.65  "not to blindly trust a vendor or just find the cheapest option" */
export const NotBlindTrust: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const rows = [
    { t: "Blindly trust a vendor", at: 74 },
    { t: "Just find the cheapest", at: 143 },
  ];
  return (
    <Shot dur={dur} enter="fade">
      <Stack gap={38}>
        <TrackLabel delay={4} color={C.textFaint}>
          The goal is not to
        </TrackLabel>
        <div style={{ width: 940, display: "flex", flexDirection: "column", gap: 22 }}>
          {rows.map((r, i) => {
            const p = animAt(f, r.at, 24, "enter");
            const strike = animAt(f, r.at + 14, 26, "enter");
            return (
              <div key={i} style={{ position: "relative", opacity: p }}>
                <div
                  style={{
                    padding: "26px 34px",
                    borderRadius: 14,
                    background: "rgba(255,255,255,0.022)",
                    border: `1px solid ${C.lineSoft}`,
                    fontFamily: SANS,
                    fontSize: 42,
                    fontWeight: 600,
                    color: C.textDim,
                    textAlign: "center",
                  }}
                >
                  {r.t}
                </div>
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: 26,
                    right: 26,
                    height: 4,
                    borderRadius: 2,
                    background: C.red,
                    ...maskRight(strike),
                  }}
                />
              </div>
            );
          })}
        </div>
      </Stack>
    </Shot>
  );
};

/* 16 — 68.65-74.10  "to help you understand what you're actually looking at before deciding" */
export const UnderstandFirst: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const eye = animAt(f, 6, 28, "heavy");
  return (
    <Shot dur={dur} enter="settle">
      <Stack gap={36}>
        <svg width="118" height="118" viewBox="0 0 118 118" style={{ opacity: eye }}>
          <circle cx="54" cy="52" r="32" fill="none" stroke={C.gold} strokeWidth="4" />
          <circle cx="54" cy="52" r="13" fill="none" stroke={C.gold} strokeWidth="3" opacity={0.75} />
          <path d="M78 76 L106 104" stroke={C.gold} strokeWidth="6" strokeLinecap="round" />
        </svg>
        <MaskWords
          words={["Understand", "what", "you're", "looking", "at"]}
          accent={[0]}
          size={68}
          delay={32}
          step={5}
        />
        <div style={{ opacity: animAt(f, 92, 26, "enter") }}>
          <TrackLabel delay={92} color={C.gold}>
            Before making decisions
          </TrackLabel>
        </div>
      </Stack>
    </Shot>
  );
};

/* 17 — 74.10-81.50  "learn the basics, understand testing, read the classrooms and ask questions" */
export const BeforeAnything: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const CUES = [48, 87, 132, 186];
  const NAMES = ["Learn the basics", "Understand testing", "Read the classrooms", "Ask questions"];
  return (
    <Shot dur={dur} enter="rise">
      <Stack gap={40}>
        <TrackLabel delay={4}>Before doing anything</TrackLabel>
        <div style={{ width: 900, display: "flex", flexDirection: "column", gap: 20 }}>
          {NAMES.map((n, i) => {
            const p = animAt(f, CUES[i], 24, "enter");
            const line = animAt(f, CUES[i] + 4, 26, "enter");
            return (
              <div
                key={i}
                style={{
                  opacity: p,
                  transform: transformOrNone([`translateX(${(1 - p) * 30}px)`], p < 1),
                  display: "flex",
                  alignItems: "center",
                  gap: 26,
                  fontFamily: SANS,
                }}
              >
                <span
                  style={{
                    fontSize: 26,
                    fontWeight: 800,
                    color: C.gold,
                    width: 46,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {`0${i + 1}`}
                </span>
                <span style={{ fontSize: 46, fontWeight: 600, color: C.text, letterSpacing: -0.8 }}>{n}</span>
                <span
                  style={{
                    flex: 1,
                    height: 1,
                    background: `linear-gradient(90deg, ${C.line}, transparent)`,
                    ...maskRight(line),
                  }}
                />
              </div>
            );
          })}
        </div>
      </Stack>
    </Shot>
  );
};

/* 18 — 81.50-86.20  "If something doesn't make sense, post about it or reach out to me." */
export const IfNotSense: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const icon = animAt(f, 60, 28, "heavy");
  return (
    <Shot dur={dur} enter="fade">
      <Stack gap={38}>
        <MaskWords words={["If", "it", "doesn't", "make", "sense"]} accent={[]} size={78} delay={24} step={4} />
        <svg width="112" height="98" viewBox="0 0 112 98" style={{ opacity: icon }}>
          <rect x="4" y="6" width="104" height="72" rx="15" fill="rgba(201,162,39,0.08)" stroke={C.gold} strokeWidth="3.5" />
          <path d="M30 34 H82 M30 52 H66" stroke={C.gold} strokeWidth="3.5" strokeLinecap="round" />
          <path d="M36 78 L36 94 L54 78" fill={C.gold} />
        </svg>
        <div style={{ opacity: animAt(f, 78, 26, "enter") }}>
          <TrackLabel delay={78} color={C.gold}>
            Post about it or reach out
          </TrackLabel>
        </div>
      </Stack>
    </Shot>
  );
};

/* 19 — 86.20-89.85  "You are not expected to know everything when you first join." */
export const NotExpected: React.FC<{ dur: number }> = ({ dur }) => (
  <Shot dur={dur} enter="settle">
    <Stack gap={26}>
      <MaskWords words={["Nobody", "starts", "knowing"]} accent={[2]} size={104} delay={12} step={5} />
      <TrackLabel delay={54} color={C.textFaint}>
        You are not expected to
      </TrackLabel>
    </Stack>
  </Shot>
);

/* 20 — 89.85-93.10  "That's the whole reason this community exists." */
export const WhyExists: React.FC<{ dur: number }> = ({ dur }) => (
  <Shot dur={dur} enter="fade">
    <Stack gap={30}>
      <MaskStatement
        lines={[
          <>
            That is the whole reason this
          </>,
          <>
            <span style={{ color: C.goldBright }}>community exists</span>.
          </>,
        ]}
        size={72}
        delay={6}
        step={9}
      />
    </Stack>
  </Shot>
);

/* 21 — 93.10-98.88  "for education and research discussion — not medical advice" */
export const EndCard: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const mark = animAt(f, 126, 30, "enter");
  return (
    <Shot dur={dur} enter="fade">
      <Stack gap={44}>
        <MaskStatement
          lines={[
            <>
              For <span style={{ color: C.goldBright }}>education and research</span>
            </>,
            <>discussion only.</>,
          ]}
          size={72}
          delay={20}
          step={10}
        />
        <div style={{ opacity: mark, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
          <div style={{ fontFamily: SERIF, fontSize: 48, color: C.red, letterSpacing: -0.6 }}>
            Not medical advice.
          </div>
          <WipeRule delay={132} width={320} />
          <div
            style={{
              fontFamily: SANS,
              fontSize: 30,
              letterSpacing: 8,
              textTransform: "uppercase",
              color: C.goldBright,
              fontWeight: 700,
            }}
          >
            Peps by Dave
          </div>
        </div>
      </Stack>
      <LightSweep at={140} dur={56} />
    </Shot>
  );
};
