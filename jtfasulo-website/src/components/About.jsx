import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { CheckCircle2, ExternalLink } from 'lucide-react'

const credentials = [
  '200+ hours spent using AI-generative systems',
  '150+ hours spent using agentic AI systems',
  'Over 100,000 views generated on my own page in the first 50 days',
]

const tools = [
  { name: 'Claude', category: 'AI Model' },
  { name: 'Claude Code', category: 'AI Dev Tool' },
  { name: 'Nano Banana Pro', category: 'Creative' },
  { name: 'Kling 3.0', category: 'AI Video' },
  { name: 'Meta Ads', category: 'Paid Social' },
  { name: 'ElevenLabs', category: 'AI Audio' },
]

export default function About() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const imgRef = useRef(null)
  const imgInView = useInView(imgRef, { once: true, margin: '-80px' })

  return (
    <section id="about" className="relative py-32 lg:py-40 bg-background overflow-hidden">
      {/* Large background text */}
      <div className="absolute bottom-10 left-0 text-[18vw] font-black text-white/[0.015] leading-none select-none pointer-events-none tracking-tighter">
        JTF
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div ref={ref} className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 mb-5"
          >
            <span className="section-label">About</span>
            <div className="h-px w-12 bg-accent/40" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-[clamp(2rem,5vw,4rem)] font-black leading-tight tracking-tight text-white max-w-2xl"
          >
            The Mind Behind<br />
            <span className="text-gradient">The Machine</span>
          </motion.h2>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-start">
          {/* Left: image */}
          <motion.div
            ref={imgRef}
            initial={{ opacity: 0, x: -40 }}
            animate={imgInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
              <img
                src="/jt-fasulo.jpeg"
                alt="JT Fasulo"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />

              {/* Name badge */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="border border-border/60 bg-background/80 backdrop-blur-sm p-4">
                  <div className="text-white font-bold text-base">JT Fasulo</div>
                  <div className="text-accent text-xs tracking-wider uppercase mt-0.5">
                    AI Creative Technologist & Brand Strategist
                  </div>
                </div>
              </div>
            </div>

            {/* Accent border decoration */}
            <div className="absolute -top-4 -left-4 w-16 h-16 border-t-2 border-l-2 border-accent/40 pointer-events-none" />
            <div className="absolute -bottom-4 -right-4 w-16 h-16 border-b-2 border-r-2 border-accent/40 pointer-events-none" />
          </motion.div>

          {/* Right: content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={imgInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          >
            {/* Bio */}
            <div className="space-y-4 mb-10">
              <p className="text-white text-lg leading-relaxed">
                I'm JT Fasulo — a creative technologist and brand strategist who sits at the
                intersection of artificial intelligence and high-performance marketing.
              </p>
              <p className="text-text-muted leading-relaxed">
                My work started in mechanical engineering, but I had an early vision that generative AI
                is the defining shift in creative production.
              </p>
              <p className="text-text-muted leading-relaxed">
                Today, I help brands, agencies, and founders harness AI-powered creative systems to
                produce campaigns that look premium, perform brilliantly, and scale without the
                traditional cost and time overhead.
              </p>
              <p className="text-text-muted leading-relaxed">
                When I'm not building creative strategies, I'm deep in the latest AI models, testing
                new tools, and sharing what I learn with the brands I partner with.
              </p>
            </div>

            {/* Credentials */}
            <div className="mb-10">
              <ul className="space-y-3">
                {credentials.map((cred, i) => (
                  <motion.li
                    key={cred}
                    initial={{ opacity: 0, x: 20 }}
                    animate={imgInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.2 + i * 0.07 }}
                    className="flex items-start gap-3 text-sm text-text-muted"
                  >
                    <CheckCircle2 size={14} className="text-accent flex-shrink-0 mt-0.5" />
                    {cred}
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Tools */}
            <div>
              <div className="text-xs tracking-[0.25em] uppercase text-text-dim mb-4">Tech Stack</div>
              <div className="flex flex-wrap gap-2">
                {tools.map((tool, i) => (
                  <motion.div
                    key={tool.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={imgInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.4, delay: 0.4 + i * 0.04 }}
                    className="flex items-center gap-2 border border-border bg-surface/50 px-3 py-2 hover:border-accent/30 hover:bg-accent/5 transition-all duration-300"
                  >
                    <span className="text-white text-xs font-medium">{tool.name}</span>
                    <span className="text-text-dim text-[9px] tracking-wider">{tool.category}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={imgInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-10 flex items-center gap-4"
            >
              <a
                href="#contact"
                onClick={(e) => { e.preventDefault(); document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }) }}
                className="btn-primary text-sm"
              >
                <span>Work With Me</span>
              </a>
              <a
                href="https://jtfasulo.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-text-muted text-sm hover:text-accent transition-colors duration-300"
              >
                jtfasulo.com
                <ExternalLink size={14} />
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
