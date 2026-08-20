"use client";

import { SITE } from "@/lib/site";
import { pixel } from "@/lib/pixel";

/** Tap-to-call anchor. Fires a (no-op until enabled) Contact pixel event. */
export function CallLink({
  className = "",
  children,
  ariaLabel,
}: {
  className?: string;
  children: React.ReactNode;
  ariaLabel?: string;
}) {
  return (
    <a
      href={SITE.phoneHref}
      className={className}
      aria-label={ariaLabel ?? `Call ${SITE.name} at ${SITE.phoneDisplay}`}
      onClick={() => pixel.contact()}
    >
      {children}
    </a>
  );
}
