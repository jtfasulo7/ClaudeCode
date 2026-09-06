import React from "react";
import { useCurrentFrame } from "remotion";
import { Shot, Stack } from "../../../shared/components/Shot";
import { Chip, MaskWords, TrackLabel, WipeRule } from "../../../shared/components/Kinetic";
import { LightSweep } from "../../../shared/components/StageV2";
import { GrowthBars } from "../../../shared/components/Onboard";
import { animAt, maskUp, transformOrNone } from "../../../shared/motion";
import { C, SANS, SERIF } from "../../../shared/theme";

/* 15 — 51.4-54.2  "We're still a newer community and we're growing fast,"
   Bars fill through "growing" (53.4s = frame 60). */
export const GrowingFast: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const bars = animAt(f, 6, 50, "enter");
  const label = animAt(f, 34, 24, "snap");
  return (
    <Shot dur={dur} enter="rise">
      <Stack gap={36}>
        <TrackLabel delay={2} color={C.textFaint}>
          Still a newer community
        </TrackLabel>
        <GrowthBars p={bars} />
        <div style={{ opacity: label }}>
          <MaskWords words={["Growing", "fast"]} accent={[1]} size={76} delay={34} step={5} />
        </div>
      </Stack>
    </Shot>
  );
};

/* 16 — 54.2-58.3  "so new content and resources are constantly being added."
   "added" lands at 57.1s = frame 87. */
export const ConstantlyAdded: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const a = animAt(f, 8, 24, "enter");
  const b = animAt(f, 34, 24, "enter");
  const c = animAt(f, 60, 26, "overshoot");
  return (
    <Shot dur={dur} enter="fade">
      <Stack gap={26}>
        <div style={{ display: "flex", gap: 20 }}>
          <Chip label="New content" p={a} size={44} />
          <Chip label="New resources" p={b} size={44} />
        </div>
        <div style={{ opacity: c }}>
          <MaskWords words={["Added", "constantly"]} accent={[1]} size={82} delay={60} step={5} />
        </div>
      </Stack>
    </Shot>
  );
};

/* 17 — 58.3-62.6  "Ask questions, share what you know, and get involved."
   Three calls, each on its own verb: ask 58.3, share 59.4, involved 61.1 —
   0 / 33 / 84 frames after 58.3s. */
export const ThreeActions: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const items: [string, number][] = [
    ["Ask questions", 2],
    ["Share what you know", 33],
    ["Get involved", 84],
  ];
  return (
    <Shot dur={dur} enter="fade">
      <div style={{ display: "flex", flexDirection: "column", gap: 22, alignItems: "center" }}>
        {items.map(([label, at], i) => {
          const p = animAt(f, at, 24, "snap");
          const last = i === items.length - 1;
          return (
            <div
              key={label}
              style={{
                opacity: p,
                transform: transformOrNone([`translate3d(0, ${(1 - p) * 26}px, 0)`], p < 1),
                fontFamily: SERIF,
                fontWeight: 600,
                fontSize: last ? 104 : 84,
                letterSpacing: -2,
                color: last ? C.goldBright : C.text,
                lineHeight: 1.06,
              }}
            >
              {label}
            </div>
          );
        })}
      </div>
    </Shot>
  );
};

/* 18 — 62.6-64.2  "Just remember," */
export const JustRemember: React.FC<{ dur: number }> = ({ dur }) => (
  <Shot dur={dur} enter="settle">
    <Stack gap={20}>
      <MaskWords words={["Just", "remember"]} size={92} delay={2} step={5} />
      <WipeRule delay={20} width={300} />
    </Stack>
  </Shot>
);

/* 19 — 64.2-68.5  "conversations here are for education and shouldn't be taken
   as medical advice."
   The distinction is the whole scene: education at 64.8s (frame 18), the
   disclaimer at 66.7s (frame 75). Stated plainly, not decorated. */
export const NotMedicalAdvice: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const edu = animAt(f, 18, 26, "enter");
  const med = animAt(f, 75, 26, "enter");
  return (
    <Shot dur={dur} enter="fade">
      <Stack gap={30}>
        <div style={{ opacity: edu }}>
          <Chip label="For education" p={edu} tone="gold" size={50} />
        </div>
        <div
          style={{
            opacity: med,
            transform: transformOrNone([`translate3d(0, ${(1 - med) * 18}px, 0)`], med < 1),
            fontFamily: SANS,
            fontSize: 52,
            fontWeight: 600,
            color: C.textDim,
            textAlign: "center",
            maxWidth: 1200,
            lineHeight: 1.3,
          }}
        >
          Not medical advice
        </div>
      </Stack>
    </Shot>
  );
};

/* 20 — 68.5-END  "Welcome in, I'll see you in the community."
   Holds past the last word so the score can resolve rather than stop. */
export const EndCard: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const t = animAt(f, 8, 34, "heavy");
  const sub = animAt(f, 40, 30, "enter");
  return (
    <Shot dur={dur} enter="fade">
      <Stack gap={24}>
        <span style={{ display: "block", overflow: "hidden", paddingBottom: 30 }}>
          <span
            style={{
              display: "block",
              ...maskUp(t),
              fontFamily: SERIF,
              fontWeight: 600,
              fontSize: 156,
              letterSpacing: -5,
              color: C.text,
              lineHeight: 1,
            }}
          >
            See you <span style={{ color: C.goldBright }}>inside</span>
          </span>
        </span>
        <WipeRule delay={42} width={420} />
        <div
          style={{
            opacity: sub,
            fontFamily: SANS,
            fontSize: 27,
            letterSpacing: 5,
            textTransform: "uppercase",
            color: C.textDim,
            marginTop: 4,
          }}
        >
          Peps by Dave
        </div>
      </Stack>
      <LightSweep at={30} dur={60} />
    </Shot>
  );
};
