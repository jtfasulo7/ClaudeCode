import { useState } from 'react'
import { motion } from 'framer-motion'
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

function SampleNewsletter() {
  const weekDate = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

  return (
    <div className="max-w-[600px] mx-auto rounded-xl overflow-hidden border border-[#222222]" style={{ backgroundColor: '#111111' }}>
      <div className="p-8 border-b border-[#222222]">
        <h3 className="text-xl font-bold text-[#06b6d4] mb-1">JT Fasulo AI Newsletter</h3>
        <p className="text-sm text-[#a3a3a3]">Week of {weekDate}</p>
      </div>

      <div className="p-8">
        <h4 className="text-lg font-bold text-white mb-6">&#128294; Tool Spotlight</h4>
        {sampleNewsletter.tool_spotlight.map((tool, i) => (
          <div key={i} className="mb-6">
            <h5 className="text-base font-bold text-[#06b6d4] mb-2">{tool.tool_name}</h5>
            <p className="text-sm text-[#a3a3a3] mb-3">{tool.what_it_does}</p>
            <div className="bg-[#1a1a1a] rounded-lg p-4 mb-3 border-l-[3px] border-[#06b6d4]">
              <p className="text-[11px] font-semibold text-[#06b6d4] uppercase tracking-wider mb-1">How to use it now</p>
              <p className="text-sm text-white leading-relaxed">{tool.how_to_use_it_now}</p>
            </div>
            <p className="text-[13px] text-[#a3a3a3] italic">{tool.why_it_matters}</p>
          </div>
        ))}
      </div>

      <div className="px-8 pb-8">
        <h4 className="text-lg font-bold text-white mb-4">&#9889; Quick Wins</h4>
        <ul className="space-y-2">
          {sampleNewsletter.quick_wins.map((tip, i) => (
            <li key={i} className="text-sm text-white leading-relaxed flex gap-2">
              <span className="text-[#a3a3a3] flex-shrink-0">&bull;</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>

      <div className="px-8 pb-8">
        <h4 className="text-lg font-bold text-white mb-5">&#127970; Industry Moves</h4>
        {sampleNewsletter.industry_moves.map((move, i) => (
          <div key={i} className="mb-5 pb-5 border-b border-[#222222] last:border-0 last:mb-0 last:pb-0">
            <p className="text-[15px] text-white mb-1"><strong className="text-[#06b6d4]">{move.company}</strong></p>
            <p className="text-sm text-white mb-1">{move.what_happened}</p>
            <p className="text-[13px] text-[#a3a3a3]">&rarr; {move.what_it_means_for_you}</p>
          </div>
        ))}
      </div>

      <div className="px-8 py-4 border-t border-[#222222]">
        <p className="text-[11px] text-[#525252]">
          You're receiving this because you subscribed at jtfasulo.com.{' '}
          <span className="text-[#06b6d4]">Unsubscribe</span>
        </p>
      </div>
    </div>
  )
}

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | success | error
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
    <div className="bg-background text-white min-h-screen">
      <Header />
      <main className="pt-32 pb-24">
        {/* Hero */}
        <section className="max-w-3xl mx-auto px-6 lg:px-8 text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide bg-[#06b6d4]/15 text-[#06b6d4] border border-[#06b6d4]/30 mb-8">
              Delivered every Sunday
            </span>
            <h1 className="text-4xl lg:text-5xl font-black tracking-tight mb-6">
              The AI Newsletter That Actually{' '}
              <span className="text-[#06b6d4]">Helps You Do Things</span>
            </h1>
            <p className="text-lg text-[#a3a3a3] leading-relaxed max-w-2xl mx-auto">
              Every Sunday, get the newest AI tools, real use cases you can apply immediately, and
              the moves big AI companies are making — all in your inbox.
            </p>
          </motion.div>
        </section>

        {/* Subscribe Form */}
        <section className="max-w-lg mx-auto px-6 lg:px-8 mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="bg-[#111111] border border-[#222222] rounded-xl p-8"
          >
            {status === 'success' ? (
              <div className="text-center py-4">
                <p className="text-lg font-semibold text-green-400">
                  You're in! &#127881; Check your inbox for a welcome email.
                </p>
              </div>
            ) : (
              <>
                <p className="text-sm text-[#a3a3a3] mb-5">
                  Enter your email to subscribe — it's free.
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="email"
                    placeholder="you@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-[#0a0a0a] border border-[#333333] text-white text-sm placeholder-[#525252] outline-none focus:border-[#06b6d4] transition-colors"
                  />
                  {status === 'error' && (
                    <p className="text-sm text-red-400">{errorMsg}</p>
                  )}
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full py-3 rounded-lg font-semibold text-sm text-white transition-all duration-200 disabled:opacity-50"
                    style={{ backgroundColor: '#06b6d4' }}
                    onMouseEnter={(e) => { if (status !== 'loading') e.target.style.backgroundColor = '#0891b2' }}
                    onMouseLeave={(e) => { e.target.style.backgroundColor = '#06b6d4' }}
                  >
                    {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </section>

        {/* What You'll Get */}
        <section className="max-w-5xl mx-auto px-6 lg:px-8 mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-white text-center mb-12">What you'll get</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  emoji: '\uD83D\uDD26',
                  title: 'Tool Spotlight',
                  desc: '2-3 new or updated AI tools every week with step-by-step instructions on how to use them right now.',
                },
                {
                  emoji: '\u26A1',
                  title: 'Quick Wins',
                  desc: '5 actionable AI tips you can apply the same day you read them.',
                },
                {
                  emoji: '\uD83C\uDFE2',
                  title: 'Industry Moves',
                  desc: 'What OpenAI, Anthropic, Google, and Meta did this week and what it means for you.',
                },
              ].map((card, i) => (
                <div
                  key={i}
                  className="bg-[#111111] border border-[#222222] rounded-xl p-6"
                >
                  <div className="text-3xl mb-4">{card.emoji}</div>
                  <h3 className="text-base font-bold text-white mb-2">{card.title}</h3>
                  <p className="text-sm text-[#a3a3a3] leading-relaxed">{card.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Sample Issue */}
        <section className="max-w-3xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
          >
            <h2 className="text-2xl font-bold text-white text-center mb-4">
              Here's what a typical issue looks like
            </h2>
            <p className="text-sm text-[#a3a3a3] text-center mb-10">
              Every Sunday morning, this lands in your inbox.
            </p>
            <SampleNewsletter />
          </motion.div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
