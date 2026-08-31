import type { Metadata } from "next";
import Link from "next/link";
import { CallLink } from "@/components/CallLink";
import { Logo } from "@/components/Logo";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: `Terms & Conditions — ${SITE.name}`,
  robots: { index: false, follow: false },
};

const BUSINESS_ADDRESS = "2261 South Cottontail Circle, New Harmony, UT 84757";
const CONTACT_EMAIL = "Russellharker990@gmail.com";
const EFFECTIVE_DATE = "August 31, 2026";

export default function TermsPage() {
  return (
    <>
      <header className="border-b border-line bg-ink/85">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4 sm:h-16 sm:px-6">
          <Link href="/" aria-label={`${SITE.name} home`}>
            <Logo />
          </Link>
          <CallLink className="text-sm font-semibold text-gold hover:underline">
            {SITE.phoneDisplay}
          </CallLink>
        </div>
        <div className="hatch h-[3px] opacity-70" aria-hidden="true" />
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <p className="eyebrow">Legal</p>
        <h1 className="mt-2 font-display text-4xl text-bone sm:text-5xl">Terms &amp; Conditions</h1>
        <p className="mt-2 text-sm text-bone-mute">Effective {EFFECTIVE_DATE}</p>

        <div className="prose-forge mt-8 space-y-8 text-[0.97rem] leading-relaxed text-bone-mute">
          <Section title="Agreement to these terms">
            <p>
              These Terms &amp; Conditions govern your use of this website and your request for an
              estimate from {SITE.name} (&ldquo;we,&rdquo; &ldquo;us&rdquo;). By using this site or
              submitting our estimate form, you agree to these terms. If you do not agree, please
              do not use the site or submit the form.
            </p>
          </Section>

          <Section title="What we do">
            <p>
              {SITE.name} is a licensed and insured concrete contractor serving{" "}
              {SITE.towns.slice(0, -1).join(", ")} and {SITE.towns.at(-1)}, {SITE.state}. This
              website exists to let you request a free on-site estimate and, if you choose, book a
              time for that estimate.
            </p>
          </Section>

          <Section title="Estimates and pricing">
            <ul className="list-disc space-y-1 pl-5">
              <li>On-site estimates are free and carry no obligation to purchase.</li>
              <li>
                Any figure shown on this website or given verbally is an approximation for planning
                only. It is not an offer and is not binding.
              </li>
              <li>
                Final pricing depends on site conditions observed in person &mdash; access, grade,
                soil, existing surfaces, drainage, and scope. Pricing becomes firm only in a written
                agreement signed by both parties.
              </li>
              <li>
                Work is performed only within our service area. If your project falls outside it,
                we will tell you rather than quote it.
              </li>
            </ul>
          </Section>

          <Section title="Scheduling and appointments">
            <p>
              Appointment times booked through this site are reserved for you, but may need to move
              for weather, site conditions, or scheduling conflicts. We will contact you to
              reschedule if that happens. Please give us as much notice as you can if you need to
              cancel or move an appointment.
            </p>
          </Section>

          <Section id="sms-terms" title="Text messaging (SMS) terms">
            <p>
              By submitting our estimate form and checking the consent box, you agree to receive
              text messages from {SITE.name} about your estimate request, including appointment
              confirmations, reminders, and follow-up regarding your project. We do not send
              marketing or promotional texts to numbers collected through this form.
            </p>
            <p>
              Example message: &ldquo;{SITE.name}: Hi John &mdash; confirming your free on-site
              estimate Tue 9/2 at 10:00 AM. Reply C to confirm or R to reschedule. Reply STOP to
              opt out.&rdquo;
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <strong className="text-bone">Consent is not a condition of purchase.</strong>
              </li>
              <li>
                <strong className="text-bone">Message frequency varies</strong> based on your
                request and appointment status.
              </li>
              <li>
                <strong className="text-bone">Message and data rates may apply.</strong>
              </li>
              <li>
                Reply <strong className="text-bone">STOP</strong> at any time to opt out. You will
                receive a single confirmation message and no further texts.
              </li>
              <li>
                Reply <strong className="text-bone">HELP</strong> for help, or call us at{" "}
                <CallLink className="font-semibold text-bone underline underline-offset-2">
                  {SITE.phoneDisplay}
                </CallLink>
                .
              </li>
              <li>
                Mobile opt-in information and phone numbers collected for SMS consent will not be
                shared with third parties or affiliates for their marketing purposes.
              </li>
            </ul>
            <p>
              How we handle the information you give us is described in our{" "}
              <Link href="/privacy" className="font-semibold text-bone underline underline-offset-2">
                Privacy Policy
              </Link>
              .
            </p>
          </Section>

          <Section title="Your responsibilities">
            <ul className="list-disc space-y-1 pl-5">
              <li>Provide accurate contact and project information.</li>
              <li>
                Use a phone number you own or are authorized to enroll. Do not submit someone
                else&rsquo;s number for text messages.
              </li>
              <li>Provide safe access to the project area at the scheduled time.</li>
              <li>
                Disclose known underground utilities, irrigation lines, septic components, and any
                HOA or permit requirements that affect the work.
              </li>
            </ul>
          </Section>

          <Section title="Use of this website">
            <p>
              You may not use this site to submit false information, attempt to gain unauthorized
              access, interfere with its operation, or scrape or copy its content for commercial
              use. The site&rsquo;s text, photographs, and design are our property or used with
              permission, and may not be reproduced without our written consent.
            </p>
          </Section>

          <Section title="Website content and workmanship">
            <p>
              Website content is provided for general information and is offered as is, without
              warranty of any kind. Nothing on this site creates a warranty regarding completed
              work. Any warranty covering work we perform is stated in the signed written agreement
              for that project, and only that document governs it.
            </p>
          </Section>

          <Section title="Limitation of liability">
            <p>
              To the fullest extent permitted by {SITE.state} law, our liability arising out of your
              use of this website is limited to the amount you paid us, if any, for use of the site.
              This limitation does not apply to our obligations under a signed agreement for
              construction work, and it does not limit any liability that cannot be limited by law.
            </p>
          </Section>

          <Section title="Governing law">
            <p>
              These terms are governed by the laws of the State of {SITE.state}, without regard to
              its conflict-of-law rules.
            </p>
          </Section>

          <Section title="Changes to these terms">
            <p>
              We may update these terms from time to time. The effective date at the top reflects
              the most recent version.
            </p>
          </Section>

          <Section title="Contact us">
            <p>{SITE.name}</p>
            <p>{BUSINESS_ADDRESS}</p>
            <p>
              Phone:{" "}
              <CallLink className="font-semibold text-bone underline underline-offset-2">
                {SITE.phoneDisplay}
              </CallLink>
            </p>
            <p>
              Email:{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="font-semibold text-bone underline underline-offset-2"
              >
                {CONTACT_EMAIL}
              </a>
            </p>
          </Section>
        </div>

        <p className="mt-12">
          <Link
            href="/"
            className="inline-flex min-h-12 items-center rounded-lg bg-gold px-5 font-bold text-ink hover:bg-gold-bright"
          >
            &larr; Back to estimate form
          </Link>
        </p>
      </main>

      <footer className="border-t border-line bg-ink-2 py-8 text-center text-sm text-bone-mute">
        © {new Date().getFullYear()} {SITE.name} · Licensed &amp; Insured in {SITE.state}
      </footer>
    </>
  );
}

function Section({
  title,
  id,
  children,
}: {
  title: string;
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-6 space-y-3">
      <h2 className="font-display text-2xl text-bone">{title}</h2>
      {children}
    </section>
  );
}
