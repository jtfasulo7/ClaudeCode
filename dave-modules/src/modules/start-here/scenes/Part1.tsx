import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Shot, Stack } from "../../../shared/components/Shot";
import { Chip, MaskStatement, MaskWords, TrackLabel, WipeRule } from "../../../shared/components/Kinetic";
import { LightSweep } from "../../../shared/components/StageV2";
import { animAt, maskRight, maskUp, stagger, transformOrNone } from "../../../shared/motion";
import { C, SANS, SERIF } from "../../../shared/theme";

/* ------------------------------------------------------------ chain glyph */

/**
 * Amino-acid chain. Beads land on the new `snap` curve one after another and
 * the bonds wipe in behind them, so the structure assembles rather than fades.
 */
export const Chain: React.FC<{ n?: number; delay: number; step?: number; w?: number; scale?: number }> = ({
  n = 7,
  delay,
  step = 5,
  w = 980,
  scale = 1,
}) => {
  const f = useCurrentFrame();
  const r = 26 * scale;
  const gap = (w - r * 2) / (n - 1);
  const h = 150 * scale;
  const y = h / 2;
  const amp = 20 * scale;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      {Array.from({ length: n - 1 }, (_, i) => {
        const p = animAt(f, stagger(delay, i, step) + 2, 14, "enter");
        const x1 = r + i * gap;
        const y1 = y + (i % 2 === 0 ? -amp : amp);
        const x2 = r + (i + 1) * gap;
        const y2 = y + (i % 2 === 0 ? amp : -amp);
        const len = Math.hypot(x2 - x1, y2 - y1);
        return (
          <line
            key={`l${i}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={C.goldDim}
            strokeWidth={3 * scale}
            strokeDasharray={len}
            strokeDashoffset={len * (1 - p)}
          />
        );
      })}
      {Array.from({ length: n }, (_, i) => {
        const p = animAt(f, stagger(delay, i, step), 18, "snap");
        const cx = r + i * gap;
        const cy = y + (i % 2 === 0 ? -amp : amp);
        return (
          <g key={`c${i}`} opacity={p}>
            <circle cx={cx} cy={cy} r={r * (1.25 - 0.25 * p)} fill="rgba(201,162,39,0.14)" />
            <circle
              cx={cx}
              cy={cy}
              r={r * (1.25 - 0.25 * p)}
              fill="none"
              stroke={C.gold}
              strokeWidth={2.5 * scale}
            />
          </g>
        );
      })}
    </svg>
  );
};

/* 1 — 0.00-4.70  "If you're completely new to peptides, this is where you should start." */
export const TitleOpen: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const t = animAt(f, 10, 34, "heavy");
  const sub = animAt(f, 64, 30, "enter");
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
              fontSize: 178,
              letterSpacing: -5,
              color: C.text,
              lineHeight: 1,
            }}
          >
            Start <span style={{ color: C.goldBright }}>here</span>
          </span>
        </span>
        <WipeRule delay={44} width={460} />
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
          New to peptides
        </div>
      </Stack>
      <LightSweep at={22} dur={54} />
    </Shot>
  );
};

/* 2 — 4.70-8.70  "A peptide is basically a short chain of amino acids" */
export const WhatIsPeptide: React.FC<{ dur: number }> = ({ dur }) => (
  <Shot dur={dur} enter="fade">
    <Stack gap={48}>
      <TrackLabel delay={4} color={C.textFaint}>
        A peptide is
      </TrackLabel>
      <Chain n={7} delay={14} step={6} w={1000} />
      <MaskWords
        words={["A", "short", "chain", "of", "amino", "acids"]}
        accent={[1, 2]}
        size={58}
        delay={57}
        step={4}
      />
    </Stack>
  </Shot>
);

/* 3 — 8.70-12.00  "the same building blocks that make up proteins in your body" */
export const BuildingBlocks: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const grow = animAt(f, 42, 34, "heavy");
  return (
    <Shot dur={dur} enter="fade">
      <Stack gap={44}>
        <MaskWords words={["The", "same", "building", "blocks"]} accent={[2, 3]} size={78} delay={3} step={5} />
        {/* Chain scales up into a protein mass — small units becoming a whole. */}
        <div
          style={{
            display: "flex",
            gap: 22,
            opacity: grow,
            transform: transformOrNone([`scale(${0.86 + 0.14 * grow})`], grow < 1),
          }}
        >
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div
              key={i}
              style={{
                width: 46,
                height: 46 + (i % 3) * 30,
                borderRadius: 23,
                background: "linear-gradient(180deg, rgba(233,198,92,0.42), rgba(201,162,39,0.16))",
                border: `2px solid ${C.goldBright}`,
              }}
            />
          ))}
        </div>
        <TrackLabel delay={52} color={C.gold}>
          That make up proteins in your body
        </TrackLabel>
      </Stack>
    </Shot>
  );
};

/* 4 — 12.00-17.20  "many different peptides, researched for completely different purposes" */
export const ManyPeptides: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const rows = [0, 1, 2].map((i) => animAt(f, stagger(9, i, 12), 22, "enter"));
  const cap = animAt(f, 72, 28, "enter");
  return (
    <Shot dur={dur} enter="rise">
      <Stack gap={40}>
        <MaskWords words={["Many", "different", "peptides"]} accent={[1]} size={72} delay={2} step={5} />
        <div style={{ display: "flex", flexDirection: "column", gap: 30, alignItems: "center" }}>
          {[5, 8, 6].map((n, i) => (
            <div key={i} style={{ opacity: rows[i] }}>
              <Chain n={n} delay={stagger(9, i, 12)} step={3} w={760} scale={0.62} />
            </div>
          ))}
        </div>
        <div style={{ opacity: cap }}>
          <TrackLabel delay={72} color={C.gold}>
            Researched for completely different purposes
          </TrackLabel>
        </div>
      </Stack>
    </Shot>
  );
};

/* 5 — 17.20-21.10  "just hearing the word peptide doesn't automatically tell you" */
export const WordDoesntTell: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const word = animAt(f, 4, 30, "heavy");
  const strike = animAt(f, 54, 26, "enter");
  return (
    <Shot dur={dur} enter="settle">
      <Stack gap={34}>
        <TrackLabel delay={2} color={C.textFaint}>
          The word alone
        </TrackLabel>
        <div style={{ position: "relative" }}>
          <span style={{ display: "block", overflow: "hidden", paddingBottom: 26 }}>
            <span
              style={{
                display: "block",
                ...maskUp(word),
                fontFamily: SANS,
                fontWeight: 800,
                fontSize: 148,
                letterSpacing: -4,
                textTransform: "uppercase",
                color: C.text,
                lineHeight: 1,
              }}
            >
              Peptide
            </span>
          </span>
          <div
            style={{
              position: "absolute",
              top: "44%",
              left: -10,
              right: -10,
              height: 5,
              borderRadius: 3,
              background: C.red,
              ...maskRight(strike),
            }}
          />
        </div>
        <TrackLabel delay={62} color={C.red}>
          Tells you nothing on its own
        </TrackLabel>
      </Stack>
    </Shot>
  );
};

/* 6 — 21.10-25.05  "whether something is effective, safe, approved or right for someone" */
export const FourUnknowns: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const cues = [3, 27, 45, 69];
  const names = ["Effective", "Safe", "Approved", "Right for someone"];
  return (
    <Shot dur={dur} enter="fade">
      <Stack gap={44}>
        <TrackLabel delay={2} color={C.textFaint}>
          It does not tell you whether it is
        </TrackLabel>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center", maxWidth: 1600 }}>
          {names.map((n, i) => (
            <Chip key={i} label={n} p={animAt(f, cues[i], 22, "snap")} tone="neutral" size={48} />
          ))}
        </div>
        <div style={{ opacity: animAt(f, 84, 24, "enter") }}>
          <span style={{ fontFamily: SERIF, fontSize: 92, color: C.goldBright, lineHeight: 1 }}>?</span>
        </div>
      </Stack>
    </Shot>
  );
};

/* 7 — 25.05-27.10  "you'll probably hear people talk about" */
export const ChannelsIntro: React.FC<{ dur: number }> = ({ dur }) => (
  <Shot dur={dur} enter="rise" len={20}>
    <Stack gap={22}>
      <TrackLabel delay={2} color={C.textFaint}>
        You will hear people talk about
      </TrackLabel>
      <MaskWords words={["Where", "it", "comes", "from"]} accent={[]} size={92} delay={6} step={4} />
    </Stack>
  </Shot>
);

/* 8 — 27.10-32.20  "clinics, pharmacies, research suppliers and the gray market" */
export const FourChannels: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const cues = [6, 30, 63, 105];
  const items = [
    { n: "Clinics", tone: "neutral" as const },
    { n: "Pharmacies", tone: "neutral" as const },
    { n: "Research suppliers", tone: "neutral" as const },
    { n: "The gray market", tone: "gold" as const },
  ];
  return (
    <Shot dur={dur} enter="fade">
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", gap: 22, alignItems: "stretch" }}>
          {items.map((it, i) => {
            const p = animAt(f, cues[i], 26, "enter");
            const gold = it.tone === "gold";
            return (
              <div
                key={i}
                style={{
                  opacity: p,
                  transform: transformOrNone([`translateY(${(1 - p) * 40}px)`], p < 1),
                  width: 372,
                  minHeight: 344,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  padding: "34px 30px",
                  borderRadius: 16,
                  border: `1.5px solid ${gold ? C.gold : C.line}`,
                  background: gold
                    ? "linear-gradient(180deg, rgba(201,162,39,0.14), rgba(201,162,39,0.04))"
                    : "rgba(255,255,255,0.022)",
                  boxShadow: gold ? "0 0 60px rgba(201,162,39,0.13)" : "none",
                  fontFamily: SANS,
                }}
              >
                <div
                  style={{
                    fontSize: 20,
                    letterSpacing: 2.6,
                    textTransform: "uppercase",
                    color: gold ? C.gold : C.textFaint,
                  }}
                >
                  {`0${i + 1}`}
                </div>
                <div
                  style={{
                    fontSize: 48,
                    fontWeight: 800,
                    color: gold ? C.text : C.textDim,
                    marginTop: 14,
                    letterSpacing: -1.2,
                    lineHeight: 1.14,
                  }}
                >
                  {it.n}
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
      <LightSweep at={112} dur={44} />
    </Shot>
  );
};

/* 9 — 32.20-38.55  "products sold outside the traditional prescription and pharmacy system" */
export const GrayMarketDef: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const box = animAt(f, 6, 30, "heavy");
  const link = animAt(f, 62, 30, "enter");
  const node = animAt(f, 84, 28, "snap");
  return (
    <Shot dur={dur} enter="fade">
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              opacity: box,
              width: 620,
              height: 330,
              borderRadius: 18,
              border: `1.5px solid ${C.line}`,
              background: "rgba(255,255,255,0.018)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 14,
              fontFamily: SANS,
            }}
          >
            <div style={{ fontSize: 21, letterSpacing: 3.4, color: C.textFaint, textTransform: "uppercase" }}>
              Regulated
            </div>
            <div style={{ fontSize: 44, fontWeight: 700, color: C.textDim, textAlign: "center", lineHeight: 1.2 }}>
              Prescription &amp;<br />pharmacy system
            </div>
          </div>

          <svg width="220" height="60" viewBox="0 0 220 60">
            <g style={{ ...maskRight(link) }}>
              <path d="M4 30 H206" stroke={C.gold} strokeWidth="2.5" strokeDasharray="9 9" strokeLinecap="round" />
              <path d="M194 22 L206 30 L194 38" fill="none" stroke={C.gold} strokeWidth="2.5" />
            </g>
          </svg>

          <div
            style={{
              opacity: node,
              transform: transformOrNone([`scale(${1.08 + (1 - 1.08) * node})`], node < 1),
              width: 430,
              height: 330,
              borderRadius: 18,
              border: `1.5px solid ${C.gold}`,
              background: "linear-gradient(160deg, rgba(201,162,39,0.15), rgba(201,162,39,0.03))",
              boxShadow: "0 0 70px rgba(201,162,39,0.16)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              fontFamily: SANS,
            }}
          >
            <div style={{ fontSize: 21, letterSpacing: 3.4, color: C.gold, textTransform: "uppercase" }}>
              Outside it
            </div>
            <div style={{ fontSize: 58, fontWeight: 800, color: C.text, letterSpacing: -1.5 }}>Gray market</div>
          </div>
        </div>
      </AbsoluteFill>
    </Shot>
  );
};

/* 10 — 38.55-41.95  "this is where beginners need to be careful" */
export const BeCareful: React.FC<{ dur: number }> = ({ dur }) => (
  <Shot dur={dur} enter="settle">
    <Stack gap={28}>
      <TrackLabel delay={2} color={C.red}>
        This is where
      </TrackLabel>
      <MaskWords words={["Beginners", "get", "caught"]} accent={[]} size={112} delay={6} step={5} />
    </Stack>
  </Shot>
);

/* 11 — 41.95-46.30  "A professional website, expensive packaging or a nice looking vial" */
export const LooksProveNothing: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const cues = [20, 59, 107];
  const names = ["A professional website", "Expensive packaging", "A nice looking vial"];
  return (
    <Shot dur={dur} enter="pushL">
      <Stack gap={36}>
        <TrackLabel delay={4} color={C.textFaint}>
          None of this is evidence
        </TrackLabel>
        <div style={{ width: 960, display: "flex", flexDirection: "column", gap: 20 }}>
          {names.map((n, i) => {
            const p = animAt(f, cues[i], 24, "enter");
            return (
              <div
                key={i}
                style={{
                  opacity: p,
                  transform: transformOrNone([`translateX(${(1 - p) * 34}px)`], p < 1),
                  padding: "26px 34px",
                  borderRadius: 14,
                  background: "rgba(255,255,255,0.022)",
                  border: `1px solid ${C.lineSoft}`,
                  fontFamily: SANS,
                  fontSize: 40,
                  fontWeight: 600,
                  color: C.textDim,
                }}
              >
                {n}
              </div>
            );
          })}
        </div>
      </Stack>
    </Shot>
  );
};
