import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Sparkles, TrendingUp, Zap } from 'lucide-react'
import FluidGrid from './FluidGrid'

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
      {/* Fluid grid canvas */}
      <FluidGrid />

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
        className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-12 sm:pb-16"
      >
        {/* Pre-headline tag */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-3 mb-8"
        >
          <div className="flex items-center gap-2 border border-accent/30 bg-accent/5 px-4 py-2 text-xs text-accent tracking-[0.25em] uppercase font-medium rounded-full">
            <Sparkles size={12} className="text-accent" />
            AI Creative Technologist
          </div>
          <div className="hidden sm:flex items-center gap-2 text-text-dim text-xs">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Available for new projects
          </div>
        </motion.div>

        {/* Headline */}
        <div className="mb-6">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: [0.45, 0, 0.55, 1], repeatType: 'loop' }}
          >
          <motion.h1
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="text-[clamp(2.8rem,8vw,7rem)] font-black leading-[1.05] tracking-tight"
          >
            <motion.span
              className="text-white block cursor-default"
              whileHover={{ x: 8, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } }}
            >
              AI-Powered
            </motion.span>
            <motion.span
              className="text-gradient block pb-2 cursor-default"
              whileHover={{ x: 8, filter: 'brightness(1.3)', transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } }}
            >
              Campaign
            </motion.span>
            <motion.span
              className="text-white block cursor-default"
              whileHover={{ x: 8, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } }}
            >
              Creatives
            </motion.span>
          </motion.h1>
          </motion.div>
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
            <a
              href="#contact"
              onClick={(e) => { e.preventDefault(); document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }) }}
              className="btn-primary"
            >
              <span>Start a Project</span>
              <ArrowRight size={16} className="relative z-10" />
            </a>
            <a
              href="#portfolio"
              onClick={(e) => { e.preventDefault(); document.querySelector('#portfolio')?.scrollIntoView({ behavior: 'smooth' }) }}
              className="btn-outline"
            >
              View Work
            </a>
          </div>
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
              className="flex items-center gap-2 text-text-muted text-xs px-4 py-2 border border-border/60 bg-white/[0.02] hover:border-accent/30 hover:text-white transition-all duration-300 rounded-full"
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
