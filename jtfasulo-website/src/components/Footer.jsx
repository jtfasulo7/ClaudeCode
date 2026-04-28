import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowUpRight, Globe, Rss, Play, Share2 } from 'lucide-react'

const navLinks = [
  { label: 'Home', href: '/' },
]

const socialLinks = [
  { icon: <Share2 size={16} />, href: '#', label: 'Twitter / X' },
  { icon: <Globe size={16} />, href: '#', label: 'LinkedIn' },
  { icon: <Rss size={16} />, href: '#', label: 'Instagram' },
  { icon: <Play size={16} />, href: '#', label: 'YouTube' },
]

export default function Footer() {
  const location = useLocation()
  const navigate = useNavigate()

  const handleNavClick = (e, href) => {
    e.preventDefault()
    if (href.startsWith('/')) {
      navigate(href)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    const target = document.querySelector(href)
    if (target) target.scrollIntoView({ behavior: 'smooth' })
  }

  const handleGuideClick = (e) => {
    e.preventDefault()
    if (location.pathname !== '/') {
      navigate('/')
      setTimeout(() => {
        document.getElementById('lm-email')?.focus()
        document.getElementById('lm-email')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 120)
      return
    }
    document.getElementById('lm-email')?.focus()
    document.getElementById('lm-email')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <footer className="relative bg-background border-t border-border overflow-hidden">
      {/* Large background text */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[20vw] font-black text-white/[0.02] leading-none select-none pointer-events-none tracking-tighter whitespace-nowrap">
        FASULO
      </div>

      {/* Top CTA bar */}
      <div className="relative border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-14 lg:py-16">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div>
              <div className="section-label mb-3">Free Guide</div>
              <h3 className="text-3xl lg:text-4xl font-black text-white tracking-tight">
                Start your AI journey<br />
                <span className="text-gradient">the right way.</span>
              </h3>
            </div>
            <a
              href="#lm-email"
              onClick={handleGuideClick}
              className="btn-primary text-sm flex-shrink-0"
            >
              <span>Get the Free Guide</span>
              <ArrowUpRight size={16} className="relative z-10" />
            </a>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-12 lg:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center mb-4">
              <span className="text-white font-semibold tracking-tight">JT Fasulo</span>
            </div>
            <p className="text-text-muted text-sm leading-relaxed mb-6 max-w-xs">
              A free PDF guide for founders getting started with AI in entrepreneurship.
              Plus a weekly newsletter on what actually matters in AI.
            </p>
            {/* Social links */}
            <div className="flex items-center gap-2">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-9 h-9 border border-border flex items-center justify-center text-text-muted hover:border-accent hover:text-accent transition-all duration-300"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <div className="text-[10px] tracking-[0.25em] uppercase text-text-dim mb-5">Navigation</div>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="text-text-muted text-sm hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-3 h-px bg-border group-hover:bg-accent group-hover:w-4 transition-all duration-300" />
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="#lm-email"
                  onClick={handleGuideClick}
                  className="text-text-muted text-sm hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                >
                  <span className="w-3 h-px bg-border group-hover:bg-accent group-hover:w-4 transition-all duration-300" />
                  Get the Guide
                </a>
              </li>
              <li>
                <a
                  href="/privacy-policy"
                  className="text-text-muted text-sm hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                >
                  <span className="w-3 h-px bg-border group-hover:bg-accent group-hover:w-4 transition-all duration-300" />
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal block */}
        <div className="pt-8 border-t border-border flex flex-col lg:flex-row items-start lg:items-center gap-6 lg:gap-10 mb-6">
          <div className="flex items-center gap-3">
            <img src="/sybago_logo.png" alt="Sybago" width="36" height="36" className="rounded" />
            <div>
              <p className="text-[11px] tracking-[0.22em] uppercase text-white font-semibold">SYBAGO LLC</p>
              <p className="text-text-dim text-xs mt-1">116 W 9th St, Wilmington, DE 19801</p>
            </div>
          </div>
          <p className="text-text-dim text-xs leading-relaxed lg:max-w-md">
            jtfasulo.com is operated by SYBAGO LLC. By submitting your email you agree to receive the
            guide and occasional updates. Unsubscribe anytime via the link in any email we send.
          </p>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-text-dim text-xs">
            © {new Date().getFullYear()} SYBAGO LLC. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a
              href="/privacy-policy"
              className="text-text-dim text-xs hover:text-accent transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="https://jtfasulo.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-dim text-xs hover:text-accent transition-colors flex items-center gap-1"
            >
              jtfasulo.com
              <ArrowUpRight size={11} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
