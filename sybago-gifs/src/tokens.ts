// Brand tokens — match sybago-website inline CSS so the videos look native
// to the page they sit on.

export const T = {
  bg:       '#ffffff',
  bg2:      '#f4f5f7',
  bg3:      '#eaecef',
  ink:      '#0f1419',
  ink2:     'rgba(15,20,25,0.66)',
  ink3:     'rgba(15,20,25,0.42)',
  ink4:     'rgba(15,20,25,0.10)',
  line:     'rgba(15,20,25,0.08)',
  teal:     '#2F6779',
  tealB:    '#3a7d93',
  tealG:    'rgba(47,103,121,0.20)',
  tealTint: 'rgba(47,103,121,0.10)',
  good:     '#4dbf7a',
  goodTint: 'rgba(77,191,122,0.10)',
  warn:     '#e8b04a',
} as const;

export const FONT =
  "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

// Frame budget — every composition is 1280×960 (4:3, matches the
// .feature-gif placeholder's aspect-ratio) at 30fps × 3s = 90 frames.
export const SIZE = {
  width:  1280,
  height: 960,
  fps:    30,
  // Padding kept slightly larger because the video sits inside a
  // bordered card on the site.
  pad:    72,
} as const;

export const DURATION = 90;
