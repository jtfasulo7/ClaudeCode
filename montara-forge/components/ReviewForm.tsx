"use client";

import { useState } from "react";
import { CallLink } from "@/components/CallLink";
import { CheckIcon, Spinner } from "@/components/icons";
import { formatUsPhone, isValidUsPhone } from "@/lib/phone";
import { SITE } from "@/lib/site";

type Values = {
  rating: number;
  review: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  okToShare: boolean;
  website: string; // honeypot
};

type Errors = Partial<Record<"rating" | "review" | "firstName" | "lastName" | "phone" | "email", string>>;

const STAR_WORDS = ["", "Poor", "Fair", "Good", "Great", "Excellent"];

function validate(v: Values): Errors {
  const e: Errors = {};
  if (!v.rating) e.rating = "Pick a star rating.";
  if (v.review.trim().length < 3) e.review = "Tell us a little about the job.";
  if (!v.firstName.trim()) e.firstName = "Enter your first name.";
  if (!v.lastName.trim()) e.lastName = "Enter your last name.";
  if (!isValidUsPhone(v.phone)) e.phone = "Enter a valid US phone number.";
  if (v.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) e.email = "Check your email address.";
  return e;
}

export function ReviewForm() {
  const [values, setValues] = useState<Values>({
    rating: 0,
    review: "",
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    okToShare: false,
    website: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "failed">("idle");
  const [hover, setHover] = useState(0);
  const submitting = status === "submitting";

  function set<K extends keyof Values>(key: K, value: Values[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    if (key in errors) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  async function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    const e = validate(values);
    setErrors(e);
    if (Object.keys(e).length) {
      document.getElementById(`review-${Object.keys(e)[0]}`)?.focus();
      return;
    }
    setStatus("submitting");
    try {
      const res = await fetch("/api/submit-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      setStatus(res.ok ? "done" : "failed");
    } catch {
      setStatus("failed");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-xl border border-line bg-ink-2 p-6 text-center sm:p-8" role="status">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-gold-dim text-gold">
          <CheckIcon className="h-6 w-6" />
        </span>
        <h2 className="mt-4 font-display text-3xl text-bone">Thank you, {values.firstName.trim()}.</h2>
        <p className="mt-2 text-bone-mute">Your review is in. I really appreciate it.</p>
      </div>
    );
  }

  const shown = hover || values.rating;

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5 rounded-xl border border-line bg-ink-2 p-5 sm:p-7">
      <fieldset>
        <legend className="mb-2 text-[0.95rem] font-semibold text-bone">How did I do?</legend>
        <div
          id="review-rating"
          tabIndex={-1}
          role="radiogroup"
          aria-label="Star rating"
          aria-describedby={errors.rating ? "review-rating-error" : undefined}
          className="flex items-center gap-1"
          onMouseLeave={() => setHover(0)}
        >
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={values.rating === n}
              aria-label={`${n} star${n > 1 ? "s" : ""}`}
              onClick={() => set("rating", n)}
              onMouseEnter={() => setHover(n)}
              disabled={submitting}
              className="grid h-12 w-12 place-items-center rounded-md text-bone/20 transition-colors data-[on=true]:text-gold"
              data-on={n <= shown}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-9 w-9 fill-current">
                <path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z" />
              </svg>
            </button>
          ))}
          <span className="ml-2 text-sm font-semibold text-bone-mute">{STAR_WORDS[shown]}</span>
        </div>
        {errors.rating && <ErrorText id="review-rating-error">{errors.rating}</ErrorText>}
      </fieldset>

      <Field id="review-review" label="Your review" error={errors.review}>
        <textarea
          id="review-review"
          name="review"
          rows={5}
          maxLength={4000}
          placeholder="What did I do for you, and how did it turn out?"
          value={values.review}
          onChange={(e) => set("review", e.target.value)}
          aria-invalid={!!errors.review}
          aria-describedby={errors.review ? "review-review-error" : undefined}
          className="input-base resize-y"
          disabled={submitting}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="review-firstName" label="First name" error={errors.firstName}>
          <input
            id="review-firstName"
            name="firstName"
            type="text"
            autoComplete="given-name"
            autoCapitalize="words"
            value={values.firstName}
            onChange={(e) => set("firstName", e.target.value)}
            aria-invalid={!!errors.firstName}
            aria-describedby={errors.firstName ? "review-firstName-error" : undefined}
            className="input-base"
            disabled={submitting}
          />
        </Field>
        <Field id="review-lastName" label="Last name" error={errors.lastName}>
          <input
            id="review-lastName"
            name="lastName"
            type="text"
            autoComplete="family-name"
            autoCapitalize="words"
            value={values.lastName}
            onChange={(e) => set("lastName", e.target.value)}
            aria-invalid={!!errors.lastName}
            aria-describedby={errors.lastName ? "review-lastName-error" : undefined}
            className="input-base"
            disabled={submitting}
          />
        </Field>
      </div>

      <Field id="review-phone" label="Phone" hint="So I can match your review to your job. Never shown publicly." error={errors.phone}>
        <input
          id="review-phone"
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          placeholder="(435) 555-0100"
          value={values.phone}
          onChange={(e) => set("phone", formatUsPhone(e.target.value))}
          aria-invalid={!!errors.phone}
          aria-describedby={errors.phone ? "review-phone-error" : "review-phone-hint"}
          className="input-base tabular-nums"
          disabled={submitting}
        />
      </Field>

      <Field
        id="review-email"
        label={
          <>
            Email <span className="font-normal text-bone-mute">(optional)</span>
          </>
        }
        error={errors.email}
      >
        <input
          id="review-email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          autoCapitalize="none"
          value={values.email}
          onChange={(e) => set("email", e.target.value)}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "review-email-error" : undefined}
          className="input-base"
          disabled={submitting}
        />
      </Field>

      {/* Honeypot — visually hidden, excluded from tab order. */}
      <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="review-website">Website</label>
        <input
          id="review-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.website}
          onChange={(e) => set("website", e.target.value)}
        />
      </div>

      <label className="flex cursor-pointer items-start gap-3 text-[0.9rem] leading-snug text-bone-mute">
        <input
          type="checkbox"
          checked={values.okToShare}
          onChange={(e) => set("okToShare", e.target.checked)}
          disabled={submitting}
          className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--color-gold)]"
        />
        It&rsquo;s OK to share my review on the {SITE.name} website, with my first name and last initial.
      </label>

      {status === "failed" && (
        <p role="alert" className="rounded-lg border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">
          Sorry, your review didn&rsquo;t go through. Please try again, or call or text me at{" "}
          <CallLink className="font-semibold underline">{SITE.phoneDisplay}</CallLink>.
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex min-h-[3.5rem] w-full items-center justify-center gap-2 rounded-lg bg-gold px-5 text-lg font-bold text-ink shadow-gold transition-colors hover:bg-gold-bright disabled:cursor-wait disabled:opacity-80"
      >
        {submitting ? (
          <>
            <Spinner className="h-5 w-5" /> Sending…
          </>
        ) : (
          "Submit Review"
        )}
      </button>
    </form>
  );
}

function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: React.ReactNode;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[0.95rem] font-semibold text-bone">
        {label}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-bone-mute">
          {hint}
        </p>
      )}
      {error && <ErrorText id={`${id}-error`}>{error}</ErrorText>}
    </div>
  );
}

function ErrorText({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <p id={id} className="mt-1.5 text-sm text-danger">
      {children}
    </p>
  );
}
