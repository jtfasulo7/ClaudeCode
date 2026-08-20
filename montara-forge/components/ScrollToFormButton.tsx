"use client";

import { SITE } from "@/lib/site";

/** Every repeated CTA scrolls back to the form card — never to a new page. */
export function scrollToForm() {
  const el = document.getElementById(SITE.formAnchorId);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
  // Hand focus to the first interactive control inside the card.
  window.setTimeout(() => {
    const target = el.querySelector<HTMLElement>(
      'button[role="radio"], input:not([type="hidden"]), button[type="submit"]',
    );
    target?.focus({ preventScroll: true });
  }, 450);
}

export function ScrollToFormButton({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button type="button" onClick={scrollToForm} className={className}>
      {children}
    </button>
  );
}
