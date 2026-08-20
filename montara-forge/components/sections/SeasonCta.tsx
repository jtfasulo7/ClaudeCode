import { CallLink } from "@/components/CallLink";
import { ArrowRightIcon, PhoneIcon, ShieldIcon, SunIcon } from "@/components/icons";
import { ScrollToFormButton } from "@/components/ScrollToFormButton";
import { SITE } from "@/lib/site";

/**
 * Soft, truthful seasonal urgency + the repeated CTA. No timers, no fake
 * job caps — just the reality that pour dates depend on the weather window.
 */
export function SeasonCta() {
  return (
    <section className="forge-bg grain relative overflow-hidden border-t border-line">
      <div className="relative z-10 mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow inline-flex items-center gap-2">
            <SunIcon className="h-4 w-4" />
            Concrete Season
          </p>
          <h2 className="mt-3 font-display text-[2.25rem] leading-[0.98] text-bone sm:text-[3.25rem]">
            Pour dates are weather-bound.
            <br />
            <span className="text-gold">The calendar fills fast.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[0.95rem] leading-relaxed text-bone-mute sm:text-lg">
            Concrete season in southern Utah runs on temperature windows, not wishful thinking.
            Get on the schedule now and your estimate — and your pour — happen sooner.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ScrollToFormButton className="inline-flex min-h-[3.5rem] w-full items-center justify-center gap-2 rounded-lg bg-gold px-7 text-lg font-bold text-ink shadow-gold transition-colors hover:bg-gold-bright sm:w-auto">
              Get My Free Estimate
              <ArrowRightIcon className="h-5 w-5" />
            </ScrollToFormButton>
            <CallLink className="inline-flex min-h-[3.5rem] w-full items-center justify-center gap-2 rounded-lg border border-line-strong px-6 text-base font-semibold text-bone transition-colors hover:border-gold hover:text-gold sm:w-auto">
              <PhoneIcon className="h-5 w-5 text-gold" />
              Call {SITE.phoneDisplay}
            </CallLink>
          </div>

          <p className="mt-5 inline-flex items-center gap-2 text-sm text-bone-mute">
            <ShieldIcon className="h-4 w-4 text-gold" />
            Licensed &amp; Insured in {SITE.state} · Financing Available
          </p>
        </div>
      </div>
    </section>
  );
}
