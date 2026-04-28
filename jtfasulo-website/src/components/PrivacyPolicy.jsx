import { useEffect } from 'react'
import { motion } from 'framer-motion'
import Header from './Header'
import Footer from './Footer'

const COMPANY = {
  name: 'SYBAGO LLC',
  brand: 'JT Fasulo',
  domain: 'jtfasulo.com',
  address: '116 W 9th St, Wilmington, DE 19801',
  contactEmail: 'newsletter@jtfasulo.com',
  effectiveDate: 'April 28, 2026',
}

export default function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="bg-background text-white min-h-screen">
      <Header />
      <main className="pt-28 pb-24">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mx-auto px-5 sm:px-6 lg:px-8"
        >
          <div className="mb-12">
            <p className="text-[11px] tracking-[0.3em] uppercase text-accent font-semibold mb-4">
              Legal
            </p>
            <h1 className="text-4xl sm:text-5xl font-black leading-[1.05] tracking-tight mb-3">
              Privacy Policy
            </h1>
            <p className="text-text-muted text-sm">
              Effective date: {COMPANY.effectiveDate}
            </p>
          </div>

          <div className="prose-custom">
            <p className="lead">
              {COMPANY.name} (&ldquo;we,&rdquo; &ldquo;us,&rdquo; &ldquo;our&rdquo;) operates{' '}
              <a href={`https://www.${COMPANY.domain}`} className="link">
                {COMPANY.domain}
              </a>
              . This Privacy Policy explains what information we collect from visitors and
              subscribers, how we use it, and the choices you have.
            </p>

            <h2>1. Information We Collect</h2>
            <p>
              We collect the email address you submit to receive <em>The Beginner&rsquo;s Guide
              to AI in Entrepreneurship</em> (the &ldquo;Guide&rdquo;) and any subsequent
              communications you opt to receive. Submission generates a record stored in our
              email list with your address, the timestamp of submission, the source (the lead
              magnet), and a randomly generated unsubscribe token.
            </p>
            <p>
              Like most websites, we may also passively collect non-identifying technical
              data such as device type, browser, and referrer through hosting and analytics
              tools. We do not sell, rent, or share that information.
            </p>

            <h2>2. How We Use Your Information</h2>
            <ul>
              <li>To deliver the Guide you requested.</li>
              <li>
                To send occasional related updates (new resources, follow-up notes from JT)
                that you may unsubscribe from at any time.
              </li>
              <li>To respond to direct replies and inquiries.</li>
              <li>To detect and prevent abuse of our forms.</li>
            </ul>

            <h2>3. Your Choices</h2>
            <p>
              <strong>Unsubscribe.</strong> Every email we send contains an unsubscribe link.
              Clicking it immediately removes your address from our list. You can also email{' '}
              <a className="link" href={`mailto:${COMPANY.contactEmail}`}>
                {COMPANY.contactEmail}
              </a>{' '}
              and we will remove you within 10 business days, as required by the CAN-SPAM Act.
            </p>
            <p>
              <strong>Access &amp; deletion.</strong> You may request a copy of the data we
              hold about you, or its deletion, at any time by emailing the address above.
            </p>

            <h2>4. How We Store Your Information</h2>
            <p>
              Email submissions are stored in a private Google Sheet accessible only to us
              and our authorized service accounts. Email delivery is handled by Resend.
              Hosting and form processing are provided by Vercel.
            </p>

            <h2>5. Sharing</h2>
            <p>
              We do not sell or rent your personal information. We share data only with the
              service providers listed above, and only to the extent necessary to operate the
              Services (e.g., delivering the email you requested). Each of those providers is
              bound by its own published privacy practices.
            </p>

            <h2>6. Cookies</h2>
            <p>
              We use minimal cookies necessary for the site to function and may use a single
              analytics provider to count visits. We do not use third-party advertising
              cookies.
            </p>

            <h2>7. Children</h2>
            <p>
              Our Services are not directed to children under 13, and we do not knowingly
              collect personal information from children.
            </p>

            <h2>8. International Visitors</h2>
            <p>
              We are based in the United States and our records are stored in the U.S. If you
              access the Services from outside the U.S., you understand that your information
              may be transferred to and processed in the U.S. We honor unsubscribe requests
              and access/deletion requests regardless of the country in which you reside.
            </p>

            <h2>9. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. The &ldquo;Effective
              date&rdquo; at the top will reflect the most recent change. Material changes
              will be communicated to active subscribers by email.
            </p>

            <h2>10. Contact</h2>
            <p>
              {COMPANY.name}
              <br />
              {COMPANY.address}
              <br />
              <a className="link" href={`mailto:${COMPANY.contactEmail}`}>
                {COMPANY.contactEmail}
              </a>
            </p>
          </div>
        </motion.article>
      </main>
      <Footer />
    </div>
  )
}
