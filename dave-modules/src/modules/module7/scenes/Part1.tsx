import React from "react";
import { AbsoluteFill } from "remotion";
import { Scene, useIn, useRamp } from "../../../shared/components/Scene";
import { Eyebrow, KeyWords, Rule } from "../../../shared/components/Type";
import { CheckRow, Lock, Panel } from "../../../shared/components/Graphics";
import { DMCard, DocTile } from "../../../shared/components/Diagrams";
import { C, SANS, SERIF } from "../../../shared/theme";

const Center: React.FC<{ children: React.ReactNode; gap?: number }> = ({ children, gap = 28 }) => (
  <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap }}>
    {children}
  </AbsoluteFill>
);

/* 1 — 0.00-4.20  "If you're completely new, don't over-complicate it." */
export const TitleOpen: React.FC<{ dur: number }> = ({ dur }) => {
  const t = useIn(8, 26);
  const sub = useIn(72, 22);
  return (
    <Scene dur={dur} enter="hold">
      <Center gap={22}>
        <Eyebrow delay={2}>Peps by Dave · Module 07</Eyebrow>
        <div
          style={{
            opacity: t,
            fontFamily: SERIF,
            fontWeight: 600,
            fontSize: 132,
            letterSpacing: -3,
            color: C.text,
            lineHeight: 1.04,
            textAlign: "center",
          }}
        >
          Where to go <span style={{ color: C.goldBright }}>from here</span>
        </div>
        <Rule delay={32} width={420} />
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
          Don't over-complicate it
        </div>
      </Center>
    </Scene>
  );
};

/* 2 — 4.20-8.60  "If you've watched the earlier videos, you understand the basics" */
export const YouKnowBasics: React.FC<{ dur: number }> = ({ dur }) => {
  const mods = [useIn(39, 18), useIn(49, 18), useIn(59, 18)];
  const cap = useIn(108, 20);
  return (
    <Scene dur={dur} enter="rise">
      <Center gap={44}>
        <Eyebrow delay={4}>If you've watched the earlier videos</Eyebrow>
        <div style={{ display: "flex", gap: 20 }}>
          {["01", "03", "05"].map((n, i) => (
            <div
              key={i}
              style={{
                opacity: mods[i],
                width: 190,
                padding: "28px 0",
                borderRadius: 14,
                border: `1.5px solid ${C.line}`,
                background: "rgba(255,255,255,0.022)",
                textAlign: "center",
                fontFamily: SANS,
              }}
            >
              <div style={{ fontSize: 56, fontWeight: 800, color: C.goldBright, letterSpacing: -2 }}>{n}</div>
              <div style={{ fontSize: 20, letterSpacing: 2.6, color: C.textFaint, textTransform: "uppercase", marginTop: 6 }}>
                Module
              </div>
            </div>
          ))}
        </div>
        <div style={{ opacity: cap }}>
          <KeyWords words={["You", "know", "the", "basics"]} accent={[3]} size={62} />
        </div>
      </Center>
    </Scene>
  );
};

