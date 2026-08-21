import type { Metadata } from "next";
import Link from "next/link";
import { CallLink } from "@/components/CallLink";
import { Logo } from "@/components/Logo";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: `Privacy Policy — ${SITE.name}`,
  robots: { index: false, follow: false },
};

const BUSINESS_ADDRESS = "2261 South Cottontail Circle, New Harmony, UT 84757";
const CONTACT_EMAIL = "Russellharker990@gmail.com";
const EFFECTIVE_DATE = "August 20, 2026";

export default function PrivacyPage() {
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
        <h1 className="mt-2 font-display text-4xl text-bone sm:text-5xl">Privacy Policy</h1>
        <p className="mt-2 text-sm text-bone-mute">Effective {EFFECTIVE_DATE}</p>

        <div className="prose-forge mt-8 space-y-8 text-[0.97rem] leading-relaxed text-bone-mute">
          <Section title="Who we are">
            <p>
              {SITE.name} (&ldquo;we,&rdquo; &ldquo;us&rdquo;) is a concrete contractor serving{" "}
              {SITE.towns.slice(0, -1).join(", ")} and {SITE.towns.at(-1)}, {SITE.state}. This
              policy explains what information we collect through our website and how we use it.
            </p>
          </Section>

          <Section title="What we collect">
            <p>When you request an estimate, we collect:</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>Your name</li>
              <li>Your phone number</li>
              <li>Your email address (optional)</li>
              <li>
                Project details you provide — project type, approximate size, timeline, and the
                project location (city, ZIP, or address)
              </li>
              <li>
                An appointment time, if you book one through our scheduling calendar
              </li>
            </ul>
            <p>
              Our website may also use standard analytics or advertising measurement tools (such
              as the Meta Pixel) that collect technical information like device type, browser,
              and pages viewed, to measure the performance of our advertising.
            </p>
          </Section>

          <Section title="Why we collect it">
            <ul className="list-disc space-y-1 pl-5">
              <li>To schedule and provide a free on-site estimate</li>
              <li>To communicate with you about your estimate request and our services</li>
              <li>To confirm that your project is within the area we serve</li>
              <li>To measure and improve our advertising and website</li>
            </ul>
          </Section>

          <Section title="Text messaging (SMS) terms">
            <p>
              By submitting our estimate form and checking the consent box, you agree to receive
              text messages from {SITE.name} about your estimate request, including appointment
              confirmations, reminders, and follow-up regarding your project.
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
          </Section>

          <Section title="We do not sell your personal information">
            <p>
              We do not sell, rent, or trade your personal information. We share it only with
              service providers who help us operate our business (for example, our customer
              relationship management and scheduling software), and only as needed to provide our
              services to you.
            </p>
          </Section>

          <Section title="How long we keep it">
            <p>
              We keep your information for as long as needed to respond to your request, provide
              our services, and meet our legal and business record-keeping obligations.
            </p>
          </Section>

          <Section title="Your choices">
            <p>
              You may ask us to update or delete your information, or to stop contacting you, at
              any time by texting STOP, calling us, or emailing us at the address below.
            </p>
          </Section>

          <Section title="Children">
            <p>Our services are not directed to children under 13, and we do not knowingly collect their information.</p>
          </Section>

          <Section title="Changes to this policy">
            <p>
              We may update this policy from time to time. The effective date at the top reflects
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
              <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-bone underline underline-offset-2">
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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="font-display text-2xl text-bone">{title}</h2>
      {children}
    </section>
  );
}
