import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { GrainV2, ProgressV2, StageV2 } from "../../shared/components/StageV2";
import { sec } from "../../shared/theme";

import {
  BuildingEducation,
  ClassroomTab,
  CommunityTab,
  DontMiss,
  DownloadApp,
  EducationTopics,
  IntroduceYourself,
  NotGrabAndGo,
  Notifications,
  Relationships,
  TellUs,
  TitleOpen,
  VendorUnlock,
  WhenInside,
} from "./scenes/Part1";
import {
  ConstantlyAdded,
  EndCard,
  GrowingFast,
  JustRemember,
  NotMedicalAdvice,
  ThreeActions,
} from "./scenes/Part2";

/**
 * Cut sheet — every boundary is a word timestamp from
 * work/onboarding/transcript.json, same rule as every other module here.
 *
 * The film has two halves and one hinge. Everything up to 38.7s is mechanical:
 * install the app, turn on notifications, here are the two tabs. The hinge is
 * "vendor access is unlocked through participating" — the moment the video
 * stops describing an interface and starts explaining a decision. Everything
 * after it is about why the room works the way it does.
 *
 * The score follows that shape: sparse and instructional under the first half,
 * warmer from the unlock, resolving on the end card.
 *
 * One transcription note: Whisper hears "school app". The platform is Skool, so
 * that is what the screen says. The audio is unchanged.
 */
const CUT: { at: number; c: React.FC<{ dur: number }> }[] = [
  { at: 0.0, c: TitleOpen },
  { at: 4.2, c: DownloadApp },
  { at: 7.2, c: Notifications },
  { at: 9.0, c: DontMiss },
  { at: 14.5, c: WhenInside },
  { at: 15.7, c: CommunityTab },
  { at: 21.8, c: IntroduceYourself },
  { at: 24.6, c: TellUs },
  { at: 28.0, c: ClassroomTab },
  { at: 30.5, c: BuildingEducation },
  { at: 32.9, c: EducationTopics },
  { at: 38.7, c: VendorUnlock },
  { at: 43.2, c: Relationships },
  { at: 48.2, c: NotGrabAndGo },
  { at: 51.4, c: GrowingFast },
  { at: 54.2, c: ConstantlyAdded },
  { at: 58.3, c: ThreeActions },
  { at: 62.6, c: JustRemember },
  { at: 64.2, c: NotMedicalAdvice },
  { at: 68.5, c: EndCard },
];

/** Last word is at 70.7s; the end card holds ~2.5s past it. */
const END = 73.2;

export const ONBOARDING_FRAMES = sec(END);

export const Onboarding: React.FC = () => (
  <AbsoluteFill>
    <StageV2 />

    {CUT.map(({ at, c: Comp }, i) => {
      const from = sec(at);
      const to = sec(i + 1 < CUT.length ? CUT[i + 1].at : END);
      // The 9-frame overrun is what makes each outgoing fade cross-dissolve
      // into the incoming shot instead of cutting through black.
      const dur = to - from + 9;
      return (
        <Sequence key={i} from={from} durationInFrames={dur} layout="none">
          <Comp dur={dur} />
        </Sequence>
      );
    })}

    <GrainV2 />
    <ProgressV2 total={ONBOARDING_FRAMES} />

    <Audio src={staticFile("vo-onboarding.mp3")} />
    <Audio src={staticFile("score-onboarding.wav")} />
  </AbsoluteFill>
);
