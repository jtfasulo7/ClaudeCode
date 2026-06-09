import React from 'react';
import {Series} from 'remotion';
import {Scene0WebsiteReveal} from './scenes/Scene0WebsiteReveal';
import {Scene1Voicemail} from './scenes/Scene1Voicemail';
import {Scene2TextBack} from './scenes/Scene2TextBack';
import {Scene3DeadLead} from './scenes/Scene3DeadLead';
import {Scene4Reviews} from './scenes/Scene4Reviews';
import {Scene5TrustCTA} from './scenes/Scene5TrustCTA';

export const FullPreview: React.FC = () => {
  return (
    <Series>
      <Series.Sequence durationInFrames={120}>
        <Scene0WebsiteReveal />
      </Series.Sequence>
      <Series.Sequence durationInFrames={150}>
        <Scene1Voicemail />
      </Series.Sequence>
      <Series.Sequence durationInFrames={90}>
        <Scene2TextBack />
      </Series.Sequence>
      <Series.Sequence durationInFrames={60}>
        <Scene3DeadLead />
      </Series.Sequence>
      <Series.Sequence durationInFrames={60}>
        <Scene4Reviews />
      </Series.Sequence>
      <Series.Sequence durationInFrames={300}>
        <Scene5TrustCTA />
      </Series.Sequence>
    </Series>
  );
};
