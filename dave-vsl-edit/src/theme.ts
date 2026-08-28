import {loadFont} from '@remotion/google-fonts/Inter';

// Only the weights actually used, latin only — otherwise Remotion fetches
// 126 font files on every frame render.
export const {fontFamily} = loadFont('normal', {
  weights: ['600', '700', '800'],
  subsets: ['latin'],
});

/**
 * Deliberately editorial, not "AI-hype". Dave's whole position is
 * anti-hype ("no miracle promises, no hype") — glossy purple gradients and
 * neon glow would undercut the one thing the script is selling: credibility.
 * Palette is pulled from the plate itself: cedar, foliage, overcast sky.
 */
export const C = {
  ink: '#14181A',
  paper: '#F5F2EA',
  line: '#DDD6C8',
  green: '#2C6B4E',
  rust: '#B0553A',
  muted: '#767B7E',
  white: '#FFFFFF',
};

export const FPS = 30;
export const sec = (s: number) => Math.round(s * FPS);
