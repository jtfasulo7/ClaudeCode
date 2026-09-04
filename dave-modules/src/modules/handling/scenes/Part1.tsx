import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Shot, Stack } from "../../../shared/components/Shot";
import { Chip, MaskWords, TrackLabel, WipeRule } from "../../../shared/components/Kinetic";
import { LightSweep } from "../../../shared/components/StageV2";
import { animAt, maskRight, maskUp, transformOrNone } from "../../../shared/motion";
import { C, SANS, SERIF } from "../../../shared/theme";

/* --------------------------------------------------------------- the vial */

/**
 * Sealed vial, shown either as dry cake or in solution.
 *
 * COMPLIANCE: this is the product as it sits on a shelf — never in use. No
 * needle, no syringe, no hands, no quantities. The script defines what
 * reconstitution *means*; it does not instruct, and neither does this.
 */
export const HandlingVial: React.FC<{
  h?: number;
  /** 0 = dry cake at the bottom, 1 = fully in solution. */
  solution?: number;
  tone?: "gold" | "red" | "neutral";
  p?: number;
  particles?: number;
  cracked?: number;
}> = ({ h = 300, solution = 0, tone = "gold", p = 1, particles = 0, cracked = 0 }) => {
  const w = h * 0.42;
  const bodyTop = h * 0.17;
  const bodyH = h * 0.74;
  const edge = tone === "red" ? C.red : tone === "neutral" ? C.line : C.gold;
  const cake = 1 - solution;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ opacity: p }}>
      {/* cap */}
      <rect x={w * 0.24} y={2} width={w * 0.52} height={h * 0.09} rx={3} fill={tone === "red" ? C.red : C.goldDim} />
      <rect x={w * 0.15} y={h * 0.09} width={w * 0.7} height={h * 0.07} rx={2} fill={edge} />

      {/* body */}
      <rect
        x={1.5}
        y={bodyTop}
        width={w - 3}
        height={bodyH}
        rx={w * 0.15}
        fill="rgba(255,255,255,0.04)"
        stroke={edge}
        strokeWidth={2}
      />

      {/* liquid */}
      {solution > 0.01 && (
        <rect
          x={3}
          y={bodyTop + bodyH - bodyH * 0.62 * solution}
          width={w - 6}
          height={bodyH * 0.62 * solution}
          rx={w * 0.13}
          fill="rgba(201,162,39,0.20)"
        />
      )}

      {/* dry cake — a compacted disc sitting on the base */}
      {cake > 0.01 && (
        <ellipse
          cx={w / 2}
          cy={bodyTop + bodyH - h * 0.07}
          rx={(w - 12) / 2}
          ry={h * 0.045 * cake}
          fill="rgba(233,198,92,0.42)"
          opacity={cake}
        />
      )}

      {/* suspended particles — a red flag, not decoration */}
      {particles > 0.01 &&
        [0.28, 0.44, 0.6, 0.36, 0.52].map((fy, i) => (
          <circle
            key={i}
            cx={w * (0.32 + (i % 3) * 0.19)}
            cy={bodyTop + bodyH * fy}
            r={2.6}
            fill={C.red}
            opacity={particles}
          />
        ))}

      {/* crack */}
      {cracked > 0.01 && (
        <path
          d={`M ${w * 0.26} ${bodyTop + bodyH * 0.3} l ${w * 0.16} ${h * 0.06} l ${-w * 0.09} ${h * 0.05} l ${w * 0.2} ${h * 0.08}`}
          fill="none"
          stroke={C.red}
          strokeWidth={2.4}
          strokeLinecap="round"
          opacity={cracked}
        />
      )}
    </svg>
  );
};

/* 1 — 0.00-4.30  "The next thing every beginner should understand is basic peptide handling." */
export const TitleOpen: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const t = animAt(f, 10, 34, "heavy");
  const sub = animAt(f, 72, 30, "enter");
  return (
    <Shot dur={dur} enter="hold">
      <Stack gap={26}>
        <TrackLabel delay={4}>Peps by Dave</TrackLabel>
        <span style={{ display: "block", overflow: "hidden", paddingBottom: 34 }}>
          <span
            style={{
              display: "block",
              ...maskUp(t),
              fontFamily: SERIF,
              fontWeight: 600,
              fontSize: 168,
              letterSpacing: -5,
              color: C.text,
              lineHeight: 1,
            }}
          >
            <span style={{ color: C.goldBright }}>Handling</span> basics
          </span>
        </span>
        <WipeRule delay={46} width={460} />
        <div
          style={{
            opacity: sub,
            fontFamily: SANS,
            fontSize: 28,
            letterSpacing: 5,
            textTransform: "uppercase",
            color: C.textDim,
            marginTop: 6,
          }}
        >
          Storage · sterility · what you can't see
        </div>
      </Stack>
      <LightSweep at={24} dur={54} />
    </Shot>
  );
};

