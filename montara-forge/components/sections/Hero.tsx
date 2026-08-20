import { LeadForm } from "@/components/form/LeadForm";
import { CardIcon, PinIcon, ShieldIcon } from "@/components/icons";
import { SITE } from "@/lib/site";

/**
 * Hero + form. On mobile the form IS the hero: a two-line headline, a
 * single line of trust cues, then the first question — all inside the
 * first viewport at 380px wide. On desktop it splits into a two-column
 * layout with the headline given room to breathe.
 */
export function Hero() {
  return (
    <section className="forge-bg grain relative overflow-hidden">
      {/* Gold hairline "seam" down the left on desktop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-[6%] hidden w-px bg-gradient-to-b from-transparent via-gold/40 to-transparent lg:block"
      />

      <div className="relative z-10 mx-auto grid max-w-6xl gap-6 px-4 pb-10 pt-4 sm:px-6 sm:pt-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-12 lg:pb-20 lg:pt-16">
        {/* ---- Copy ---- */}
        <div className="lg:pt-4">
          <p className="eyebrow animate-rise">Free On-Site Estimates · Southern Utah</p>

          <h1 className="animate-rise mt-2.5 font-display text-[2.05rem] leading-[0.96] text-bone [animation-delay:60ms] sm:mt-3 sm:text-5xl lg:text-[4.25rem]">
            New Driveways &amp;
            <br className="hidden sm:inline" /> Driveway Replacements{" "}
            <br className="hidden sm:inline" />
            <span className="text-gold">in Cedar City</span> &amp; Southern Utah
          </h1>

          {/* Subline is desktop/tablet only — on phones the form itself is the hero. */}
          <p className="animate-rise mt-4 hidden max-w-xl text-bone-mute [animation-delay:120ms] sm:block sm:text-lg sm:leading-relaxed">
            Tell us about your project in 30 seconds, pick a time, and we&rsquo;ll come out,
            measure, and hand you a firm price. No sales runaround.
          </p>

          {/* Desktop-only trust cues (mobile gets the compact strip under the form) */}
          <ul className="animate-rise mt-6 hidden gap-x-6 gap-y-3 text-sm font-medium text-bone [animation-delay:180ms] lg:flex lg:flex-wrap">
            <li className="inline-flex items-center gap-2">
              <ShieldIcon className="h-5 w-5 text-gold" /> Licensed &amp; Insured in {SITE.state}
            </li>
            <li className="inline-flex items-center gap-2">
              <CardIcon className="h-5 w-5 text-gold" /> Financing Available
            </li>
            <li className="inline-flex items-center gap-2">
              <PinIcon className="h-5 w-5 text-gold" /> Serving {SITE.towns.join(" · ")}
            </li>
          </ul>

          {/* Big ghosted numeral — desktop texture, purely decorative */}
          <p
            aria-hidden="true"
            className="pointer-events-none mt-10 hidden select-none font-display text-[11rem] leading-none text-transparent lg:block"
            style={{ WebkitTextStroke: "1px rgba(212,167,58,0.18)" }}
          >
            MF
          </p>
        </div>

        {/* ---- Form ---- */}
        <div className="animate-rise [animation-delay:90ms] lg:sticky lg:top-24">
          <LeadForm />
        </div>
      </div>
    </section>
  );
}
