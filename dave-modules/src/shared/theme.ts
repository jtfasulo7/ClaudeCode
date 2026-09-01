import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadSpectral } from "@remotion/google-fonts/Spectral";

// Only the weights actually used — otherwise Remotion refetches dozens of
// font files on every rendered frame.
export const { fontFamily: SANS } = loadInter("normal", {
  weights: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

export const { fontFamily: SERIF } = loadSpectral("normal", {
  weights: ["400", "600"],
  subsets: ["latin"],
});

/**
 * Black and gold. Charcoal is layered rather than flat so panels read as
 * separate surfaces without needing borders everywhere.
 *
 * Colour is load-bearing here and deliberately rationed:
 *   gold  = emphasis, the thing being taught
 *   green = verification / success ONLY
 *   red   = warning ONLY
 * Anything else stays in the neutral ramp. That restraint is what keeps it
 * reading as documentary rather than infographic-y.
 */
export const C = {
  bg: "#0A0A0B",
  panel: "#141518",
  panel2: "#1B1D21",
  line: "#2A2D33",
  lineSoft: "#212429",

  text: "#F3F1EC",
  textDim: "#9BA0A8",
  textFaint: "#5E636B",

  gold: "#C9A227",
  goldBright: "#E9C65C",
  goldDim: "#8A6F1B",

  green: "#3E9E6A",
  red: "#B4483C",
} as const;

export const FPS = 30;
export const sec = (s: number) => Math.round(s * FPS);

