import React from "react";
import { useCurrentFrame } from "remotion";
import { Shot, Stack } from "../../../shared/components/Shot";
import { Chip, MaskWords, TrackLabel, WipeRule } from "../../../shared/components/Kinetic";
import { LightSweep } from "../../../shared/components/StageV2";
import { AppTile, Bell, LinkPair, TabBar, UnlockLock } from "../../../shared/components/Onboard";
import {
  AvatarRow,
  Bubbles,
  CardFan,
  CheckList,
  MapPin,
  NotifStack,
  Orbit,
  PhoneFeed,
  ProgressRing,
  Pulse,
} from "../../../shared/components/OnboardFx";
import { animAt, maskUp, transformOrNone } from "../../../shared/motion";
import { C, SANS, SERIF } from "../../../shared/theme";

/*
 * Every delay is a frame offset from the SHOT's own start, and each shot starts
 * on a word boundary from work/onboarding/transcript.json.
 *
 * Two rules hold throughout:
 *   - Everything carrying meaning settles to exactly identity. Ambient layers
 *     are the only things allowed to keep moving.
 *   - A beat must finish arriving well before its shot starts fading. `Shot`
 *     begins its fade at dur-9, so nothing meaningful settles after that.
 *
 * EVERY shot is wrapped in <Stack>. That is what centres it — <Shot> alone is a
 * plain AbsoluteFill, so a bare <div> inside it lands top-left.
 */

/* 1 — 0.0-4.2  "Hey, welcome to Peps by Dave. I'm really glad you're here." */
export const TitleOpen: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const t = animAt(f, 10, 34, "heavy");
  const sub = animAt(f, 62, 30, "enter");
  const orb = animAt(f, 8, 60, "heavy");
  return (
    <Shot dur={dur} enter="hold">
      <Orbit p={orb} r={430} n={3} />
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
      <Pulse at={12} size={520} />
      <LightSweep at={22} dur={52} />
    </Shot>
  );
};

/* 2 — 4.2-7.2  "downloading the Skool app"
   The tile and the phone arrive as a pair, so the shot has depth rather than a
   single object floating in the middle. */
export const DownloadApp: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const tile = animAt(f, 10, 28, "overshoot");
  const phone = animAt(f, 20, 30, "enter");
  const label = animAt(f, 28, 26, "enter");
  return (
    <Shot dur={dur} enter="fade">
      <Stack gap={30}>
        <TrackLabel delay={2} color={C.textFaint}>
          First thing
        </TrackLabel>
        <div style={{ display: "flex", alignItems: "center", gap: 74 }}>
          <AppTile p={tile} size={158} />
          <PhoneFeed p={phone} delay={30} step={8} rows={3} goldRow={0} w={252} />
        </div>
        <div style={{ opacity: label }}>
          <MaskWords words={["Download", "the", "app"]} accent={[2]} size={72} delay={28} step={5} />
        </div>
      </Stack>
      <Pulse at={14} size={380} />
    </Shot>
  );
};

/* 3 — 7.2-9.0  "and turning your notifications on." */
export const Notifications: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const bell = animAt(f, 2, 22, "enter");
  return (
    <Shot dur={dur} enter="rise">
      <Stack gap={30}>
        <Bell p={bell} ring={10} size={150} />
        <MaskWords words={["Notifications", "on"]} accent={[1]} size={82} delay={6} step={5} />
      </Stack>
      <Pulse at={12} size={330} />
    </Shot>
  );
};

/* 4 — 9.0-14.5  "you don't miss new posts, updates, or anything we add"
   Cards land on their own words: posts 10.4s, updates 11.2s, anything 12.1s —
   42 / 66 / 93 frames after 9.0s. */
