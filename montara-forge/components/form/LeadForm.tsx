"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  IMPLIED_NEW_OR_REPLACEMENT,
  NEW_OR_REPLACEMENT_OPTIONS,
  PROJECT_OPTIONS,
  SIZE_OPTIONS,
  TIMELINE_OPTIONS,
  type LeadPayload,
  type NewOrReplacement,
  type ProjectType,
  type SizeRange,
  type Timeline,
} from "@/lib/form";
import { isInServiceArea } from "@/lib/service-area";
import { pixel } from "@/lib/pixel";
import { SITE } from "@/lib/site";
import { OptionStep } from "./OptionStep";
import { LocationStep } from "./LocationStep";
import { ContactStep, type ContactValues } from "./ContactStep";
import { BookingCalendar } from "@/components/BookingCalendar";
import { ArrowLeftIcon, ShieldIcon } from "@/components/icons";

type StepId = "project" | "newOrReplacement" | "size" | "timeline" | "location" | "contact";

interface Answers {
  projectType?: ProjectType;
  newOrReplacement?: NewOrReplacement;
  sizeRange?: SizeRange;
  timeline?: Timeline;
  location: string;
}

const QUESTION: Record<StepId, string> = {
  project: "What's your project?",
  newOrReplacement: "New pour or replacing existing concrete?",
  size: "About how big is the area?",
  timeline: "When are you hoping to get this done?",
  location: "Where's the project located?",
  contact: "Where should we send your estimate details?",
};

/** Step 2 is only asked when the project type doesn't already answer it. */
function stepsFor(projectType?: ProjectType): StepId[] {
  const needsStep2 = projectType ? IMPLIED_NEW_OR_REPLACEMENT[projectType] === undefined : false;
  return [
    "project",
    ...(needsStep2 ? (["newOrReplacement"] as const) : []),
    "size",
    "timeline",
    "location",
    "contact",
  ];
}

const ADVANCE_DELAY_MS = 170;

