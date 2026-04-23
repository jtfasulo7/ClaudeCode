import { Composition } from 'remotion';
import { HeroCredentials } from './HeroComposition';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="HeroCredentials"
        component={HeroCredentials}
        durationInFrames={180}
        fps={30}
        width={1080}
        height={1350}
      />
    </>
  );
};
