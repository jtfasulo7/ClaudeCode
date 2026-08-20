"use client";

import { useEffect, useState } from "react";
import { CallLink } from "@/components/CallLink";
import { PhoneIcon } from "@/components/icons";
import { scrollToForm } from "@/components/ScrollToFormButton";
import { SITE } from "@/lib/site";

/**
 * Mobile-only sticky bottom bar. Appears once the visitor has scrolled
 * PAST the form card (not while it's still on screen), and hides again
 * whenever the form is visible.
 */
export function StickyBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const form = document.getElementById(SITE.formAnchorId);
    if (!form || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => {
        const scrolledPast = !entry.isIntersecting && entry.boundingClientRect.bottom < 0;
        setVisible(scrolledPast);
      },
      { threshold: 0 },
    );
    io.observe(form);
    return () => io.disconnect();
  }, []);

  return (
    <div
      aria-hidden={!visible}
      className={`fixed inset-x-0 bottom-0 z-50 border-t border-line bg-ink/95 px-3 pt-2.5 backdrop-blur-md transition-transform duration-300 md:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      style={{ paddingBottom: "calc(0.625rem + env(safe-area-inset-bottom))" }}
    >
      <div className="flex gap-2">
        <button
          type="button"
          onClick={scrollToForm}
          tabIndex={visible ? 0 : -1}
          className="inline-flex min-h-12 flex-1 items-center justify-center rounded-lg bg-gold px-4 text-base font-bold text-ink shadow-gold"
        >
          Get My Free Estimate
        </button>
        <CallLink
          ariaLabel={`Call ${SITE.phoneDisplay}`}
          className="grid h-12 w-12 shrink-0 place-items-center rounded-lg border border-gold/60 text-gold"
        >
          <PhoneIcon className="h-5 w-5" />
        </CallLink>
      </div>
    </div>
  );
}
