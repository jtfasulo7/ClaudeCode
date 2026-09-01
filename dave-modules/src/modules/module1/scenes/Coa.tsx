import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Scene, useIn, useRamp } from "../../../shared/components/Scene";
import { Eyebrow, KeyWords, Rule } from "../../../shared/components/Type";
import { CheckRow, CoaSheet, Panel } from "../../../shared/components/Graphics";
import { C, SANS } from "../../../shared/theme";

const ROWS = [
  { label: "Identity", value: "Confirmed" },
  { label: "Purity", value: "99.1%" },
  { label: "Tested amount", value: "10.2 mg" },
  { label: "Batch", value: "A-2291" },
];

/* 13 — 47.25-52.55  "...is a COA, or certificate of analysis." */
export const COAIntro: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const coa = useIn(52, 20);
  const expand = useIn(104, 22);
  const sheet = useIn(74, 26);

  // The acronym lifts out of the way as the full name arrives.
  const lift = interpolate(f, [104, 126], [0, -54], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <Scene dur={dur} enter="fade">
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            position: "absolute",
            bottom: -180,
            opacity: sheet * 0.5,
            transform: `translateY(${(1 - sheet) * 120}px) scale(0.9)`,
            filter: "blur(1.5px)",
          }}
        >
          <CoaSheet w={520} rows={ROWS} reveal={1} />
        </div>

        <div
          style={{
            position: "absolute",
            top: 300,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 20,
            transform: `translateY(${lift}px)`,
          }}
        >
          <Eyebrow delay={44} color={C.textFaint}>
            You will hear this constantly
          </Eyebrow>
          <div
            style={{
              opacity: coa,
              transform: `scale(${0.86 + coa * 0.14})`,
              fontFamily: SANS,
              fontSize: 196,
              fontWeight: 800,
              letterSpacing: 6,
              color: C.goldBright,
              lineHeight: 1,
            }}
          >
            COA
          </div>
          <div style={{ opacity: expand }}>
            <Rule delay={106} width={420} />
          </div>
          <div
            style={{
              opacity: expand,
              transform: `translateY(${(1 - expand) * 14}px)`,
              fontFamily: SANS,
              fontSize: 46,
              fontWeight: 600,
              letterSpacing: 7,
              textTransform: "uppercase",
              color: C.text,
            }}
          >
            Certificate of Analysis
          </div>
        </div>
      </AbsoluteFill>
    </Scene>
  );
};

/* 14 — 52.55-60.65  "a lab report that can show identity, purity, tested amount of a batch" */
export const COAAnatomy: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const sheet = useIn(2, 24);
  const fill = useRamp(12, 86);

  // Row cues, each on the frame the narrator names it.
  const cues = [89, 113, 167, 197];
  const active = cues.reduce((acc, c, i) => (f >= c ? i : acc), -1);

  const items = [
    { t: "Identity", d: "What the compound actually is", at: 89 },
    { t: "Purity", d: "How much of it is the compound", at: 113 },
    { t: "Tested amount", d: "What the vial was measured at", at: 167 },
    { t: "Specific batch", d: "Which production run it came from", at: 197 },
  ];

  return (
    <Scene dur={dur} enter="wipeL">
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 84 }}>
        {/* Rows fill in across the setup line so the sheet is actively being
            written while the narrator says "a lab report that can show..." */}
        <div style={{ opacity: sheet, transform: `translateX(${(1 - sheet) * -30}px)` }}>
          <CoaSheet w={470} rows={ROWS} active={active} reveal={fill} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 26, width: 640 }}>
          <Eyebrow delay={6}>What a lab report can show</Eyebrow>
          {items.map((it, i) => {
            const p = interpolate(f, [it.at - 6, it.at + 10], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const on = i === active;
            return (
              <div
                key={i}
                style={{
                  opacity: p,
                  transform: `translateX(${(1 - p) * 26}px)`,
                  borderLeft: `3px solid ${on ? C.gold : C.line}`,
                  paddingLeft: 22,
                  fontFamily: SANS,
                }}
              >
                <div
                  style={{
                    fontSize: 42,
                    fontWeight: 700,
                    color: on ? C.text : C.textDim,
                    letterSpacing: -0.8,
                  }}
                >
                  {it.t}
                </div>
                <div style={{ fontSize: 25, color: C.textFaint, marginTop: 5 }}>{it.d}</div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </Scene>
  );
};

/* 15 — 60.65-68.35  "only useful if it's real, from a verifiable lab, and matches the batch" */
export const COAValid: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const c1 = useRamp(65, 85);
  const c2 = useRamp(104, 124);
  const c3 = useRamp(158, 178);
  const stampIn = f >= 196;

  return (
    <Scene dur={dur} enter="fade">
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 90 }}>
        <div style={{ transform: "rotate(-3deg)" }}>
          <CoaSheet w={430} rows={ROWS} reveal={1} stamp={stampIn ? "verified" : "none"} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 44, width: 700 }}>
          <Eyebrow delay={4}>Only useful if</Eyebrow>
          <CheckRow text="It's real" p={c1} />
          <CheckRow text="From a verifiable lab" p={c2} />
          <CheckRow text="Matches the batch sold" p={c3} />
        </div>
      </AbsoluteFill>
    </Scene>
  );
};

/* 16 — 68.35-71.85  "That's what we're going to teach you throughout this classroom." */
export const TeachYou: React.FC<{ dur: number }> = ({ dur }) => (
  <Scene dur={dur} enter="rise">
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 30 }}>
      <Eyebrow color={C.textFaint}>Throughout this classroom</Eyebrow>
      <KeyWords words={["We", "teach", "you", "how"]} accent={[1]} size={104} delay={4} />
    </AbsoluteFill>
  </Scene>
);

/* Small reusable stat plate used by the classroom section. */
export const MiniStat: React.FC<{ k: string; v: string; p: number }> = ({ k, v, p }) => (
  <Panel pad={26} style={{ opacity: p, transform: `translateY(${(1 - p) * 18}px)` }}>
    <div style={{ fontSize: 20, letterSpacing: 2.6, color: C.textFaint, textTransform: "uppercase" }}>{k}</div>
    <div style={{ fontSize: 46, fontWeight: 800, color: C.goldBright, marginTop: 8, letterSpacing: -1 }}>{v}</div>
  </Panel>
);
