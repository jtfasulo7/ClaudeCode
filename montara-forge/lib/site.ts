/**
 * Single source of truth for business details used across the page.
 * Everything client-facing that could change lives here.
 */
export const SITE = {
  name: "Montara Forge",
  /** Canonical production URL (Vercel: montaraforge.com → www). */
  url: "https://www.montaraforge.com",
  tagline: "Concrete built to outlast the house.",
  phoneDisplay: "(435) 319-9628",
  phoneHref: "tel:+14353199628",
  state: "Utah",
  /** The six towns we name explicitly for ad message-match. */
  towns: [
    "Cedar City",
    "St. George",
    "Parowan",
    "Beaver",
    "New Harmony",
    "Paragonah",
  ],
  /** DOM id of the form card — every CTA on the page scrolls here. */
  formAnchorId: "estimate-form",
} as const;

/**
 * FEATURE FLAG — Reviews / testimonials section.
 *
 * Montara Forge has no collected reviews yet, so the <Reviews /> component is
 * built but NOT rendered. Flip this to `true` (and replace the placeholder
 * entries in components/Reviews.tsx with real, attributable reviews) once the
 * client has collected them. Do not enable with fabricated reviews.
 */
export const SHOW_REVIEWS = false;
