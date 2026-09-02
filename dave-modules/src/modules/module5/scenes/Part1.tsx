import React from "react";
import { AbsoluteFill } from "remotion";
import { Scene, useIn, useRamp } from "../../../shared/components/Scene";
import { Eyebrow, KeyWords, Rule, Statement } from "../../../shared/components/Type";
import { CoaSheet, Panel } from "../../../shared/components/Graphics";
import { ChapterNumber, VerifyBadge } from "../../../shared/components/Diagrams";
import { C, SANS, SERIF } from "../../../shared/theme";

const Center: React.FC<{ children: React.ReactNode; gap?: number }> = ({ children, gap = 28 }) => (
  <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap }}>
    {children}
  </AbsoluteFill>
);

export const COA_ROWS = [
  { label: "Compound", value: "Confirmed" },
  { label: "Batch number", value: "A-2291" },
  { label: "Test date", value: "2026-07-14" },
  { label: "Purity", value: "99.1%" },
];

/** Small document tile for the library grid. */
export const DocTile: React.FC<{ p: number; gold?: boolean }> = ({ p, gold = false }) => (
  <div
    style={{
      width: 148,
      height: 192,
      borderRadius: 6,
      background: gold ? "linear-gradient(165deg,#F6F4EE,#E5DFCF)" : "linear-gradient(165deg,#EEEBE3,#DAD6CB)",
      opacity: p,
      boxShadow: gold ? `0 14px 34px rgba(0,0,0,0.5), 0 0 0 2px ${C.gold}` : "0 14px 34px rgba(0,0,0,0.45)",
      padding: 14,
      display: "flex",
      flexDirection: "column",
      gap: 7,
    }}
  >
    <div style={{ height: 7, width: "62%", background: "#9A8A4F", borderRadius: 2, opacity: 0.7 }} />
    <div style={{ height: 5, width: "88%", background: "#C6C0B0", borderRadius: 2 }} />
    <div style={{ height: 5, width: "74%", background: "#C6C0B0", borderRadius: 2 }} />
    <div style={{ height: 5, width: "80%", background: "#C6C0B0", borderRadius: 2 }} />
    <div style={{ marginTop: "auto", height: 22, width: 22, borderRadius: 11, border: `2px solid ${C.goldDim}` }} />
  </div>
);

/* 1 — 0.00-7.90  "one of the most important videos... mistakes beginners make" */
export const TitleOpen: React.FC<{ dur: number }> = ({ dur }) => {
  const t = useIn(8, 26);
  const sub = useIn(135, 22);
  return (
    <Scene dur={dur} enter="hold">
      <Center gap={22}>
        <Eyebrow delay={2}>Peps by Dave · Module 05</Eyebrow>
        <div
          style={{
            opacity: t,
            fontFamily: SERIF,
            fontWeight: 600,
            fontSize: 138,
            letterSpacing: -3,
            color: C.text,
            lineHeight: 1.04,
            textAlign: "center",
          }}
        >
          Beginner <span style={{ color: C.goldBright }}>mistakes</span>
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
          The ones I see all the time
        </div>
      </Center>
    </Scene>
  );
};

/* 2 — 7.90-13.60  "don't assume cheap means bad or expensive means good" */
export const MistakeOne: React.FC<{ dur: number }> = ({ dur }) => {
  const ch = useIn(2, 20);
  const a = useIn(48, 20);
  const b = useIn(105, 20);
  return (
    <Scene dur={dur} enter="rise">
      <Center gap={44}>
        <ChapterNumber n="01" label="Mistake" p={ch} />
        <div style={{ display: "flex", gap: 34 }}>
          <div
            style={{
              opacity: a,
              width: 460,
              padding: "34px 30px",
              borderRadius: 16,
              border: `1.5px solid ${C.line}`,
              background: "rgba(255,255,255,0.022)",
              textAlign: "center",
              fontFamily: SANS,
            }}
          >
            <div style={{ fontSize: 44, fontWeight: 800, color: C.text, letterSpacing: -1 }}>Cheap</div>
            <div style={{ fontSize: 34, color: C.red, marginTop: 10 }}>≠ bad</div>
          </div>
          <div
            style={{
              opacity: b,
              width: 460,
              padding: "34px 30px",
              borderRadius: 16,
              border: `1.5px solid ${C.line}`,
              background: "rgba(255,255,255,0.022)",
              textAlign: "center",
              fontFamily: SANS,
            }}
          >
            <div style={{ fontSize: 44, fontWeight: 800, color: C.text, letterSpacing: -1 }}>Expensive</div>
            <div style={{ fontSize: 34, color: C.red, marginTop: 10 }}>≠ good</div>
          </div>
        </div>
      </Center>
    </Scene>
  );
};

