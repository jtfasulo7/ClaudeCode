import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { GrainV2, ProgressV2, StageV2 } from "../../shared/components/StageV2";
import { sec } from "../../shared/theme";

import {
  BeCareful,
  BuildingBlocks,
  ChannelsIntro,
  FourChannels,
  FourUnknowns,
  GrayMarketDef,
  LooksProveNothing,
  ManyPeptides,
  TitleOpen,
  WhatIsPeptide,
  WordDoesntTell,
} from "./scenes/Part1";
import {
  BeforeAnything,
  DoesNotProve,
  EndCard,
  IfNotSense,
  NotBlindTrust,
  NotExpected,
  OutsideRegulated,
  TheSeven,
  UnderstandFirst,
  WhyExists,
} from "./scenes/Part2";

/**
 * Cut sheet — boundaries are word timestamps from work/start-here/transcript.json.
 *
 * NOTE ON TRANSITIONS: @remotion/transitions' <TransitionSeries> shortens the
 * timeline, because transitions consume frames from the scenes either side.
 * Every boundary here is pinned to a word in the voiceover, so losing frames
 * would walk the picture out of sync with the narration over 99 seconds.
 *
 * So scenes stay as absolutely-positioned <Sequence>s and carry their own
 * entrance/exit.
 *
 * LIGHT LEAKS WERE TRIED AND CUT. @remotion/light-leaks screen-blends a warm
 * bloom over the frame; on a near-black palette that lifts the blacks and
 * washes the whole image orange, even taken down to 0.14 opacity. It reads as
 * a filter laid on top rather than as light in the scene. The chapter turns
 * are punctuated by the score instead, and <LightSweep> handles specular
 * moments where they are actually motivated.
 */
const CUT: { at: number; c: React.FC<{ dur: number }> }[] = [
  { at: 0.0, c: TitleOpen },
  { at: 4.7, c: WhatIsPeptide },
  { at: 8.7, c: BuildingBlocks },
  { at: 12.0, c: ManyPeptides },
  { at: 17.2, c: WordDoesntTell },
  { at: 21.1, c: FourUnknowns },
  { at: 25.05, c: ChannelsIntro },
  { at: 27.1, c: FourChannels },
  { at: 32.2, c: GrayMarketDef },
  { at: 38.55, c: BeCareful },
  { at: 41.95, c: LooksProveNothing },
  { at: 46.3, c: DoesNotProve },
  { at: 49.35, c: OutsideRegulated },
  { at: 55.25, c: TheSeven },
  { at: 62.75, c: NotBlindTrust },
  { at: 68.65, c: UnderstandFirst },
  { at: 74.1, c: BeforeAnything },
  { at: 81.5, c: IfNotSense },
  { at: 86.2, c: NotExpected },
  { at: 89.85, c: WhyExists },
  { at: 93.1, c: EndCard },
];

const END = 98.88;

export const STARTHERE_FRAMES = sec(END);

export const StartHere: React.FC = () => (
  <AbsoluteFill>
    <StageV2 />

    {CUT.map(({ at, c: Comp }, i) => {
      const from = sec(at);
      const to = sec(i + 1 < CUT.length ? CUT[i + 1].at : END);
      // 9-frame overlap so the outgoing exit cross-dissolves into the incoming.
      const dur = to - from + 9;
      return (
        <Sequence key={i} from={from} durationInFrames={dur} layout="none">
          <Comp dur={dur} />
        </Sequence>
      );
    })}


    <GrainV2 />
    <ProgressV2 total={STARTHERE_FRAMES} />

    <Audio src={staticFile("vo-start-here.mp3")} />
    {/* Original score, composed to this cut sheet and side-chained to the VO. */}
    <Audio src={staticFile("score-start-here.wav")} />
  </AbsoluteFill>
);
