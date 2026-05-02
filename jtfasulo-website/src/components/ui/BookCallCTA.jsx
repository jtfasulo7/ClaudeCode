import { ArrowUpRight } from 'lucide-react'

/* Replaces the Footer's old "Start your AI journey the right way" CTA bar.
   Single-column closing CTA — minimal copy, white pill button. */

const BOOKING_URL = 'https://api.leadconnectorhq.com/widget/bookings/pro-website-training'

export default function BookCallCTA() {
  return (
    <section className="relative bg-background text-white overflow-hidden border-t border-border">
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-24 md:py-32 text-center">
        <p className="text-[11px] tracking-[0.42em] uppercase text-white/55 mb-6">
          Ready when you are
        </p>
        <h2 className="font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[1.05] mb-8">
          Let&rsquo;s build something
          <br className="hidden md:block" />
          <span className="opacity-70"> worth showing off.</span>
        </h2>

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
