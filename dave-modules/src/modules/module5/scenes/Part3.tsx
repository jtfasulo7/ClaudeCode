import React from "react";
import { AbsoluteFill } from "remotion";
import { Scene, useIn, useRamp } from "../../../shared/components/Scene";
import { Eyebrow, KeyWords, Rule, Statement } from "../../../shared/components/Type";
import { Lock, Panel } from "../../../shared/components/Graphics";
import { C, SANS, SERIF } from "../../../shared/theme";

const Center: React.FC<{ children: React.ReactNode; gap?: number }> = ({ children, gap = 28 }) => (
  <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap }}>
    {children}
  </AbsoluteFill>
);

/* 23 — 106.90-110.70  "before communicating or sending payment" */
export const BeforePayment: React.FC<{ dur: number }> = ({ dur }) => (
  <Scene dur={dur} enter="rise">
    <Center gap={26}>
      <Eyebrow color={C.textFaint}>Before you do anything else</Eyebrow>
      <KeyWords words={["Before", "sending", "payment"]} accent={[2]} size={96} delay={4} />
    </Center>
  </Scene>
);

/* 24 — 110.70-115.70  "gray market transactions can have limited consumer protection" */
export const LimitedProtection: React.FC<{ dur: number }> = ({ dur }) => {
  const a = useIn(39, 22);
  const b = useIn(90, 22);
  return (
    <Scene dur={dur} enter="fade">
      <Center gap={40}>
        <Eyebrow delay={4}>Remember</Eyebrow>
        <div style={{ opacity: a }}>
          <KeyWords words={["Gray", "market", "transactions"]} accent={[0, 1]} size={72} />
        </div>
        <div
          style={{
            opacity: b,
            padding: "26px 44px",
            borderRadius: 14,
            border: `1.5px solid rgba(180,72,60,0.5)`,
            background: "rgba(180,72,60,0.08)",
            fontFamily: SANS,
            fontSize: 44,
            fontWeight: 700,
            color: C.red,
          }}
        >
          Limited consumer protection
        </div>
      </Center>
    </Scene>
  );
};

/* 25 — 115.70-119.00  "something labeled 'research use only'" */
export const ResearchUseOnly: React.FC<{ dur: number }> = ({ dur }) => {
  const label = useIn(27, 22);
  return (
    <Scene dur={dur} enter="scale">
      <Center gap={36}>
        <Eyebrow delay={4}>Something labelled</Eyebrow>
        <div
          style={{
            opacity: label,
            padding: "34px 56px",
            borderRadius: 10,
            border: `3px solid ${C.gold}`,
            background: "rgba(201,162,39,0.08)",
            fontFamily: SANS,
            fontSize: 66,
            fontWeight: 800,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: C.goldBright,
          }}
        >
          Research use only
        </div>
      </Center>
    </Scene>
  );
};

/* 26 — 119.00-123.40  "has not automatically been evaluated or approved for human use" */
export const NotEvaluated: React.FC<{ dur: number }> = ({ dur }) => {
  const rows = [useRamp(6, 30), useRamp(66, 90)];
  const names = ["Evaluated", "Approved for human use"];
  return (
    <Scene dur={dur} enter="fade">
      <Center gap={34}>
        <Eyebrow delay={2} color={C.red}>
          Has not automatically been
        </Eyebrow>
        <div style={{ width: 860, display: "flex", flexDirection: "column", gap: 20 }}>
          {names.map((n, i) => (
            <div key={i} style={{ position: "relative" }}>
              <div
                style={{
                  padding: "24px 32px",
                  borderRadius: 12,
                  background: "rgba(255,255,255,0.022)",
                  border: `1px solid ${C.lineSoft}`,
                  fontFamily: SANS,
                  fontSize: 42,
                  fontWeight: 600,
                  color: C.textDim,
                  textAlign: "center",
                }}
              >
                {n}
              </div>
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: 24,
                  height: 4,
                  width: `calc(${rows[i] * 100}% - 48px)`,
                  background: C.red,
                  borderRadius: 2,
                }}
              />
            </div>
          ))}
        </div>
      </Center>
    </Scene>
  );
};

/* 27 — 123.40-128.00  "Once you unlock the trusted vendor classroom through engagement" */
export const UnlockCompare: React.FC<{ dur: number }> = ({ dur }) => {
  const open = useRamp(18, 46);
  const cap = useIn(50, 20);
  return (
    <Scene dur={dur} enter="fade">
      <Center gap={38}>
        <Lock open={open} size={150} />
        <div style={{ opacity: cap }}>
          <KeyWords words={["Trusted", "vendor", "classroom"]} accent={[0]} size={56} />
        </div>
      </Center>
    </Scene>
  );
};

/* 28 — 128.00-133.30  "compare vendor information, pricing and available COAs" */
export const CompareVendors: React.FC<{ dur: number }> = ({ dur }) => {
  const cols = [useIn(39, 20), useIn(81, 20), useIn(105, 20)];
  const names = ["Vendor information", "Pricing", "Available COAs"];
  return (
    <Scene dur={dur} enter="rise">
      <Center gap={42}>
        <Eyebrow delay={4}>You'll be able to compare</Eyebrow>
        <div style={{ display: "flex", gap: 26 }}>
          {names.map((n, i) => (
            <div key={i} style={{ opacity: cols[i] }}>
              <Panel width={380} pad={36} glow={i === 2}>
                <div style={{ fontFamily: SANS, fontSize: 22, letterSpacing: 2.6, color: C.textFaint, textTransform: "uppercase" }}>
                  {`0${i + 1}`}
                </div>
                <div
                  style={{
                    fontFamily: SANS,
                    fontSize: 40,
                    fontWeight: 700,
                    color: C.text,
                    marginTop: 14,
                    letterSpacing: -0.8,
                    lineHeight: 1.2,
                  }}
                >
                  {n}
                </div>
              </Panel>
            </div>
          ))}
        </div>
      </Center>
    </Scene>
  );
};

/* 29 — 133.30-137.40  "Use Peps by Dave to research smarter" */
export const ResearchSmarter: React.FC<{ dur: number }> = ({ dur }) => (
  <Scene dur={dur} enter="scale">
    <Center gap={26}>
      <Eyebrow color={C.textFaint}>Use this to</Eyebrow>
      <KeyWords words={["Research", "smarter"]} accent={[1]} size={116} delay={6} />
    </Center>
  </Scene>
);

/* 30 — 137.40-140.90  "ask better questions" */
export const BetterQuestions: React.FC<{ dur: number }> = ({ dur }) => (
  <Scene dur={dur} enter="rise">
    <Center>
      <KeyWords words={["Ask", "better", "questions"]} accent={[1]} size={106} delay={4} />
    </Center>
  </Scene>
);

/* 31 — 140.90-143.05  "become more informed, not less cautious" */
export const InformedNotLess: React.FC<{ dur: number }> = ({ dur }) => {
  const b = useIn(14, 20);
  return (
    <Scene dur={dur} enter="fade">
      <Center gap={26}>
        <KeyWords words={["More", "informed"]} accent={[1]} size={92} delay={2} />
        <div style={{ opacity: b }}>
          <KeyWords words={["Not", "less", "cautious"]} accent={[]} size={54} color={C.textDim} />
        </div>
      </Center>
    </Scene>
  );
};

/* 32 — 143.05-146.08  "And as always, nothing here is medical advice." */
export const EndCard: React.FC<{ dur: number }> = ({ dur }) => {
  const line = useIn(4, 22);
  const mark = useIn(28, 22);
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
          <Rule delay={30} width={300} />
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
