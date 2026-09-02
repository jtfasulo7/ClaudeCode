import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { Grain, Progress, Stage } from "../../shared/components/Stage";
import { sec } from "../../shared/theme";

import {
  ActuallyVerify,
  CheckMatch,
  COALibraryGrid,
  COALibraryIntro,
  LookAtEvidence,
  MistakeOne,
  MistakeTwo,
  PayingFor,
  PriceNotQuality,
  TitleOpen,
  VerifyWithLab,
  WhichLab,
} from "./scenes/Part1";
import {
  ClaimingVendor,
  CryptoWallet,
  DoYourResearch,
  FlashSaleTimer,
  IndependentPatterns,
  Irreversible,
  MistakeThree,
  OneWrongCharacter,
  RandomDMs,
  VerifyOfficial,
} from "./scenes/Part2";
import {
  BeforePayment,
  BetterQuestions,
  CompareVendors,
  EndCard,
  InformedNotLess,
  LimitedProtection,
  NotEvaluated,
  ResearchSmarter,
  ResearchUseOnly,
  UnlockCompare,
} from "./scenes/Part3";

/**
 * Cut sheet — every boundary is a word timestamp from
 * work/module5/transcript.json. This module has an explicit
 * "First / Second / Third" spine, so the three mistake scenes open on a
 * numbered chapter mark.
 */
const CUT: { at: number; c: React.FC<{ dur: number }> }[] = [
  { at: 0.0, c: TitleOpen },
  { at: 7.9, c: MistakeOne },
  { at: 13.6, c: PriceNotQuality },
  { at: 20.1, c: PayingFor },
  { at: 25.3, c: LookAtEvidence },
  { at: 28.05, c: MistakeTwo },
  { at: 35.25, c: ActuallyVerify },
  { at: 37.05, c: CheckMatch },
  { at: 43.5, c: WhichLab },
  { at: 46.75, c: VerifyWithLab },
  { at: 55.55, c: COALibraryIntro },
  { at: 59.3, c: COALibraryGrid },
  { at: 65.55, c: MistakeThree },
  { at: 70.7, c: IndependentPatterns },
  { at: 74.9, c: FlashSaleTimer },
  { at: 79.3, c: DoYourResearch },
  { at: 82.4, c: CryptoWallet },
  { at: 87.85, c: Irreversible },
  { at: 91.0, c: OneWrongCharacter },
  { at: 94.3, c: RandomDMs },
  { at: 98.0, c: ClaimingVendor },
  { at: 101.95, c: VerifyOfficial },
  { at: 106.9, c: BeforePayment },
  { at: 110.7, c: LimitedProtection },
  { at: 115.7, c: ResearchUseOnly },
  { at: 119.0, c: NotEvaluated },
  { at: 123.4, c: UnlockCompare },
  { at: 128.0, c: CompareVendors },
  { at: 133.3, c: ResearchSmarter },
  { at: 137.4, c: BetterQuestions },
  { at: 140.9, c: InformedNotLess },
  { at: 143.05, c: EndCard },
];

const END = 146.08;

export const MODULE5_FRAMES = sec(END);

export const Module5: React.FC = () => (
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
    <Progress total={MODULE5_FRAMES} />

    <Audio src={staticFile("vo-module5.mp3")} />
  </AbsoluteFill>
);
