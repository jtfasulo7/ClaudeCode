import React from "react";
import { AbsoluteFill } from "remotion";
import { Scene, useIn, useRamp } from "../../../shared/components/Scene";
import { Eyebrow, KeyWords, Rule } from "../../../shared/components/Type";
import { Panel, PriceBar, Vial } from "../../../shared/components/Graphics";
import { C, SANS } from "../../../shared/theme";

/* 8 — 24.55-33.20  "10 vials through a US vendor for $600, $800 or even $1000" */
export const PriceUS: React.FC<{ dur: number }> = ({ dur }) => {
  const card = useIn(2, 20);
  // Each bar lands on the frame its number is spoken.
  const b1 = useRamp(117, 141);
  const b2 = useRamp(155, 179);
  const b3 = useRamp(213, 237);

  return (
    <Scene dur={dur} enter="rise">
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ opacity: card, transform: `scale(${0.96 + card * 0.04})` }}>
          <Panel width={1080} pad={52}>
            <Eyebrow delay={6}>10 vials · US research vendor</Eyebrow>
            {/* The ten vials count in while the narrator sets the listing up,
                so the card is never just a header waiting for its first bar. */}
            <div style={{ display: "flex", gap: 14, marginTop: 26, marginBottom: 34 }}>
              {Array.from({ length: 10 }, (_, i) => (
                <Vial key={i} h={74} fill={0.58} delay={12 + i * 7} />
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
              <PriceBar label="Listing A" value="$600" frac={0.6} p={b1} />
              <PriceBar label="Listing B" value="$800" frac={0.8} p={b2} />
              <PriceBar label="Listing C" value="$1,000" frac={1} p={b3} color={C.text} />
            </div>
          </Panel>
        </div>
      </AbsoluteFill>
    </Scene>
  );
};

/* 9 — 33.20-38.45  "an overseas supplier may list a similar quantity for under $100" */
export const PriceOverseas: React.FC<{ dur: number }> = ({ dur }) => {
  const card = useIn(2, 20);
  const us = useRamp(8, 30);
  const os = useRamp(103, 130);
  const gap = useIn(126, 20);

  return (
    <Scene dur={dur} enter="fade">
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ opacity: card, transform: `scale(${0.96 + card * 0.04})` }}>
          <Panel width={1080} pad={52}>
            <Eyebrow delay={4}>Similar quantity · same listing</Eyebrow>
            <div style={{ height: 42 }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 46 }}>
              <PriceBar label="US vendors" value="$600 – $1,000" frac={1} p={us} color={C.textDim} />
              <PriceBar label="Overseas supplier" value="Under $100" frac={0.1} p={os} color={C.goldBright} />
            </div>
          </Panel>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 118,
            opacity: gap,
            transform: `translateY(${(1 - gap) * 16}px)`,
            fontFamily: SANS,
            display: "flex",
            alignItems: "baseline",
            gap: 18,
          }}
        >
          <span style={{ fontSize: 76, fontWeight: 800, color: C.goldBright, letterSpacing: -2 }}>6–10×</span>
          <span style={{ fontSize: 32, color: C.textDim, letterSpacing: 2, textTransform: "uppercase" }}>
            price difference
          </span>
        </div>
      </AbsoluteFill>
    </Scene>
  );
};

/* 10 — 38.45-41.35  "That doesn't automatically mean they're the same quality" */
export const NotSameQuality: React.FC<{ dur: number }> = ({ dur }) => {
  const a = useIn(2, 18);
  const b = useIn(8, 18);
  const sign = useIn(26, 16);

  return (
    <Scene dur={dur} enter="scale">
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 46 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 76 }}>
          <div style={{ opacity: a, textAlign: "center", fontFamily: SANS }}>
            <Vial h={210} fill={0.6} delay={2} />
            <div style={{ marginTop: 18, fontSize: 24, color: C.textDim, letterSpacing: 2 }}>$1,000</div>
          </div>

          <div
            style={{
              opacity: sign,
              transform: `scale(${0.7 + sign * 0.3})`,
              fontFamily: SANS,
              fontSize: 128,
              fontWeight: 300,
              color: C.red,
              lineHeight: 1,
            }}
          >
            ≠
          </div>

          <div style={{ opacity: b, textAlign: "center", fontFamily: SANS }}>
            <Vial h={210} fill={0.6} delay={8} />
            <div style={{ marginTop: 18, fontSize: 24, color: C.textDim, letterSpacing: 2 }}>Under $100</div>
          </div>
        </div>

        <KeyWords words={["Not", "automatically", "the", "same"]} accent={[]} size={54} delay={34} />
      </AbsoluteFill>
    </Scene>
  );
};

/* 11 — 41.35-44.35  "and cheaper definitely doesn't always mean better" */
export const CheaperNotBetter: React.FC<{ dur: number }> = ({ dur }) => {
  const bar = useIn(20, 20);
  return (
    <Scene dur={dur} enter="rise">
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 34 }}>
        <KeyWords words={["Cheaper", "≠", "better"]} accent={[]} size={124} delay={2} />
        <div
          style={{
            opacity: bar,
            height: 3,
            width: 300 * bar,
            background: `linear-gradient(90deg, transparent, ${C.red}, transparent)`,
          }}
        />
      </AbsoluteFill>
    </Scene>
  );
};

/* 12 — 44.35-47.25  "The important thing is verification." */
export const VerificationKey: React.FC<{ dur: number }> = ({ dur }) => (
  <Scene dur={dur} enter="scale">
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 28 }}>
      <Eyebrow color={C.textFaint}>What actually matters</Eyebrow>
      <KeyWords words={["Verification"]} accent={[0]} size={168} delay={4} />
      <Rule delay={18} width={480} />
    </AbsoluteFill>
  </Scene>
);
