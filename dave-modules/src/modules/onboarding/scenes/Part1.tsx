import React from "react";
import { useCurrentFrame } from "remotion";
import { Shot, Stack } from "../../../shared/components/Shot";
import { Chip, MaskWords, TrackLabel, WipeRule } from "../../../shared/components/Kinetic";
import { LightSweep } from "../../../shared/components/StageV2";
import { AppTile, Bell, LinkPair, Phone, TabBar, UnlockLock } from "../../../shared/components/Onboard";
import { animAt, maskUp, transformOrNone } from "../../../shared/motion";
import { C, SANS, SERIF } from "../../../shared/theme";

/*
 * Every delay below is a frame offset from the SHOT's own start, and each shot
 * starts on a word boundary from work/onboarding/transcript.json. Where a beat
 * lands inside a shot — three chips, four topics — it is timed to the word that
 * names it, not to an even cadence.
 */

/* 1 — 0.0-4.2  "Hey, welcome to Peps by Dave. I'm really glad you're here." */
export const TitleOpen: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const t = animAt(f, 10, 34, "heavy");
  // "I'm really glad you're here" lands at 2.4s = frame 72.
  const sub = animAt(f, 66, 30, "enter");
  return (
    <Shot dur={dur} enter="hold">
      <Stack gap={24}>
        <TrackLabel delay={2}>Peps by Dave · Start here</TrackLabel>
        <span style={{ display: "block", overflow: "hidden", paddingBottom: 30 }}>
          <span
            style={{
              display: "block",
              ...maskUp(t),
              fontFamily: SERIF,
              fontWeight: 600,
              fontSize: 168,
              letterSpacing: -5,
              color: C.text,
              lineHeight: 1,
            }}
          >
            Welcome <span style={{ color: C.goldBright }}>in</span>
          </span>
        </span>
        <WipeRule delay={44} width={440} />
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
          Glad you're here
        </div>
      </Stack>
      <LightSweep at={22} dur={52} />
    </Shot>
  );
};

/* 2 — 4.2-7.2  "First thing I'd recommend is downloading the Skool app" */
export const DownloadApp: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const tile = animAt(f, 14, 30, "overshoot");
  const label = animAt(f, 28, 26, "enter");
  return (
    <Shot dur={dur} enter="fade">
      <Stack gap={40}>
        <TrackLabel delay={2} color={C.textFaint}>
          First thing
        </TrackLabel>
        <AppTile p={tile} />
        <div style={{ opacity: label }}>
          <MaskWords words={["Download", "the", "app"]} accent={[2]} size={78} delay={28} step={5} />
        </div>
      </Stack>
    </Shot>
  );
};

/* 3 — 7.2-9.0  "and turning your notifications on." */
export const Notifications: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const bell = animAt(f, 2, 22, "enter");
  return (
    <Shot dur={dur} enter="rise">
      <Stack gap={34}>
        <Bell p={bell} ring={10} size={170} />
        <MaskWords words={["Notifications", "on"]} accent={[1]} size={86} delay={6} step={5} />
      </Stack>
    </Shot>
  );
};

/* 4 — 9.0-14.5  "you don't miss new posts, updates, or anything we add"
   Chips land on their own words: posts 10.4s, updates 11.2s, anything 12.1s.
   Shot starts at 9.0s, so 42 / 66 / 93 frames in. */
export const DontMiss: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const items: [string, number][] = [
    ["New posts", 42],
    ["Updates", 66],
    ["Anything we add", 93],
  ];
  return (
    <Shot dur={dur} enter="fade">
      <Stack gap={44}>
        <TrackLabel delay={2} color={C.textFaint}>
          So you don't miss
        </TrackLabel>
        <div style={{ display: "flex", gap: 22, flexWrap: "wrap", justifyContent: "center" }}>
          {items.map(([label, at]) => (
            <Chip key={label} label={label} p={animAt(f, at, 22, "snap")} tone="gold" size={44} />
          ))}
        </div>
      </Stack>
    </Shot>
  );
};

