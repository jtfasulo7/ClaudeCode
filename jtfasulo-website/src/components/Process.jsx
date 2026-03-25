import { useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { Search, Map, Palette, BarChart2, Trophy } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: <Search size={22} />,
    title: 'Discovery',
    description:
      'Deep-dive into your brand, audience, competitive landscape, and goals. We define what success looks like before a single pixel is touched.',
    detail: '1–2 days',
  },
  {
    number: '02',
    icon: <Map size={22} />,
    title: 'Strategy',
    description:
      'Build the creative and channel strategy: messaging framework, content pillars, AI toolchain selection, and KPI targets.',
    detail: '2–3 days',
  },
  {
    number: '03',
    icon: <Palette size={22} />,
    title: 'Creation',
    description:
      'AI-powered production at scale. Campaign assets, social content, and creative variants designed for your platforms, budget, and brand.',
    detail: '5–7 days',
  },
  {
    number: '04',
    icon: <BarChart2 size={22} />,
    title: 'Optimization',
    description:
      'Launch, measure, and iterate. Continuous testing of creative variants, audience segments, and messaging to compound performance over time.',
    detail: 'Ongoing',
  },
  {
    number: '05',
    icon: <Trophy size={22} />,
    title: 'Results',
    description:
      'Deliver measurable outcomes: lower CPAs, higher ROAS, audience growth, engagement lifts. Clear reporting on every metric that matters.',
    detail: 'Monthly',
  },
]

function ProcessStep({ step, index, total }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-30px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
      animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: index * 0.12 }}
      className="relative flex flex-col lg:flex-row items-start gap-6 lg:gap-10"
    >
      {/* Step number + connector */}
      <div className="flex flex-col items-center flex-shrink-0">
        <div className={`w-14 h-14 border flex items-center justify-center transition-all duration-500 ${
          inView ? 'border-accent text-accent bg-accent/5' : 'border-border text-text-dim'
        }`}>
          {step.icon}
        </div>
        {index < total - 1 && (
          <motion.div
            initial={{ scaleY: 0 }}
            animate={inView ? { scaleY: 1 } : {}}
            transition={{ duration: 0.6, delay: index * 0.1 + 0.3 }}
            className="w-px h-16 lg:h-24 bg-gradient-to-b from-accent/40 to-transparent mt-2 origin-top"
          />
        )}
      </div>

      {/* Content */}
      <div className="pb-8 lg:pb-12 flex-1">
        <div className="flex items-center gap-4 mb-3">
          <span className="section-number">{step.number}</span>
          <span className="text-[10px] tracking-[0.2em] uppercase text-text-dim border border-border px-2 py-1">
            {step.detail}
          </span>
        </div>
        <h3 className="text-xl lg:text-2xl font-bold text-white mb-3">{step.title}</h3>
        <p className="text-text-muted text-sm leading-relaxed max-w-lg">{step.description}</p>
      </div>
    </motion.div>
  )
}

export default function Process() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start end', 'end end'] })
  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <section id="process" className="relative py-32 lg:py-40 bg-background overflow-hidden">
      {/* Large background text */}
      <div className="absolute top-20 right-0 text-[20vw] font-black text-white/[0.015] leading-none select-none pointer-events-none tracking-tighter">
        HOW
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 mb-5"
            >
              <span className="section-label">Process</span>
              <div className="h-px w-12 bg-accent/40" />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-[clamp(2rem,5vw,4rem)] font-black leading-tight tracking-tight text-white"
            >
              From Brief<br />
              <span className="text-gradient">To Results</span>
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center"
          >
            <p className="text-text-muted text-base leading-relaxed">
              A proven five-phase system that takes every engagement from raw idea to measurable business
              impact — fast, structured, and transparent at every step.
            </p>
          </motion.div>
        </div>

        {/* Steps */}
        <div ref={containerRef} className="max-w-2xl">
          {steps.map((step, i) => (
            <ProcessStep key={step.number} step={step} index={i} total={steps.length} />
          ))}
        </div>

      </div>
    </section>
  )
}
