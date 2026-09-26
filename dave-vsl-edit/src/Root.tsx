import React from 'react';
import {Composition} from 'remotion';
import {DaveVSL} from './DaveVSL';
import {CtaClip, CTA_CLIP_FRAMES} from './CtaClip';
import {LoomEdit, LOOM_FRAMES} from './LoomEdit';
import {FPS} from './theme';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="DaveVSL"
      component={DaveVSL}
      durationInFrames={2110}
      fps={FPS}
      width={1920}
      height={1080}
    />
    {/* The CTA stinger as its own render, so it can be cut onto the end of
        anything rather than only existing inside the VSL. */}
    <Composition
      id="CtaClip"
      component={CtaClip}
      durationInFrames={CTA_CLIP_FRAMES}
      fps={FPS}
      width={1920}
      height={1080}
    />
    {/* The Loom walkthrough with a camera added — pushes and re-frames only,
        no inserted footage. See LoomEdit.tsx: SHOTS is the whole edit. */}
    <Composition
      id="LoomEdit"
      component={LoomEdit}
      durationInFrames={LOOM_FRAMES}
      fps={FPS}
      width={1920}
      height={1080}
    />
  </>
);
