"use client";

import { useEffect, useRef, useState } from "react";
import { isInServiceArea } from "@/lib/service-area";
import { ArrowRightIcon, PinIcon } from "@/components/icons";

export function LocationStep({
  value,
  onChange,
  onContinue,
}: {
  value: string;
  onChange: (v: string) => void;
  onContinue: () => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Open the keyboard straight away on this step.
    inputRef.current?.focus({ preventScroll: true });
  }, []);

  const trimmed = value.trim();
  // Soft validation only: we show a note, we never block.
  const showAreaNote = trimmed.length >= 3 && !isInServiceArea(trimmed);

  const handleContinue = () => {
    if (trimmed.length < 2) {
      setError("Enter your city or ZIP so we can confirm we serve your area.");
      inputRef.current?.focus();
      return;
    }
    setError(null);
    onContinue();
  };

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        handleContinue();
      }}
      className="grid gap-3"
    >
      <div>
        <label htmlFor="location" className="mb-1.5 block text-sm font-semibold text-bone">
          City + ZIP (or street address)
          <span className="ml-1.5 font-normal text-bone-mute">— so we can confirm we serve your area.</span>
        </label>
        <div className="relative">
          <PinIcon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gold" />
          <input
            ref={inputRef}
            id="location"
            name="location"
            type="text"
            inputMode="text"
            autoComplete="postal-code"
            placeholder="e.g. Cedar City 84720"
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              if (error) setError(null);
            }}
            aria-invalid={!!error}
            aria-describedby={error ? "location-error" : showAreaNote ? "location-note" : undefined}
            className="input-base pl-11"
          />
        </div>
        {error && (
          <p id="location-error" role="alert" className="mt-1.5 text-sm text-danger">
            {error}
          </p>
        )}
        {!error && showAreaNote && (
          <p id="location-note" className="mt-1.5 text-sm text-bone-mute">
            Not one of our usual towns — no problem. We&rsquo;ll confirm we can reach you when we call.
          </p>
        )}
      </div>

      <button
        type="submit"
        className="inline-flex min-h-[3.25rem] w-full items-center justify-center gap-2 rounded-lg bg-gold px-5 text-base font-bold text-ink shadow-gold transition-colors hover:bg-gold-bright"
      >
        Continue
        <ArrowRightIcon className="h-5 w-5" />
      </button>
    </form>
  );
}
