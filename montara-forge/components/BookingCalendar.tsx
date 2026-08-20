"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";
import { CallLink } from "@/components/CallLink";
import { CheckIcon, PhoneIcon } from "@/components/icons";
import { pixel } from "@/lib/pixel";
import { SITE } from "@/lib/site";

const WIDGET_SRC = `https://api.leadconnectorhq.com/widget/booking/${SITE.ghl.bookingWidgetId}`;

const TRUSTED_ORIGINS = new Set([
  "https://api.leadconnectorhq.com",
  "https://link.msgsndr.com",
  "https://msgsndr.com",
]);

/**
 * TODO(verify): GHL booking-confirmation postMessage shape.
 *
 * The LeadConnector booking widget talks to the parent page via postMessage
 * (form_embed.js uses it for iframe auto-resize). The exact message it sends
 * on a confirmed appointment is not documented. This detector is
 * deliberately conservative: it looks for a message whose type/event name
 * mentions booking/appointment AND confirm/success/booked/complete.
 *
 * To verify: set NEXT_PUBLIC_DEBUG_GHL_MESSAGES=1 locally, complete a test
 * booking, read the console log of every message, then tighten the check
 * below to the exact `type` string the widget emits. Schedule must NOT fire
 * on calendar render — that would just duplicate Lead.
 */
function looksLikeBookingConfirmation(data: unknown): boolean {
  let candidate = "";
  if (typeof data === "string") candidate = data;
  else if (data && typeof data === "object") {
    const d = data as Record<string, unknown>;
    candidate = [d.type, d.event, d.eventName, d.action, d.name]
      .filter((x): x is string => typeof x === "string")
      .join(" ");
  }
  if (!candidate) return false;
  const s = candidate.toLowerCase();
  const subject = /booking|appointment|calendar/.test(s);
  const outcome = /confirm|success|booked|complete|submitted/.test(s);
  return subject && outcome;
}

export function BookingCalendar({ firstName }: { firstName: string }) {
  const firedRef = useRef(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // Bring the confirmation + calendar to the top of the viewport so the
    // visitor sees the next action immediately, then announce it.
    document.getElementById(SITE.formAnchorId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    headingRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    const debug = !!process.env.NEXT_PUBLIC_DEBUG_GHL_MESSAGES;
    const onMessage = (e: MessageEvent) => {
      if (!TRUSTED_ORIGINS.has(e.origin)) return;
      if (debug) console.log("[ghl-widget message]", e.origin, e.data);
      if (firedRef.current) return;
      if (looksLikeBookingConfirmation(e.data)) {
        firedRef.current = true;
        pixel.schedule({ content_name: "onsite-estimate" });
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <div className="animate-rise">
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
            You&rsquo;re almost done{firstName ? `, ${firstName}` : ""}!
          </h2>
          <p className="mt-1.5 text-[0.95rem] text-bone-mute">
            Last step — pick a time for your free on-site estimate.
          </p>
        </div>
      </div>

      {/* GHL booking widget. form_embed.js auto-sizes the iframe height via
          postMessage; the min-height keeps the card from collapsing before
          the script runs (and on slow connections). */}
      <div className="mt-4 overflow-hidden rounded-xl border border-line bg-white">
        <iframe
          src={WIDGET_SRC}
          allow="payment"
          style={{ width: "100%", border: "none", overflow: "hidden", minHeight: 640 }}
          scrolling="no"
          id={SITE.ghl.bookingIframeId}
          title="Pick a time for your free on-site estimate"
        />
      </div>
      <Script src={SITE.ghl.embedScriptSrc} strategy="afterInteractive" />

      <p className="mt-4 text-center text-sm text-bone-mute">
        Prefer to talk now?{" "}
        <CallLink className="inline-flex items-center gap-1.5 font-semibold text-bone underline underline-offset-4 hover:text-gold">
          <PhoneIcon className="h-4 w-4 text-gold" />
          Call {SITE.phoneDisplay}
        </CallLink>
      </p>
    </div>
  );
}
