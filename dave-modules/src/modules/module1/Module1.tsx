import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { Grain, Progress, Stage } from "../../shared/components/Stage";
import { sec } from "../../shared/theme";

import { OutsideSystem, PeptideMarket, QuestionScene, TitleOpen } from "./scenes/Open";
import { OverseasOrigin, PricingIntro, USVendors } from "./scenes/Supply";
import {
  CheaperNotBetter,
  NotSameQuality,
  PriceOverseas,
  PriceUS,
  VerificationKey,
} from "./scenes/Pricing";
import { COAAnatomy, COAIntro, COAValid, TeachYou } from "./scenes/Coa";
import {
  COALibrary,
  LockUnlock,
  PriceListing,
  TestingDocs,
  TrustedVendorClassroom,
  VendorDirectory,
} from "./scenes/Classroom";
import {
  Compare,
  EducationOnly,
  EndCard,
  InformedDecisions,
  NotWhatToBuy,
  Understand,
} from "./scenes/Close";

/**
 * The cut sheet. Every boundary is a word timestamp from work/transcript.json —
 * scenes change on the narrator's phrase boundaries, not on a fixed cadence.
 *
 * Longer entries (PriceUS, COAAnatomy, COAValid, VendorDirectory) are single
 * shots on purpose: they carry 3-4 internal builds each, and cutting away
 * mid-chart or mid-document would break the thought the narrator is finishing.
 */
const CUT: { at: number; c: React.FC<{ dur: number }> }[] = [
  { at: 0.0, c: TitleOpen },
  { at: 4.05, c: QuestionScene },
  { at: 6.9, c: PeptideMarket },
  { at: 9.9, c: OutsideSystem },
  { at: 13.3, c: USVendors },
  { at: 17.4, c: OverseasOrigin },
  { at: 22.3, c: PricingIntro },
  { at: 24.55, c: PriceUS },
  { at: 33.2, c: PriceOverseas },
  { at: 38.45, c: NotSameQuality },
  { at: 41.35, c: CheaperNotBetter },
  { at: 44.35, c: VerificationKey },
  { at: 47.25, c: COAIntro },
  { at: 52.55, c: COAAnatomy },
  { at: 60.65, c: COAValid },
  { at: 68.35, c: TeachYou },
  { at: 71.85, c: TrustedVendorClassroom },
  { at: 76.35, c: LockUnlock },
  { at: 80.55, c: VendorDirectory },
  { at: 86.9, c: PriceListing },
  { at: 90.95, c: COALibrary },
  { at: 94.45, c: TestingDocs },
  { at: 98.55, c: NotWhatToBuy },
  { at: 101.0, c: Understand },
  { at: 103.6, c: Compare },
  { at: 105.75, c: InformedDecisions },
  { at: 108.3, c: EducationOnly },
  { at: 113.6, c: EndCard },
];

const END = 115.76;

/** Runtime is pinned to this module's VO. */
export const MODULE1_FRAMES = sec(END);

export const Module1: React.FC = () => (
  <AbsoluteFill>
    <Stage />

    {CUT.map(({ at, c: Comp }, i) => {
      const from = sec(at);
      const to = sec(i + 1 < CUT.length ? CUT[i + 1].at : END);
      // Scenes overlap by 8 frames so the outgoing fade cross-dissolves into
      // the incoming one rather than cutting through black.
      const dur = to - from + 8;
      return (
        <Sequence key={i} from={from} durationInFrames={dur} layout="none">
          <Comp dur={dur} />
        </Sequence>
      );
    })}

    <Grain />
    <Progress total={MODULE1_FRAMES} />

    <Audio src={staticFile("vo-module1.mp3")} />
  </AbsoluteFill>
);