/* 5 — 14.5-15.7  "When you're inside," — the tab bar arrives, nothing selected yet */
export const WhenInside: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const bar = animAt(f, 0, 20, "enter");
  return (
    <Shot dur={dur} enter="fade">
      <Stack gap={38}>
        <TrackLabel delay={0} color={C.textFaint}>
          Once you're inside
        </TrackLabel>
        <TabBar tabs={["Community", "Classroom", "Calendar"]} active={0} p={bar} slide={0} />
      </Stack>
    </Shot>
  );
};

/* 6 — 15.7-21.8  "the community tab is where everyone talks, asks questions,
   and shares what they're learning."
   Highlight slides onto Community, then three beats: talks 17.4, asks 18.3,
   shares 19.8 — 51 / 78 / 123 frames after 15.7s. */
export const CommunityTab: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const bar = animAt(f, 2, 20, "enter");
  const slide = animAt(f, 6, 26, "snap");
  const items: [string, number][] = [
    ["Everyone talks", 51],
    ["Asks questions", 78],
    ["Shares what they learn", 123],
  ];
  return (
    <Shot dur={dur} enter="fade">
      <Stack gap={44}>
        <TabBar tabs={["Community", "Classroom", "Calendar"]} active={0} p={bar} slide={slide} />
        <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "center" }}>
          {items.map(([label, at]) => (
            <Chip key={label} label={label} p={animAt(f, at, 22, "snap")} size={40} />
          ))}
        </div>
      </Stack>
    </Shot>
  );
};

/* 7 — 21.8-24.6  "Go ahead and introduce yourself there too." */
export const IntroduceYourself: React.FC<{ dur: number }> = ({ dur }) => (
  <Shot dur={dur} enter="pushL">
    <Stack gap={30}>
      <TrackLabel delay={2} color={C.textFaint}>
        Your first post
      </TrackLabel>
      <MaskWords words={["Introduce", "yourself"]} accent={[0]} size={108} delay={8} step={6} />
    </Stack>
  </Shot>
);

/* 8 — 24.6-28.0  "Tell us where you're from and what brought you into peptides." */
export const TellUs: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const a = animAt(f, 10, 24, "enter");
  const b = animAt(f, 40, 24, "enter");
  return (
    <Shot dur={dur} enter="fade">
      <Stack gap={30}>
        <div style={{ opacity: a }}>
          <Chip label="Where you're from" p={a} size={46} />
        </div>
        <div style={{ opacity: b }}>
          <Chip label="What brought you to peptides" p={b} tone="gold" size={46} />
        </div>
      </Stack>
    </Shot>
  );
};

/* 9 — 28.0-30.5  "Then check out the classroom tab."
   The highlight moves off Community and onto Classroom — the one moment in the
   film where that bar earns its keep. */
export const ClassroomTab: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const bar = animAt(f, 2, 18, "enter");
  const slide = animAt(f, 10, 28, "snap");
  return (
    <Shot dur={dur} enter="fade">
      <Stack gap={40}>
        <TabBar tabs={["Community", "Classroom", "Calendar"]} active={1} p={bar} slide={slide} />
        <MaskWords words={["The", "classroom"]} accent={[1]} size={84} delay={22} step={6} />
      </Stack>
    </Shot>
  );
};

/* 10 — 30.5-32.9  "That's where we're building out all the education," */
export const BuildingEducation: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const p = animAt(f, 8, 30, "heavy");
  return (
    <Shot dur={dur} enter="settle">
      <Stack gap={22}>
        <span style={{ display: "block", overflow: "hidden", paddingBottom: 22 }}>
          <span
            style={{
              display: "block",
              ...maskUp(p),
              fontFamily: SERIF,
              fontWeight: 600,
              fontSize: 116,
              letterSpacing: -3,
              color: C.text,
              lineHeight: 1.04,
            }}
          >
            All the <span style={{ color: C.goldBright }}>education</span>
          </span>
        </span>
        <WipeRule delay={34} width={360} />
      </Stack>
    </Shot>
  );
};

