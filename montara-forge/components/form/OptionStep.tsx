"use client";

import type { Option } from "@/lib/form";
import { ArrowRightIcon, CheckIcon } from "@/components/icons";

/**
 * One-question-per-step option cards. Rendered as a radio group for AT,
 * but each card is a real <button> so the whole surface is a tap target and
 * arrow keys / Enter / Space behave natively.
 */
export function OptionStep<T extends string>({
  name,
  options,
  value,
  onSelect,
}: {
  name: string;
  options: Option<T>[];
  value?: T;
  onSelect: (value: T) => void;
}) {
  return (
    <div role="radiogroup" aria-label={name} className="grid gap-2.5">
      {options.map((opt) => {
        const selected = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={selected}
            data-selected={selected}
            onClick={() => onSelect(opt.value)}
            className="option-card"
          >
            <span className="flex min-w-0 flex-1 flex-col">
              <span>{opt.label}</span>
              {opt.hint && (
                <span className="mt-0.5 text-[0.8rem] font-normal leading-snug text-bone-mute">
                  {opt.hint}
                </span>
              )}
            </span>
            <span
              aria-hidden="true"
              className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border transition-colors ${
                selected ? "border-gold bg-gold text-ink" : "border-line-strong text-bone-mute"
              }`}
            >
              {selected ? <CheckIcon className="h-4 w-4" /> : <ArrowRightIcon className="h-4 w-4" />}
            </span>
          </button>
        );
      })}
    </div>
  );
}
