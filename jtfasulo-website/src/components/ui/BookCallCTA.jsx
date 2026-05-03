import { ArrowUpRight, Check } from 'lucide-react'

/* Closing section — title + curriculum bullets + booking CTA. */

const BOOKING_URL = 'https://api.leadconnectorhq.com/widget/bookings/pro-website-training'

const CURRICULUM = [
  'What makes a site convert',
  'Build high-end websites without learning how to code',
  'Master AI to get the best results',
  'Targeting high-ticket clients',
]

export default function BookCallCTA() {
  return (
    <section className="relative bg-background text-white overflow-hidden border-t border-border">
      <div className="relative max-w-3xl mx-auto px-6 lg:px-8 py-20 md:py-28 text-center">
        <p className="text-[11px] tracking-[0.42em] uppercase text-white/55 mb-6">
          The Curriculum
        </p>
        <h2 className="font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[1.12] mb-10 md:mb-12">
          What you learn.
        </h2>

        <ul className="text-left max-w-xl mx-auto space-y-4 md:space-y-5 mb-12 md:mb-14">
          {CURRICULUM.map((item) => (
            <li key={item} className="flex items-start gap-3 md:gap-4">
              <Check
                size={20}
                strokeWidth={1.5}
                className="text-white/55 mt-0.5 md:mt-1 shrink-0"
                aria-hidden="true"
              />
              <span className="text-base md:text-lg leading-snug text-white/90">
                {item}
              </span>
            </li>
          ))}
        </ul>

        <a
          href={BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary text-sm inline-flex items-center gap-2"
        >
          <span>Book a free call</span>
          <ArrowUpRight size={16} className="relative z-[1]" />
        </a>

        <p className="mt-6 text-xs tracking-[0.28em] uppercase text-white/40">
          30 minutes · No pitch
        </p>
      </div>
    </section>
  )
}