export const DontMiss: React.FC<{ dur: number }> = ({ dur }) => (
  <Shot dur={dur} enter="fade">
    <Stack gap={40}>
      <TrackLabel delay={2} color={C.textFaint}>
        So you don't miss
      </TrackLabel>
      <NotifStack
        items={[
          { title: "New posts", at: 42 },
          { title: "Updates", at: 66 },
          { title: "Anything we add", at: 93 },
        ]}
        w={600}
      />
    </Stack>
  </Shot>
);

/* 5 — 14.5-15.7  "When you're inside," — a 1.2s connective shot, so the bar has
   to be present almost immediately. */
export const WhenInside: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const bar = animAt(f, 0, 20, "enter");
  return (
    <Shot dur={dur} enter="fade">
      <Stack gap={36}>
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
   Avatars fill the room, then bubbles on talks 17.4 / asks 18.3 / shares 19.8 —
   51 / 78 / 123 frames after 15.7s. */
export const CommunityTab: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const bar = animAt(f, 2, 20, "enter");
  const slide = animAt(f, 6, 26, "snap");
  return (
    <Shot dur={dur} enter="fade">
      <Stack gap={34}>
        <TabBar tabs={["Community", "Classroom", "Calendar"]} active={0} p={bar} slide={slide} />
        <AvatarRow n={7} delay={22} step={5} size={68} goldAt={3} />
        <Bubbles
          items={[
            { at: 51, w: 300, side: -1 },
            { at: 78, w: 240, side: 1 },
            { at: 123, w: 340, side: -1 },
          ]}
        />
      </Stack>
    </Shot>
  );
};

/* 7 — 21.8-24.6  "Go ahead and introduce yourself there too." */
export const IntroduceYourself: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const av = animAt(f, 6, 26, "overshoot");
  return (
    <Shot dur={dur} enter="pushL">
      <Stack gap={30}>
        <TrackLabel delay={2} color={C.textFaint}>
          Your first post
        </TrackLabel>
        <div style={{ opacity: av }}>
          <AvatarRow n={1} delay={6} size={104} goldAt={0} />
        </div>
        <MaskWords words={["Introduce", "yourself"]} accent={[0]} size={100} delay={14} step={6} />
      </Stack>
      <Pulse at={10} size={340} />
    </Shot>
  );
};

/* 8 — 24.6-28.0  "Tell us where you're from and what brought you into peptides."
   The pin drops on "where you're from"; the second prompt follows. */
export const TellUs: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const pin = animAt(f, 6, 30, "heavy");
  const a = animAt(f, 20, 24, "enter");
  const b = animAt(f, 48, 24, "enter");
  return (
    <Shot dur={dur} enter="fade">
      <Stack gap={26}>
        <MapPin p={pin} size={116} />
        <div style={{ opacity: a }}>
          <Chip label="Where you're from" p={a} size={44} />
        </div>
        <div style={{ opacity: b }}>
          <Chip label="What brought you to peptides" p={b} tone="gold" size={44} />
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
      <Stack gap={38}>
        <TabBar tabs={["Community", "Classroom", "Calendar"]} active={1} p={bar} slide={slide} />
        <MaskWords words={["The", "classroom"]} accent={[1]} size={80} delay={22} step={6} />
      </Stack>
      <Pulse at={24} size={420} />
    </Shot>
  );
};

/* 10 — 30.5-32.9  "That's where we're building out all the education,"
   The fan is literally the material being built out. */
export const BuildingEducation: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const fan = animAt(f, 4, 40, "enter");
  const p = animAt(f, 20, 30, "heavy");
  return (
    <Shot dur={dur} enter="settle">
      <Stack gap={26}>
        <CardFan p={fan} n={5} w={128} />
        <span style={{ display: "block", overflow: "hidden", paddingBottom: 22 }}>
          <span
            style={{
              display: "block",
              ...maskUp(p),
              fontFamily: SERIF,
              fontWeight: 600,
              fontSize: 104,
              letterSpacing: -3,
              color: C.text,
              lineHeight: 1.04,
            }}
          >
            All the <span style={{ color: C.goldBright }}>education</span>
          </span>
        </span>
      </Stack>
    </Shot>
  );
};

