import { cn } from "@/lib/cn";

export function Container({
  children,
  className,
  as: As = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}) {
  return (
    <As className={cn("mx-auto w-full max-w-[1280px] px-6 sm:px-8 lg:px-12", className)}>
      {children}
    </As>
  );
}
