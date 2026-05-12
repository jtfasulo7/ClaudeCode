import { motion } from 'framer-motion'
import { ArrowUpRight, Check } from 'lucide-react'

/*
 * Sits right below the hero. Combines the high-level pitch for the PDF
 * with the "What you learn." curriculum that used to live in BookCallCTA.
 * Single CTA: "Get your guide" → Stripe checkout.
 */

const STRIPE_URL = 'https://buy.stripe.com/28E5kw2tXbZA7LBbqC8Zq03'
const PRICE_TAG  = '$39.99'

const PARTS = [
  { num: '01', title: 'The Stack',                          chapters: 5 },
  { num: '02', title: 'How Any Of This Works',              chapters: 3 },
  { num: '03', title: 'The Workflow',                       chapters: 4 },
  { num: '04', title: 'Skills — The Unfair Advantage',      chapters: 4 },
  { num: '05', title: 'Designing With 21st.dev',            chapters: 3 },
  { num: '06', title: 'Higgsfield AI for Scroll Animations', chapters: 4 },
  { num: '07', title: 'SEO That Actually Works',            chapters: 5 },
  { num: '08', title: 'Serverless APIs on Vercel',          chapters: 4 },
  { num: '09', title: 'Shipping It',                        chapters: 4 },
  { num: '10', title: 'A Full Walkthrough',                 chapters: 3 },
]

const LEARN = [
  'What makes a site convert',
  'Build high-end websites without learning how to code',
  'Master AI to get the best results',
  'Targeting high-ticket clients',
]

const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0,  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
}

export default function PdfShowcase() {
  return (
    <section className="relative bg-background text-white border-t border-border overflow-hidden">
      <div className="relative max-w-6xl mx-auto px-6 lg:px-8 py-20 md:py-28">

        {/* ── Intro: eyebrow + headline + lede ─────────────────────────── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
          className="max-w-3xl mx-auto text-center mb-14 md:mb-20"
        >
          <p className="text-[11px] tracking-[0.42em] uppercase text-accent font-semibold mb-6">
            The Playbook
          </p>
          <h2 className="font-bold text-4xl sm:text-5xl md:text-6xl tracking-tight leading-[1.05] mb-6">
            A 100-page playbook for building $10k websites with Claude&nbsp;Code.
          </h2>
          <p className="text-text-muted text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            Forty-two chapters, ten parts, every technique I use to ship premium
            sites for contractors and solo founders on $44 a month of tools.
            Written for total beginners — no coding experience required.
          </p>
        </motion.div>

        {/* ── Two-column body: What's inside  +  What you learn ─────────── */}
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 mb-14 md:mb-20">

          {/* What's inside */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeUp}
          >
            <p className="text-[10px] tracking-[0.42em] uppercase text-white/55 font-semibold mb-5">
              What's inside
            </p>
            <ul className="space-y-3">
              {PARTS.map(({ num, title, chapters }) => (
                <li
                  key={num}
                  className="flex items-baseline gap-4 py-2 border-b border-border/60"
                >
                  <span className="text-xs tracking-[0.18em] text-accent font-bold tabular-nums">
                    {num}
                  </span>
                  <span className="text-sm md:text-base text-white/90 font-medium flex-1 leading-snug">
                    {title}
                  </span>
                  <span className="text-[10px] tracking-[0.22em] uppercase text-white/40">
                    {chapters} ch
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* What you learn */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeUp}
          >
            <p className="text-[10px] tracking-[0.42em] uppercase text-white/55 font-semibold mb-5">
              What you learn
            </p>
            <ul className="space-y-5">
              {LEARN.map((item) => (
                <li key={item} className="flex items-start gap-3 md:gap-4">
                  <Check
                    size={20}
                    strokeWidth={1.5}
                    className="text-accent mt-1 shrink-0"
                    aria-hidden="true"
                  />
                  <span className="text-base md:text-lg leading-snug text-white/90">
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            {/* Format chips */}
            <div className="mt-8 flex flex-wrap gap-2">
              {['100 pages', 'PDF, instant download', 'Lifetime access'].map((c) => (
                <span
                  key={c}
                  className="text-[10px] tracking-[0.22em] uppercase text-white/55 border border-border/70 rounded-full px-3 py-1.5"
                >
                  {c}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── CTA ──────────────────────────────────────────────────────── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
          className="text-center"
        >
          <a
            href={STRIPE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-sm inline-flex items-center gap-2"
          >
            <span>Get your guide — {PRICE_TAG}</span>
            <ArrowUpRight size={16} className="relative z-[1]" />
          </a>
          <p className="mt-5 text-xs tracking-[0.28em] uppercase text-white/40">
            One-time · Secure checkout via Stripe
          </p>
        </motion.div>

      </div>
    </section>
  )
}
