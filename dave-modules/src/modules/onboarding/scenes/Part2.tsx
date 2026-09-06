import React from "react";
import { useCurrentFrame } from "remotion";
import { Shot, Stack } from "../../../shared/components/Shot";
import { Chip, MaskWords, TrackLabel, WipeRule } from "../../../shared/components/Kinetic";
import { LightSweep } from "../../../shared/components/StageV2";
import { GrowthBars } from "../../../shared/components/Onboard";
import { AvatarRow, Orbit, Pulse } from "../../../shared/components/OnboardFx";
import { animAt, maskUp, transformOrNone } from "../../../shared/motion";
import { C, SANS, SERIF } from "../../../shared/theme";

/* 15 — 51.4-54.2  "We're still a newer community and we're growing fast."
   The headline lands on the start of the phrase rather than on the word
   "growing" at 53.4s, which sat under the cut. The last bar turning gold
   carries that word instead. */
export const GrowingFast: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const bars = animAt(f, 6, 50, "enter");
  const label = animAt(f, 34, 24, "snap");
  const av = animAt(f, 2, 30, "overshoot");
  return (
    <Shot dur={dur} enter="rise">
      <Stack gap={28}>
        <TrackLabel delay={0} color={C.textFaint}>
          Still a newer community
        </TrackLabel>
        <div style={{ opacity: av }}>
          <AvatarRow n={5} delay={2} step={4} size={54} goldAt={4} />
        </div>
        <GrowthBars p={bars} />
        <div style={{ opacity: label }}>
          <MaskWords words={["Growing", "fast"]} accent={[1]} size={72} delay={34} step={5} />
        </div>
      </Stack>
    </Shot>
  );
};

/* 16 — 54.2-58.3  "so new content and resources are constantly being added."
   Lands on "constantly" (56.3s = frame 63) rather than the final word "added",
   which left seven frames to read a headline. */
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
          <MaskWords words={["Added", "constantly"]} accent={[1]} size={78} delay={60} step={5} />
        </div>
      </Stack>
      <Pulse at={64} size={430} />
    </Shot>
  );
};

/* 17 — 58.3-62.6  "Ask questions, share what you know, and get involved."
   Each call on its own verb: ask 58.3, share 59.4, involved 61.1 —
   2 / 33 / 84 frames after 58.3s.
   Wrapped in <Stack>: this shot previously used a bare div and rendered against
   the top-left corner. */
export const ThreeActions: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const items: [string, number][] = [
    ["Ask questions", 2],
    ["Share what you know", 33],
    ["Get involved", 84],
  ];
  const orb = animAt(f, 6, 74, "heavy");
  return (
    <Shot dur={dur} enter="fade">
      <Orbit p={orb} r={400} n={3} />
      <Stack gap={20}>
        {items.map(([label, at], i) => {
          const p = animAt(f, at, 24, "snap");
          const last = i === items.length - 1;
          return (
            <div
              key={label}
              style={{
                opacity: p,
                transform: transformOrNone(
                  [`translate3d(0, ${((1 - p) * 26).toFixed(2)}px, 0)`],
                  p < 1,
                ),
                fontFamily: SERIF,
                fontWeight: 600,
                fontSize: last ? 100 : 80,
                letterSpacing: -2,
                color: last ? C.goldBright : C.text,
                lineHeight: 1.06,
              }}
            >
              {label}
            </div>
          );
        })}
      </Stack>
      <Pulse at={86} size={520} />
    </Shot>
  );
};

/* 18 — 62.6-64.2  "Just remember," — a 1.6s beat, so it arrives immediately. */
export const JustRemember: React.FC<{ dur: number }> = ({ dur }) => (
  <Shot dur={dur} enter="settle">
    <Stack gap={20}>
      <MaskWords words={["Just", "remember"]} size={88} delay={2} step={5} />
      <WipeRule delay={20} width={300} />
    </Stack>
  </Shot>
);

/* 19 — 64.2-68.5  "conversations here are for education and shouldn't be taken
   as medical advice."
   Education at 64.8s (frame 18), the disclaimer at 66.7s (frame 75). Stated
   plainly — a caution is the one place in this film not to decorate. */
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
            transform: transformOrNone([`translate3d(0, ${((1 - med) * 18).toFixed(2)}px, 0)`], med < 1),
            fontFamily: SANS,
            fontSize: 50,
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
   Holds past the last word so the score resolves rather than stops. */
export const EndCard: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const t = animAt(f, 8, 34, "heavy");
  const sub = animAt(f, 40, 30, "enter");
  const av = animAt(f, 54, 34, "overshoot");
  const orb = animAt(f, 4, 80, "heavy");
  return (
    <Shot dur={dur} enter="fade">
      <Orbit p={orb} r={460} n={5} />
      <Stack gap={22}>
        <span style={{ display: "block", overflow: "hidden", paddingBottom: 30 }}>
          <span
            style={{
              display: "block",
              ...maskUp(t),
              fontFamily: SERIF,
              fontWeight: 600,
              fontSize: 152,
              letterSpacing: -5,
              color: C.text,
              lineHeight: 1,
            }}
          >
            See you <span style={{ color: C.goldBright }}>inside</span>
          </span>
        </span>
        <WipeRule delay={42} width={420} />
        <div style={{ opacity: av }}>
          <AvatarRow n={7} delay={54} step={4} size={52} goldAt={3} />
        </div>
        <div
          style={{
            opacity: sub,
            fontFamily: SANS,
            fontSize: 26,
            letterSpacing: 5,
            textTransform: "uppercase",
            color: C.textDim,
            marginTop: 2,
          }}
        >
          Peps by Dave
        </div>
      </Stack>
      <Pulse at={16} size={620} />
      <LightSweep at={30} dur={60} />
    </Shot>
  );
};
