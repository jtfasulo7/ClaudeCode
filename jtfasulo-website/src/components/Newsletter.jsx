import { useState, useEffect } from 'react'
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion'
import { ArrowRight, Check, Mail, Cpu, TrendingUp, Zap } from 'lucide-react'
import Header from './Header'
import Footer from './Footer'

const sampleNewsletter = {
  tool_spotlight: [
    {
      tool_name: 'Cursor 2.0',
      what_it_does: 'AI-native code editor that now supports multi-file editing and autonomous debugging.',
      how_to_use_it_now: 'Download Cursor from cursor.com, open any project, and press Cmd+K to start an AI edit. Try asking it to refactor an entire module — it now handles cross-file dependencies automatically.',
      why_it_matters: 'This makes AI-assisted coding viable for production-scale projects, not just single files.',
    },
    {
      tool_name: 'Napkin AI',
      what_it_does: 'Turns any text into polished visual diagrams and infographics instantly.',
      how_to_use_it_now: 'Paste a blog post or meeting notes into napkin.ai and click Generate. Choose from 12 visual styles. Export as PNG or SVG for presentations.',
      why_it_matters: 'Eliminates hours of manual diagram creation for content creators and consultants.',
    },
  ],
  quick_wins: [
    'Use Claude\'s "web search" tool to get real-time data in your prompts — no plugins needed.',
    'Add "respond in JSON" to any ChatGPT prompt to get structured, parseable output every time.',
    'Try Perplexity\'s new "Focus" mode for research — it cites every claim with sources.',
    'Use NotebookLM to turn any PDF into a podcast-style audio summary in under 2 minutes.',
    'Set up a free n8n workflow to auto-summarize your daily emails using any LLM API.',
  ],
  industry_moves: [
    {
      company: 'Anthropic',
      what_happened: 'Released Claude Opus 4.6 with 1M context window and improved agentic capabilities.',
      what_it_means_for_you: 'You can now process entire codebases or book-length documents in a single prompt.',
    },
    {
      company: 'OpenAI',
      what_happened: 'Launched GPT-4.1 with native image generation and improved reasoning benchmarks.',
      what_it_means_for_you: 'One model now handles text, code, and image creation — fewer tools to juggle.',
    },
    {
      company: 'Google',
      what_happened: 'Gemini 2.5 Pro now available in Google Workspace with real-time collaboration features.',
      what_it_means_for_you: 'AI assistance is now built into Docs, Sheets, and Slides — no extensions required.',
    },
  ],
}

const ease = [0.16, 1, 0.3, 1]