/* 2 — 4.30-7.40  "even if a product was manufactured correctly" */
export const EvenIfMade: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const tick = animAt(f, 45, 26, "enter");
  return (
    <Shot dur={dur} enter="fade">
      <Stack gap={34}>
        <TrackLabel delay={4} color={C.textFaint}>
          Even if
        </TrackLabel>
        <MaskWords words={["It", "was", "made", "correctly"]} accent={[3]} size={86} delay={8} step={5} />
        <svg width="58" height="58" viewBox="0 0 58 58" style={{ opacity: tick }}>
          <circle cx="29" cy="29" r="26" fill="none" stroke={C.green} strokeWidth="2.4" opacity={0.4} />
          <path
            d="M16 29.5 L25 38.5 L42 19"
            fill="none"
            stroke={C.green}
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={44}
            strokeDashoffset={44 * (1 - tick)}
          />
        </svg>
      </Stack>
    </Shot>
  );
};

/* 3 — 7.40-12.20  "poor handling, storage or contamination can still cause problems" */
export const PoorHandling: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const cues = [3, 30, 48];
  const names = ["Poor handling", "Storage", "Contamination"];
  const out = animAt(f, 87, 28, "enter");
  return (
    <Shot dur={dur} enter="rise">
      <Stack gap={44}>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center", maxWidth: 1600 }}>
          {names.map((n, i) => (
            <Chip key={i} label={n} p={animAt(f, cues[i], 24, "snap")} tone="red" size={44} />
          ))}
        </div>
        <div style={{ opacity: out }}>
          <MaskWords words={["Can", "still", "cause", "problems"]} accent={[3]} size={64} delay={87} step={4} />
        </div>
      </Stack>
    </Shot>
  );
};

/* 4 — 12.20-17.40  "a dry, freeze-dried material called lyophilized powder" */
export const Lyophilized: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const vial = animAt(f, 8, 30, "heavy");
  const term = animAt(f, 105, 30, "enter");
  return (
    <Shot dur={dur} enter="fade">
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 90 }}>
        <HandlingVial h={520} solution={0} p={vial} />
        <div style={{ width: 720 }}>
          <TrackLabel delay={48} color={C.textFaint}>
            A dry, freeze-dried material
          </TrackLabel>
          <div style={{ marginTop: 20, opacity: term }}>
            <span style={{ display: "block", overflow: "hidden", paddingBottom: 20 }}>
              <span
                style={{
                  display: "block",
                  ...maskUp(term),
                  fontFamily: SANS,
                  fontSize: 76,
                  fontWeight: 800,
                  letterSpacing: -2,
                  color: C.goldBright,
                  lineHeight: 1.05,
                }}
              >
                Lyophilized
                <br />
                powder
              </span>
            </span>
          </div>
        </div>
      </AbsoluteFill>
    </Shot>
  );
};

/* 5 — 17.40-21.20  "You might also hear people refer to it as a puck." */
export const ThePuck: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const word = animAt(f, 69, 26, "enter");
  return (
    <Shot dur={dur} enter="settle">
      <Stack gap={30}>
        <TrackLabel delay={4} color={C.textFaint}>
          You will also hear it called
        </TrackLabel>
        <div style={{ opacity: word }}>
          <MaskWords words={["A", "puck"]} accent={[1]} size={132} delay={69} step={5} />
        </div>
        <HandlingVial h={340} solution={0} p={animAt(f, 10, 26, "enter")} />
      </Stack>
    </Shot>
  );
};

/* 6 — 21.20-28.00  "Reconstitution means adding a sterile diluent to turn dry material into liquid"
 *
 * Strictly a terminology card. The script defines the word; it does not teach a
 * procedure, and neither does this — the vial simply changes state.
 */
