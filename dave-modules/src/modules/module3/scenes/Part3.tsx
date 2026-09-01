import React from "react";
import { AbsoluteFill } from "remotion";
import { Scene, useIn, useRamp } from "../../../shared/components/Scene";
import { Eyebrow, KeyWords, Rule, Statement } from "../../../shared/components/Type";
import { Lock } from "../../../shared/components/Graphics";
import { TierLadder } from "../../../shared/components/Diagrams";
import { C, SANS, SERIF } from "../../../shared/theme";

const Center: React.FC<{ children: React.ReactNode; gap?: number }> = ({ children, gap = 28 }) => (
  <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap }}>
    {children}
  </AbsoluteFill>
);

/* 22 — 72.35-77.85  "certain areas may require higher engagement levels" */
export const HigherEngagement: React.FC<{ dur: number }> = ({ dur }) => {
  const ladder = useRamp(35, 100);
  const cap = useIn(113, 20);
  return (
    <Scene dur={dur} enter="rise">
      <Center gap={40}>
        <Eyebrow delay={4}>Some areas of the community</Eyebrow>
        <TierLadder
          p={ladder}
          tiers={[
            { name: "Educational classrooms", unlocked: true },
            { name: "Discussions", unlocked: true },
            { name: "Trusted vendor classroom", unlocked: false },
            { name: "COA results library", unlocked: false },
          ]}
        />
        <div style={{ opacity: cap }}>
          <KeyWords words={["Higher", "engagement", "required"]} accent={[1]} size={46} />
        </div>
      </Center>
    </Scene>
  );
};

/* 23 — 77.85-79.25  "That's intentional." */
export const Intentional: React.FC<{ dur: number }> = ({ dur }) => (
  <Scene dur={dur} enter="scale">
    <Center>
      <KeyWords words={["That's", "intentional"]} accent={[1]} size={116} delay={2} />
    </Center>
  </Scene>
);