/* 3 — 13.60-20.10  "3-4x more doesn't mean 3-4x better" */
export const PriceNotQuality: React.FC<{ dur: number }> = ({ dur }) => {
  const a = useIn(21, 20);
  const sign = useIn(78, 18);
  const b = useIn(132, 20);
  return (
    <Scene dur={dur} enter="fade">
      <Center gap={46}>
        <Eyebrow delay={4}>A vendor charging more</Eyebrow>
        <div style={{ display: "flex", alignItems: "center", gap: 56, fontFamily: SANS }}>
          <div style={{ opacity: a, textAlign: "center" }}>
            <div style={{ fontSize: 108, fontWeight: 800, color: C.goldBright, letterSpacing: -3 }}>3–4×</div>
            <div style={{ fontSize: 26, color: C.textDim, letterSpacing: 2.4, textTransform: "uppercase", marginTop: 6 }}>
              the price
            </div>
          </div>
          <div style={{ opacity: sign, fontSize: 100, fontWeight: 300, color: C.red, lineHeight: 1 }}>≠</div>
          <div style={{ opacity: b, textAlign: "center" }}>
            <div style={{ fontSize: 108, fontWeight: 800, color: C.textDim, letterSpacing: -3 }}>3–4×</div>
            <div style={{ fontSize: 26, color: C.textDim, letterSpacing: 2.4, textTransform: "uppercase", marginTop: 6 }}>
              the product
            </div>
          </div>
        </div>
      </Center>
    </Scene>
  );
};

