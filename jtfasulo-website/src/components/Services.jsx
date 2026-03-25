import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Cpu, BarChart3, FileImage, Lightbulb, ArrowUpRight } from 'lucide-react'

const services = [
  {
    number: '01',
    icon: <Cpu size={24} />,
    title: 'Campaign Creatives Made with AI',
    tagline: 'Primary Offering',
    description:
      'Data-driven visual content engineered for conversion. I harness the latest generative AI models to produce scroll-stopping campaign assets — ads, banners, social posts, and brand visuals — at scale and speed that traditional agencies can\'t match.',
    features: [
      'Generative ad creative sets',
      'AI-enhanced photo & video',
      'Brand-consistent visual systems',
      'A/B-ready creative variants',
      'Platform-optimized formats',
    ],
    accent: true,
  },
  {
    number: '02',
    icon: <BarChart3 size={24} />,
    title: 'Social Media Strategy',
    tagline: 'Secondary Offering',
    description:
      'Audience growth and engagement optimization built on real data. I develop content calendars, platform-specific strategies, and community frameworks that turn followers into buyers.',
    features: [
      'Content calendar development',
      'Audience growth roadmaps',
      'Platform algorithm strategy',
      'Engagement rate optimization',
      'Analytics & reporting',
    ],
    accent: false,
  },
  {
    number: '03',
    icon: <FileImage size={24} />,
    title: 'Content Optimization',
    tagline: 'Add-On Service',
    description:
      'Transform underperforming assets into high-converting content. I audit existing creative libraries, identify gaps, and systematically improve performance across every channel.',
    features: [
      'Creative performance audits',
      'Copy & visual refresh',
      'Repurposing for multi-channel',
      'SEO-informed content strategy',
      'Conversion rate testing',
    ],
    accent: false,
  },
  {
    number: '04',
    icon: <Lightbulb size={24} />,
    title: 'Strategy Consulting',
    tagline: 'Advisory',
    description:
      'High-level brand and marketing consulting for founders, CMOs, and agencies looking to integrate AI into their creative workflow or rethink their content ecosystem from first principles.',
    features: [
      'AI creative stack audits',
      'Brand positioning workshops',
      'Go-to-market creative strategy',
      'Team training & playbooks',
      'Ongoing advisory retainer',
    ],
    accent: false,
  },
]

function ServiceCard({ service, index }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
      animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: index * 0.12 }}
      className={`relative group p-8 lg:p-10 border transition-all duration-500 cursor-default card-hover ${
        service.accent
          ? 'border-accent/30 bg-accent/[0.04]'
          : 'border-border bg-surface/50'
      }`}
    >
      {/* Top row */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-4">
          <span className="section-number text-sm">{service.number}/04</span>
          <span className="text-[10px] tracking-[0.25em] uppercase text-text-dim border border-border px-2 py-1">
            {service.tagline}
          </span>
        </div>
        <div className={`p-3 border transition-all duration-300 ${
          service.accent
            ? 'border-accent/40 text-accent bg-accent/10 group-hover:bg-accent group-hover:text-background'
            : 'border-border text-text-muted group-hover:border-accent/40 group-hover:text-accent'
        }`}>
          {service.icon}
        </div>
      </div>

      {/* Title */}
      <h3 className="text-xl lg:text-2xl font-bold text-white mb-4 leading-tight">
        {service.title}
      </h3>

      {/* Description */}
      <p className="text-text-muted text-sm leading-relaxed mb-8">
        {service.description}
      </p>

      {/* Features */}
      <ul className="space-y-2.5 mb-8">
        {service.features.map((feat) => (
          <li key={feat} className="flex items-center gap-3 text-sm text-text-muted">
            <span className={`w-1 h-1 rounded-full flex-shrink-0 ${service.accent ? 'bg-accent' : 'bg-text-dim'}`} />
            {feat}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <a
        href="#contact"
        onClick={(e) => { e.preventDefault(); document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }) }}
        className={`inline-flex items-center gap-2 text-xs font-semibold tracking-[0.15em] uppercase transition-colors duration-300 ${
          service.accent ? 'text-accent hover:text-white' : 'text-text-muted hover:text-accent'
        }`}
      >
        Get Started
        <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
      </a>

      {/* Corner accent for primary */}
      {service.accent && (
        <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden pointer-events-none">
          <div className="absolute top-3 right-3 w-px h-10 bg-accent/40" />
          <div className="absolute top-3 right-3 w-10 h-px bg-accent/40" />
        </div>
      )}
    </motion.div>
  )
}

export default function Services() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="services" className="relative py-32 lg:py-40 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section header */}
        <div ref={ref} className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-20">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 mb-5"
            >
              <span className="section-label">Services</span>
              <div className="h-px w-12 bg-accent/40" />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-[clamp(2rem,5vw,4rem)] font-black leading-tight tracking-tight text-white"
            >
              What I Build<br />
              <span className="text-gradient">For Your Brand</span>
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-sm text-text-muted text-sm leading-relaxed lg:text-right"
          >
            Four focused service lines designed to give ambitious brands an unfair creative advantage.
          </motion.p>
        </div>

        {/* Service cards grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          {services.map((service, i) => (
            <ServiceCard key={service.number} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
