import { useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Sparkles, TrendingUp, Zap } from 'lucide-react'

const stats = [
  { value: '150+', label: 'Campaigns Delivered' },
  { value: '3.2x', label: 'Avg. Engagement Lift' },
  { value: '50+', label: 'Brands Served' },
  { value: '98%', label: 'Client Retention' },
]

export default function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  return (
    <section
      ref={ref}
      id="hero"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden hero-gradient"
    >
      {/* Grid overlay */}
      <div className="absolute inset-0 grid-overlay opacity-100 pointer-events-none" />

      {/* Animated orbs */}
      <motion.div
        style={{ y }}
        className="absolute inset-0 pointer-events-none"
      >
        <div
          className="orb w-[600px] h-[600px] bg-accent/[0.07] -top-40 left-1/2 -translate-x-1/2"
          style={{ animationDelay: '0s' }}
        />
        <div
          className="orb w-[400px] h-[400px] bg-accent-blue/[0.05] top-1/2 -right-40"
          style={{ animationDelay: '3s' }}
        />
        <div
          className="orb w-[300px] h-[300px] bg-accent/[0.04] bottom-0 left-10"
          style={{ animationDelay: '1.5s' }}
        />
      </motion.div>

      {/* Thin horizontal line decorations */}
      <div className="absolute top-[28%] left-0 right-0 h-px bg-white/[0.03]" />
      <div className="absolute bottom-[25%] left-0 right-0 h-px bg-white/[0.03]" />

      {/* Main content */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-28 pb-16"
      >
        {/* Pre-headline tag */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-3 mb-8"
        >
          <div className="flex items-center gap-2 border border-accent/30 bg-accent/5 px-4 py-2 text-xs text-accent tracking-[0.25em] uppercase font-medium">
            <Sparkles size={12} className="text-accent" />
            AI Creative Technologist
          </div>
          <div className="hidden sm:flex items-center gap-2 text-text-dim text-xs">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Available for new projects
          </div>
        </motion.div>

        {/* Headline */}
        <div className="overflow-hidden mb-6">
          <motion.h1
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="text-[clamp(2.8rem,8vw,7rem)] font-black leading-[0.92] tracking-tight"
          >
            <span className="text-white block">AI-Powered</span>
            <span className="text-gradient block">Campaign</span>
            <span className="text-white block">Creatives</span>
          </motion.h1>
        </div>

        {/* Sub-headline row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="flex flex-col lg:flex-row lg:items-end gap-8 mb-14"
        >
          <div className="max-w-lg">
            <p className="text-text-muted text-lg leading-relaxed">
              Cutting-edge visual content that converts. I combine AI-driven creative intelligence
              with proven social strategy to build brands that dominate their market.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:ml-auto lg:mb-1">
            <a href="#contact" onClick={(e) => { e.preventDefault(); document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }) }} className="btn-primary">
              <span>Start a Project</span>
              <ArrowRight size={16} className="relative z-10" />
            </a>
            <a href="#portfolio" onClick={(e) => { e.preventDefault(); document.querySelector('#portfolio')?.scrollIntoView({ behavior: 'smooth' }) }} className="btn-outline">
              View Work
            </a>
          </div>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
          className="divider mb-10 origin-left"
        />

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.65 + i * 0.08 }}
              className="flex flex-col gap-1"
            >
              <div className="text-3xl lg:text-4xl font-black text-white counter-number">
                {stat.value}
              </div>
              <div className="text-text-dim text-xs tracking-widest uppercase">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom feature pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="mt-16 flex flex-wrap items-center gap-3"
        >
          {[
            { icon: <Zap size={13} />, text: 'AI-Generated Creatives' },
            { icon: <TrendingUp size={13} />, text: 'Data-Driven Strategy' },
            { icon: <Sparkles size={13} />, text: 'Premium Brand Identity' },
          ].map((pill) => (
            <div
              key={pill.text}
              className="flex items-center gap-2 text-text-muted text-xs px-4 py-2 border border-border/60 bg-white/[0.02] hover:border-accent/30 hover:text-white transition-all duration-300"
            >
              <span className="text-accent">{pill.icon}</span>
              {pill.text}
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10"
      >
        <span className="text-text-dim text-[10px] tracking-[0.3em] uppercase">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-text-dim to-transparent" />
      </motion.div>
    </section>
  )
}