/* 24 — 79.25-87.05  "a community rather than a directory somebody joins, grabs from, and disappears" */
export const NotADirectory: React.FC<{ dur: number }> = ({ dur }) => {
  const comm = useIn(29, 20);
  const dir = useIn(74, 20);
  const steps = [useRamp(124, 142), useRamp(155, 173), useRamp(202, 220)];

  return (
    <Scene dur={dur} enter="fade">
      <Center gap={44}>
        <Eyebrow delay={4}>What we're building</Eyebrow>
        <div style={{ display: "flex", gap: 40, alignItems: "stretch" }}>
          <div
            style={{
              opacity: comm,
              width: 470,
              padding: "38px 34px",
              borderRadius: 16,
              border: `1.5px solid ${C.gold}`,
              background: "rgba(201,162,39,0.09)",
              fontFamily: SANS,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 22, letterSpacing: 3, color: C.gold, textTransform: "uppercase" }}>Yes</div>
            <div style={{ fontSize: 54, fontWeight: 800, color: C.text, marginTop: 14, letterSpacing: -1.2 }}>
              A community
            </div>
          </div>

          <div
            style={{
              opacity: dir,
              width: 470,
              padding: "38px 34px",
              borderRadius: 16,
              border: `1.5px solid ${C.line}`,
              background: "rgba(255,255,255,0.02)",
              fontFamily: SANS,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 22, letterSpacing: 3, color: C.textFaint, textTransform: "uppercase" }}>Not</div>
            <div style={{ fontSize: 54, fontWeight: 800, color: C.textDim, marginTop: 14, letterSpacing: -1.2 }}>
              A directory
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 26 }}>
              {["Join for five minutes", "Grab information", "Disappear"].map((t, i) => (
                <div
                  key={i}
                  style={{
                    opacity: steps[i],
                    fontSize: 25,
                    color: C.textFaint,
                    borderTop: `1px solid ${C.lineSoft}`,
                    paddingTop: 10,
                  }}
                >
                  {t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Center>
    </Scene>
  );
};

/* 25 — 87.05-93.00  "Comment, introduce yourself, participate in discussions, help somebody." */
export const HowToEngage: React.FC<{ dur: number }> = ({ dur }) => {
  const items = [useIn(2, 18), useIn(29, 18), useIn(74, 18), useIn(130, 18)];
  const names = ["Comment", "Introduce yourself", "Join discussions", "Help somebody"];
  return (
    <Scene dur={dur} enter="rise">
      <Center gap={40}>
        <Eyebrow delay={2}>How to engage</Eyebrow>
        <div style={{ display: "flex", flexDirection: "column", gap: 20, width: 760 }}>
          {names.map((n, i) => (
            <div
              key={i}
              style={{
                opacity: items[i],
                display: "flex",
                alignItems: "center",
                gap: 22,
                padding: "24px 32px",
                borderRadius: 12,
                background: "rgba(201,162,39,0.07)",
                border: `1px solid rgba(201,162,39,0.28)`,
                fontFamily: SANS,
              }}
            >
              <span style={{ fontSize: 24, fontWeight: 800, color: C.gold, width: 34 }}>{`0${i + 1}`}</span>
              <span style={{ fontSize: 38, fontWeight: 600, color: C.text }}>{n}</span>
            </div>
          ))}
        </div>
      </Center>
    </Scene>
  );
};

/* 26 — 93.00-96.35  "You'll naturally unlock more of the community over time." */
export const UnlockOverTime: React.FC<{ dur: number }> = ({ dur }) => {
  const open = useRamp(18, 44);
  const cap = useIn(46, 20);
  return (
    <Scene dur={dur} enter="fade">
      <Center gap={40}>
        <Lock open={open} size={158} />
        <div style={{ opacity: cap }}>
          <KeyWords words={["Unlock", "more", "over", "time"]} accent={[0]} size={62} />
        </div>
      </Center>
    </Scene>
  );
};

/* 27 — 96.35-98.20  "And one important rule," */
export const ImportantRule: React.FC<{ dur: number }> = ({ dur }) => (
  <Scene dur={dur} enter="scale">
    <Center gap={22}>
      <Eyebrow color={C.textFaint}>And one</Eyebrow>
      <KeyWords words={["Important", "rule"]} accent={[0]} size={120} delay={2} />
    </Center>
  </Scene>
);

/* 28 — 98.20-104.25  "don't blindly trust it because Dave / a member / a vendor said it" */
export const DontBlindlyTrust: React.FC<{ dur: number }> = ({ dur }) => {
  const strikes = [useRamp(60, 82), useRamp(93, 115), useRamp(138, 160)];
  const names = ["Because Dave said it", "Because a member said it", "Because a vendor said it"];
  return (
    <Scene dur={dur} enter="fade">
      <Center gap={38}>
        <Eyebrow delay={4} color={C.red}>
          Don't blindly trust
        </Eyebrow>
        <div style={{ display: "flex", flexDirection: "column", gap: 22, width: 820 }}>
          {names.map((n, i) => (
            <div key={i} style={{ position: "relative", opacity: strikes[i] > 0 ? 1 : 0.25 }}>
              <div
                style={{
                  padding: "22px 30px",
                  borderRadius: 12,
                  background: "rgba(255,255,255,0.022)",
                  border: `1px solid ${C.lineSoft}`,
                  fontFamily: SANS,
                  fontSize: 38,
                  fontWeight: 600,
                  color: C.textDim,
                }}
              >
                {n}
              </div>
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: 22,
                  height: 4,
                  width: `calc(${strikes[i] * 100}% - 44px)`,
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

/* 29 — 104.25-106.65  "Verify information yourself." */
export const VerifyYourself: React.FC<{ dur: number }> = ({ dur }) => (
  <Scene dur={dur} enter="scale">
    <Center gap={26}>
      <Eyebrow color={C.textFaint}>Instead</Eyebrow>
      <KeyWords words={["Verify", "it", "yourself"]} accent={[0]} size={124} delay={4} />
      <Rule delay={20} width={520} />
    </Center>
  </Scene>
);

/* 30 — 106.65-110.75  "That mindset is one of the most valuable things you can learn here." */
export const Mindset: React.FC<{ dur: number }> = ({ dur }) => (
  <Scene dur={dur} enter="fade">
    <Center>
      <Statement size={66} delay={10}>
        That mindset is the most <span style={{ color: C.goldBright }}>valuable thing</span> you can learn here.
      </Statement>
    </Center>
  </Scene>
);

/* 31 — 110.75-113.75  "This community should help make your research easier." */
export const ResearchEasier: React.FC<{ dur: number }> = ({ dur }) => (
  <Scene dur={dur} enter="rise">
    <Center gap={26}>
      <Eyebrow color={C.textFaint}>This community should</Eyebrow>
      <KeyWords words={["Make", "research", "easier"]} accent={[1]} size={96} delay={4} />
    </Center>
  </Scene>
);

/* 32 — 113.75-115.92  "It should never replace your own judgment." */
export const NeverReplace: React.FC<{ dur: number }> = ({ dur }) => {
  const line = useIn(4, 22);
  const mark = useIn(26, 22);
  return (
    <Scene dur={dur} enter="fade">
      <Center gap={40}>
        <div
          style={{
            opacity: line,
            fontFamily: SERIF,
            fontSize: 72,
            fontWeight: 600,
            color: C.text,
            letterSpacing: -1,
            textAlign: "center",
            maxWidth: 1400,
          }}
        >
          It should never replace your <span style={{ color: C.goldBright }}>own judgment</span>.
        </div>
        <div style={{ opacity: mark, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          <Rule delay={28} width={300} />
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
