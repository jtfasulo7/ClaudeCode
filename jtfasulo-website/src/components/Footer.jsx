import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight, Globe, Rss, Play, Share2 } from 'lucide-react'

const navLinks = [
  { label: 'Services', href: '#services' },
  { label: 'Work', href: '#portfolio' },
  { label: 'Process', href: '#process' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
  { label: 'Newsletter', href: '/newsletter' },
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
      return
    }
    if (location.pathname !== '/') {
      navigate('/')
      setTimeout(() => {
        const target = document.querySelector(href)
        if (target) target.scrollIntoView({ behavior: 'smooth' })
      }, 100)
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

      {/* Top CTA bar */}
      <div className="relative border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-14 lg:py-16">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div>
              <div className="section-label mb-3">Ready to Start?</div>
              <h3 className="text-3xl lg:text-4xl font-black text-white tracking-tight">
                Let's build something that<br />
                <span className="text-gradient">converts.</span>
              </h3>
            </div>
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, '#contact')}
              className="btn-primary text-sm flex-shrink-0"
            >
              <span>Book a Free Discovery Call</span>
              <ArrowUpRight size={16} className="relative z-10" />
            </a>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-12 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-4">
              <span className="text-white font-semibold tracking-tight">JT Fasulo</span>
            </div>
            <p className="text-text-muted text-sm leading-relaxed mb-6 max-w-xs">
              AI creative technologist and strategic brand partner. Building the future of campaign
              creatives, one brand at a time.
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
            </ul>
          </div>

          {/* Services */}
          <div>
            <div className="text-[10px] tracking-[0.25em] uppercase text-text-dim mb-5">Services</div>
            <ul className="space-y-3">
              {[
                'Campaign Creatives Made with AI',
                'Social Media Strategy',
                'Content Optimization',
                'Strategy Consulting',
              ].map((service) => (
                <li key={service}>
                  <a
                    href="#services"
                    onClick={(e) => handleNavClick(e, '#services')}
                    className="text-text-muted text-sm hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-3 h-px bg-border group-hover:bg-accent group-hover:w-4 transition-all duration-300" />
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-text-dim text-xs">
            © {new Date().getFullYear()} JT Fasulo. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-text-dim text-xs hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="text-text-dim text-xs hover:text-white transition-colors">Terms</a>
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
