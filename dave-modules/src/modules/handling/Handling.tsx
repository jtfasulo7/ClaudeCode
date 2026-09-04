import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { GrainV2, ProgressV2, StageV2 } from "../../shared/components/StageV2";
import { sec } from "../../shared/theme";

import {
  ContaminationRisk,
  EvenIfMade,
  FiveFactors,
  Lyophilized,
  PoorHandling,
  Reconstitution,
  StabilityVaries,
  SterilityMatters,
  StorageImportant,
  ThePuck,
  TitleOpen,
} from "./scenes/Part1";
import {
  AppearanceCant,
  AskCommunity,
  EndCard,
  LooksNormal,
  LooksQuestionable,
  MoreThanReconstitute,
  NeverAssume,
  RedFlags,
  StopAndAsk,
  StoredImproperly,
  TheFour,
} from "./scenes/Part2";

/**
 * Cut sheet — boundaries are word timestamps from work/handling/transcript.json.
 * Same v2 system as Start Here: asymmetric curves, mask reveals, scored bed.
 *
 * COMPLIANCE NOTE: this script covers reconstitution and injectables. Every
 * visual treats them as terminology and risk, never as procedure — the vial is
 * always shown sealed and at rest, there is no needle, no syringe, no hands and
 * no quantities anywhere in the film.
 */
const CUT: { at: number; c: React.FC<{ dur: number }> }[] = [
  { at: 0.0, c: TitleOpen },
  { at: 4.3, c: EvenIfMade },
  { at: 7.4, c: PoorHandling },
  { at: 12.2, c: Lyophilized },
  { at: 17.4, c: ThePuck },
  { at: 21.2, c: Reconstitution },
  { at: 28.0, c: SterilityMatters },
  { at: 32.3, c: ContaminationRisk },
  { at: 38.9, c: StorageImportant },
  { at: 42.2, c: StabilityVaries },
  { at: 45.6, c: FiveFactors },
  { at: 52.0, c: NeverAssume },
  { at: 57.3, c: LooksQuestionable },
  { at: 60.5, c: RedFlags },
  { at: 67.6, c: StoredImproperly },
  { at: 71.5, c: AppearanceCant },
  { at: 77.4, c: LooksNormal },
  { at: 84.0, c: MoreThanReconstitute },
  { at: 88.6, c: TheFour },
  { at: 94.5, c: StopAndAsk },
  { at: 99.9, c: AskCommunity },
  { at: 103.9, c: EndCard },
];

/** Runs ~2s past the last word so the end card holds and the score resolves. */
const END = 107.6;

export const HANDLING_FRAMES = sec(END);

export const Handling: React.FC = () => (
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
    <ProgressV2 total={HANDLING_FRAMES} />

    <Audio src={staticFile("vo-handling.mp3")} />
    <Audio src={staticFile("score-handling.wav")} />
  </AbsoluteFill>
);
