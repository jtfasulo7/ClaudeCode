import React from "react";
import { AbsoluteFill } from "remotion";
import { Scene, useIn, useRamp } from "../../../shared/components/Scene";
import { Eyebrow, KeyWords, Rule, Statement } from "../../../shared/components/Type";
import { CoaSheet, Panel } from "../../../shared/components/Graphics";
import { PeptideChain } from "../../../shared/components/Diagrams";
import { C, SANS, SERIF } from "../../../shared/theme";

const Center: React.FC<{ children: React.ReactNode; gap?: number }> = ({ children, gap = 28 }) => (
  <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap }}>
    {children}
  </AbsoluteFill>
);

const COA_ROWS = [
  { label: "Identity", value: "Confirmed" },
  { label: "Purity", value: "99.1%" },
  { label: "Tested amount", value: "10.2 mg" },
  { label: "Batch", value: "A-2291" },
];

/* 1 — 0.00-6.20  "how to get the most value out of this community" */
export const TitleOpen: React.FC<{ dur: number }> = ({ dur }) => {
  const t = useIn(8, 26);
  const sub = useIn(30, 20);
  return (
    <Scene dur={dur} enter="hold">
      <Center gap={22}>
        <Eyebrow delay={2}>Peps by Dave · Module 03</Eyebrow>
        <div
          style={{
            opacity: t,
            fontFamily: SERIF,
            fontWeight: 600,
            fontSize: 128,
            letterSpacing: -3,
            color: C.text,
            lineHeight: 1.06,
            textAlign: "center",
          }}
        >
          Getting the most from
          <br />
          <span style={{ color: C.goldBright }}>this community</span>
        </div>
        <Rule delay={34} width={420} />
        <div
          style={{
            opacity: sub,
            fontFamily: SANS,
            fontSize: 28,
            letterSpacing: 5,
            textTransform: "uppercase",
            color: C.textDim,
            marginTop: 8,
          }}
        >
          How to use it properly
        </div>
      </Center>
    </Scene>
  );
};

/* 2 — 6.20-11.15  "joining, looking at one vendor page and leaving" */
export const BiggestMistake: React.FC<{ dur: number }> = ({ dur }) => {
  const steps = [useRamp(51, 71), useRamp(84, 104), useRamp(123, 143)];
  const cross = useIn(136, 18);
  const labels = ["Join", "Read one page", "Leave"];

  return (
    <Scene dur={dur} enter="rise">
      <Center gap={52}>
        <Eyebrow delay={4} color={C.red}>
          The biggest mistake
        </Eyebrow>
        <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
          {labels.map((l, i) => (
            <React.Fragment key={i}>
              {i > 0 && (
                <svg width="52" height="20" viewBox="0 0 52 20" style={{ opacity: steps[i] }}>
                  <path d="M2 10 H44 M36 4 L46 10 L36 16" fill="none" stroke={C.textFaint} strokeWidth="2.4" strokeLinecap="round" />
                </svg>
              )}
              <div
                style={{
                  opacity: steps[i],
                  padding: "26px 38px",
                  borderRadius: 14,
                  border: `1.5px solid ${i === 2 ? C.red : C.line}`,
                  background: i === 2 ? "rgba(180,72,60,0.10)" : "rgba(255,255,255,0.022)",
                  fontFamily: SANS,
                  fontSize: 40,
                  fontWeight: 700,
                  color: i === 2 ? C.red : C.textDim,
                }}
              >
                {l}
              </div>
            </React.Fragment>
          ))}
        </div>
        <div style={{ opacity: cross }}>
          <KeyWords words={["Don't", "do", "that"]} size={56} color={C.textDim} />
        </div>
      </Center>
    </Scene>
  );
};

/* 3 — 11.15-12.95  "There's a lot more here." */
export const LotMoreHere: React.FC<{ dur: number }> = ({ dur }) => (
  <Scene dur={dur} enter="scale">
    <Center>
      <KeyWords words={["There's", "a", "lot", "more", "here"]} accent={[2, 3]} size={106} delay={2} />
    </Center>
  </Scene>
);

