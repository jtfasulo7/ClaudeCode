import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import { SITE } from "@/lib/site";

/**
 * Server component. Looks for /public/images/logo.svg or logo.png at build
 * time. If neither exists, renders the styled wordmark. Drop the file in and
 * redeploy — no code change needed.
 */
function findLogo(): { src: string; isSvg: boolean } | null {
  const dir = path.join(/*turbopackIgnore: true*/ process.cwd(), "public", "images");
  for (const file of ["logo.svg", "logo.png"]) {
    if (fs.existsSync(path.join(/*turbopackIgnore: true*/ dir, file))) {
      return { src: `/images/${file}`, isSvg: file.endsWith(".svg") };
    }
  }
  return null;
}

export function Logo({ className = "" }: { className?: string }) {
  const logo = findLogo();

  if (logo) {
    return (
      <span className={`inline-flex items-center ${className}`}>
        <Image
          src={logo.src}
          alt={SITE.name}
          width={180}
          height={44}
          priority
          unoptimized={logo.isSvg}
          className="h-8 w-auto sm:h-10"
        />
      </span>
    );
  }

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap select-none sm:gap-2 ${className}`}
      aria-label={SITE.name}
    >
      {/* Anvil mark */}
      <svg
        viewBox="0 0 26 26"
        aria-hidden="true"
        className="h-5 w-5 shrink-0 text-gold sm:h-6 sm:w-6"
      >
        <path
          fill="currentColor"
          d="M3 7h20l-2 4h-6v5l4 2v2H7v-2l4-2v-5H5a3 3 0 0 1-3-3V7Z"
        />
      </svg>
      <span className="font-display text-[1.25rem] leading-none tracking-[0.04em] text-bone sm:text-[1.65rem]">
        MONTARA <span className="text-gold">FORGE</span>
      </span>
    </span>
  );
}
