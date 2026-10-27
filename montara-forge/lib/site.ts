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
 * On since the first real review came in (Scott McDonell, 5★). The reviews
 * themselves live in components/sections/Reviews.tsx. Never fill the section
 * with fabricated reviews.
 */
export const SHOW_REVIEWS = true;
