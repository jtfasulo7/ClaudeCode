import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react'

const testimonials = [
  {
    id: 1,
    quote:
      "JT transformed how we think about creative production. What used to take our in-house team three weeks, he delivers in three days — and the quality is staggeringly good. The AI-powered ad variants he built cut our CPA by 60% in the first month.",
    name: 'Sarah Chen',
    title: 'CMO, Velocity Sportswear',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&q=80&auto=format&fit=crop&crop=face',
    stat: '60% CPA Reduction',
  },
  {
    id: 2,
    quote:
      "Working with JT felt like gaining a strategic partner, not just a vendor. His social strategy doubled our engagement within two months and his content calendar system has made our marketing completely predictable for the first time.",
    name: 'Marcus Rivera',
    title: 'Founder, Ember Coffee Roasters',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=80&auto=format&fit=crop&crop=face',
    stat: '2x Engagement Growth',
  },
  {
    id: 3,
    quote:
      "We hired JT for a three-month project and ended up expanding the relationship to a full retainer. The caliber of creative he produces with AI is genuinely future-forward, and his understanding of B2B brand strategy is exceptional.",
    name: 'Priya Nair',
    title: 'VP Marketing, NorthPeak Capital',
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=120&q=80&auto=format&fit=crop&crop=face',
    stat: '65% Inbound Lead Increase',
  },
  {
    id: 4,
    quote:
      "JT's process is unlike anything I've seen — disciplined, data-obsessed, and creative in equal measure. He built us an AI creative testing engine that now runs on autopilot. Our team couldn't believe the results.",
    name: 'Tyler Moss',
    title: 'Growth Lead, Flux Fitness App',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&q=80&auto=format&fit=crop&crop=face',
    stat: '$0.61 CPA (from $4.20)',
  },
  {
    id: 5,
    quote:
      "The transformation of our Instagram presence was immediate and dramatic. JT doesn't just make things look good — he makes sure they perform. Six months in and we're getting consistent inbound inquiries from our target clients.",
    name: 'Diana Fontaine',
    title: 'Principal, Meridian Architecture',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&q=80&auto=format&fit=crop&crop=face',
    stat: '14x Profile Visit Increase',
  },
]

export default function Testimonials() {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)
  const [isPaused, setIsPaused] = useState(false)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  const next = useCallback(() => {
    setDirection(1)
    setCurrent((c) => (c + 1) % testimonials.length)
  }, [])

  const prev = useCallback(() => {
    setDirection(-1)
    setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length)
  }, [])

  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [next, isPaused])

  const variants = {
    enter: (dir) => ({ opacity: 0, x: dir > 0 ? 40 : -40 }),
    center: { opacity: 1, x: 0 },
    exit: (dir) => ({ opacity: 0, x: dir > 0 ? -40 : 40 }),
  }

  const t = testimonials[current]

  return (
    <section id="testimonials" className="relative py-32 lg:py-40 bg-surface/20 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-border" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-border" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-accent/[0.03] rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div ref={ref} className="mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-3 mb-5"
          >
            <div className="h-px w-12 bg-accent/40" />
            <span className="section-label">Testimonials</span>
            <div className="h-px w-12 bg-accent/40" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-[clamp(2rem,5vw,4rem)] font-black leading-tight tracking-tight text-white"
          >
            What Clients Say
          </motion.h2>
        </div>

        {/* Carousel */}
        <div
          className="max-w-4xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Main card */}
          <div className="relative min-h-[360px] flex items-center">
            <AnimatePresence custom={direction} mode="wait">
              <motion.div
                key={current}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 flex flex-col justify-center"
              >
                <div className="border border-border bg-surface/50 p-8 lg:p-12">
                  {/* Quote icon */}
                  <div className="mb-6">
                    <Quote size={28} className="text-accent/40" />
                  </div>

                  {/* Quote text */}
                  <blockquote className="text-white text-lg lg:text-xl leading-relaxed font-light mb-8">
                    "{t.quote}"
                  </blockquote>

                  {/* Author + stat */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={t.avatar}
                        alt={t.name}
                        className="w-12 h-12 rounded-full object-cover border border-border"
                      />
                      <div>
                        <div className="text-white font-semibold text-sm">{t.name}</div>
                        <div className="text-text-dim text-xs tracking-wide">{t.title}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-accent font-bold text-base">{t.stat}</div>
                      <div className="text-text-dim text-[10px] tracking-widest uppercase">Key Result</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between mt-8">
            {/* Dots */}
            <div className="flex items-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i) }}
                  className={`transition-all duration-300 ${
                    i === current
                      ? 'w-8 h-1.5 bg-accent'
                      : 'w-1.5 h-1.5 bg-border hover:bg-text-muted'
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>

            {/* Arrows */}
            <div className="flex items-center gap-2">
              <button
                onClick={prev}
                className="w-11 h-11 border border-border flex items-center justify-center text-text-muted hover:border-accent hover:text-accent transition-all duration-300"
                aria-label="Previous"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={next}
                className="w-11 h-11 border border-border flex items-center justify-center text-text-muted hover:border-accent hover:text-accent transition-all duration-300"
                aria-label="Next"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Counter */}
          <div className="text-center mt-6">
            <span className="text-text-dim text-xs tracking-widest">
              {String(current + 1).padStart(2, '0')} / {String(testimonials.length).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
