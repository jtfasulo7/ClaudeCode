import React from "react";
import { AbsoluteFill } from "remotion";
import { Scene, useIn, useRamp } from "../../../shared/components/Scene";
import { Eyebrow, KeyWords, Rule, Statement } from "../../../shared/components/Type";
import { CheckRow, Panel } from "../../../shared/components/Graphics";
import { C, SANS, SERIF } from "../../../shared/theme";

const Center: React.FC<{ children: React.ReactNode; gap?: number }> = ({ children, gap = 28 }) => (
  <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap }}>
    {children}
  </AbsoluteFill>
);

/* 12 — 43.45-46.05  "And don't feel like you need to rush." */
export const DontRush: React.FC<{ dur: number }> = ({ dur }) => (
  <Scene dur={dur} enter="scale">
    <Center gap={24}>
      <Eyebrow color={C.textFaint}>And</Eyebrow>
      <KeyWords words={["No", "need", "to", "rush"]} accent={[3]} size={104} delay={3} />
    </Center>
  </Scene>
);

/* 13 — 46.05-51.85  "Take your time, ask questions, compare the information, check what's available" */
export const TakeYourTime: React.FC<{ dur: number }> = ({ dur }) => {
  const c = [useRamp(2, 22), useRamp(32, 52), useRamp(77, 97), useRamp(122, 142)];
  const names = ["Take your time", "Ask questions", "Compare the information", "Check what's available"];
  return (
    <Scene dur={dur} enter="rise">
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 940, display: "flex", flexDirection: "column", gap: 34 }}>
          {names.map((n, i) => (
            <CheckRow key={i} text={n} p={c[i]} tone="gold" />
          ))}
        </div>
      </AbsoluteFill>
    </Scene>
  );
};

/* 14 — 51.85-55.55  "understand what you're looking at before making any decision" */
export const BeforeDeciding: React.FC<{ dur: number }> = ({ dur }) => {
  const a = useIn(14, 20);
  const b = useIn(56, 20);
  return (
    <Scene dur={dur} enter="fade">
      <Center gap={30}>
        <div style={{ opacity: a }}>
          <KeyWords words={["Understand", "what", "you're", "seeing"]} accent={[0]} size={78} />
        </div>
        <div style={{ opacity: b }}>
          <Eyebrow delay={56} color={C.gold}>
            Before making any decision
          </Eyebrow>
        </div>
      </Center>
    </Scene>
  );
};

/* 15 — 55.55-58.90  "I also recommend starting cautiously" */
export const StartCautiously: React.FC<{ dur: number }> = ({ dur }) => (
  <Scene dur={dur} enter="scale">
    <Center gap={26}>
      <Eyebrow color={C.textFaint}>I recommend</Eyebrow>
      <KeyWords words={["Starting", "cautiously"]} accent={[1]} size={110} delay={40} />
    </Center>
  </Scene>
);

/* 16 — 58.90-62.60  "rather than a large amount at risk with someone you've never dealt with" */
export const DontRiskLarge: React.FC<{ dur: number }> = ({ dur }) => {
  const a = useIn(6, 20);
  const b = useIn(63, 20);
  return (
    <Scene dur={dur} enter="fade">
      <Center gap={40}>
        <Eyebrow delay={2}>Rather than</Eyebrow>
        <div style={{ display: "flex", gap: 34, alignItems: "stretch" }}>
          <div
            style={{
              opacity: a,
              width: 470,
              padding: "36px 32px",
              borderRadius: 16,
              border: `1.5px solid rgba(180,72,60,0.5)`,
              background: "rgba(180,72,60,0.08)",
              textAlign: "center",
              fontFamily: SANS,
            }}
          >
            <div style={{ fontSize: 22, letterSpacing: 3, color: C.red, textTransform: "uppercase" }}>Avoid</div>
            <div style={{ fontSize: 42, fontWeight: 800, color: C.text, marginTop: 12, letterSpacing: -1, lineHeight: 1.18 }}>
              A large amount
              <br />
              at risk
            </div>
          </div>
          <div
            style={{
              opacity: b,
              width: 470,
              padding: "36px 32px",
              borderRadius: 16,
              border: `1.5px solid ${C.line}`,
              background: "rgba(255,255,255,0.022)",
              textAlign: "center",
              fontFamily: SANS,
            }}
          >
            <div style={{ fontSize: 22, letterSpacing: 3, color: C.textFaint, textTransform: "uppercase" }}>
              Especially with
            </div>
            <div style={{ fontSize: 42, fontWeight: 800, color: C.textDim, marginTop: 12, letterSpacing: -1, lineHeight: 1.18 }}>
              Someone new
              <br />
              to you
            </div>
          </div>
        </div>
      </Center>
    </Scene>
  );
};

