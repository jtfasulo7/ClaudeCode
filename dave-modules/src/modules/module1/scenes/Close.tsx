import React from "react";
import { AbsoluteFill } from "remotion";
import { Scene, useIn, useRamp } from "../../../shared/components/Scene";
import { Eyebrow, KeyWords, Rule, Statement } from "../../../shared/components/Type";
import { C, SANS, SERIF } from "../../../shared/theme";

/* 23 — 98.55-101.00  "The goal isn't to tell you what to buy" */
export const NotWhatToBuy: React.FC<{ dur: number }> = ({ dur }) => {
  const strike = useRamp(20, 40);
  return (
    <Scene dur={dur} enter="fade">
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 26 }}>
        <Eyebrow color={C.textFaint}>The goal is not</Eyebrow>
        <div style={{ position: "relative" }}>
          <KeyWords words={["Telling", "you", "what", "to", "buy"]} size={92} delay={2} color={C.textDim} />
          <div
            style={{
              position: "absolute",
              top: "52%",
              left: -14,
              height: 5,
              width: `calc(${strike * 100}% + 28px)`,
              background: C.red,
              borderRadius: 3,
              opacity: 0.9,
            }}
          />
        </div>
      </AbsoluteFill>
    </Scene>
  );
};

/* 24 — 101.00-103.60  "it's to help you understand what you're looking at" */
export const Understand: React.FC<{ dur: number }> = ({ dur }) => {
  const eye = useIn(2, 20);
  return (
    <Scene dur={dur} enter="rise">
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 34 }}>
        <svg width="112" height="112" viewBox="0 0 112 112" style={{ opacity: eye }}>
          <circle cx="52" cy="50" r="30" fill="none" stroke={C.gold} strokeWidth="4" />
          <circle cx="52" cy="50" r="12" fill="none" stroke={C.gold} strokeWidth="3" opacity={0.7} />
          <path d="M74 72 L100 98" stroke={C.gold} strokeWidth="6" strokeLinecap="round" />
        </svg>
        <KeyWords words={["Understand", "what", "you", "see"]} accent={[0]} size={88} delay={8} />
      </AbsoluteFill>
    </Scene>
  );
};

/* 25 — 103.60-105.75  "compare the information for yourself" */
export const Compare: React.FC<{ dur: number }> = ({ dur }) => {
  const l = useIn(2, 18);
  const r = useIn(8, 18);
  return (
    <Scene dur={dur} enter="scale">
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 42 }}>
        <div style={{ display: "flex", gap: 40, alignItems: "center" }}>
          {[l, r].map((p, i) => (
            <div
              key={i}
              style={{
                width: 224,
                height: 288,
                borderRadius: 8,
                background: "linear-gradient(165deg,#EEEBE3,#D9D5CA)",
                opacity: p,
                transform: `translateY(${(1 - p) * 20}px) rotate(${i === 0 ? -3 : 3}deg)`,
                boxShadow: "0 20px 46px rgba(0,0,0,0.5)",
                padding: 20,
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <div style={{ height: 8, width: "58%", background: "#9A8A4F", borderRadius: 2, opacity: 0.7 }} />
              {[0.9, 0.72, 0.84, 0.6].map((w, j) => (
                <div key={j} style={{ height: 6, width: `${w * 100}%`, background: "#C6C0B0", borderRadius: 2 }} />
              ))}
            </div>
          ))}
        </div>
        <KeyWords words={["Compare", "it", "yourself"]} accent={[0]} size={72} delay={16} />
      </AbsoluteFill>
    </Scene>
  );
};

/* 26 — 105.75-108.30  "make more informed research decisions" */
export const InformedDecisions: React.FC<{ dur: number }> = ({ dur }) => (
  <Scene dur={dur} enter="rise">
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 26 }}>
      <Eyebrow color={C.textFaint}>So you can make</Eyebrow>
      <KeyWords words={["Informed", "research", "decisions"]} accent={[0]} size={98} delay={3} />
      <Rule delay={22} width={520} />
    </AbsoluteFill>
  </Scene>
);

/* 27 — 108.30-113.60  "Peps by Dave is for education and research discussion only." */
export const EducationOnly: React.FC<{ dur: number }> = ({ dur }) => {
  const s = useIn(60, 22);
  return (
    <Scene dur={dur} enter="fade">
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 40 }}>
        <Eyebrow delay={10}>And remember</Eyebrow>
        <Statement delay={22} size={72}>
          Peps by Dave is for <span style={{ color: C.goldBright }}>education and research discussion</span> only.
        </Statement>
        <div style={{ opacity: s }}>
          <Rule delay={62} width={420} />
        </div>
      </AbsoluteFill>
    </Scene>
  );
};

/* 28 — 113.60-115.76  "Nothing here is medical advice." */
export const EndCard: React.FC<{ dur: number }> = ({ dur }) => {
  const line = useIn(4, 22);
  const mark = useIn(24, 22);
  return (
    <Scene dur={dur} enter="fade">
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 40 }}>
        <div
          style={{
            opacity: line,
            transform: `translateY(${(1 - line) * 16}px)`,
            fontFamily: SERIF,
            fontSize: 76,
            fontWeight: 600,
            color: C.text,
            letterSpacing: -1,
          }}
        >
          Nothing here is <span style={{ color: C.red }}>medical advice</span>.
        </div>
        <div style={{ opacity: mark, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          <Rule delay={26} width={300} />
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
      </AbsoluteFill>
    </Scene>
  );
};
