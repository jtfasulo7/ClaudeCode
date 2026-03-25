import { useState, useRef, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

const categories = ['All', 'AI Creatives', 'Social Strategy']

const caseStudies = [
  {
    id: 1,
    category: 'AI Creatives',
    title: 'Versace',
    subtitle: 'AI Campaign Creative',
    description: 'Full AI-generated campaign creative for a luxury fashion brand. Premium visual content built for performance.',
    metric: '3.8x ROAS',
    metricLabel: 'Return on Ad Spend',
    tags: ['Meta Ads', 'AI Creative', 'Luxury'],
    video: '/videos/versace.mp4',
    color: 'from-cyan-500/10',
  },
  {
    id: 2,
    category: 'AI Creatives',
    title: 'Timberland',
    subtitle: 'AI Campaign Creative',
    description: 'AI-powered campaign creatives for an iconic outdoor brand. Data-driven visuals that convert.',
    metric: '2.6x ROAS',
    metricLabel: 'Return on Ad Spend',
    tags: ['Meta Ads', 'AI Creative', 'Lifestyle'],
    video: '/videos/timberland.mp4',
    color: 'from-amber-500/10',
  },
  {
    id: 3,
    category: 'AI Creatives',
    title: 'Oakley',
    subtitle: 'AI Campaign Creative',
    description: 'High-impact AI-generated creative suite for a performance eyewear brand launching a new product line.',
    metric: '4.1x ROAS',
    metricLabel: 'Return on Ad Spend',
    tags: ['Performance', 'AI Creative', 'Product Launch'],
    video: '/videos/jt oakley.mp4',
    color: 'from-blue-500/10',
  },
  {
    id: 4,
    category: 'AI Creatives',
    title: 'Budri Tennis Club',
    subtitle: 'AI Campaign Creative',
    description: 'Premium brand storytelling for a luxury tennis club. AI-crafted visuals that position the brand at the top of the market.',
    metric: '14x',
    metricLabel: 'Profile Visits Increase',
    tags: ['Brand', 'AI Creative', 'Premium'],
    video: '/videos/Budri. Tennis Club - FINAL.mp4',
    color: 'from-purple-500/10',
  },
]

function VideoCard({ study, index }) {
  const cardRef = useRef(null)
  const inView = useInView(cardRef, { once: true, margin: '-60px' })
  const videoRef = useRef(null)

  // IntersectionObserver — plays on scroll into view (works on mobile)
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {})
          } else {
            video.pause()
          }
        })
      },
      { threshold: 0.4 }
    )

    observer.observe(video)
    return () => observer.disconnect()
  }, [])

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: index * 0.08 }}
      className="group relative border border-border bg-surface/30 overflow-hidden card-hover cursor-default rounded-2xl"
    >
      {/* Video */}
      <div className="relative aspect-[9/16] overflow-hidden bg-black">
        <video
          ref={videoRef}
          src={study.video}
          muted
          loop
          playsInline
          autoPlay
          preload="auto"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className={`absolute inset-0 bg-gradient-to-b ${study.color} to-surface`} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-surface" />

        {/* Category badge */}
        <div className="absolute top-4 left-4">
          <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-accent border border-accent/30 bg-background/70 backdrop-blur-sm px-3 py-1.5">
            {study.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 lg:p-7">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-white mb-1 group-hover:text-accent transition-colors duration-300">
            {study.title}
          </h3>
          <p className="text-xs text-text-dim tracking-wider uppercase">{study.subtitle}</p>
        </div>

        <p className="text-text-muted text-sm leading-relaxed">{study.description}</p>
      </div>
    </motion.div>
  )
}

export default function Portfolio() {
  const [activeFilter, setActiveFilter] = useState('All')
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  const filtered = activeFilter === 'All'
    ? caseStudies
    : caseStudies.filter((s) => s.category === activeFilter)

  return (
    <section id="portfolio" className="relative py-32 lg:py-40 bg-surface/20">
      {/* Background accent */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-border" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-border" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div ref={ref} className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 mb-5"
            >
              <span className="section-label">Case Studies</span>
              <div className="h-px w-12 bg-accent/40" />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-[clamp(2rem,5vw,4rem)] font-black leading-tight tracking-tight text-white"
            >
              Work That<br />
              <span className="text-gradient">Moves the Needle</span>
            </motion.h2>
          </div>

          {/* Filter buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center gap-2"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-4 py-2 text-xs font-semibold tracking-[0.15em] uppercase border transition-all duration-300 ${
                  activeFilter === cat
                    ? 'border-accent text-accent bg-accent/5'
                    : 'border-border text-text-muted hover:border-accent/40 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Cards grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            {filtered.map((study, i) => (
              <VideoCard key={study.id} study={study} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="text-text-muted text-sm mb-6">
            These are a selection of recent engagements. Let's talk about your project.
          </p>
          <a
            href="#contact"
            onClick={(e) => { e.preventDefault(); document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }) }}
            className="btn-primary inline-flex"
          >
            <span>Discuss Your Project</span>
            <ArrowUpRight size={16} className="relative z-10" />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
