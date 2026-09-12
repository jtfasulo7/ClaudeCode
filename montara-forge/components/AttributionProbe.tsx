"use client";

import { useEffect } from "react";
import { rememberAttribution } from "@/lib/attribution";

/**
 * Records where this visit came from, on the first page view.
 *
 * It has to run THIS early. `document.referrer` and the `fbclid` query
 * parameter describe how the visitor arrived, and both are gone the moment
 * they navigate anywhere — so reading them at submit time returns the site's
 * own URL and labels every ad click as direct traffic.
 *
 * Renders nothing. See lib/attribution.ts for why the value is first-touch and
 * why it lives in sessionStorage.
 */
export function AttributionProbe() {
  useEffect(() => {
    rememberAttribution();
  }, []);

  return null;
}
