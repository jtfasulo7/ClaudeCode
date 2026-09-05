import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { GrainV2, ProgressV2, StageV2 } from "../../shared/components/StageV2";
import { sec } from "../../shared/theme";

import {
  BeginnersConfused,
  CertificateOf,
  IdeallyIndependent,
  IndependentMatters,
  NotFullStory,
  PostingIsntTrust,
  RemovesIncentive,
  ReportLegit,
  TheTermCOA,
  TitleOpen,
  VendorChain,
  WhoSelected,
} from "./scenes/Part1";
import {
  CanItBeVerified,
  EndCard,
  HighPurityWrongAmount,
  IdentityTesting,
  NinetyNine,
  NotJustPaper,
  PurityTesting,
  QuantityTesting,
  RememberThis,
  SterilityEndotoxins,
  TypesOfTesting,
  WhatToCheck,
} from "./scenes/Part2";

/**
 * Cut sheet — boundaries are word timestamps from work/module2/transcript.json.
 * Same v2 system as Start Here and Handling.
 *
 * The film's hinge is "who selected the sample?" at 25.9s: everything before it
 * builds the question, the vendor chain states the problem, and independent
 * testing is the answer. The score follows that shape — Am into Gm, resolving
 * to F only when the answer arrives.
 */
const CUT: { at: number; c: React.FC<{ dur: number }> }[] = [
  { at: 0.0, c: TitleOpen },
  { at: 5.6, c: TheTermCOA },
  { at: 9.3, c: CertificateOf },
  { at: 12.1, c: BeginnersConfused },
  { at: 15.0, c: PostingIsntTrust },
  { at: 20.6, c: ReportLegit },
  { at: 25.9, c: WhoSelected },
  { at: 29.0, c: VendorChain },
  { at: 35.3, c: NotFullStory },
  { at: 39.8, c: IndependentMatters },
  { at: 43.5, c: IdeallyIndependent },
  { at: 48.6, c: RemovesIncentive },
  { at: 53.0, c: TypesOfTesting },
  { at: 55.8, c: IdentityTesting },
  { at: 61.0, c: PurityTesting },
  { at: 67.0, c: QuantityTesting },
  { at: 71.4, c: SterilityEndotoxins },
  { at: 77.6, c: RememberThis },
  { at: 81.0, c: NinetyNine },
  { at: 85.0, c: HighPurityWrongAmount },
  { at: 91.3, c: WhatToCheck },
  { at: 99.4, c: CanItBeVerified },
  { at: 102.4, c: NotJustPaper },
  { at: 106.6, c: EndCard },
];

/** Runs ~2s past the last word so the end card holds and the score resolves. */
const END = 111.6;

export const MODULE2_FRAMES = sec(END);

export const Module2: React.FC = () => (
  <AbsoluteFill>
    <StageV2 />

    {CUT.map(({ at, c: Comp }, i) => {
      const from = sec(at);
      const to = sec(i + 1 < CUT.length ? CUT[i + 1].at : END);
      const dur = to - from + 9;
      return (
        <Sequence key={i} from={from} durationInFrames={dur} layout="none">
          <Comp dur={dur} />
        </Sequence>
      );
    })}

    <GrainV2 />
    <ProgressV2 total={MODULE2_FRAMES} />

    <Audio src={staticFile("vo-module2.mp3")} />
    <Audio src={staticFile("score-module2.wav")} />
  </AbsoluteFill>
);
