import {loadFont} from '@remotion/google-fonts/Inter';

export const {fontFamily} = loadFont('normal', {
  weights: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
});

export const theme = {
  teal: '#2F6779',
  tealDark: '#1f4a58',
  tealLight: '#3a7d93',
  gold: '#d4a14a',
  ink: '#111111',
  inkMuted: 'rgba(17,17,17,0.6)',
  inkFaint: 'rgba(17,17,17,0.35)',
  paper: '#ffffff',
  paperCool: '#f5f5f5',
  danger: '#d63232',
  success: '#2fb158',
} as const;

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;
