import type { Metadata } from "next";
import Link from "next/link";
import { CallLink } from "@/components/CallLink";
import { Logo } from "@/components/Logo";
import { ReviewForm } from "@/components/ReviewForm";
import { SITE } from "@/lib/site";

/**
 * /review — the link Russell sends customers after a job. Submissions go to
 * GoHighLevel (app/api/submit-review); nothing is published from here.
 */
export const metadata: Metadata = {
  title: `Leave a Review — ${SITE.name}`,
  robots: { index: false, follow: false },
};

export default function ReviewPage() {
  return (
    <>
      <header className="border-b border-line bg-ink/85">
        <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-4 sm:h-16 sm:px-6">
          <Link href="/" aria-label={`${SITE.name} home`}>
            <Logo />
          </Link>
          <CallLink className="text-sm font-semibold text-gold hover:underline">
            {SITE.phoneDisplay}
          </CallLink>
        </div>
        <div className="hatch h-[3px] opacity-70" aria-hidden="true" />
      </header>

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <p className="eyebrow">Leave a Review</p>
        <h1 className="mt-2 font-display text-4xl leading-[0.98] text-bone sm:text-5xl">
          How did your concrete <span className="text-gold">turn out?</span>
        </h1>
        <p className="mt-3 text-bone-mute">
          Thanks for choosing {SITE.name}. A few words about the job go a long way for a small crew.
        </p>

        <div className="mt-8">
          <ReviewForm />
        </div>
      </main>

      <footer className="border-t border-line bg-ink-2 py-8 text-center text-sm text-bone-mute">
        © {new Date().getFullYear()} {SITE.name} · Licensed &amp; Insured in {SITE.state}
      </footer>
    </>
  );
}
