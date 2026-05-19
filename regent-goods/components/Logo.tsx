import Link from "next/link";
import { cn } from "@/lib/cn";

/**
 * Typographic logo placeholder. Swap this for a real mark when assets land.
 * TODO: Replace with real logo SVG when provided.
 */
export function Logo({
  variant = "light",
  className,
}: {
  variant?: "light" | "dark";
  className?: string;
}) {
  const isDark = variant === "dark";
  return (
    <Link
      href="/"
      aria-label="Regent Goods Wholesale & Liquidation — Home"
      className={cn(
        "display group inline-flex items-baseline gap-[0.4rem] leading-none",
        className,
      )}
    >
      <span
        className={cn(
          "text-[20px] font-extrabold tracking-tight",
          isDark ? "text-paper" : "text-ink",
        )}
      >
        Regent
      </span>
      <span
        aria-hidden="true"
        className={cn(
          "block h-[6px] w-[6px] rounded-full",
          isDark ? "bg-paper" : "bg-navy",
        )}
      />
      <span
        className={cn(
          "text-[20px] font-semibold tracking-tight",
          isDark ? "text-paper" : "text-ink",
        )}
      >
        Goods
      </span>
    </Link>
  );
}