/* 11 — 32.9-38.7  "from beginner basics and COAs to different peptide
   categories and our vendor resources."
   Four ticks on their words: beginner 33.1, COAs 34.2, categories 35.9,
   vendor resources 36.8 — 6 / 39 / 90 / 117 frames after 32.9s.
   Wrapped in <Stack>: this shot previously used a bare div and rendered against
   the top-left corner. */
export const EducationTopics: React.FC<{ dur: number }> = ({ dur }) => (
  <Shot dur={dur} enter="fade">
    <Stack gap={26}>
      <TrackLabel delay={0} color={C.textFaint}>
        Inside the classroom
      </TrackLabel>
      <CheckList
        w={760}
        items={[
          { label: "Beginner basics", at: 6 },
          { label: "COAs", at: 39 },
          { label: "Peptide categories", at: 90 },
          { label: "Vendor resources", at: 117, gold: true },
        ]}
      />
    </Stack>
  </Shot>
);

/* 12 — 38.7-43.2  "Vendor access is unlocked through actually participating."
   The ring fills as participation accrues, the lock opens on "unlocked"
   (39.7s = frame 30), and the reason lands on "participating" (41.0s = 69). */
export const VendorUnlock: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const ring = animAt(f, 4, 46, "enter");
  const lock = animAt(f, 8, 22, "enter");
  const open = animAt(f, 30, 26, "overshoot");
  const why = animAt(f, 69, 26, "enter");
  return (
    <Shot dur={dur} enter="fade">
      <Stack gap={30}>
        <div style={{ position: "relative", display: "grid", placeItems: "center" }}>
          <ProgressRing p={ring} size={252} />
          <div style={{ position: "absolute" }}>
            <UnlockLock p={lock} open={open} size={116} />
          </div>
        </div>
        <MaskWords words={["Vendor", "access", "unlocks"]} accent={[2]} size={68} delay={30} step={5} />
        <div style={{ opacity: why }}>
          <Chip label="Through taking part" p={why} tone="gold" size={40} />
        </div>
      </Stack>
      <Pulse at={34} size={470} />
    </Shot>
  );
};

/* 13 — 43.2-48.2  "we want people building relationships and learning from
   each other" — the link draws on "relationships" (45.8s = frame 78). */
export const Relationships: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const pair = animAt(f, 8, 26, "enter");
  const draw = animAt(f, 78, 30, "snap");
  const orb = animAt(f, 12, 70, "heavy");
  return (
    <Shot dur={dur} enter="fade">
      <Orbit p={orb} r={370} n={4} />
      <Stack gap={38}>
        <TrackLabel delay={2} color={C.textFaint}>
          We built it this way on purpose
        </TrackLabel>
        <LinkPair p={pair} draw={draw} />
        <MaskWords words={["Relationships,", "not", "a", "list"]} accent={[0]} size={60} delay={84} step={4} />
      </Stack>
    </Shot>
  );
};

/* 14 — 48.2-51.4  "not just grabbing a list and disappearing."
   The rule is drawn as a width, so the type underneath never resamples. */
export const NotGrabAndGo: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const p = animAt(f, 6, 26, "enter");
  const strike = animAt(f, 45, 24, "snap");
  const fade = animAt(f, 52, 24, "enter");
  return (
    <Shot dur={dur} enter="fade">
      <Stack gap={28}>
        <div style={{ position: "relative", opacity: p }}>
          <div
            style={{
              fontFamily: SANS,
              fontSize: 70,
              fontWeight: 600,
              // Dims as it is struck, so the strike reads as a verdict.
              color: `rgba(155,160,168,${(1 - fade * 0.45).toFixed(3)})`,
              whiteSpace: "nowrap",
            }}
          >
            Grab a list and disappear
          </div>
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
