import React from "react";
import { AbsoluteFill } from "remotion";
import { Scene, useIn, useRamp } from "../../../shared/components/Scene";
import { Eyebrow, KeyWords, Rule } from "../../../shared/components/Type";
import { Vial } from "../../../shared/components/Graphics";
import { C, SANS, SERIF } from "../../../shared/theme";

const Center: React.FC<{ children: React.ReactNode; gap?: number }> = ({ children, gap = 26 }) => (
  <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap }}>
    {children}
  </AbsoluteFill>
);

/* 1 — 0.00-4.05  "Welcome to the gray market section of Peps by Dave." */
export const TitleOpen: React.FC<{ dur: number }> = ({ dur }) => {
  const t = useIn(6, 26);
  const sub = useIn(26, 20);
  return (
    <Scene dur={dur} enter="hold">
      <Center gap={22}>
        <Eyebrow delay={2}>Peps by Dave · Module 01</Eyebrow>
        <div
          style={{
            opacity: t,
            transform: `translateY(${(1 - t) * 26}px)`,
            fontFamily: SERIF,
            fontWeight: 600,
            fontSize: 150,
            letterSpacing: -3,
            color: C.text,
            lineHeight: 1,
          }}
        >
          The <span style={{ color: C.goldBright }}>Gray Market</span>
        </div>
        <Rule delay={30} width={420} />
        <div
          style={{
            opacity: sub,
            fontFamily: SANS,
            fontSize: 30,
            letterSpacing: 5,
            textTransform: "uppercase",
            color: C.textDim,
            marginTop: 8,
          }}
        >
          Education &amp; research discussion
        </div>
      </Center>
    </Scene>
  );
};

/* 2 — 4.05-6.90  "So what exactly is the gray market?" */
export const QuestionScene: React.FC<{ dur: number }> = ({ dur }) => (
  <Scene dur={dur} enter="rise">
    <Center gap={30}>
      <Eyebrow color={C.textFaint}>The question</Eyebrow>
      <KeyWords words={["What", "is", "the", "gray", "market?"]} accent={[3, 4]} size={106} delay={4} />
    </Center>
  </Scene>
);

/* 3 — 6.90-9.90  "it's the peptide market that operates..." */
export const PeptideMarket: React.FC<{ dur: number }> = ({ dur }) => {
  const label = useIn(20, 18);
  return (
    <Scene dur={dur} enter="scale">
      <Center gap={44}>
        <div style={{ display: "flex", gap: 34, alignItems: "flex-end" }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <Vial key={i} h={168 + (i % 2) * 26} fill={0.5 + (i % 3) * 0.13} delay={4 + i * 3} />
          ))}
        </div>
        <div style={{ opacity: label, transform: `translateY(${(1 - label) * 16}px)` }}>
          <KeyWords words={["The", "peptide", "market"]} accent={[1]} size={78} />
        </div>
      </Center>
    </Scene>
  );
};

/* 4 — 9.90-13.30  "...outside the traditional pharmacy and pharmaceutical system." */
export const OutsideSystem: React.FC<{ dur: number }> = ({ dur }) => {
  const box = useIn(2, 20);
  const node = useIn(24, 18);
  const dash = useRamp(30, 52);
  const cap = useIn(40, 16);

  return (
    <Scene dur={dur} enter="fade">
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
          {/* The regulated system */}
          <div
            style={{
              opacity: box,
              transform: `scale(${0.94 + box * 0.06})`,
              width: 620,
              height: 340,
              borderRadius: 18,
              border: `1.5px solid ${C.line}`,
              background: "rgba(255,255,255,0.018)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 16,
              fontFamily: SANS,
            }}
          >
            <div style={{ fontSize: 22, letterSpacing: 3.4, color: C.textFaint, textTransform: "uppercase" }}>
              Regulated
            </div>
            <div style={{ fontSize: 46, fontWeight: 700, color: C.textDim, textAlign: "center", lineHeight: 1.2 }}>
              Pharmacy &amp;<br />pharmaceutical system
            </div>
          </div>

          {/* Dashed link out of the box */}
          <svg width="230" height="60" viewBox="0 0 230 60">
            <path
              d="M4 30 H226"
              stroke={C.gold}
              strokeWidth="2.5"
              strokeDasharray="10 10"
              strokeDashoffset={240 - dash * 240}
              opacity={0.85}
              strokeLinecap="round"
            />
            <path d="M214 22 L226 30 L214 38" fill="none" stroke={C.gold} strokeWidth="2.5" opacity={dash} />
          </svg>

          {/* Outside it */}
          <div
            style={{
              opacity: node,
              transform: `scale(${0.9 + node * 0.1})`,
              width: 420,
              height: 340,
              borderRadius: 18,
              border: `1.5px solid ${C.gold}`,
              background: "linear-gradient(160deg, rgba(201,162,39,0.13), rgba(201,162,39,0.03))",
              boxShadow: "0 0 60px rgba(201,162,39,0.14)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 14,
              fontFamily: SANS,
            }}
          >
            <div style={{ fontSize: 22, letterSpacing: 3.4, color: C.gold, textTransform: "uppercase" }}>
              Outside it
            </div>
            <div style={{ fontSize: 58, fontWeight: 800, color: C.text, letterSpacing: -1.4 }}>Gray market</div>
          </div>
        </div>

        <div style={{ position: "absolute", bottom: 132, opacity: cap }}>
          <KeyWords words={["Operates", "outside", "the", "system"]} accent={[1]} size={54} />
        </div>
      </AbsoluteFill>
    </Scene>
  );
};