export function LeadForm() {
  const [answers, setAnswers] = useState<Answers>({ location: "" });
  const [stepIndex, setStepIndex] = useState(0);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [status, setStatus] = useState<"idle" | "submitting" | "done">("idle");
  const [submittedFirstName, setSubmittedFirstName] = useState("");
  const [touched, setTouched] = useState(false);

  const steps = useMemo(() => stepsFor(answers.projectType), [answers.projectType]);
  const stepId = steps[Math.min(stepIndex, steps.length - 1)];
  const total = steps.length;

  const headingRef = useRef<HTMLHeadingElement>(null);
  const timerRef = useRef<number | null>(null);
  useEffect(() => () => { if (timerRef.current) window.clearTimeout(timerRef.current); }, []);

  // Move focus to the new question on step change (not on first paint — that
  // would yank the viewport on load). Keyboard/screen-reader users land on
  // the heading and can tab straight into the options.
  useEffect(() => {
    if (!touched) return;
    headingRef.current?.focus({ preventScroll: true });
  }, [stepId, touched]);

  const go = useCallback((dir: "forward" | "back") => {
    setTouched(true);
    setDirection(dir);
    setStepIndex((i) => (dir === "forward" ? i + 1 : Math.max(0, i - 1)));
  }, []);

  const advanceSoon = useCallback(() => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => go("forward"), ADVANCE_DELAY_MS);
  }, [go]);

  // ---- option handlers ---------------------------------------------------
  const pickProject = (value: ProjectType) => {
    const implied = IMPLIED_NEW_OR_REPLACEMENT[value];
    setAnswers((a) => ({
      ...a,
      projectType: value,
      // Carry the implied answer; clear a stale explicit one if the user
      // went back and switched to a type that asks the question.
      newOrReplacement: implied ?? (IMPLIED_NEW_OR_REPLACEMENT[a.projectType ?? value] ? undefined : a.newOrReplacement),
    }));
    advanceSoon();
  };
  const pickNewOrReplacement = (value: NewOrReplacement) => {
    setAnswers((a) => ({ ...a, newOrReplacement: value }));
    advanceSoon();
  };
  const pickSize = (value: SizeRange) => {
    setAnswers((a) => ({ ...a, sizeRange: value }));
    advanceSoon();
  };
  const pickTimeline = (value: Timeline) => {
    setAnswers((a) => ({ ...a, timeline: value }));
    advanceSoon();
  };

  // ---- submit ------------------------------------------------------------
  const submit = async (contact: ContactValues) => {
    if (status === "submitting") return;
    setStatus("submitting");

    const payload: LeadPayload = {
      firstName: contact.firstName.trim(),
      lastName: contact.lastName.trim(),
      phone: contact.phone,
      email: contact.email.trim() || undefined,
      projectType: answers.projectType!,
      newOrReplacement: answers.newOrReplacement!,
      sizeRange: answers.sizeRange!,
      timeline: answers.timeline!,
      location: answers.location.trim(),
      inServiceArea: isInServiceArea(answers.location),
      website: contact.website,
    };

    try {
      const res = await fetch("/api/submit-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        keepalive: true,
      });
      if (!res.ok) {
        console.error("[lead] submit returned", res.status, await res.text().catch(() => ""));
      }
      // Lead fires once the request has returned — capture happened (or was
      // logged server-side). Never fire on calendar render.
      pixel.lead({ content_name: payload.projectType });
    } catch (err) {
      // Network failure. We still advance: the booking widget captures the
      // contact a second time, so the visitor is not lost.
      console.error("[lead] submit failed", err);
    } finally {
      setSubmittedFirstName(payload.firstName);
      setStatus("done");
    }
  };

  // ---- success state: swap in the calendar, same card, no navigation -----
  if (status === "done") {
    return (
      <FormShell>
        <BookingCalendar firstName={submittedFirstName} />
      </FormShell>
    );
  }

  const selected = {
    project: answers.projectType,
    newOrReplacement: answers.newOrReplacement,
    size: answers.sizeRange,
    timeline: answers.timeline,
  };

  return (
    <FormShell>
      {/* Progress */}
      <div className="flex items-center justify-between gap-4">
        <p className="eyebrow">
          Step <span className="text-bone">{stepIndex + 1}</span> of {total}
        </p>
        <p className="text-xs font-medium text-bone-mute">Free · No obligation · ~30 seconds</p>
      </div>
      <div
        className="mt-2.5 flex gap-1"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={stepIndex + 1}
        aria-label="Form progress"
      >
        {steps.map((s, i) => (
          <span
            key={s}
            className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
              i <= stepIndex ? "bg-gold" : "bg-line-strong"
            }`}
          />
        ))}
      </div>

      {/* Step body (re-mounted per step so the enter animation replays) */}
      <div
        key={stepId}
        className={direction === "forward" ? "animate-step-forward" : "animate-step-back"}
      >
        <h2
          ref={headingRef}
          tabIndex={-1}
          className="mt-5 font-display text-[1.75rem] leading-[1.02] text-bone outline-none sm:text-[2rem]"
        >
          {QUESTION[stepId]}
        </h2>

        <div className="mt-4">
          {stepId === "project" && (
            <OptionStep name="projectType" options={PROJECT_OPTIONS} value={selected.project} onSelect={pickProject} />
          )}
          {stepId === "newOrReplacement" && (
            <OptionStep
              name="newOrReplacement"
              options={NEW_OR_REPLACEMENT_OPTIONS}
              value={selected.newOrReplacement}
              onSelect={pickNewOrReplacement}
            />
          )}
          {stepId === "size" && (
            <OptionStep name="sizeRange" options={SIZE_OPTIONS} value={selected.size} onSelect={pickSize} />
          )}
          {stepId === "timeline" && (
            <OptionStep name="timeline" options={TIMELINE_OPTIONS} value={selected.timeline} onSelect={pickTimeline} />
          )}
          {stepId === "location" && (
            <LocationStep
              value={answers.location}
              onChange={(location) => setAnswers((a) => ({ ...a, location }))}
              onContinue={() => go("forward")}
            />
          )}
          {stepId === "contact" && (
            <ContactStep submitting={status === "submitting"} onSubmit={submit} />
          )}
        </div>
      </div>

      {/* Footer row: back + trust line */}
      <div className="mt-5 flex items-center justify-between gap-3 border-t border-line pt-4">
        {stepIndex > 0 ? (
          <button
            type="button"
            onClick={() => go("back")}
            disabled={status === "submitting"}
            className="inline-flex min-h-10 items-center gap-1.5 rounded-md px-2 text-sm font-semibold text-bone-mute transition-colors hover:text-bone disabled:opacity-50"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back
          </button>
        ) : (
          <span />
        )}
        <p className="inline-flex items-center gap-1.5 text-xs font-medium text-bone-mute">
          <ShieldIcon className="h-4 w-4 text-gold" />
          Licensed &amp; Insured in {SITE.state}
        </p>
      </div>
    </FormShell>
  );
}

/** The card every state renders inside, so the swap to the calendar is seamless. */
function FormShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      id={SITE.formAnchorId}
      className="relative scroll-mt-20 rounded-2xl border border-line-strong bg-ink-2 p-4 shadow-forge sm:p-6"
    >
      {/* Gold corner brackets — a small "forged" brand moment */}
      <span aria-hidden="true" className="pointer-events-none absolute -left-px -top-px h-5 w-5 rounded-tl-2xl border-l-2 border-t-2 border-gold" />
      <span aria-hidden="true" className="pointer-events-none absolute -bottom-px -right-px h-5 w-5 rounded-br-2xl border-b-2 border-r-2 border-gold" />
      {children}
    </div>
  );
}