export const Reconstitution: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const term = animAt(f, 3, 32, "heavy");
  const dil = animAt(f, 75, 28, "enter");
  const sol = animAt(f, 147, 44, "enter");
  return (
    <Shot dur={dur} enter="fade">
      <Stack gap={40}>
        <div style={{ opacity: term }}>
          <TrackLabel delay={3} color={C.gold} size={24}>
            Terminology
          </TrackLabel>
        </div>
        <MaskWords words={["Reconstitution"]} accent={[0]} size={116} delay={10} step={5} />

        <div style={{ display: "flex", alignItems: "center", gap: 56 }}>
          <HandlingVial h={310} solution={0} p={term} />
          <svg width="120" height="30" viewBox="0 0 120 30" style={{ ...maskRight(dil) }}>
            <path d="M4 15 H108" stroke={C.gold} strokeWidth="2.5" strokeDasharray="9 9" strokeLinecap="round" />
            <path d="M96 8 L108 15 L96 22" fill="none" stroke={C.gold} strokeWidth="2.5" />
          </svg>
          <HandlingVial h={310} solution={sol} p={dil} />
        </div>

        <div style={{ opacity: dil }}>
          <TrackLabel delay={78} color={C.textDim}>
            Dry material into a liquid solution
          </TrackLabel>
        </div>
      </Stack>
    </Shot>
  );
};

/* 7 — 28.00-32.30  "this is where you have to understand that sterility matters" */
export const SterilityMatters: React.FC<{ dur: number }> = ({ dur }) => (
  <Shot dur={dur} enter="settle">
    <Stack gap={28}>
      <TrackLabel delay={4} color={C.textFaint}>
        And this is where
      </TrackLabel>
      <MaskWords words={["Sterility", "matters"]} accent={[0]} size={126} delay={72} step={6} />
    </Stack>
  </Shot>
);

/* 8 — 32.30-38.90  "injectable products carry contamination risks — never treated casually" */
export const ContaminationRisk: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const a = animAt(f, 27, 26, "enter");
  const b = animAt(f, 69, 26, "enter");
  const c = animAt(f, 129, 28, "enter");
  return (
    <Shot dur={dur} enter="fade">
      <Stack gap={38}>
        <div style={{ opacity: a }}>
          <TrackLabel delay={27} color={C.textFaint}>
            Anything involving injectable products
          </TrackLabel>
        </div>
        <div style={{ opacity: b }}>
          <div
            style={{
              padding: "28px 52px",
              borderRadius: 14,
              border: `1.5px solid rgba(180,72,60,0.55)`,
              background: "rgba(180,72,60,0.09)",
              fontFamily: SANS,
              fontSize: 54,
              fontWeight: 700,
              color: C.red,
            }}
          >
            Carries contamination risk
          </div>
        </div>
        <div style={{ opacity: c }}>
          <MaskWords words={["Never", "treat", "it", "casually"]} accent={[0]} size={58} delay={129} step={4} />
        </div>
      </Stack>
    </Shot>
  );
};

/* 9 — 38.90-42.20  "Storage is also extremely important." */
export const StorageImportant: React.FC<{ dur: number }> = ({ dur }) => (
  <Shot dur={dur} enter="rise">
    <Stack gap={26}>
      <MaskWords words={["Storage", "matters", "too"]} accent={[0]} size={108} delay={6} step={5} />
    </Stack>
  </Shot>
);

/* 10 — 42.20-45.60  "Different peptides can have different stability requirements" */
export const StabilityVaries: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const b = animAt(f, 51, 28, "enter");
  return (
    <Shot dur={dur} enter="fade">
      <Stack gap={30}>
        <TrackLabel delay={4} color={C.textFaint}>
          Different peptides
        </TrackLabel>
        <div style={{ opacity: b }}>
          <MaskWords words={["Different", "stability", "requirements"]} accent={[1]} size={74} delay={51} step={5} />
        </div>
      </Stack>
    </Shot>
  );
};

/* 11 — 45.60-52.00  "temperature, light, moisture, time and repeated temperature changes" */
export const FiveFactors: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const CUES = [12, 36, 51, 69, 87];
  const NAMES = ["Temperature", "Light", "Moisture", "Time", "Temperature cycling"];
  return (
    <Shot dur={dur} enter="fade">
      <Stack gap={40}>
        <TrackLabel delay={4}>Things that can affect it</TrackLabel>
        <div style={{ display: "flex", gap: 18, flexWrap: "wrap", justifyContent: "center", maxWidth: 1620 }}>
          {NAMES.map((n, i) => (
            <Chip key={i} label={n} p={animAt(f, CUES[i], 22, "snap")} tone="gold" size={42} />
          ))}
        </div>
      </Stack>
      <LightSweep at={96} dur={46} />
    </Shot>
  );
};
