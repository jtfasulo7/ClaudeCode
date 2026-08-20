import { Logo } from "@/components/Logo";
import { CallLink } from "@/components/CallLink";
import { PhoneIcon } from "@/components/icons";
import { SITE } from "@/lib/site";

/**
 * Minimal header. Logo + tap-to-call only. Deliberately NO navigation —
 * the only exits on this page are the form and the phone number.
 */
export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ink/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:h-16 sm:px-6">
        <Logo />
        <CallLink className="inline-flex h-10 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md border border-gold/60 px-2.5 text-[0.85rem] font-semibold text-gold transition-colors hover:bg-gold hover:text-ink sm:h-11 sm:gap-2 sm:px-4 sm:text-[0.95rem]">
          <PhoneIcon className="h-4 w-4" />
          <span>
            Call <span className="tabular-nums">{SITE.phoneDisplay}</span>
          </span>
        </CallLink>
      </div>
      <div className="hatch h-[3px] opacity-70" aria-hidden="true" />
    </header>
  );
}
