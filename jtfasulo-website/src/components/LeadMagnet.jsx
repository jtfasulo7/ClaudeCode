import { useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, BookOpen, Check, Download, Sparkles, Zap } from 'lucide-react'
import FluidGrid from './FluidGrid'

const PDF_URL = '/AI_Entrepreneurship_Guide_2026.pdf'
const PDF_FILENAME = 'AI_Entrepreneurship_Guide_2026.pdf'

const HIGHLIGHTS = [
  { icon: <Zap size={13} />, text: 'Free 2026 Edition' },
  { icon: <BookOpen size={13} />, text: 'Beginner Friendly' },
  { icon: <Sparkles size={13} />, text: 'Actionable, No Fluff' },
]

const INSIDE_THE_GUIDE = [
  'Pick the right AI tools for your stage of business — without the buzzword soup',
  'Design a 90-day operating cadence that compounds AI leverage week over week',
  'Build a lean tech stack that scales from solo founder to first hire',
  'Avoid the seven mistakes that cost early-stage founders six figures',
]

export default function LeadMagnet() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [errorMessage, setErrorMessage] = useState('')

  const triggerDownload = () => {
    const a = document.createElement('a')
    a.href = PDF_URL
    a.download = PDF_FILENAME
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (status === 'loading') return

    const trimmed = email.trim()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setStatus('error')
      setErrorMessage('Please enter a valid email address.')
      return
    }

    setStatus('loading')
    setErrorMessage('')

    try {
      const res = await fetch('/api/lead-magnet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setStatus('error')
        setErrorMessage(data.error || 'Something went wrong. Please try again.')
        return
      }
      setStatus('success')
      // Auto-trigger the download after a beat
      setTimeout(triggerDownload, 400)
    } catch (err) {
      setStatus('error')
      setErrorMessage('Network error. Please try again.')
    }
  }

  return (
    <section
      ref={ref}
      id="hero"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden hero-gradient"
    >
      <FluidGrid />

      <motion.div style={{ y }} className="absolute inset-0 pointer-events-none">
        <div
          className="orb w-[600px] h-[600px] bg-accent/[0.07] -top-40 left-1/2 -translate-x-1/2"
          style={{ animationDelay: '0s' }}
        />
        <div
          className="orb w-[400px] h-[400px] bg-accent/[0.05] top-1/2 -right-40"
          style={{ animationDelay: '3s' }}
        />
        <div
          className="orb w-[300px] h-[300px] bg-accent/[0.04] bottom-0 left-10"
          style={{ animationDelay: '1.5s' }}
        />
      </motion.div>

      <div className="absolute top-[28%] left-0 right-0 h-px bg-white/[0.03]" />
      <div className="absolute bottom-[25%] left-0 right-0 h-px bg-white/[0.03]" />

      <motion.div
        style={{ opacity }}
        className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pt-28 sm:pt-32 pb-20 sm:pb-24 w-full"
      >
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* LEFT — pitch */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-3 mb-8"
            >
              <div className="flex items-center gap-2 border border-accent/30 bg-accent/5 px-4 py-2 text-xs text-accent tracking-[0.25em] uppercase font-medium rounded-full">
                <Sparkles size={12} className="text-accent" />
                Free 2026 Edition · PDF
              </div>
            </motion.div>

            <div className="mb-7">
              <motion.h1
                initial={{ y: 80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                className="text-[clamp(2.4rem,6.5vw,5.5rem)] font-black leading-[1.05] tracking-tight"
              >
                <span className="text-white block">The Beginner's Guide</span>
                <span className="text-gradient block pb-2">to AI in</span>
                <span className="text-white block">Entrepreneurship</span>
              </motion.h1>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
              className="text-text-muted text-lg leading-relaxed max-w-xl mb-10"
            >
              A free, no-fluff PDF for founders and operators who want to use AI to build,
              ship, and scale a real business — without wasting six months figuring out which
              tools matter.
            </motion.p>

            <motion.ul
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="space-y-3 mb-10 max-w-xl"
            >
              {INSIDE_THE_GUIDE.map((line) => (
                <li key={line} className="flex items-start gap-3 text-sm text-text-muted leading-relaxed">
                  <span className="mt-[6px] flex-shrink-0 w-4 h-4 rounded-full bg-accent/15 border border-accent/40 flex items-center justify-center">
                    <Check size={10} className="text-accent" />
                  </span>
                  <span>{line}</span>
                </li>
              ))}
            </motion.ul>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.7 }}
              className="flex flex-wrap items-center gap-3"
            >
              {HIGHLIGHTS.map((pill) => (
                <div
                  key={pill.text}
                  className="flex items-center gap-2 text-text-muted text-xs px-4 py-2 border border-border/60 bg-white/[0.02] rounded-full"
                >
                  <span className="text-accent">{pill.icon}</span>
                  {pill.text}
                </div>
              ))}
            </motion.div>
          </div>

          {/* RIGHT — capture form */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
              className="relative"
            >
              <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-accent/30 via-accent/10 to-transparent pointer-events-none" />
              <div className="relative bg-surface border border-border rounded-2xl p-7 sm:p-9 shadow-[0_30px_80px_-20px_rgba(46,125,140,0.25)]">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  <span className="text-[10px] tracking-[0.3em] uppercase text-accent font-semibold">
                    Get the Guide
                  </span>
                </div>

                <h2 className="text-2xl sm:text-[1.7rem] font-black text-white leading-tight tracking-tight mb-3">
                  Send me the <span className="text-gradient">free guide</span>.
                </h2>
                <p className="text-text-muted text-sm leading-relaxed mb-7">
                  Drop your email below. The PDF downloads immediately, and we'll send a copy
                  to your inbox so you can come back to it.
                </p>

                {status === 'success' ? (
                  <SuccessState onDownload={triggerDownload} email={email} />
                ) : (
                  <form onSubmit={handleSubmit} noValidate>
                    <label htmlFor="lm-email" className="block text-[10px] tracking-[0.25em] uppercase text-text-dim font-semibold mb-2">
                      Your Email
                    </label>
                    <input
                      id="lm-email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="you@yourcompany.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        if (status === 'error') {
                          setStatus('idle')
                          setErrorMessage('')
                        }
                      }}
                      className="form-input mb-4"
                    />

                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <span>
                        {status === 'loading' ? 'Sending…' : 'Send My Free Guide'}
                      </span>
                      {status !== 'loading' && <ArrowRight size={16} className="relative z-10" />}
                    </button>

                    {status === 'error' && (
                      <p role="alert" className="mt-4 text-xs text-red-400 leading-relaxed">
                        {errorMessage}
                      </p>
                    )}

                    <p className="mt-5 text-[11px] text-text-dim leading-relaxed">
                      No spam. No course pitch. One PDF, delivered.
                    </p>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}

function SuccessState({ onDownload, email }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex items-center gap-3 mb-4">
        <span className="flex-shrink-0 w-9 h-9 rounded-full bg-accent/15 border border-accent/40 flex items-center justify-center">
          <Check size={16} className="text-accent" />
        </span>
        <div>
          <p className="text-white text-base font-semibold leading-tight">You're in.</p>
          <p className="text-text-muted text-xs leading-tight mt-1">
            We sent a copy to <span className="text-white">{email}</span>.
          </p>
        </div>
      </div>

      <p className="text-text-muted text-sm leading-relaxed mb-5">
        If your download didn't start automatically, grab it here:
      </p>

      <button onClick={onDownload} className="btn-primary w-full justify-center">
        <Download size={16} className="relative z-10" />
        <span>Download the Guide (PDF)</span>
      </button>
    </motion.div>
  )
}
