import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { Grain, Progress, Stage } from "../../shared/components/Stage";
import { sec } from "../../shared/theme";

import {
  BasicsMakeSense,
  BiggestMistake,
  ClaimsVsEvidence,
  LearnCompounds,
  LotMoreHere,
  ReadCOA,
  StartClassrooms,
  Terminology,
  ThirdPartyTesting,
  TitleOpen,
} from "./scenes/Part1";
import {
  AlreadyAsked,
  AskQuestions,
  CommentsGold,
  CommunityUseful,
  MembersHelping,
  NotExpert,
  Participate,
  SearchBeforeAsk,
  ShareLearned,
  ShareSupplier,
  UseSearch,
} from "./scenes/Part2";
import {
  DontBlindlyTrust,
  HigherEngagement,
  HowToEngage,
  ImportantRule,
  Intentional,
  Mindset,
  NeverReplace,
  NotADirectory,
  ResearchEasier,
  UnlockOverTime,
  VerifyYourself,
} from "./scenes/Part3";

/**
 * Cut sheet — every boundary is a word timestamp from
 * work/module3/transcript.json, same method as Module 1.
 */
const CUT: { at: number; c: React.FC<{ dur: number }> }[] = [
  { at: 0.0, c: TitleOpen },
  { at: 6.2, c: BiggestMistake },
  { at: 11.15, c: LotMoreHere },
  { at: 12.95, c: StartClassrooms },
  { at: 15.35, c: LearnCompounds },
  { at: 17.9, c: Terminology },
  { at: 19.7, c: ThirdPartyTesting },
  { at: 22.4, c: ReadCOA },
  { at: 24.7, c: ClaimsVsEvidence },
  { at: 28.55, c: BasicsMakeSense },
  { at: 35.6, c: UseSearch },
  { at: 37.85, c: SearchBeforeAsk },
  { at: 41.0, c: AlreadyAsked },
  { at: 44.35, c: CommentsGold },
  { at: 50.9, c: Participate },
  { at: 53.85, c: NotExpert },
  { at: 55.65, c: AskQuestions },
  { at: 57.55, c: ShareLearned },
  { at: 62.15, c: ShareSupplier },
  { at: 67.55, c: CommunityUseful },
  { at: 69.85, c: MembersHelping },
  { at: 72.35, c: HigherEngagement },
  { at: 77.85, c: Intentional },
  { at: 79.25, c: NotADirectory },
  { at: 87.05, c: HowToEngage },
  { at: 93.0, c: UnlockOverTime },
  { at: 96.35, c: ImportantRule },
  { at: 98.2, c: DontBlindlyTrust },
  { at: 104.25, c: VerifyYourself },
  { at: 106.65, c: Mindset },
  { at: 110.75, c: ResearchEasier },
  { at: 113.75, c: NeverReplace },
];

const END = 115.92;

export const MODULE3_FRAMES = sec(END);

export const Module3: React.FC = () => (
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
    <Progress total={MODULE3_FRAMES} />

    <Audio src={staticFile("vo-module3.mp3")} />
  </AbsoluteFill>
);
