import React from 'react';
import {AbsoluteFill, OffthreadVideo, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Caption, Scrim} from './components/Caption';
import {Panel} from './components/Panel';
import {PriceGap} from './broll/PriceGap';
import {FailureStamps} from './broll/FailureStamps';
import {Checklist} from './broll/Checklist';
import {BrandCard} from './broll/BrandCard';
import {CtaCard} from './broll/CtaCard';
import {sec} from './theme';

// --- Cut sheet -------------------------------------------------------------
// Every number below is a word timestamp out of work/transcript.json, not a
// guess. Side panels sit over the plate; the two full-frame cards replace it.
const PANEL_PRICE = {in: sec(1.35), out: sec(9.1)};
// Enters right on the first stamp — an empty card waiting for its contents
// reads as unfinished.
const PANEL_FAIL = {in: sec(17.45), out: sec(20.9)};
const PANEL_LIST = {in: sec(40.0), out: sec(58.7)};

const CARD_BRAND = {in: sec(25.2), out: sec(28.35)};
const CARD_CTA = {in: sec(67.62)};

const PANELS = [PANEL_PRICE, PANEL_FAIL, PANEL_LIST];

// Kept short enough to sit on one line each — six wrapped rows would run the
// card past the caption safe area.
const LIST_ITEMS = [
  {text: 'Research, minus the jargon', at: sec(40.3)},
  {text: 'Real conversations on quality', at: sec(44.24)},
  {text: 'Verified supplier connections', at: sec(47.14)},
  {text: 'What a COA actually tells you', at: sec(49.62)},
  {text: 'Vendor insights from members', at: sec(52.22)},
  {text: 'How to stop overpaying', at: sec(55.0)},
];

/**
 * How far the plate is pushed left, 0..1. Ramps in over ~0.5s as a card
 * arrives and back out as it leaves — slow enough to read as a camera move
 * rather than an effect, which is the whole point.
 */
const pushAmount = (frame: number) =>
  PANELS.reduce((acc, w) => {
    const up = interpolate(frame, [w.in, w.in + 15], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
    const down = interpolate(frame, [w.out - 12, w.out], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
    return Math.max(acc, Math.min(up, down));
  }, 0);

const inWindow = (frame: number, w: {in: number; out?: number}) =>
  frame >= w.in && (w.out === undefined || frame < w.out);

export const DaveVSL: React.FC = () => {
  const frame = useCurrentFrame();

  const push = pushAmount(frame);
  const scale = 1 + push * 0.16;
  // Scale first, then translate in real pixels. The shift is derived from the
  // scale so it can never exceed the overflow the punch-in bought us — which is
  // what was letting a black bar appear on the right edge.
  const shift = -0.96 * 960 * (scale - 1);

  const fullFrameCard = inWindow(frame, CARD_BRAND) || inWindow(frame, CARD_CTA);

  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      {/* A-roll plate — never cut, only pushed. Audio rides with it. */}
      <AbsoluteFill style={{overflow: 'hidden'}}>
        <AbsoluteFill
          style={{
            transform: `translateX(${shift}px) scale(${scale})`,
            filter: 'saturate(1.06) contrast(1.06) brightness(1.02)',
          }}
        >
          <OffthreadVideo src={staticFile('aroll.mp4')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        </AbsoluteFill>
      </AbsoluteFill>

      {/* Restrained vignette — pulls the eye to centre without reading as a filter. */}
      <AbsoluteFill
        style={{
          background: 'radial-gradient(120% 90% at 50% 45%, rgba(0,0,0,0) 52%, rgba(0,0,0,0.30) 100%)',
        }}
      />

      <Scrim />

      {!fullFrameCard && <Caption />}

      <Panel label="The gap" inAt={PANEL_PRICE.in} outAt={PANEL_PRICE.out}>
        <PriceGap ats={[sec(1.5), sec(4.15)]} />
      </Panel>

      <Panel label="What shows up" inAt={PANEL_FAIL.in} outAt={PANEL_FAIL.out}>
        <FailureStamps ats={[sec(17.82), sec(18.68), sec(19.98)]} />
      </Panel>

      <Panel label="Inside the community" inAt={PANEL_LIST.in} outAt={PANEL_LIST.out}>
        <Checklist items={LIST_ITEMS} />
      </Panel>

      <BrandCard inAt={CARD_BRAND.in} outAt={CARD_BRAND.out} />
      <CtaCard inAt={CARD_CTA.in} />
    </AbsoluteFill>
  );
};