/* 17 — 62.60-65.60  "And remember, I'm here to help." */
export const ImHereToHelp: React.FC<{ dur: number }> = ({ dur }) => {
  const icon = useIn(30, 20);
  const line = useIn(45, 22);
  return (
    <Scene dur={dur} enter="fade">
      <Center gap={34}>
        <svg width="108" height="94" viewBox="0 0 108 94" style={{ opacity: icon }}>
          <rect x="4" y="6" width="100" height="70" rx="14" fill="rgba(201,162,39,0.08)" stroke={C.gold} strokeWidth="3.5" />
          <path d="M28 34 H80 M28 50 H64" stroke={C.gold} strokeWidth="3.5" strokeLinecap="round" />
          <path d="M34 76 L34 90 L50 76" fill={C.gold} />
        </svg>
        <div style={{ opacity: line }}>
          <KeyWords words={["I'm", "here", "to", "help"]} accent={[3]} size={96} delay={45} />
        </div>
      </Center>
    </Scene>
  );
};

/* 18 — 65.60-75.00  "if something is confusing, a price sheet, a COA, or you don't know what it means" */
export const IfConfusing: React.FC<{ dur: number }> = ({ dur }) => {
  const c = [useIn(57, 18), useIn(114, 18), useIn(174, 18), useIn(228, 18)];
  const names = [
    "Something in the classroom is confusing",
    "You don't understand a price sheet",
    "You're unsure about a COA",
    "You don't know what something means",
  ];
  return (
    <Scene dur={dur} enter="fade">
      <Center gap={38}>
        <Eyebrow delay={6}>If</Eyebrow>
        <div style={{ width: 1000, display: "flex", flexDirection: "column", gap: 20 }}>
          {names.map((n, i) => (
            <div
              key={i}
              style={{
                opacity: c[i],
                padding: "24px 32px",
                borderRadius: 12,
                background: "rgba(201,162,39,0.07)",
                border: `1px solid rgba(201,162,39,0.26)`,
                fontFamily: SANS,
                fontSize: 34,
                fontWeight: 600,
                color: C.text,
              }}
            >
              {n}
            </div>
          ))}
        </div>
      </Center>
    </Scene>
  );
};

/* 19 — 75.00-76.60  "send me a message." */
export const SendMeAMessage: React.FC<{ dur: number }> = ({ dur }) => {
  const box = useIn(3, 18);
  return (
    <Scene dur={dur} enter="scale">
      <Center gap={30}>
        <div style={{ opacity: box }}>
          <Panel width={860} pad={0} glow>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "30px 34px",
                fontFamily: SANS,
              }}
            >
              <span style={{ fontSize: 34, color: C.textFaint }}>Message Dave…</span>
              <span
                style={{
                  padding: "14px 30px",
                  borderRadius: 999,
                  background: C.gold,
                  color: C.bg,
                  fontSize: 26,
                  fontWeight: 800,
                  letterSpacing: 1,
                }}
              >
                Send
              </span>
            </div>
          </Panel>
        </div>
      </Center>
    </Scene>
  );
};

/* 20 — 76.60-79.60  "The whole point of Peps by Dave" */
export const WholePoint: React.FC<{ dur: number }> = ({ dur }) => (
  <Scene dur={dur} enter="rise">
    <Center gap={26}>
      <Eyebrow color={C.textFaint}>The whole point of</Eyebrow>
      <KeyWords words={["Peps", "by", "Dave"]} accent={[0, 1, 2]} size={116} delay={15} />
    </Center>
  </Scene>
);

/* 21 — 79.60-83.20  "help you become more educated and more confident" */
export const EducatedConfident: React.FC<{ dur: number }> = ({ dur }) => {
  const a = useIn(6, 20);
  const b = useIn(45, 20);
  return (
    <Scene dur={dur} enter="fade">
      <Center gap={30}>
        <div style={{ opacity: a }}>
          <KeyWords words={["More", "educated"]} accent={[1]} size={92} />
        </div>
        <div style={{ opacity: b }}>
          <KeyWords words={["More", "confident"]} accent={[1]} size={92} />
        </div>
      </Center>
    </Scene>
  );
};

/* 22 — 83.20-87.12  "And as always, nothing here is medical advice." */
export const EndCard: React.FC<{ dur: number }> = ({ dur }) => {
  const line = useIn(66, 22);
  const mark = useIn(88, 22);
  return (
    <Scene dur={dur} enter="fade">
      <Center gap={40}>
        <div
          style={{
            opacity: line,
            fontFamily: SERIF,
            fontSize: 76,
            fontWeight: 600,
            color: C.text,
            letterSpacing: -1,
            textAlign: "center",
          }}
        >
          Nothing here is <span style={{ color: C.red }}>medical advice</span>.
        </div>
        <div style={{ opacity: mark, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          <Rule delay={90} width={300} />
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
      </Center>
    </Scene>
  );
};
