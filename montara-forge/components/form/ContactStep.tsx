"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { formatUsPhone, isValidUsPhone } from "@/lib/phone";
import { SITE } from "@/lib/site";
import { ArrowRightIcon, Spinner } from "@/components/icons";

export interface ContactValues {
  firstName: string;
  lastName: string;
  /** Masked display value, e.g. "(435) 319-9628". Server normalizes to E.164. */
  phone: string;
  email: string;
  consent: boolean;
  /** Honeypot. */
  website: string;
}

type Errors = Partial<Record<keyof ContactValues, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ContactStep({
  submitting,
  onSubmit,
}: {
  submitting: boolean;
  onSubmit: (values: ContactValues) => void;
}) {
  const [values, setValues] = useState<ContactValues>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    consent: false,
    website: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const firstRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    firstRef.current?.focus({ preventScroll: true });
  }, []);

  const set = <K extends keyof ContactValues>(key: K, v: ContactValues[K]) => {
    setValues((s) => ({ ...s, [key]: v }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validate = (): Errors => {
    const e: Errors = {};
    if (!values.firstName.trim()) e.firstName = "Please enter your first name.";
    if (!values.lastName.trim()) e.lastName = "Please enter your last name.";
    if (!values.phone.trim()) e.phone = "We need a phone number to send your estimate details.";
    else if (!isValidUsPhone(values.phone)) e.phone = "That doesn't look like a complete US number.";
    if (values.email.trim() && !EMAIL_RE.test(values.email.trim()))
      e.email = "That email looks incomplete — or leave it blank.";
    if (!values.consent) e.consent = "Please check the box so we can text you about your estimate.";
    return e;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (submitting) return;
    const e = validate();
    setErrors(e);
    const firstError = (Object.keys(e) as (keyof ContactValues)[]).find((k) => e[k]);
    if (firstError) {
      document.getElementById(`contact-${firstError}`)?.focus();
      return;
    }
    onSubmit(values);
  };

  return (
    <form noValidate onSubmit={handleSubmit} className="grid gap-3">
      <div className="grid grid-cols-2 gap-3">
        <Field id="contact-firstName" label="First name" error={errors.firstName}>
          <input
            ref={firstRef}
            id="contact-firstName"
            name="firstName"
            type="text"
            autoComplete="given-name"
            autoCapitalize="words"
            value={values.firstName}
            onChange={(e) => set("firstName", e.target.value)}
            aria-invalid={!!errors.firstName}
            aria-describedby={errors.firstName ? "contact-firstName-error" : undefined}
            className="input-base"
            disabled={submitting}
          />
        </Field>
        <Field id="contact-lastName" label="Last name" error={errors.lastName}>
          <input
            id="contact-lastName"
            name="lastName"
            type="text"
            autoComplete="family-name"
            autoCapitalize="words"
            value={values.lastName}
            onChange={(e) => set("lastName", e.target.value)}
            aria-invalid={!!errors.lastName}
            aria-describedby={errors.lastName ? "contact-lastName-error" : undefined}
            className="input-base"
            disabled={submitting}
          />
        </Field>
      </div>

      <Field id="contact-phone" label="Mobile phone" error={errors.phone}>
        <input
          id="contact-phone"
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          placeholder="(435) 555-0100"
          value={values.phone}
          onChange={(e) => set("phone", formatUsPhone(e.target.value))}
          aria-invalid={!!errors.phone}
          aria-describedby={errors.phone ? "contact-phone-error" : undefined}
          className="input-base tabular-nums"
          disabled={submitting}
        />
      </Field>

      <Field
        id="contact-email"
        label={
          <>
            Email <span className="font-normal text-bone-mute">(optional)</span>
          </>
        }
        error={errors.email}
      >
        <input
          id="contact-email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          autoCapitalize="none"
          value={values.email}
          onChange={(e) => set("email", e.target.value)}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "contact-email-error" : undefined}
          className="input-base"
          disabled={submitting}
        />
      </Field>

      {/* Honeypot — visually hidden, excluded from tab order. */}
      <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="contact-website">Website</label>
        <input
          id="contact-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.website}
          onChange={(e) => set("website", e.target.value)}
        />
      </div>

      {/* SMS consent — exact required language */}
      <div>
        <label
          htmlFor="contact-consent"
          className={`flex cursor-pointer gap-3 rounded-lg border p-3 transition-colors ${
            errors.consent ? "border-danger/70 bg-danger/5" : "border-line bg-ink/60"
          }`}
        >
          <input
            id="contact-consent"
            name="consent"
            type="checkbox"
            checked={values.consent}
            onChange={(e) => set("consent", e.target.checked)}
            aria-invalid={!!errors.consent}
            aria-describedby={errors.consent ? "contact-consent-error" : undefined}
            disabled={submitting}
            className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-gold"
          />
          <span className="text-[0.8rem] leading-snug text-bone-mute">
            By submitting, I agree to receive text messages from {SITE.name} about my estimate
            request. Message &amp; data rates may apply. Reply STOP to opt out.{" "}
            <Link
              href="/privacy"
              target="_blank"
              rel="noopener"
              className="font-semibold text-bone underline underline-offset-2 hover:text-gold"
            >
              Privacy Policy
            </Link>
          </span>
        </label>
        {errors.consent && (
          <p id="contact-consent-error" role="alert" className="mt-1.5 text-sm text-danger">
            {errors.consent}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={submitting}
        aria-busy={submitting}
        className="mt-1 inline-flex min-h-[3.5rem] w-full items-center justify-center gap-2 rounded-lg bg-gold px-5 text-lg font-bold text-ink shadow-gold transition-colors hover:bg-gold-bright disabled:cursor-wait disabled:opacity-80"
      >
        {submitting ? (
          <>
            <Spinner className="h-5 w-5" />
            Sending…
          </>
        ) : (
          <>
            Get My Free Estimate
            <ArrowRightIcon className="h-5 w-5" />
          </>
        )}
      </button>
      <p className="text-center text-xs text-bone-mute">
        Next: pick a time for your on-site visit. No pressure, no obligation.
      </p>
    </form>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: React.ReactNode;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-bone">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
