import React from 'react';
import {Composition, Folder} from 'remotion';
import {FPS, WIDTH, HEIGHT} from './Theme';
import {Scene0WebsiteReveal} from './scenes/Scene0WebsiteReveal';
import {Scene1Voicemail} from './scenes/Scene1Voicemail';
import {Scene2TextBack} from './scenes/Scene2TextBack';
import {Scene3DeadLead} from './scenes/Scene3DeadLead';
import {Scene4Reviews} from './scenes/Scene4Reviews';
import {Scene5TrustCTA} from './scenes/Scene5TrustCTA';
import {FullPreview} from './FullPreview';
import {PolishedAd} from './PolishedAd';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="Final">
        <Composition id="PolishedAd" component={PolishedAd} durationInFrames={833} fps={FPS} width={WIDTH} height={HEIGHT} />
      </Folder>
      <Folder name="Scenes">
        <Composition id="Scene0WebsiteReveal" component={Scene0WebsiteReveal} durationInFrames={120} fps={FPS} width={WIDTH} height={HEIGHT} />
        <Composition id="Scene1Voicemail" component={Scene1Voicemail} durationInFrames={150} fps={FPS} width={WIDTH} height={HEIGHT} />
        <Composition id="Scene2TextBack" component={Scene2TextBack} durationInFrames={90} fps={FPS} width={WIDTH} height={HEIGHT} />
        <Composition id="Scene3DeadLead" component={Scene3DeadLead} durationInFrames={60} fps={FPS} width={WIDTH} height={HEIGHT} />
        <Composition id="Scene4Reviews" component={Scene4Reviews} durationInFrames={60} fps={FPS} width={WIDTH} height={HEIGHT} />
        <Composition id="Scene5TrustCTA" component={Scene5TrustCTA} durationInFrames={300} fps={FPS} width={WIDTH} height={HEIGHT} />
      </Folder>
      <Folder name="Preview">
        <Composition id="FullPreview" component={FullPreview} durationInFrames={780} fps={FPS} width={WIDTH} height={HEIGHT} />
      </Folder>
    </>
  );
};
