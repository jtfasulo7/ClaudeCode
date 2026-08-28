import React from 'react';
import {Composition} from 'remotion';
import {DaveVSL} from './DaveVSL';
import {FPS} from './theme';

export const RemotionRoot: React.FC = () => (
  <Composition
    id="DaveVSL"
    component={DaveVSL}
    durationInFrames={2110}
    fps={FPS}
    width={1920}
    height={1080}
  />
);
