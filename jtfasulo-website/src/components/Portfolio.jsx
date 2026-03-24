import { useState, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, Eye } from 'lucide-react'

const categories = ['All', 'AI Creatives', 'Social Strategy']

const caseStudies = [
  {
    id: 1,
    category: 'AI Creatives',
    title: 'Velocity Sportswear',
    subtitle: 'Campaign Creative Suite',
    description: 'Full AI-generated campaign for a D2C sports brand. 40+ unique ad variants produced in 72 hours, achieving a 3.8x ROAS lift.',
    metric: '3.8x ROAS',
    metricLabel: 'Return on Ad Spend',
    tags: ['Meta Ads', 'AI Creative', 'Product Launch'],
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80&auto=format&fit=crop',
    color: 'from-cyan-500/10',
  },
  {
    id: 2,
    category: 'Social Strategy',
    title: 'Aura Skincare',
    subtitle: 'Social Media Overhaul',
    description: 'Six-month social strategy that transformed a stagnant account into a 120K-follower community with 8.2% average engagement rate.',
    metric: '120K',
    metricLabel: 'Followers Gained',
    tags: ['Instagram', 'TikTok', 'Content Calendar'],
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80&auto=format&fit=crop',
    color: 'from-purple-500/10',
  },
  {
    id: 3,
    category: 'AI Creatives',
    title: 'NorthPeak Capital',
    subtitle: 'B2B Brand Identity Campaign',
    description: 'Premium AI-crafted visual identity and LinkedIn campaign for a growth-stage VC firm positioning as a thought leader in fintech.',
    metric: '65%',
    metricLabel: 'Increase in Inbound Leads',
    tags: ['LinkedIn', 'Brand Identity', 'B2B'],
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80&auto=format&fit=crop',
    color: 'from-blue-500/10',
  },
  {
    id: 4,
    category: 'Social Strategy',
    title: 'Ember Coffee Roasters',
    subtitle: 'Community Growth Strategy',
    description: 'Built a hyper-engaged local-to-national brand community with video-first content strategy and creator partnerships.',
    metric: '2.4M',
    metricLabel: 'Organic Impressions / Month',
    tags: ['Community', 'Video', 'Creator Collab'],
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80&auto=format&fit=crop',
    color: 'from-amber-500/10',
  },
  {
    id: 5,
    category: 'AI Creatives',
    title: 'Flux Fitness App',
    subtitle: 'Performance Ad Campaign',
    description: 'AI-powered creative testing engine that cycles 80+ variants per week, consistently finding winning hooks for a fitness subscription app.',
    metric: '$0.61',
    metricLabel: 'Avg. CPA (down from $4.20)',
    tags: ['Performance', 'Mobile App', 'AI Testing'],
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80&auto=format&fit=crop',
    color: 'from-green-500/10',
  },
  {
    id: 6,
    category: 'Social Strategy',
    title: 'Meridian Architecture',
    subtitle: 'Premium B2B Social Presence',
    description: 'Elevated a boutique architecture firm\'s digital presence from zero to a premium portfolio-forward brand with high-net-worth client pipeline.',
    metric: '14x',
    metricLabel: 'Profile Visits Increase',
    tags: ['LinkedIn', 'Instagram', 'Premium Brand'],
    image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80&auto=format&fit=crop',
    color: 'from-rose-500/10',
  },
]

function CaseStudyCard({ study, index }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: index * 0.08 }}
      className="group relative border border-border bg-surface/30 overflow-hidden card-hover cursor-default"
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={study.image}
          alt={study.title}
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

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <Eye size={16} className="text-background" />
          </div>
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

        <p className="text-text-muted text-sm leading-relaxed mb-5">{study.description}</p>

        {/* Metric */}
        <div className="border-t border-border pt-5 flex items-center justify-between">
          <div>
            <div className="text-2xl font-black text-white">{study.metric}</div>
            <div className="text-[10px] text-text-dim tracking-widest uppercase mt-0.5">{study.metricLabel}</div>
          </div>
          <div className="flex flex-wrap gap-1.5 justify-end max-w-[55%]">
            {study.tags.map((tag) => (
              <span
                key={tag}
                className="text-[9px] tracking-wider uppercase text-text-dim border border-border/60 px-2 py-1"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
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
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {filtered.map((study, i) => (
              <CaseStudyCard key={study.id} study={study} index={i} />
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
