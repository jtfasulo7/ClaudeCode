"use client";

import { useEffect, useRef } from "react";
import { CallLink } from "@/components/CallLink";
import { CheckIcon, PhoneIcon } from "@/components/icons";
import { SITE } from "@/lib/site";

/**
 * The end of the flow.
 *
 * This used to be a booking calendar. It is now a close: the lead is already
 * in the CRM by the time this renders, and the callback is the promise.
 *
 * `captured` is the one thing that changes what this says. The API route
 * deliberately never shows a cold lead an error, so a failed CRM push still
 * returns success — which was safe while a booking widget sat here and took
 * their details a second time. With the calendar gone that second capture is
 * gone too, so promising a call we have no number to make would be a lie the
 * visitor acts on. When the capture failed, the phone number leads instead.
 */
export function ThankYou({
  firstName,
  captured,
}: {
  firstName: string;
  captured: boolean;
}) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // The card swapped contents without navigating, so nothing would announce
    // the change or move the caret out of the form that no longer exists.
    headingRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    headingRef.current?.focus();
  }, []);

  if (!captured) {
    return (
      <div className="animate-rise" role="status" aria-live="polite">
        <h2
          ref={headingRef}
          tabIndex={-1}
          className="font-display text-[1.85rem] leading-[1.02] text-bone outline-none sm:text-[2.1rem]"
        >
          Let&rsquo;s get you on the phone{firstName ? `, ${firstName}` : ""}.
        </h2>
        <p className="mt-2 text-[0.95rem] text-bone-mute">
          Something went wrong on our end and your details didn&rsquo;t reach us. Nothing you
          did — but rather than leave you waiting on a call that won&rsquo;t come, give us a
          ring and we&rsquo;ll take it from here.
        </p>

        <CallLink className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gold px-5 py-4 font-semibold text-ink transition hover:brightness-110">
          <PhoneIcon className="h-5 w-5" />
          Call {SITE.phoneDisplay}
        </CallLink>
      </div>
    );
  }

  return (
    <div className="animate-rise" role="status" aria-live="polite">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gold text-ink">
          <CheckIcon className="h-5 w-5" />
        </span>
        <div>
          <h2
            ref={headingRef}
            tabIndex={-1}
            className="font-display text-[1.85rem] leading-[1.02] text-bone outline-none sm:text-[2.1rem]"
          >
            Thank you{firstName ? `, ${firstName}` : ""}.
          </h2>
          <p className="mt-1.5 text-[0.95rem] text-bone-mute">
            We have your project details, and we appreciate you considering{" "}
            {SITE.name}.
          </p>
        </div>
      </div>

      <p className="mt-4 text-[0.95rem] leading-relaxed text-bone-mute">
        A member of our team will call you as soon as possible to talk through the job and
        arrange your free on-site estimate. No pressure, no obligation — just a straight
        answer on what the work takes and what it costs.
      </p>

      <p className="mt-5 text-center text-sm text-bone-mute">
        Would rather talk now?{" "}
        <CallLink className="inline-flex items-center gap-1.5 font-semibold text-bone underline underline-offset-4 hover:text-gold">
          <PhoneIcon className="h-4 w-4 text-gold" />
          Call {SITE.phoneDisplay}
        </CallLink>
      </p>
    </div>
  );
}
