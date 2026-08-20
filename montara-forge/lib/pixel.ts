/**
 * Meta Pixel helper — DORMANT until NEXT_PUBLIC_META_PIXEL_ID is set.
 *
 * Activation is purely an env-var change + redeploy:
 *   1. Create the pixel in Meta Events Manager.
 *   2. Set NEXT_PUBLIC_META_PIXEL_ID in Vercel → Environment Variables.
 *   3. Redeploy.
 *
 * With the var unset, <MetaPixel /> renders nothing and every function here
 * is a safe no-op, so call sites never need to guard.
 *
 * Events fired:
 *   PageView  — on load (inline in the base snippet, components/MetaPixel.tsx)
 *   Lead      — after /api/submit-lead returns (form success)
 *   Schedule  — when the GHL booking widget confirms an appointment
 *               (components/BookingCalendar.tsx, via postMessage listener)
 */

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
}

export const META_PIXEL_ID: string = (process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "").trim();

export const pixelEnabled: boolean = META_PIXEL_ID.length > 0;

type EventParams = Record<string, string | number | boolean | undefined>;

function fbq(...args: unknown[]): void {
  if (!pixelEnabled) return;
  if (typeof window === "undefined") return;
  if (typeof window.fbq !== "function") return;
  try {
    window.fbq(...args);
  } catch (err) {
    // Tracking must never break the page.
    console.warn("[pixel] fbq call failed", err);
  }
}

export const pixel = {
  pageView(): void {
    fbq("track", "PageView");
  },
  /** Fire once the lead is captured server-side (not on calendar render). */
  lead(params?: EventParams): void {
    fbq("track", "Lead", params);
  },
  /** Fire only when the GHL widget confirms a booking. */
  schedule(params?: EventParams): void {
    fbq("track", "Schedule", params);
  },
  /** Optional: tap-to-call engagement. */
  contact(): void {
    fbq("track", "Contact");
  },
};
