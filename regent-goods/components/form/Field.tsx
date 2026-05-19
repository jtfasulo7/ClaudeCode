import { cn } from "@/lib/cn";

export function FieldGroup({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("grid gap-5 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-5", className)}>
      {children}
    </div>
  );
}

export function FieldShell({
  label,
  htmlFor,
  required,
  hint,
  error,
  className,
  children,
  fullWidth = false,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  hint?: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
  fullWidth?: boolean;
}) {
  return (
    <div className={cn(fullWidth && "sm:col-span-2", className)}>
      <label
        htmlFor={htmlFor}
        className="flex items-baseline justify-between text-[13px] font-medium text-ink"
      >
        <span>
          {label}
          {required ? (
            <span className="ml-1 text-navy" aria-hidden="true">
              *
            </span>
          ) : null}
        </span>
        {hint ? <span className="text-[12px] text-text-soft">{hint}</span> : null}
      </label>
      <div className="mt-2">{children}</div>
      {error ? (
        <p className="mt-2 text-[12.5px] text-[#a51c1c]" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

const inputBase =
  "block w-full h-11 bg-paper border border-border px-3.5 text-[15px] text-ink placeholder:text-mute transition-colors focus:outline-none focus:border-ink rounded-[3px]";

export function TextInput({
  invalid,
  className,
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }) {
  return (
    <input
      {...rest}
      className={cn(inputBase, invalid && "border-[#a51c1c]", className)}
    />
  );
}

export function TextArea({
  invalid,
  className,
  ...rest
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean }) {
  return (
    <textarea
      {...rest}
      className={cn(
        inputBase,
        "h-auto min-h-[120px] py-3 leading-relaxed",
        invalid && "border-[#a51c1c]",
        className,
      )}
    />
  );
}