/* 3 — 8.60-14.10  "what a COA is, why testing matters, why prices vary so much" */
export const TheBasicsRecap: React.FC<{ dur: number }> = ({ dur }) => {
  const c = [useIn(18, 18), useIn(54, 18), useIn(96, 18)];
  const names = ["What a COA is", "Why testing matters", "Why prices vary"];
  return (
    <Scene dur={dur} enter="fade">
      <Center gap={42}>
        <Eyebrow delay={4}>You already understand</Eyebrow>
        {/* stretch so panels with one-line and two-line titles still line up */}
        <div style={{ display: "flex", gap: 24, alignItems: "stretch" }}>
          {names.map((n, i) => (
            <div key={i} style={{ opacity: c[i], display: "flex" }}>
              <Panel width={380} pad={36}>
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

/* 4 — 14.10-18.10  "Your next step is simply to keep engaging inside the community." */
export const KeepEngaging: React.FC<{ dur: number }> = ({ dur }) => {
  const a = useIn(9, 20);
  const b = useIn(51, 22);
  return (
    <Scene dur={dur} enter="scale">
      <Center gap={30}>
        <div style={{ opacity: a }}>
          <Eyebrow delay={9}>Your next step</Eyebrow>
        </div>
        <div style={{ opacity: b }}>
          <KeyWords words={["Keep", "engaging"]} accent={[0]} size={124} delay={51} />
        </div>
      </Center>
    </Scene>
  );
};

/* 5 — 18.10-21.20  "Once you unlock the trusted vendor access classroom" */
export const UnlockAccess: React.FC<{ dur: number }> = ({ dur }) => {
  const open = useRamp(15, 42);
  const cap = useIn(44, 20);
  return (
    <Scene dur={dur} enter="fade">
      <Center gap={36}>
        <Lock open={open} size={148} />
        <div style={{ opacity: cap }}>
          <KeyWords words={["Trusted", "vendor", "access"]} accent={[0]} size={54} />
        </div>
      </Center>
    </Scene>
  );
};

/* 6 — 21.20-25.30  "you'll see the vendors we've collected, their contact information" */
export const WhatYouSee: React.FC<{ dur: number }> = ({ dur }) => {
  const card = useIn(6, 20);
  const rows = [useRamp(36, 56), useRamp(48, 68), useRamp(60, 80)];
  const contact = useRamp(81, 101);
  return (
    <Scene dur={dur} enter="rise">
      <Center gap={30}>
        <div style={{ opacity: card }}>
          <Panel width={1060} pad={0}>
            <div
              style={{
                display: "flex",
                padding: "22px 34px",
                borderBottom: `1px solid ${C.line}`,
                fontFamily: SANS,
                fontSize: 20,
                letterSpacing: 2.6,
                color: C.textFaint,
                textTransform: "uppercase",
              }}
            >
              <span style={{ flex: 2 }}>Vendor</span>
              <span style={{ flex: 2 }}>Contact</span>
            </div>
            {["Vendor 01", "Vendor 02", "Vendor 03"].map((v, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "24px 34px",
                  borderBottom: i < 2 ? `1px solid ${C.lineSoft}` : "none",
                  opacity: rows[i],
                  fontFamily: SANS,
                }}
              >
                <span style={{ flex: 2, fontSize: 32, fontWeight: 600, color: C.text }}>{v}</span>
                <span style={{ flex: 2, fontSize: 27, color: C.gold, opacity: contact }}>
                  Official contact on file
                </span>
              </div>
            ))}
          </Panel>
        </div>
      </Center>
    </Scene>
  );
};

/* 7 — 25.30-28.90  "available price lists, and other important details" */
export const PriceListsDetails: React.FC<{ dur: number }> = ({ dur }) => {
  const a = useIn(12, 20);
  const b = useIn(48, 20);
  return (
    <Scene dur={dur} enter="wipeL">
      <Center gap={34}>
        <Eyebrow delay={2}>Also inside</Eyebrow>
        <div style={{ display: "flex", gap: 26 }}>
          <div style={{ opacity: a }}>
            <Panel width={420} pad={36} glow>
              <div style={{ fontFamily: SANS, fontSize: 40, fontWeight: 700, color: C.text, letterSpacing: -0.8 }}>
                Price lists
              </div>
              <div style={{ fontFamily: SANS, fontSize: 25, color: C.textDim, marginTop: 10 }}>
                What each vendor lists
              </div>
            </Panel>
          </div>
          <div style={{ opacity: b }}>
            <Panel width={420} pad={36}>
              <div style={{ fontFamily: SANS, fontSize: 40, fontWeight: 700, color: C.text, letterSpacing: -0.8 }}>
                Other details
              </div>
              <div style={{ fontFamily: SANS, fontSize: 25, color: C.textDim, marginTop: 10 }}>
                Collected by the community
              </div>
            </Panel>
          </div>
        </div>
      </Center>
    </Scene>
  );
};

/* 8 — 28.90-31.40  "Before trusting any vendor" */
export const BeforeTrusting: React.FC<{ dur: number }> = ({ dur }) => (
  <Scene dur={dur} enter="scale">
    <Center gap={24}>
      <Eyebrow color={C.textFaint}>But first</Eyebrow>
      <KeyWords words={["Before", "trusting", "any", "vendor"]} accent={[0]} size={88} delay={3} />
    </Center>
  </Scene>
);

/* 9 — 31.40-35.60  "check the COA results library and review the testing we have available" */
export const COALibraryCheck: React.FC<{ dur: number }> = ({ dur }) => {
  const cells = [
    useRamp(3, 19),
    useRamp(9, 25),
    useRamp(15, 31),
    useRamp(21, 37),
    useRamp(27, 43),
    useRamp(33, 49),
    useRamp(39, 55),
    useRamp(45, 61),
  ];
  const cap = useIn(54, 20);
  return (
    <Scene dur={dur} enter="fade">
      <Center gap={40}>
        <Eyebrow delay={2}>Check the COA results library</Eyebrow>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 148px)", gap: 24 }}>
          {cells.map((p, i) => (
            <DocTile key={i} p={p} gold={i === 5} />
          ))}
        </div>
        <div style={{ opacity: cap }}>
          <KeyWords words={["Review", "the", "testing"]} accent={[0]} size={48} />
        </div>
      </Center>
    </Scene>
  );
};

/* 10 — 35.60-39.35  "Always verify the vendor's official contact information." */
export const VerifyOfficial: React.FC<{ dur: number }> = ({ dur }) => {
  const c = useRamp(18, 42);
  return (
    <Scene dur={dur} enter="rise">
      <Center gap={38}>
        <Eyebrow delay={4}>Always</Eyebrow>
        <div style={{ width: 900 }}>
          <CheckRow text="Verify official contact information" p={c} />
        </div>
      </Center>
    </Scene>
  );
};

/* 11 — 39.35-43.45  "Don't respond to random DMs from someone claiming to be a vendor." */
export const NoRandomDMs: React.FC<{ dur: number }> = ({ dur }) => {
  const dm = useIn(32, 20);
  const flag = useRamp(77, 99);
  return (
    <Scene dur={dur} enter="fade">
      <Center gap={36}>
        <Eyebrow delay={4} color={C.red}>
          Don't respond to
        </Eyebrow>
        <DMCard
          who="Unknown sender"
          text="Hey — I'm a vendor, message me for stock and prices."
          p={dm}
          flagged={flag}
        />
      </Center>
    </Scene>
  );
};
