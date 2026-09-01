import React from "react";
import { AbsoluteFill } from "remotion";
import { Scene, useIn, useRamp } from "../../../shared/components/Scene";
import { Eyebrow, KeyWords } from "../../../shared/components/Type";
import { Globe, Panel, Vial } from "../../../shared/components/Graphics";
import { C, SANS } from "../../../shared/theme";

/* 5 — 13.30-17.40  "products sold by US research vendors" */
export const USVendors: React.FC<{ dur: number }> = ({ dur }) => {
  const card = useIn(2, 20);
  const rows = [0, 1, 2].map((i) => useIn(16 + i * 7, 16));
  const cap = useIn(48, 16);

  return (
    <Scene dur={dur} enter="rise">
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 40 }}>
        <div style={{ opacity: card, transform: `scale(${0.95 + card * 0.05})` }}>
          <Panel width={880} pad={0} glow>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "22px 30px",
                borderBottom: `1px solid ${C.line}`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 11, height: 11, borderRadius: 6, background: C.gold }} />
                <span style={{ fontSize: 24, fontWeight: 700, letterSpacing: 2.6, color: C.textDim }}>
                  US RESEARCH VENDOR
                </span>
              </div>
              <span style={{ fontSize: 20, color: C.textFaint, letterSpacing: 1.6 }}>CATALOG</span>
            </div>

            <div style={{ padding: "10px 30px 26px" }}>
              {["Research peptide · 10 vials", "Research peptide · 10 vials", "Research peptide · 10 vials"].map(
                (label, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 22,
                      padding: "20px 0",
                      borderBottom: i < 2 ? `1px solid ${C.lineSoft}` : "none",
                      opacity: rows[i],
                      transform: `translateX(${(1 - rows[i]) * 22}px)`,
                    }}
                  >
                    <Vial h={62} fill={0.55 + i * 0.1} delay={16 + i * 7} />
                    <span style={{ flex: 1, fontSize: 30, color: C.text, fontWeight: 500 }}>{label}</span>
                    <span style={{ fontSize: 34, fontWeight: 800, color: C.textDim, letterSpacing: -0.8 }}>
                      {["$600", "$800", "$1,000"][i]}
                    </span>
                  </div>
                ),
              )}
            </div>
          </Panel>
        </div>

        <div style={{ opacity: cap }}>
          <KeyWords words={["Sold", "by", "US", "vendors"]} accent={[2]} size={50} />
        </div>
      </AbsoluteFill>
    </Scene>
  );
};

/* 6 — 17.40-22.30  "...originate from overseas manufacturers, including suppliers in China." */
export const OverseasOrigin: React.FC<{ dur: number }> = ({ dur }) => {
  const globe = useIn(2, 24);
  const arc = useRamp(20, 74);
  const pinA = useIn(60, 14);
  const pinB = useIn(18, 14);
  const labelA = useIn(64, 16);
  const labelB = useIn(24, 16);

  return (
    <Scene dur={dur} enter="scale">
      {/* Flex row rather than absolute pixels — the labels stay balanced
          against the globe instead of drifting off its centre. */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 56 }}>
        <div
          style={{
            width: 330,
            textAlign: "right",
            opacity: labelA,
            transform: `translateX(${(1 - labelA) * -18}px)`,
            fontFamily: SANS,
          }}
        >
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Eyebrow delay={64}>Origin</Eyebrow>
          </div>
          <div style={{ fontSize: 46, fontWeight: 800, color: C.text, letterSpacing: -1, marginTop: 10, lineHeight: 1.14 }}>
            Suppliers
            <br />
            in China
          </div>
        </div>

        <div style={{ opacity: globe, transform: `scale(${0.9 + globe * 0.1})`, flexShrink: 0 }}>
          <Globe r={238} arc={arc} pinA={pinA} pinB={pinB} />
        </div>

        <div
          style={{
            width: 330,
            opacity: labelB,
            transform: `translateX(${(1 - labelB) * 18}px)`,
            fontFamily: SANS,
          }}
        >
          <Eyebrow delay={24} color={C.textFaint}>
            Listed by
          </Eyebrow>
          <div style={{ fontSize: 46, fontWeight: 800, color: C.text, letterSpacing: -1, marginTop: 10, lineHeight: 1.14 }}>
            US research
            <br />
            vendors
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end", paddingBottom: 88 }}>
        <KeyWords words={["Overseas", "manufacturers"]} accent={[0]} size={54} delay={58} />
      </AbsoluteFill>
    </Scene>
  );
};

/* 7 — 22.30-24.55  "that's where the pricing can get pretty crazy" */
export const PricingIntro: React.FC<{ dur: number }> = ({ dur }) => (
  <Scene dur={dur} enter="rise">
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 26 }}>
      <Eyebrow color={C.textFaint}>And this is where</Eyebrow>
      <KeyWords words={["The", "pricing", "gets", "wild"]} accent={[1]} size={112} delay={3} />
    </AbsoluteFill>
  </Scene>
);