/* 11 — 32.9-38.7  "from beginner basics and COAs to different peptide
   categories and our vendor resources."
   Four topics on their words: beginner 33.1, COAs 34.2, categories 35.9,
   vendor resources 36.8 — 6 / 39 / 90 / 117 frames after 32.9s. */
export const EducationTopics: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const items: [string, number, boolean][] = [
    ["Beginner basics", 6, false],
    ["COAs", 39, false],
    ["Peptide categories", 90, false],
    ["Vendor resources", 117, true],
  ];
  return (
    <Shot dur={dur} enter="fade">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 24,
          width: 1180,
        }}
      >
        {items.map(([label, at, gold]) => {
          const p = animAt(f, at, 24, "snap");
          return (
            <div
              key={label}
              style={{
                opacity: p,
                transform: transformOrNone([`translate3d(0, ${(1 - p) * 22}px, 0)`], p < 1),
                border: `1.5px solid ${gold ? C.gold : C.line}`,
                background: gold ? "rgba(201,162,39,0.08)" : C.panel,
                borderRadius: 16,
                padding: "38px 34px",
                fontFamily: SANS,
                fontSize: 44,
                fontWeight: 600,
                color: gold ? C.goldBright : C.text,
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

/* 12 — 38.7-43.2  "Vendor access is unlocked through actually participating."
   Lock opens on "unlocked" (39.7s = frame 30), the reason lands on
   "participating" (41.0s = frame 69). */
export const VendorUnlock: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const lock = animAt(f, 4, 22, "enter");
  const open = animAt(f, 30, 26, "overshoot");
  const why = animAt(f, 69, 26, "enter");
  return (
    <Shot dur={dur} enter="fade">
      <Stack gap={34}>
        <UnlockLock p={lock} open={open} size={186} />
        <MaskWords words={["Vendor", "access", "unlocks"]} accent={[2]} size={72} delay={30} step={5} />
        <div style={{ opacity: why }}>
          <Chip label="Through taking part" p={why} tone="gold" size={40} />
        </div>
      </Stack>
    </Shot>
  );
};

/* 13 — 43.2-48.2  "we want people building relationships and learning from
   each other" — the link draws on "relationships" (45.8s = frame 78). */
export const Relationships: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const pair = animAt(f, 8, 26, "enter");
  const draw = animAt(f, 78, 30, "snap");
  return (
    <Shot dur={dur} enter="fade">
      <Stack gap={40}>
        <TrackLabel delay={2} color={C.textFaint}>
          We built it this way on purpose
        </TrackLabel>
        <LinkPair p={pair} draw={draw} />
        <MaskWords words={["Relationships,", "not", "a", "list"]} accent={[0]} size={64} delay={84} step={4} />
      </Stack>
    </Shot>
  );
};

/* 14 — 48.2-51.4  "not just grabbing a list and disappearing."
   The struck line is the point, so it strikes on "disappearing" (49.7s = 45). */
export const NotGrabAndGo: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const p = animAt(f, 6, 26, "enter");
  const strike = animAt(f, 45, 24, "snap");
  return (
    <Shot dur={dur} enter="fade">
      <Stack gap={28}>
        <div style={{ position: "relative", opacity: p }}>
          <div
            style={{
              fontFamily: SANS,
              fontSize: 74,
              fontWeight: 600,
              color: C.textDim,
              whiteSpace: "nowrap",
            }}
          >
            Grab a list and disappear
          </div>
          {/* Drawn as a width, not a scale, so the text underneath never resamples. */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: "52%",
              height: 4,
              width: `${(strike * 100).toFixed(2)}%`,
              background: C.red,
              borderRadius: 2,
            }}
          />
        </div>
      </Stack>
    </Shot>
  );
};
