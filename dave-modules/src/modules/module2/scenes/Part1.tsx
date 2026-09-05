import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Shot, Stack } from "../../../shared/components/Shot";
import { Chip, MaskWords, TrackLabel, WipeRule } from "../../../shared/components/Kinetic";
import { LightSweep } from "../../../shared/components/StageV2";
import { animAt, maskRight, maskUp, transformOrNone } from "../../../shared/motion";
import { C, SANS, SERIF } from "../../../shared/theme";

/* 1 — 0.00-5.60  "one of the most important things you can understand is testing" */
export const TitleOpen: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const t = animAt(f, 12, 34, "heavy");
  const sub = animAt(f, 132, 30, "enter");
  return (
    <Shot dur={dur} enter="hold">
      <Stack gap={26}>
        <TrackLabel delay={4}>Peps by Dave · Module 02</TrackLabel>
        <span style={{ display: "block", overflow: "hidden", paddingBottom: 34 }}>
          <span
            style={{
              display: "block",
              ...maskUp(t),
              fontFamily: SERIF,
              fontWeight: 600,
              fontSize: 176,
              letterSpacing: -5,
              color: C.text,
              lineHeight: 1,
            }}
          >
            Understanding <span style={{ color: C.goldBright }}>testing</span>
          </span>
        </span>
        <WipeRule delay={48} width={480} />
        <div
          style={{
            opacity: sub,
            fontFamily: SANS,
            fontSize: 28,
            letterSpacing: 5,
            textTransform: "uppercase",
            color: C.textDim,
            marginTop: 6,
          }}
        >
          What a COA does and does not tell you
        </div>
      </Stack>
      <LightSweep at={26} dur={54} />
    </Shot>
  );
};

/* 2 — 5.60-9.30  "You're going to see the term COA all the time." */
export const TheTermCOA: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const coa = animAt(f, 45, 30, "heavy");
  return (
    <Shot dur={dur} enter="fade">
      <Stack gap={30}>
        <TrackLabel delay={4} color={C.textFaint}>
          You will see this term constantly
        </TrackLabel>
        <div
          style={{
            opacity: coa,
            transform: transformOrNone([`scale(${1.08 + (1 - 1.08) * coa})`], coa < 1),
            fontFamily: SANS,
            fontSize: 210,
            fontWeight: 800,
            letterSpacing: 8,
            color: C.goldBright,
            lineHeight: 1,
          }}
        >
          COA
        </div>
      </Stack>
    </Shot>
  );
};

/* 3 — 9.30-12.10  "COA stands for certificate of analysis." */
export const CertificateOf: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const exp = animAt(f, 33, 30, "enter");
  return (
    <Shot dur={dur} enter="fade">
      <Stack gap={22}>
        <div
          style={{
            fontFamily: SANS,
            fontSize: 96,
            fontWeight: 800,
            letterSpacing: 5,
            color: C.goldBright,
            lineHeight: 1,
          }}
        >
          COA
        </div>
        <div style={{ opacity: exp }}>
          <WipeRule delay={36} width={440} />
        </div>
        <div style={{ opacity: exp }}>
          <MaskWords
            words={["Certificate", "of", "analysis"]}
            accent={[]}
            size={62}
            delay={40}
            step={5}
            color={C.text}
          />
        </div>
      </Stack>
    </Shot>
  );
};

/* 4 — 12.10-15.00  "here's where a lot of beginners get confused" */
export const BeginnersConfused: React.FC<{ dur: number }> = ({ dur }) => (
  <Shot dur={dur} enter="settle">
    <Stack gap={26}>
      <TrackLabel delay={4} color={C.red}>
        But here is where
      </TrackLabel>
      <MaskWords words={["Beginners", "get", "confused"]} accent={[2]} size={104} delay={8} step={5} />
    </Stack>
  </Shot>
);

/* 5 — 15.00-20.60  "Just because a vendor posts a COA does not mean you can trust the product." */
export const PostingIsntTrust: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const a = animAt(f, 33, 28, "enter");
  const b = animAt(f, 69, 28, "enter");
  const strike = animAt(f, 123, 30, "enter");
  return (
    <Shot dur={dur} enter="fade">
      <Stack gap={38}>
        <div style={{ opacity: a }}>
          <TrackLabel delay={33} color={C.textFaint}>
            A vendor posting a COA
          </TrackLabel>
        </div>
        <div style={{ position: "relative", opacity: b }}>
          <MaskWords words={["Means", "you", "can", "trust", "it"]} accent={[]} size={78} delay={69} step={4} color={C.textDim} />
          <div
            style={{
              position: "absolute",
              top: "48%",
              left: -12,
              right: -12,
              height: 5,
              borderRadius: 3,
              background: C.red,
              ...maskRight(strike),
            }}
          />
        </div>
      </Stack>
    </Shot>
  );
};

/* 6 — 20.60-25.90  "The report could be legitimate, but you still have to ask an important question." */
export const ReportLegit: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const a = animAt(f, 30, 28, "enter");
  const b = animAt(f, 105, 30, "enter");
  return (
    <Shot dur={dur} enter="fade">
      <Stack gap={40}>
        <div style={{ opacity: a, display: "flex", alignItems: "center", gap: 20 }}>
          <svg width="46" height="46" viewBox="0 0 46 46">
            <circle cx="23" cy="23" r="21" fill="none" stroke={C.green} strokeWidth="2" opacity={0.45} />
            <path
              d="M13 23.5 L20 30.5 L33 15.5"
              fill="none"
              stroke={C.green}
              strokeWidth="3.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={34}
              strokeDashoffset={34 * (1 - a)}
            />
          </svg>
          <span style={{ fontFamily: SANS, fontSize: 44, fontWeight: 600, color: C.textDim }}>
            The report itself may be legitimate
          </span>
        </div>
        <div style={{ opacity: b }}>
          <MaskWords words={["But", "one", "question", "remains"]} accent={[2]} size={72} delay={105} step={5} />
        </div>
      </Stack>
    </Shot>
  );
};

