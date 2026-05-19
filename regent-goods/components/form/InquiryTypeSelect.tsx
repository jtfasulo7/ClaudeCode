"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/cn";
import {
  inquiryTypes,
  inquiryTypeLabels,
  inquiryTypeDescriptions,
  type InquiryType,
} from "@/lib/inquiry-schema";

export function InquiryTypeSelect({
  value,
  onChange,
  name = "inquiryType",
}: {
  value: InquiryType | "";
  onChange: (v: InquiryType) => void;
  name?: string;
}) {
  return (
    <fieldset>
      <legend className="text-[13px] font-medium text-ink">
        What best describes your inquiry?
        <span className="ml-1 text-navy">*</span>
      </legend>
      <div
        className="mt-4 grid gap-3 sm:grid-cols-3"
        role="radiogroup"
        aria-label="Inquiry type"
      >
        {inquiryTypes.map((type) => {
          const selected = value === type;
          return (
            <label
              key={type}
              className={cn(
                "relative flex cursor-pointer flex-col gap-2 border p-5 transition-colors",
                selected
                  ? "border-ink bg-paper-soft"
                  : "border-border bg-paper hover:border-ink/50",
              )}
            >
              <input
                type="radio"
                name={name}
                value={type}
                checked={selected}
                onChange={() => onChange(type)}
                className="sr-only"
              />
              <span
                aria-hidden="true"
                className={cn(
                  "inline-flex h-5 w-5 items-center justify-center border transition-colors rounded-[3px]",
                  selected
                    ? "border-navy bg-navy text-paper"
                    : "border-border bg-paper text-transparent",
                )}
              >
                <Check size={12} strokeWidth={3} />
              </span>
              <span className="display text-[16px] font-semibold tracking-tight text-ink">
                {inquiryTypeLabels[type]}
              </span>
              <span className="text-[13px] leading-snug text-text">
                {inquiryTypeDescriptions[type]}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
