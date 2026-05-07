import { Config } from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
// h264 + yuv420p so the MP4 plays inline on iOS / Safari without extra tweaks
Config.setCodec('h264');
Config.setPixelFormat('yuv420p');
Config.setCrf(20);
Config.setConcurrency(4);