/* 7 — 25.90-29.00  "Who selected the sample that was tested?"  — the hinge of the film */
export const WhoSelected: React.FC<{ dur: number }> = ({ dur }) => (
  <Shot dur={dur} enter="settle">
    <Stack gap={24}>
      <MaskWords words={["Who", "selected", "the", "sample?"]} accent={[0, 1]} size={116} delay={3} step={5} />
    </Stack>
  </Shot>
);

/* 8 — 29.00-35.30  "the vendor chooses the vial, sends it to the lab, pays for the test, posts the best result"
 *
 * The problem stated as a chain. Each link lands on its bell in the score.
 */
export const VendorChain: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const CUES = [24, 63, 96, 138];
  const NAMES = ["Chooses the vial", "Sends it to the lab", "Pays for the test", "Posts the best result"];
  return (
    <Shot dur={dur} enter="fade">
      <Stack gap={44}>
        <TrackLabel delay={4} color={C.red}>
          If the vendor
        </TrackLabel>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {NAMES.map((n, i) => {
            const p = animAt(f, CUES[i], 24, "enter");
            const last = i === 3;
            return (
              <React.Fragment key={i}>
                {i > 0 && (
                  <svg width="46" height="18" viewBox="0 0 46 18" style={{ ...maskRight(p) }}>
                    <path
                      d="M2 9 H38 M31 3 L40 9 L31 15"
                      fill="none"
                      stroke={C.textFaint}
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    />
                  </svg>
                )}
                <div
                  style={{
                    opacity: p,
                    transform: transformOrNone([`translateY(${(1 - p) * 26}px)`], p < 1),
                    width: 300,
                    minHeight: 150,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    padding: "26px 22px",
                    borderRadius: 14,
                    border: `1.5px solid ${last ? C.red : C.line}`,
                    background: last ? "rgba(180,72,60,0.10)" : "rgba(255,255,255,0.022)",
                    fontFamily: SANS,
                    fontSize: 32,
                    fontWeight: 600,
                    color: last ? C.text : C.textDim,
                    lineHeight: 1.22,
                  }}
                >
                  {n}
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </Stack>
    </Shot>
  );
};

/* 9 — 35.30-39.80  "that test may not tell you the full story about everything they're selling" */
export const NotFullStory: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const b = animAt(f, 93, 28, "enter");
  return (
    <Shot dur={dur} enter="pushL">
      <Stack gap={32}>
        <MaskWords words={["Not", "the", "full", "story"]} accent={[2, 3]} size={98} delay={48} step={5} />
        <div style={{ opacity: b }}>
          <TrackLabel delay={93} color={C.textDim}>
            About everything they are currently selling
          </TrackLabel>
        </div>
      </Stack>
    </Shot>
  );
};

/* 10 — 39.80-43.50  "That's why independent third-party testing matters." */
export const IndependentMatters: React.FC<{ dur: number }> = ({ dur }) => (
  <Shot dur={dur} enter="rise">
    <Stack gap={26}>
      <TrackLabel delay={4} color={C.textFaint}>
        Which is why
      </TrackLabel>
      <MaskWords words={["Independent", "testing", "matters"]} accent={[0]} size={92} delay={18} step={5} />
    </Stack>
  </Shot>
);

/* 11 — 43.50-48.60  "Ideally the person selecting and submitting the sample is independent from the seller." */
export const IdeallyIndependent: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const a = animAt(f, 36, 28, "enter");
  const b = animAt(f, 96, 30, "enter");
  return (
    <Shot dur={dur} enter="fade">
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 42 }}>
        <div style={{ opacity: a }}>
          <TrackLabel delay={36} color={C.textFaint}>
            Whoever selects and submits the sample
          </TrackLabel>
        </div>
        <div style={{ display: "flex", gap: 34, alignItems: "stretch", opacity: b }}>
          {[
            { k: "Not", v: "The seller", tone: "red" as const },
            { k: "But", v: "Someone independent", tone: "green" as const },
          ].map((x, i) => (
            <div
              key={i}
              style={{
                width: 470,
                padding: "36px 32px",
                borderRadius: 16,
                border: `1.5px solid ${x.tone === "red" ? "rgba(180,72,60,0.5)" : "rgba(62,158,106,0.5)"}`,
                background: x.tone === "red" ? "rgba(180,72,60,0.07)" : "rgba(62,158,106,0.07)",
                textAlign: "center",
                fontFamily: SANS,
              }}
            >
              <div
                style={{
                  fontSize: 22,
                  letterSpacing: 3,
                  textTransform: "uppercase",
                  color: x.tone === "red" ? C.red : C.green,
                }}
              >
                {x.k}
              </div>
              <div style={{ fontSize: 44, fontWeight: 800, color: C.text, marginTop: 14, letterSpacing: -1 }}>
                {x.v}
              </div>
            </div>
          ))}
        </div>
      </AbsoluteFill>
    </Shot>
  );
};

/* 12 — 48.60-53.00  "That removes some of the incentive to only test a perfect sample." */
export const RemovesIncentive: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const b = animAt(f, 63, 30, "enter");
  return (
    <Shot dur={dur} enter="settle">
      <Stack gap={30}>
        <MaskWords words={["It", "removes", "the", "incentive"]} accent={[3]} size={78} delay={42} step={5} />
        <div style={{ opacity: b }}>
          <TrackLabel delay={63} color={C.gold}>
            To only ever test a perfect sample
          </TrackLabel>
        </div>
      </Stack>
    </Shot>
  );
};