/* 4 — 12.95-15.35  "Start with the educational classrooms." */
export const StartClassrooms: React.FC<{ dur: number }> = ({ dur }) => {
  const card = useIn(4, 20);
  return (
    <Scene dur={dur} enter="rise">
      <Center gap={38}>
        <Eyebrow delay={2}>Start here</Eyebrow>
        <div style={{ opacity: card }}>
          <Panel width={880} pad={0} glow>
            <div
              style={{
                height: 118,
                background: `linear-gradient(120deg, rgba(201,162,39,0.16), ${C.panel2})`,
                borderRadius: "16px 16px 0 0",
                display: "flex",
                alignItems: "center",
                paddingLeft: 44,
              }}
            >
              <span style={{ fontFamily: SANS, fontSize: 24, letterSpacing: 3.4, color: C.gold, textTransform: "uppercase" }}>
                Classrooms
              </span>
            </div>
            <div style={{ padding: "32px 44px 40px", fontFamily: SANS }}>
              <div style={{ fontSize: 58, fontWeight: 800, color: C.text, letterSpacing: -1.4 }}>Educational</div>
              <div style={{ fontSize: 26, color: C.textDim, marginTop: 10 }}>
                The foundation everything else builds on
              </div>
            </div>
          </Panel>
        </div>
      </Center>
    </Scene>
  );
};

/* 5 — 15.35-17.90  "Learn what these compounds actually are." */
export const LearnCompounds: React.FC<{ dur: number }> = ({ dur }) => {
  const chain = useRamp(6, 52);
  return (
    <Scene dur={dur} enter="fade">
      <Center gap={44}>
        <Eyebrow delay={2}>Learn</Eyebrow>
        <PeptideChain n={7} p={chain} w={920} />
        <KeyWords words={["What", "these", "compounds", "are"]} accent={[2]} size={62} delay={16} />
      </Center>
    </Scene>
  );
};

/* 6 — 17.90-19.70  "Understand terminology." */
export const Terminology: React.FC<{ dur: number }> = ({ dur }) => {
  const card = useIn(4, 18);
  return (
    <Scene dur={dur} enter="scale">
      <Center gap={34}>
        <div style={{ opacity: card }}>
          <Panel width={760} pad={40}>
            <div style={{ fontFamily: SANS, fontSize: 22, letterSpacing: 3, color: C.textFaint, textTransform: "uppercase" }}>
              Term
            </div>
            <div style={{ fontFamily: SANS, fontSize: 62, fontWeight: 800, color: C.goldBright, marginTop: 10, letterSpacing: -1.4 }}>
              Third-party tested
            </div>
            <div style={{ height: 1, background: C.line, margin: "26px 0" }} />
            <div style={{ fontFamily: SANS, fontSize: 28, color: C.textDim, lineHeight: 1.4 }}>
              Analysed by a lab independent of the seller
            </div>
          </Panel>
        </div>
        <KeyWords words={["Understand", "terminology"]} accent={[1]} size={52} delay={20} />
      </Center>
    </Scene>
  );
};

/* 7 — 19.70-22.40  "Learn how third-party testing works." */
export const ThirdPartyTesting: React.FC<{ dur: number }> = ({ dur }) => {
  const steps = [useRamp(6, 26), useRamp(24, 44), useRamp(42, 62)];
  const names = ["Sample", "Independent lab", "Result"];
  return (
    <Scene dur={dur} enter="rise">
      <Center gap={48}>
        <Eyebrow delay={2}>How third-party testing works</Eyebrow>
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          {names.map((n, i) => (
            <React.Fragment key={i}>
              {i > 0 && (
                <svg width="56" height="20" viewBox="0 0 56 20" style={{ opacity: steps[i] }}>
                  <path d="M2 10 H48 M40 4 L50 10 L40 16" fill="none" stroke={C.goldDim} strokeWidth="2.4" strokeLinecap="round" />
                </svg>
              )}
              <div
                style={{
                  opacity: steps[i],
                  width: 300,
                  padding: "34px 24px",
                  borderRadius: 14,
                  border: `1.5px solid ${i === 1 ? C.gold : C.line}`,
                  background: i === 1 ? "rgba(201,162,39,0.09)" : "rgba(255,255,255,0.022)",
                  textAlign: "center",
                  fontFamily: SANS,
                  fontSize: 34,
                  fontWeight: 700,
                  color: i === 1 ? C.text : C.textDim,
                }}
              >
                {n}
              </div>
            </React.Fragment>
          ))}
        </div>
      </Center>
    </Scene>
  );
};

