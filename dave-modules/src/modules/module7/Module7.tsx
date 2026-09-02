import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { Grain, Progress, Stage } from "../../shared/components/Stage";
import { sec } from "../../shared/theme";

import {
  BeforeTrusting,
  COALibraryCheck,
  KeepEngaging,
  NoRandomDMs,
  PriceListsDetails,
  TheBasicsRecap,
  TitleOpen,
  UnlockAccess,
  VerifyOfficial,
  WhatYouSee,
  YouKnowBasics,
} from "./scenes/Part1";
import {
  BeforeDeciding,
  DontRiskLarge,
  DontRush,
  EducatedConfident,
  EndCard,
  IfConfusing,
  ImHereToHelp,
  SendMeAMessage,
  StartCautiously,
  TakeYourTime,
  WholePoint,
} from "./scenes/Part2";

/**
 * Cut sheet — every boundary is a word timestamp from
 * work/module7/transcript.json.
 *
 * This is the wrap-up module: it recaps what the earlier films covered, then
 * turns into a support beat. The recap scene deliberately cites modules 01/03/05
 * so it reads as part of a series rather than a standalone.
 */
const CUT: { at: number; c: React.FC<{ dur: number }> }[] = [
  { at: 0.0, c: TitleOpen },
  { at: 4.2, c: YouKnowBasics },
  { at: 8.6, c: TheBasicsRecap },
  { at: 14.1, c: KeepEngaging },
  { at: 18.1, c: UnlockAccess },
  { at: 21.2, c: WhatYouSee },
  { at: 25.3, c: PriceListsDetails },
  { at: 28.9, c: BeforeTrusting },
  { at: 31.4, c: COALibraryCheck },
  { at: 35.6, c: VerifyOfficial },
  { at: 39.35, c: NoRandomDMs },
  { at: 43.45, c: DontRush },
  { at: 46.05, c: TakeYourTime },
  { at: 51.85, c: BeforeDeciding },
  { at: 55.55, c: StartCautiously },
  { at: 58.9, c: DontRiskLarge },
  { at: 62.6, c: ImHereToHelp },
  { at: 65.6, c: IfConfusing },
  { at: 75.0, c: SendMeAMessage },
  { at: 76.6, c: WholePoint },
  { at: 79.6, c: EducatedConfident },
  { at: 83.2, c: EndCard },
];

const END = 87.12;

export const MODULE7_FRAMES = sec(END);

export const Module7: React.FC = () => (
  <AbsoluteFill>
    <Stage />

    {CUT.map(({ at, c: Comp }, i) => {
      const from = sec(at);
      const to = sec(i + 1 < CUT.length ? CUT[i + 1].at : END);
      // 8-frame overlap so each outgoing fade cross-dissolves into the next.
      const dur = to - from + 8;
      return (
        <Sequence key={i} from={from} durationInFrames={dur} layout="none">
          <Comp dur={dur} />
        </Sequence>
      );
    })}

    <Grain />
    <Progress total={MODULE7_FRAMES} />

    <Audio src={staticFile("vo-module7.mp3")} />
  </AbsoluteFill>
);