function SampleNewsletter() {
  const weekDate = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

  return (
    <div className="relative">
      {/* Glow behind the card */}
      <div className="absolute -inset-4 bg-accent/[0.04] blur-3xl rounded-3xl pointer-events-none" />
      <div className="relative rounded-2xl overflow-hidden border border-border/60 bg-surface">
        {/* Email chrome bar */}
        <div className="flex items-center gap-2 px-5 py-3 bg-[#0d0d0d] border-b border-border/40">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
            <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
            <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
          </div>
          <div className="flex-1 mx-4">
            <div className="bg-white/[0.04] rounded-md px-3 py-1 text-[10px] text-text-dim tracking-wide text-center">
              inbox — newsletter@jtfasulo.com
            </div>
          </div>
        </div>

        {/* Newsletter header */}
        <div className="px-8 pt-8 pb-6 border-b border-border/40">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] tracking-[0.25em] uppercase text-text-dim mb-2">Weekly Issue</p>
              <h3 className="text-lg font-bold text-white">JT Fasulo AI Newsletter</h3>
            </div>
            <span className="text-[11px] text-text-dim tabular-nums">{weekDate}</span>
          </div>
        </div>

        {/* Tool Spotlight */}
        <div className="px-8 py-7">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-5 h-px bg-accent/60" />
            <h4 className="text-[11px] tracking-[0.2em] uppercase text-accent font-semibold">Tool Spotlight</h4>
          </div>
          {sampleNewsletter.tool_spotlight.map((tool, i) => (
            <div key={i} className={i < sampleNewsletter.tool_spotlight.length - 1 ? 'mb-6 pb-6 border-b border-border/30' : ''}>
              <h5 className="text-[15px] font-semibold text-white mb-1.5">{tool.tool_name}</h5>
              <p className="text-[13px] text-text-muted leading-relaxed mb-3">{tool.what_it_does}</p>
              <div className="bg-accent/[0.06] border border-accent/10 rounded-lg px-4 py-3 mb-2.5">
                <p className="text-[13px] text-white/90 leading-relaxed">{tool.how_to_use_it_now}</p>
              </div>
              <p className="text-[12px] text-text-dim italic">{tool.why_it_matters}</p>
            </div>
          ))}
        </div>

        {/* Quick Wins */}
        <div className="px-8 pb-7">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-5 h-px bg-accent/60" />
            <h4 className="text-[11px] tracking-[0.2em] uppercase text-accent font-semibold">Quick Wins</h4>
          </div>
          <div className="space-y-2.5">
            {sampleNewsletter.quick_wins.map((tip, i) => (
              <div key={i} className="flex gap-3 items-start">
                <span className="text-accent text-[13px] mt-px font-mono">{String(i + 1).padStart(2, '0')}</span>
                <p className="text-[13px] text-white/80 leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Industry Moves */}
        <div className="px-8 pb-7">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-5 h-px bg-accent/60" />
            <h4 className="text-[11px] tracking-[0.2em] uppercase text-accent font-semibold">Industry Moves</h4>
          </div>
          {sampleNewsletter.industry_moves.map((move, i) => (
            <div key={i} className={`flex gap-4 ${i < sampleNewsletter.industry_moves.length - 1 ? 'mb-4 pb-4 border-b border-border/30' : ''}`}>
              <div className="w-1 rounded-full bg-accent/30 flex-shrink-0" />
              <div>
                <p className="text-[13px] text-white font-medium mb-0.5">{move.company} — <span className="text-text-muted font-normal">{move.what_happened}</span></p>
                <p className="text-[12px] text-text-dim">{move.what_it_means_for_you}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-8 py-4 bg-[#0d0d0d] border-t border-border/40">
          <p className="text-[10px] text-text-dim tracking-wide">
            jtfasulo.com &middot; <span className="text-accent/60">Unsubscribe</span>
          </p>
        </div>
      </div>
    </div>
  )
}

function SubscribeForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()

      if (!res.ok) {
        setStatus('error')
        setErrorMsg(data.error || 'Something went wrong.')
        return
      }
      setStatus('success')
    } catch {
      setStatus('error')
      setErrorMsg('Something went wrong. Please try again.')
    }
  }

  return (
    <AnimatePresence mode="wait">
      {status === 'success' ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease }}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0">
            <Check size={18} className="text-accent" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm">You're in.</p>
            <p className="text-text-muted text-xs">Check your inbox for a welcome email.</p>
          </div>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="flex-1 relative">
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full h-12 px-4 rounded-xl bg-white/[0.04] border border-border text-white text-sm placeholder-text-dim outline-none focus:border-accent/50 transition-all duration-300"
              style={{ boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.3)' }}
            />
            {status === 'error' && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute -bottom-6 left-0 text-xs text-red-400"
              >
                {errorMsg}
              </motion.p>
            )}
          </div>
          <button
            type="submit"
            disabled={status === 'loading'}
            className="h-12 px-6 rounded-xl bg-accent text-background font-semibold text-sm tracking-wide uppercase transition-all duration-300 hover:shadow-[0_0_30px_rgba(47, 103, 121,0.3)] hover:-translate-y-px disabled:opacity-50 flex items-center justify-center gap-2 flex-shrink-0"
          >
            {status === 'loading' ? (
              <div className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
            ) : (
              <>
                Subscribe
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </motion.form>
      )}
    </AnimatePresence>
  )
}

export default function Newsletter() {
  const [mouseX, setMouseX] = useState(0)
  const [mouseY, setMouseY] = useState(0)

  useEffect(() => {
    const handleMouse = (e) => {
      setMouseX(e.clientX / window.innerWidth)
      setMouseY(e.clientY / window.innerHeight)
    }
    window.addEventListener('mousemove', handleMouse)
    return () => window.removeEventListener('mousemove', handleMouse)
  }, [])

  return (
    <div className="bg-background text-white min-h-screen">
      <Header />
      <main>
        {/* === HERO === */}
        <section className="relative min-h-[85vh] flex items-center overflow-hidden">
          {/* Ambient glow that follows scroll position */}
          <div
            className="absolute inset-0 pointer-events-none transition-all duration-[2s] ease-out"
            style={{
              background: `radial-gradient(ellipse 50% 50% at ${30 + mouseX * 40}% ${30 + mouseY * 40}%, rgba(47, 103, 121,0.08) 0%, transparent 70%), radial-gradient(ellipse 40% 40% at 70% 60%, rgba(0, 0, 0,0.04) 0%, transparent 70%)`,
            }}
          />

          {/* Grid pattern */}
          <div className="absolute inset-0 grid-overlay opacity-40 pointer-events-none" />

          {/* Horizontal rules */}
          <div className="absolute top-[30%] left-0 right-0 h-px bg-white/[0.03]" />
          <div className="absolute top-[70%] left-0 right-0 h-px bg-white/[0.03]" />

          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full pt-32 pb-20">
            <div className="grid lg:grid-cols-12 gap-16 lg:gap-8 items-center">
              {/* Left — copy */}
              <div className="lg:col-span-7">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex items-center gap-3 mb-10">
                    <div className="w-8 h-px bg-accent" />
                    <span className="text-accent text-[11px] tracking-[0.3em] uppercase font-medium">Every Sunday</span>
                  </div>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, ease, delay: 0.1 }}
                  className="text-[clamp(2.5rem,5.5vw,4.5rem)] font-black leading-[1.05] tracking-tight mb-8"
                >
                  <span className="text-white">The AI briefing</span>
                  <br />
                  <span className="text-white">that's actually</span>
                  <br />
                  <span className="text-gradient">worth reading.</span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease, delay: 0.25 }}
                  className="text-text-muted text-lg leading-relaxed max-w-xl mb-10"
                >
                  Every Sunday, get the newest AI tools, real use cases you can apply immediately, and the moves big AI companies are making — all in your inbox.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease, delay: 0.35 }}
                  className="max-w-lg mb-12"
                >
                  <SubscribeForm />
                  <p className="text-text-dim text-[11px] mt-4 tracking-wide">
                    Free. No spam. Unsubscribe anytime.
                  </p>
                </motion.div>

                {/* Social proof / stats row */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="flex items-center gap-6"
                >
                  {[
                    { label: 'Tools reviewed', value: '50+' },
                    { label: 'Read time', value: '3 min' },
                  ].map((stat, i) => (
                    <div key={i} className="flex items-baseline gap-2">
                      <span className="text-white font-bold text-lg tabular-nums">{stat.value}</span>
                      <span className="text-text-dim text-[11px] tracking-wide">{stat.label}</span>
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* Right — floating preview card */}
              <motion.div
                initial={{ opacity: 0, y: 60, rotateY: -5 }}
                animate={{ opacity: 1, y: 0, rotateY: 0 }}
                transition={{ duration: 1.2, ease, delay: 0.3 }}
                className="lg:col-span-5 hidden lg:block"
                style={{ perspective: '1200px' }}
              >
                <div className="relative">
                  {/* Floating mini-preview of the newsletter */}
                  <div className="rounded-2xl overflow-hidden border border-border/40 bg-surface shadow-2xl">
                    <div className="px-5 py-3 bg-[#0d0d0d] border-b border-border/30 flex items-center gap-2">
                      <div className="flex gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-white/10" />
                        <div className="w-2 h-2 rounded-full bg-white/10" />
                        <div className="w-2 h-2 rounded-full bg-white/10" />
                      </div>
                      <span className="text-[9px] text-text-dim tracking-wide ml-2">inbox</span>
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-2.5 mb-4">
                        <div className="w-4 h-px bg-accent/60" />
                        <span className="text-[9px] tracking-[0.2em] uppercase text-accent font-semibold">This Week</span>
                      </div>
                      {sampleNewsletter.tool_spotlight.slice(0, 1).map((tool, i) => (
                        <div key={i} className="mb-4">
                          <h5 className="text-[13px] font-semibold text-white mb-1">{tool.tool_name}</h5>
                          <p className="text-[11px] text-text-muted leading-relaxed">{tool.what_it_does}</p>
                        </div>
                      ))}
                      <div className="space-y-1.5 mb-4">
                        {sampleNewsletter.quick_wins.slice(0, 2).map((tip, i) => (
                          <div key={i} className="flex gap-2 items-start">
                            <span className="text-accent text-[10px] mt-0.5 font-mono">{String(i + 1).padStart(2, '0')}</span>
                            <p className="text-[10px] text-white/60 leading-relaxed line-clamp-1">{tip}</p>
                          </div>
                        ))}
                      </div>
                      <div className="h-px bg-border/30 mb-3" />
                      <div className="flex items-center gap-2">
                        <div className="w-0.5 h-3 rounded-full bg-accent/30" />
                        <p className="text-[10px] text-text-dim">
                          <span className="text-white/70 font-medium">{sampleNewsletter.industry_moves[0].company}</span> — {sampleNewsletter.industry_moves[0].what_happened.slice(0, 50)}...
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Decorative elements */}
                  <div className="absolute -bottom-3 -right-3 w-full h-full rounded-2xl border border-accent/[0.08] -z-10" />
                  <div className="absolute -bottom-6 -right-6 w-full h-full rounded-2xl border border-accent/[0.04] -z-20" />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* === DIVIDER === */}
        <div className="divider max-w-7xl mx-auto" />

        {/* === WHAT YOU GET === */}
        <section className="py-24 lg:py-32 relative">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, ease }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-px bg-accent" />
                <span className="text-accent text-[11px] tracking-[0.3em] uppercase font-medium">What's Inside</span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-black tracking-tight text-white mb-16 max-w-md">
                Three sections.<br />Zero fluff.
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-border/30 rounded-2xl overflow-hidden">
              {[
                {
                  icon: <Cpu size={20} />,
                  num: '01',
                  title: 'Tool Spotlight',
                  desc: '2–3 new or updated AI tools every week with step-by-step instructions on how to use them right now. No vague overviews — real workflows you can copy.',
                },
                {
                  icon: <Zap size={20} />,
                  num: '02',
                  title: 'Quick Wins',
                  desc: '5 actionable AI tips you can apply the same day you read them. Prompts, shortcuts, and techniques that save real time.',
                },
                {
                  icon: <TrendingUp size={20} />,
                  num: '03',
                  title: 'Industry Moves',
                  desc: 'What OpenAI, Anthropic, Google, and Meta did this week — and one sentence on what it actually means for you.',
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.6, ease, delay: i * 0.1 }}
                  className="bg-surface p-8 lg:p-10 group hover:bg-surface-2 transition-colors duration-500"
                >
                  <div className="flex items-center justify-between mb-8">
                    <div className="w-10 h-10 rounded-lg bg-accent/[0.08] border border-accent/10 flex items-center justify-center text-accent group-hover:bg-accent/[0.12] transition-colors duration-500">
                      {item.icon}
                    </div>
                    <span className="text-text-dim text-[11px] font-mono tracking-wider">{item.num}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3 tracking-tight">{item.title}</h3>
                  <p className="text-text-muted text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* === DIVIDER === */}
        <div className="divider max-w-7xl mx-auto" />

        {/* === SAMPLE ISSUE === */}
        <section className="py-24 lg:py-32 relative">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, ease }}
              className="mb-14"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-px bg-accent" />
                <span className="text-accent text-[11px] tracking-[0.3em] uppercase font-medium">Preview</span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-black tracking-tight text-white mb-4">
                See what you'll get.
              </h2>
              <p className="text-text-muted text-base">
                Here's a sample issue. Every Sunday, this lands in your inbox.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 1, ease }}
            >
              <SampleNewsletter />
            </motion.div>
          </div>
        </section>

        {/* === DIVIDER === */}
        <div className="divider max-w-7xl mx-auto" />

        {/* === BOTTOM CTA === */}
        <section className="py-24 lg:py-32 relative">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 50% 60% at 50% 100%, rgba(47, 103, 121,0.06) 0%, transparent 70%)',
            }}
          />
          <div className="relative z-10 max-w-xl mx-auto px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.8, ease }}
            >
              <Mail size={28} className="text-accent mx-auto mb-6" />
              <h2 className="text-2xl lg:text-3xl font-black tracking-tight text-white mb-4">
                Join the list.
              </h2>
              <p className="text-text-muted text-sm mb-8">
                One email a week. The AI tools, tips, and news that actually matter.
              </p>
              <div className="max-w-md mx-auto">
                <SubscribeForm />
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