/* 8 — 22.40-24.70  "Learn how to read a COA." */
export const ReadCOA: React.FC<{ dur: number }> = ({ dur }) => {
  const sheet = useIn(4, 20);
  return (
    <Scene dur={dur} enter="scale">
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 76 }}>
        <div style={{ opacity: sheet }}>
          <CoaSheet w={400} rows={COA_ROWS} reveal={1} active={1} />
        </div>
        <div style={{ width: 600 }}>
          <Eyebrow delay={10}>Learn to read</Eyebrow>
          <div style={{ marginTop: 16 }}>
            <KeyWords words={["A", "COA"]} accent={[1]} size={116} delay={14} align="left" />
          </div>
        </div>
      </AbsoluteFill>
    </Scene>
  );
};

/* 9 — 24.70-28.55  "the difference between marketing claims and actual evidence" */
export const ClaimsVsEvidence: React.FC<{ dur: number }> = ({ dur }) => {
  const a = useIn(42, 20);
  const b = useIn(87, 20);
  return (
    <Scene dur={dur} enter="fade">
      <Center gap={44}>
        <Eyebrow delay={4}>Know the difference</Eyebrow>
        <div style={{ display: "flex", gap: 40 }}>
          <div
            style={{
              opacity: a,
              width: 480,
              padding: "40px 34px",
              borderRadius: 16,
              border: `1.5px solid rgba(180,72,60,0.45)`,
              background: "rgba(180,72,60,0.07)",
              fontFamily: SANS,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 22, letterSpacing: 3, color: C.red, textTransform: "uppercase" }}>Claim</div>
            <div style={{ fontSize: 46, fontWeight: 800, color: C.text, marginTop: 14, letterSpacing: -1 }}>
              Marketing
            </div>
          </div>
          <div
            style={{
              opacity: b,
              width: 480,
              padding: "40px 34px",
              borderRadius: 16,
              border: `1.5px solid rgba(62,158,106,0.5)`,
              background: "rgba(62,158,106,0.07)",
              fontFamily: SANS,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 22, letterSpacing: 3, color: C.green, textTransform: "uppercase" }}>Evidence</div>
            <div style={{ fontSize: 46, fontWeight: 800, color: C.text, marginTop: 14, letterSpacing: -1 }}>
              Actual data
            </div>
          </div>
        </div>
      </Center>
    </Scene>
  );
};

/* 10 — 28.55-35.60  "Once you understand those basics, the conversations will make more sense." */
export const BasicsMakeSense: React.FC<{ dur: number }> = ({ dur }) => {
  const chips = [useIn(6, 16), useIn(20, 16), useIn(34, 16), useIn(48, 16)];
  const line = useRamp(74, 104);
  const pay = useIn(139, 24);
  const names = ["Compounds", "Terminology", "Testing", "COAs"];

  return (
    <Scene dur={dur} enter="fade">
      <Center gap={46}>
        <Eyebrow delay={2}>Once these are in place</Eyebrow>
        <div style={{ display: "flex", gap: 20 }}>
          {names.map((n, i) => (
            <div
              key={i}
              style={{
                opacity: chips[i],
                padding: "20px 30px",
                borderRadius: 999,
                border: `1.5px solid ${C.gold}`,
                background: "rgba(201,162,39,0.09)",
                fontFamily: SANS,
                fontSize: 30,
                fontWeight: 600,
                color: C.text,
              }}
            >
              {n}
            </div>
          ))}
        </div>
        <div style={{ height: 2, width: 760 * line, background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)` }} />
        <div style={{ opacity: pay }}>
          <Statement size={62} delay={140}>
            The conversations inside the community start to <span style={{ color: C.goldBright }}>make sense</span>.
          </Statement>
        </div>
      </Center>
    </Scene>
  );
};
