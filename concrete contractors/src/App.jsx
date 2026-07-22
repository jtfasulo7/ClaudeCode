import { useEffect } from 'react'
import { config } from './client.config.js'
import MultiStepForm from './components/MultiStepForm.jsx'

export default function App() {
  // Per-client theming: primary/accent become CSS variables. Only accents
  // change — layout never depends on these.
  const themeVars = {
    '--primary': config.primaryColor,
    '--accent': config.accentColor,
  }

  useEffect(() => {
    document.title = `Free Estimate — ${config.businessName}`
  }, [])

  const scrollToForm = () => {
    document.getElementById('estimate-form')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="page" style={themeVars}>

      {/* ── SECTION 1 — Hero + multi-step form (first screen) ── */}
      <section className="hero" id="estimate-form">
        <div className="hero-inner">
          <img className="logo" src={config.logoPath} alt={config.businessName} />
          <p className="eyebrow">{config.businessName} — {config.city}&rsquo;s Concrete &amp; Paving Pros</p>
          <h1 className="hero-title">Get a <span>FREE</span> estimate now</h1>
          <p className="hero-sub">
            Tell us about your project — takes 30 seconds. No pressure, no obligation.
          </p>
          <MultiStepForm />
        </div>
      </section>

      {/* ── SECTION 2 — Trust strip ── */}
      <TrustStrip />

      {/* ── SECTION 3 — Proof photos ── */}
      <ProofPhotos />

      {/* ── SECTION 4 — How it works ── */}
      <HowItWorks />

      {/* ── SECTION 5 — Reviews ── */}
      <Reviews />

      {/* ── SECTION 6 — Final CTA + footer ── */}
      <FinalCta onClick={scrollToForm} />
      <Footer />
    </div>
  )
}

function TrustStrip() {
  return (
    <section className="trust">
      <div className="trust-inner">
        <span className="trust-item">
          <span className="stars-inline">★</span> {config.googleRating} on Google
          {' '}({config.reviewCount} reviews)
        </span>
        <span className="dot">·</span>
        <span className="trust-item">Licensed &amp; Insured</span>
        <span className="dot">·</span>
        <span className="trust-item">Serving {config.serviceArea} since {config.yearEstablished}</span>
      </div>
    </section>
  )
}

function ProofPhotos() {
  return (
    <section className="section proof">
      <p className="proof-line">Recent work in {config.serviceArea}.</p>
      <div className="photo-grid">
        {config.projectPhotos.slice(0, 4).map((src, i) => (
          <div className="photo" key={i}>
            <img src={src} alt={`Recent ${config.businessName} project ${i + 1}`} loading="lazy" />
          </div>
        ))}
      </div>
    </section>
  )
}

function HowItWorks() {
  const steps = [
    'Tell us about your project',
    'We come out, measure, and give you a real number',
    'You decide — no pressure',
  ]
  return (
    <section className="section how">
      <h2 className="section-h">How it works</h2>
      <ol className="how-list">
        {steps.map((s, i) => (
          <li key={i} className="how-item">
            <span className="how-num">{i + 1}</span>
            <span>{s}</span>
          </li>
        ))}
      </ol>
    </section>
  )
}

function Reviews() {
  return (
    <section className="section reviews">
      <h2 className="section-h">What neighbors say</h2>
      <div className="review-grid">
        {config.reviews.slice(0, 3).map((r, i) => (
          <figure className="review-card" key={i}>
            <div className="stars" aria-label={`${r.stars} out of 5 stars`}>
              {'★'.repeat(r.stars)}
            </div>
            <blockquote>{r.text}</blockquote>
            <figcaption>— {r.name}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}

function FinalCta({ onClick }) {
  return (
    <section className="final-cta">
      <h2>Ready for your free estimate?</h2>
      <button type="button" className="btn-primary btn-lg" onClick={onClick}>
        Get My Free Estimate
      </button>
    </section>
  )
}

function Footer() {
  const telHref = `tel:${config.phone.replace(/[^\d+]/g, '')}`
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">{config.businessName}</div>
        <a className="footer-phone" href={telHref}>{config.phone}</a>
        {config.licenseNumber && <div className="footer-lic">{config.licenseNumber}</div>}
        <div className="footer-legal">
          <a href="#privacy">Privacy Policy</a>
        </div>
      </div>
    </footer>
  )
}
