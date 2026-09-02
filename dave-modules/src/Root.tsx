import React from "react";
import { Composition } from "remotion";
import { Module1, MODULE1_FRAMES } from "./modules/module1/Module1";
import { Module3, MODULE3_FRAMES } from "./modules/module3/Module3";
import { Module5, MODULE5_FRAMES } from "./modules/module5/Module5";
import { Module7, MODULE7_FRAMES } from "./modules/module7/Module7";
import { FPS } from "./shared/theme";

/**
 * One project, one design system, one composition per module. Keeping them
 * together is what guarantees the modules stay visually consistent — a fix to
 * anything in src/shared lands in every module at once.
 */
export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="Module1"
      component={Module1}
      durationInFrames={MODULE1_FRAMES}
      fps={FPS}
      width={1920}
      height={1080}
    />
    <Composition
      id="Module3"
      component={Module3}
      durationInFrames={MODULE3_FRAMES}
      fps={FPS}
      width={1920}
      height={1080}
    />
    <Composition
      id="Module5"
      component={Module5}
      durationInFrames={MODULE5_FRAMES}
      fps={FPS}
      width={1920}
      height={1080}
    />
    <Composition
      id="Module7"
      component={Module7}
      durationInFrames={MODULE7_FRAMES}
      fps={FPS}
      width={1920}
      height={1080}
    />
  </>
);
