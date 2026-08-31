import Link from "next/link";
import { CallLink } from "@/components/CallLink";
import { SITE } from "@/lib/site";

/** Minimal footer: name, phone, license line, legal links. Nothing else. */
export function Footer() {
  return (
    <footer className="border-t border-line bg-ink-2 pb-24 pt-10 md:pb-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 sm:px-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-display text-2xl tracking-[0.04em] text-bone">
            MONTARA <span className="text-gold">FORGE</span>
          </p>
          <p className="mt-2 text-sm text-bone-mute">
            Licensed &amp; Insured in {SITE.state} · Financing Available
          </p>
          <p className="mt-1 text-sm text-bone-mute">
            Serving {SITE.towns.slice(0, -1).join(", ")} &amp; {SITE.towns.at(-1)}
          </p>
        </div>
        <div className="flex flex-col gap-2 text-sm md:items-end">
          <CallLink className="font-semibold text-bone underline-offset-4 hover:text-gold hover:underline">
            {SITE.phoneDisplay}
          </CallLink>
          <Link
            href="/privacy"
            className="text-bone-mute underline-offset-4 hover:text-bone hover:underline"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms"
            className="text-bone-mute underline-offset-4 hover:text-bone hover:underline"
          >
            Terms &amp; Conditions
          </Link>
          <p className="text-xs text-bone-mute/70">
            © {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