/* 4 — 20.10-25.30  "branding, advertising, packaging or convenience" */
export const PayingFor: React.FC<{ dur: number }> = ({ dur }) => {
  const c = [useIn(42, 18), useIn(72, 18), useIn(96, 18), useIn(120, 18)];
  const names = ["Branding", "Advertising", "Packaging", "Convenience"];
  return (
    <Scene dur={dur} enter="rise">
      <Center gap={42}>
        <Eyebrow delay={4}>Sometimes you're paying for</Eyebrow>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center", maxWidth: 1500 }}>
          {names.map((n, i) => (
            <div
              key={i}
              style={{
                opacity: c[i],
                padding: "26px 40px",
                borderRadius: 999,
                border: `1.5px solid ${C.line}`,
                background: "rgba(255,255,255,0.022)",
                fontFamily: SANS,
                fontSize: 40,
                fontWeight: 600,
                color: C.textDim,
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

/* 5 — 25.30-28.05  "Look at the evidence." */
export const LookAtEvidence: React.FC<{ dur: number }> = ({ dur }) => (
  <Scene dur={dur} enter="scale">
    <Center gap={26}>
      <Eyebrow color={C.textFaint}>Instead</Eyebrow>
      <KeyWords words={["Look", "at", "the", "evidence"]} accent={[3]} size={104} delay={4} />
    </Center>
  </Scene>
);

/* 6 — 28.05-35.25  "don't blindly trust a COA because a PDF says 99% purity" */
export const MistakeTwo: React.FC<{ dur: number }> = ({ dur }) => {
  const ch = useIn(2, 20);
  const coa = useIn(77, 20);
  const pdf = useIn(119, 20);
  return (
    <Scene dur={dur} enter="rise">
      <Center gap={40}>
        <ChapterNumber n="02" label="Mistake" p={ch} />
        <div style={{ opacity: coa }}>
          <KeyWords words={["Don't", "blindly", "trust", "a", "COA"]} accent={[4]} size={72} />
        </div>
        <div
          style={{
            opacity: pdf,
            display: "flex",
            alignItems: "center",
            gap: 20,
            padding: "22px 34px",
            borderRadius: 12,
            border: `1.5px solid rgba(180,72,60,0.5)`,
            background: "rgba(180,72,60,0.08)",
            fontFamily: SANS,
          }}
        >
          <span style={{ fontSize: 22, fontWeight: 800, color: C.red, letterSpacing: 2 }}>PDF</span>
          <span style={{ fontSize: 34, color: C.textDim }}>“99% purity”</span>
        </div>
      </Center>
    </Scene>
  );
};

/* 7 — 35.25-37.05  "Actually verify it." */
export const ActuallyVerify: React.FC<{ dur: number }> = ({ dur }) => (
  <Scene dur={dur} enter="scale">
    <Center>
      <KeyWords words={["Actually", "verify", "it"]} accent={[1]} size={116} delay={2} />
    </Center>
  </Scene>
);

/* 8 — 37.05-43.50  "check compound, batch number, test date, sample info match what's sold" */
export const CheckMatch: React.FC<{ dur: number }> = ({ dur }) => {
  const cues = [26, 50, 77, 98];
  const p = [useIn(26, 16), useIn(50, 16), useIn(77, 16), useIn(98, 16)];
  const matchP = useIn(128, 20);
  const active = cues.reduce((acc, c, i) => (p[i] > 0 ? i : acc), -1);
  const names = ["Compound", "Batch number", "Test date", "Sample information"];

  return (
    <Scene dur={dur} enter="wipeL">
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 80 }}>
        <CoaSheet w={430} rows={COA_ROWS} active={active} reveal={1} />
        <div style={{ width: 640, display: "flex", flexDirection: "column", gap: 22 }}>
          <Eyebrow delay={4}>Check that these match</Eyebrow>
          {names.map((n, i) => (
            <div
              key={i}
              style={{
                opacity: p[i],
                borderLeft: `3px solid ${i === active ? C.gold : C.line}`,
                paddingLeft: 22,
                fontFamily: SANS,
                fontSize: 40,
                fontWeight: 600,
                color: i === active ? C.text : C.textDim,
              }}
            >
              {n}
            </div>
          ))}
          <div style={{ opacity: matchP, marginTop: 10 }}>
            <span style={{ fontFamily: SANS, fontSize: 30, color: C.gold, letterSpacing: 1.6 }}>
              …against what the vendor is selling
            </span>
          </div>
        </div>
      </AbsoluteFill>
    </Scene>
  );
};

/* 9 — 43.50-46.75  "Then check which laboratory performed the test." */
export const WhichLab: React.FC<{ dur: number }> = ({ dur }) => (
  <Scene dur={dur} enter="rise">
    <Center gap={26}>
      <Eyebrow color={C.textFaint}>Then check</Eyebrow>
      <KeyWords words={["Which", "lab", "ran", "it"]} accent={[1]} size={98} delay={4} />
    </Center>
  </Scene>
);

/* 10 — 46.75-55.55  "verification number, QR code or report ID — confirm on the lab's own site" */
export const VerifyWithLab: React.FC<{ dur: number }> = ({ dur }) => {
  const badge = useIn(34, 20);
  const qr = useRamp(77, 110);
  const site = useIn(154, 22);
  return (
    <Scene dur={dur} enter="fade">
      <Center gap={44}>
        <Eyebrow delay={4}>If the report carries one</Eyebrow>
        <Panel pad={40} glow>
          <VerifyBadge p={badge} qr={qr} />
        </Panel>
        <div style={{ opacity: site }}>
          <KeyWords words={["Confirm", "on", "the", "lab's", "site"]} accent={[3]} size={50} />
        </div>
      </Center>
    </Scene>
  );
};

/* 11 — 55.55-59.30  "That's also why we built the COA results library classroom" */
export const COALibraryIntro: React.FC<{ dur: number }> = ({ dur }) => {
  const card = useIn(6, 22);
  return (
    <Scene dur={dur} enter="scale">
      <Center gap={38}>
        <Eyebrow delay={2}>Which is why we built</Eyebrow>
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
                Classroom
              </span>
            </div>
            <div style={{ padding: "32px 44px 40px", fontFamily: SANS }}>
              <div style={{ fontSize: 58, fontWeight: 800, color: C.text, letterSpacing: -1.4 }}>COA results library</div>
              <div style={{ fontSize: 26, color: C.textDim, marginTop: 10 }}>
                Testing documentation collected in one place
              </div>
            </div>
          </Panel>
        </div>
      </Center>
    </Scene>
  );
};

/* 12 — 59.30-65.55  "members can review testing documentation we've collected in one place" */
export const COALibraryGrid: React.FC<{ dur: number }> = ({ dur }) => {
  const cells = [
    useRamp(18, 34),
    useRamp(26, 42),
    useRamp(34, 50),
    useRamp(42, 58),
    useRamp(50, 66),
    useRamp(58, 74),
    useRamp(66, 82),
    useRamp(74, 90),
    useRamp(82, 98),
    useRamp(90, 106),
  ];
  const cap = useIn(114, 20);
  return (
    <Scene dur={dur} enter="fade">
      <Center gap={44}>
        <Eyebrow delay={4}>Reviewed by members</Eyebrow>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 148px)", gap: 26 }}>
          {cells.map((p, i) => (
            <DocTile key={i} p={p} gold={i === 6} />
          ))}
        </div>
        <div style={{ opacity: cap }}>
          <KeyWords words={["All", "in", "one", "place"]} accent={[2]} size={48} />
        </div>
      </Center>
    </Scene>
  );
};
