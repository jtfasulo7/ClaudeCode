import { useNavigate } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'

const navLinks = [
  { label: 'Home', href: '/' },
]

// Brand glyphs. lucide-react deprecated brand icons over trademark concerns,
// so all three are inlined here. Matched stroke weight (1.5 / 24).
const ICON_PROPS = {
  width: 16, height: 16, viewBox: '0 0 24 24',
  fill: 'none', stroke: 'currentColor', strokeWidth: 1.5,
  strokeLinecap: 'round', strokeLinejoin: 'round',
  'aria-hidden': true,
}

function InstagramIcon() {
  return (
    <svg {...ICON_PROPS}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg {...ICON_PROPS}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

function TikTokIcon() {
  // Minimal monoline TikTok mark.
  return (
    <svg {...ICON_PROPS}>
      <path d="M21 8.5a6.5 6.5 0 0 1-5-2.4V16a5 5 0 1 1-5-5" />
    </svg>
  )
}

const socialLinks = [
  { icon: <InstagramIcon />, href: 'https://www.instagram.com/fasulostudio/',                        label: 'Instagram' },
  { icon: <FacebookIcon  />, href: 'https://www.facebook.com/profile.php?id=61587073324051',         label: 'Facebook'  },
  { icon: <TikTokIcon    />, href: 'https://www.tiktok.com/@fasulostudio?lang=en',                   label: 'TikTok'    },
]

export default function Footer() {
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

  return (
    <footer className="relative bg-background border-t border-border overflow-hidden">
      {/* Large background text */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[20vw] font-black text-white/[0.02] leading-none select-none pointer-events-none tracking-tighter whitespace-nowrap">
        FASULO
      </div>

      {/* Main footer */}
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-12 lg:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center mb-6">
              <span className="text-white font-semibold tracking-tight">JT Fasulo</span>
            </div>
            {/* Social links */}
            <div className="flex items-center gap-2">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-9 h-9 border border-border flex items-center justify-center text-text-muted hover:border-white hover:text-white transition-all duration-300"
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
