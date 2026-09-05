import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Shot, Stack } from "../../../shared/components/Shot";
import { Chip, MaskStatement, MaskWords, TrackLabel, WipeRule } from "../../../shared/components/Kinetic";
import { LightSweep } from "../../../shared/components/StageV2";
import { CoaSheet } from "../../../shared/components/Graphics";
import { animAt, maskRight, maskUp, transformOrNone } from "../../../shared/motion";
import { C, SANS, SERIF } from "../../../shared/theme";

const COA_ROWS = [
  { label: "Laboratory", value: "Independent" },
  { label: "Test date", value: "2026-08-11" },
  { label: "Purity", value: "99.1%" },
  { label: "Quantity", value: "10.2 mg" },
];

/* 13 — 53.00-55.80  "There are also different types of testing." */
export const TypesOfTesting: React.FC<{ dur: number }> = ({ dur }) => (
  <Shot dur={dur} enter="rise">
    <Stack gap={24}>
      <TrackLabel delay={4} color={C.textFaint}>
        And there are
      </TrackLabel>
      <MaskWords words={["Different", "types", "of", "testing"]} accent={[0]} size={92} delay={8} step={5} />
    </Stack>
  </Shot>
);

/**
 * Shared layout for the three test-type scenes, so they read as one series
 * rather than three unrelated shots. The numeral and rule stay put; only the
 * name and definition change.
 */
const TestType: React.FC<{
  n: string;
  name: string;
  def: React.ReactNode;
  defAt: number;
}> = ({ n, name, def, defAt }) => {
  const f = useCurrentFrame();
  const head = animAt(f, 3, 30, "heavy");
  const body = animAt(f, defAt, 30, "enter");
  return (
    <Stack gap={36}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 24, opacity: head }}>
        <span
          style={{
            fontFamily: SANS,
            fontSize: 40,
            fontWeight: 800,
            color: C.gold,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {n}
        </span>
        <span style={{ display: "inline-block", overflow: "hidden", paddingBottom: 22 }}>
          <span
            style={{
              display: "inline-block",
              ...maskUp(head),
              fontFamily: SANS,
              fontSize: 104,
              fontWeight: 800,
              letterSpacing: -3,
              color: C.text,
              lineHeight: 1,
            }}
          >
            {name}
          </span>
        </span>
      </div>
      <WipeRule delay={20} width={520} />
      <div style={{ opacity: body, maxWidth: 1280, textAlign: "center" }}>
        <span style={{ fontFamily: SANS, fontSize: 42, fontWeight: 500, color: C.textDim, lineHeight: 1.34 }}>
          {def}
        </span>
      </div>
    </Stack>
  );
};

/* 14 — 55.80-61.00  identity */
export const IdentityTesting: React.FC<{ dur: number }> = ({ dur }) => (
  <Shot dur={dur} enter="fade">
    <TestType
      n="01"
      name="Identity"
      defAt={99}
      def={
        <>
          Is the compound actually <span style={{ color: C.goldBright }}>what it claims to be</span>?
        </>
      }
    />
  </Shot>
);

/* 15 — 61.00-67.00  purity */
export const PurityTesting: React.FC<{ dur: number }> = ({ dur }) => (
  <Shot dur={dur} enter="fade">
    <TestType
      n="02"
      name="Purity"
      defAt={99}
      def={
        <>
          How clean is the sample, and how much{" "}
          <span style={{ color: C.goldBright }}>unwanted material</span> is present?
        </>
      }
    />
  </Shot>
);

/* 16 — 67.00-71.40  quantity */
export const QuantityTesting: React.FC<{ dur: number }> = ({ dur }) => (
  <Shot dur={dur} enter="fade">
    <TestType
      n="03"
      name="Quantity"
      defAt={96}
      def={
        <>
          How much of the actual compound is{" "}
          <span style={{ color: C.goldBright }}>inside the vial</span>?
        </>
      }
    />
  </Shot>
);

/* 17 — 71.40-77.60  "there can also be testing for sterility or endotoxins" */
export const SterilityEndotoxins: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  return (
    <Shot dur={dur} enter="rise">
      <Stack gap={42}>
        <TrackLabel delay={4} color={C.textFaint}>
          And depending on the situation
        </TrackLabel>
        <div style={{ display: "flex", gap: 24 }}>
          <Chip label="Sterility" p={animAt(f, 108, 24, "snap")} tone="gold" size={52} />
          <Chip label="Endotoxins" p={animAt(f, 135, 24, "snap")} tone="gold" size={52} />
        </div>
      </Stack>
    </Shot>
  );
};

/* 18 — 77.60-81.00  "One thing I really want you to remember is this." */
export const RememberThis: React.FC<{ dur: number }> = ({ dur }) => (
  <Shot dur={dur} enter="settle">
    <Stack gap={22}>
      <TrackLabel delay={4} color={C.gold}>
        One thing to remember
      </TrackLabel>
      <MaskWords words={["Remember", "this"]} accent={[]} size={112} delay={10} step={6} />
    </Stack>
  </Shot>
);

