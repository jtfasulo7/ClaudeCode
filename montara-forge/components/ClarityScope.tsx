"use client";

import { useEffect } from "react";

type ClarityFn = (command: string, ...args: unknown[]) => void;

let mountedBefore = false;

/**
 * Keeps Clarity on the landing page only. The footer links are client-side
 * navigations, so a Clarity session started on / would otherwise keep
 * recording on /privacy, /terms and /review. Stop on leaving /, start again on
 * coming back (the first visit is started by the snippet itself).
 */
export function ClarityScope() {
  useEffect(() => {
    const clarity = () => (window as unknown as { clarity?: ClarityFn }).clarity;
    if (mountedBefore) clarity()?.("start");
    mountedBefore = true;
    return () => clarity()?.("stop");
  }, []);
  return null;
}