/* 19 — 81.00-85.00  "Seeing 99% purity does not tell you everything." */
export const NinetyNine: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const num = animAt(f, 9, 32, "heavy");
  const cap = animAt(f, 60, 30, "enter");
  return (
    <Shot dur={dur} enter="fade">
      <Stack gap={30}>
        <div
          style={{
            opacity: num,
            transform: transformOrNone([`scale(${1.06 + (1 - 1.06) * num})`], num < 1),
            fontFamily: SANS,
            fontSize: 210,
            fontWeight: 800,
            letterSpacing: -8,
            color: C.goldBright,
            lineHeight: 1,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          99%
        </div>
        <div style={{ opacity: cap }}>
          <MaskWords words={["Does", "not", "tell", "you", "everything"]} accent={[]} size={58} delay={60} step={4} color={C.textDim} />
        </div>
      </Stack>
    </Shot>
  );
};

/* 20 — 85.00-91.30  "high purity but a different amount than the label claims" */
export const HighPurityWrongAmount: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const a = animAt(f, 33, 28, "enter");
  const b = animAt(f, 108, 28, "enter");
  const c = animAt(f, 141, 28, "enter");
  return (
    <Shot dur={dur} enter="fade">
      <Stack gap={34}>
        <div style={{ display: "flex", gap: 30, alignItems: "stretch" }}>
          <div
            style={{
              opacity: a,
              width: 430,
              padding: "34px 30px",
              borderRadius: 16,
              border: `1.5px solid rgba(62,158,106,0.5)`,
              background: "rgba(62,158,106,0.07)",
              textAlign: "center",
              fontFamily: SANS,
            }}
          >
            <div style={{ fontSize: 22, letterSpacing: 3, textTransform: "uppercase", color: C.green }}>Purity</div>
            <div style={{ fontSize: 56, fontWeight: 800, color: C.text, marginTop: 12, letterSpacing: -1.4 }}>
              Very high
            </div>
          </div>
          <div
            style={{
              opacity: b,
              width: 430,
              padding: "34px 30px",
              borderRadius: 16,
              border: `1.5px solid rgba(180,72,60,0.5)`,
              background: "rgba(180,72,60,0.07)",
              textAlign: "center",
              fontFamily: SANS,
            }}
          >
            <div style={{ fontSize: 22, letterSpacing: 3, textTransform: "uppercase", color: C.red }}>Quantity</div>
            <div style={{ fontSize: 56, fontWeight: 800, color: C.text, marginTop: 12, letterSpacing: -1.4 }}>
              Different
            </div>
          </div>
        </div>
        <div style={{ opacity: c }}>
          <TrackLabel delay={141} color={C.red}>
            Than what the label claims
          </TrackLabel>
        </div>
      </Stack>
    </Shot>
  );
};

/* 21 — 91.30-99.40  "check the laboratory, test date, sample information, testing method, purity, quantity" */
export const WhatToCheck: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const CUES = [69, 96, 126, 162, 189, 216];
  const NAMES = ["Laboratory", "Test date", "Sample information", "Testing method", "Purity", "Quantity"];
  const sheet = animAt(f, 6, 30, "heavy");
  return (
    <Shot dur={dur} enter="pushL">
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 80 }}>
        <div style={{ opacity: sheet }}>
          <CoaSheet w={430} rows={COA_ROWS} reveal={1} />
        </div>
        <div style={{ width: 700, display: "flex", flexDirection: "column", gap: 18 }}>
          <TrackLabel delay={10}>When you look at a COA</TrackLabel>
          {NAMES.map((n, i) => {
            const p = animAt(f, CUES[i], 22, "enter");
            return (
              <div
                key={i}
                style={{
                  opacity: p,
                  transform: transformOrNone([`translateX(${(1 - p) * 24}px)`], p < 1),
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                  fontFamily: SANS,
                  borderLeft: `3px solid ${C.gold}`,
                  paddingLeft: 20,
                }}
              >
                <span style={{ fontSize: 38, fontWeight: 600, color: C.text, letterSpacing: -0.6 }}>{n}</span>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </Shot>
  );
};

/* 22 — 99.40-102.40  "and whether the report can actually be verified" */
export const CanItBeVerified: React.FC<{ dur: number }> = ({ dur }) => (
  <Shot dur={dur} enter="settle">
    <Stack gap={26}>
      <TrackLabel delay={4} color={C.textFaint}>
        And whether it can
      </TrackLabel>
      <MaskWords words={["Actually", "be", "verified"]} accent={[2]} size={104} delay={63} step={5} />
    </Stack>
  </Shot>
);

/* 23 — 102.40-106.60  "stop looking at a COA as just a piece of paper" */
export const NotJustPaper: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const b = animAt(f, 75, 30, "enter");
  return (
    <Shot dur={dur} enter="fade">
      <Stack gap={30}>
        <TrackLabel delay={4} color={C.textFaint}>
          Stop treating it as
        </TrackLabel>
        <div style={{ opacity: b }}>
          <MaskWords words={["Just", "a", "piece", "of", "paper"]} accent={[]} size={80} delay={75} step={4} color={C.textDim} />
        </div>
      </Stack>
    </Shot>
  );
};

/* 24 — 106.60-111.60  "start understanding what the results actually mean" */
export const EndCard: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const mark = animAt(f, 96, 30, "enter");
  return (
    <Shot dur={dur} enter="fade">
      <Stack gap={44}>
        <MaskStatement
          lines={[
            <>Start understanding what the</>,
            <>
              <span style={{ color: C.goldBright }}>results actually mean</span>.
            </>,
          ]}
          size={72}
          delay={36}
          step={10}
        />
        <div style={{ opacity: mark, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          {/* Standing series disclaimer — not spoken in this script. */}
          <div style={{ fontFamily: SERIF, fontSize: 38, color: C.red, letterSpacing: -0.4 }}>
            Education and research discussion only. Not medical advice.
          </div>
          <WipeRule delay={104} width={320} />
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
      <LightSweep at={110} dur={56} />
    </Shot>
  );
};
