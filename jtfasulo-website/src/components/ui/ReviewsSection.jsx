import { useEffect, useRef } from 'react'

/* Compositor-thread vertical marquee. Same shape as the realtor-website
   testimonials per the animation-performance skill:
     • CSS @keyframes on transform — runs on the GPU compositor, not JS RAF
     • paused initially; JS measures scrollHeight / 3 once, sets --cycle and
       --col-duration as inline custom props, then adds .ready to unpause
     • triple-buffer (3 copies, not 2) so the wrap point is invisible even
       when card heights differ
     • gradient-overlay pseudo-elements for the top/bottom fade — NOT
       mask-image, which forces a compositing pass per frame
*/

const TESTIMONIALS = [
  {
    text: "Brought JT in to redo a landing page that wasn't converting. Two weeks later we'd shipped it and conversions were up 38%. He treats your homepage like a product, not a page.",
    name: 'Maya Chen',
    role: 'Founder · Series-A SaaS',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=facearea&facepad=2&w=120&h=120&q=80',
  },
  {
    text: "I spent six months trying to teach myself design. One month with JT and I shipped a portfolio site that actually got me hired.",
    name: 'Daniel Reyes',
    role: 'Independent Designer',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=120&h=120&q=80',
  },
  {
    text: "Most agencies hand you a Figma file and disappear. JT shipped the actual code, hooked up the analytics, walked us through everything. Different operating mode.",
    name: 'Priya Anand',
    role: 'COO · DTC brand',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=2&w=120&h=120&q=80',
  },
  {
    text: "He thinks about typography the way a chef thinks about salt. After our session I started SEEING type instead of just placing it.",
    name: 'Marco Velez',
    role: 'Mentee · Architectural Designer',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=facearea&facepad=2&w=120&h=120&q=80',
  },
  {
    text: "Our agency template-shop site was hurting credibility. JT rebuilt it as something that looks like the brands we sell to. Inbound leads tripled in the first quarter.",
    name: 'Helen Forsythe',
    role: 'Founder · Boutique agency',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=facearea&facepad=2&w=120&h=120&q=80',
  },
  {
    text: "I came in thinking I knew CSS. Left understanding what design IS. The conversation about hierarchy alone was worth the program.",
    name: 'James Reardon',
    role: 'Mentee · Frontend Engineer',
    image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=facearea&facepad=2&w=120&h=120&q=80',
  },
  {
    text: "What I appreciated most was the honesty. JT will tell you when an idea is wrong. That's rare and worth paying for.",
    name: 'Olivia Tan',
    role: 'Founder · Cybersecurity startup',
    image: 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=facearea&facepad=2&w=120&h=120&q=80',
  },
  {
    text: "He built our launch site in 11 days, hit Lighthouse 99, and the headline he wrote did more lifting than three rounds of agency copy.",
    name: 'Robert Caldwell',
    role: 'CEO · B2B SaaS',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=facearea&facepad=2&w=120&h=120&q=80',
  },
  {
    text: "JT is the rare designer who can build production code AND argue typography over a Zoom call. That combination is what makes his sites feel different.",
    name: 'Sarah Lim',
    role: 'Mentee → now full-time designer',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=120&h=120&q=80',
  },
]

const COLUMNS = [
  { items: TESTIMONIALS.slice(0, 3), duration: 32, hideBelow: '' },
  { items: TESTIMONIALS.slice(3, 6), duration: 38, hideBelow: 'hidden md:block' },
  { items: TESTIMONIALS.slice(6, 9), duration: 35, hideBelow: 'hidden lg:block' },
]

function TestimonialCard({ t }) {
  return (
    <div className="p-8 md:p-9 rounded-3xl border border-white/10 bg-white/[0.04] max-w-xs w-full">
      <p className="text-[15px] leading-relaxed text-white/85">{t.text}</p>
      <div className="flex items-center gap-3 mt-6">
        <img
          width={40}
          height={40}
          src={t.image}
          alt={t.name}
          className="h-10 w-10 rounded-full object-cover"
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.currentTarget.style.background = '#1f1f1f'
            e.currentTarget.removeAttribute('src')
          }}
        />
        <div className="flex flex-col">
          <div className="font-medium tracking-tight leading-5 text-white">{t.name}</div>
          <div className="leading-5 text-white/55 tracking-tight text-sm">{t.role}</div>
        </div>
      </div>
    </div>
  )
}

export default function ReviewsSection() {
  const trackRefs = useRef([])

  useEffect(() => {
    const tracks = trackRefs.current.filter(Boolean)
    if (!tracks.length) return

    function applyAnims() {
      tracks.forEach((el, i) => {
        const cycle = el.scrollHeight / 3   // height of one set of cards
        if (!cycle) return                  // hidden columns have 0 height
        el.style.setProperty('--cycle', cycle + 'px')
        el.style.setProperty('--col-duration', COLUMNS[i].duration + 's')
        el.classList.add('ready')           // unpauses the keyframe animation
      })
    }

    function whenReady(cb) {
      const go = () => requestAnimationFrame(() => requestAnimationFrame(cb))
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(go)
      else if (document.readyState === 'complete') go()
      else window.addEventListener('load', go)
    }
    whenReady(applyAnims)

    let t = 0
    const onResize = () => {
      clearTimeout(t)
      t = setTimeout(applyAnims, 120)
    }
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      clearTimeout(t)
    }
  }, [])

  return (
    <section id="reviews" className="bg-background text-white relative py-24 md:py-32 px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col items-center justify-center max-w-[640px] mx-auto text-center">
          <div className="inline-block border border-white/20 py-1 px-4 rounded-full text-[11px] tracking-[0.32em] uppercase text-white/80">
            Testimonials
          </div>
          <h2 className="font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[1.12] mt-7 text-white">
            Make your reviews pop.
          </h2>
        </div>

        <div className="reviews-stage flex justify-center gap-6 mt-16 max-h-[740px] overflow-hidden">
          {COLUMNS.map((c, i) => {
            const inner = c.items.map((t, j) => <TestimonialCard key={j} t={t} />)
            return (
              <div key={i} className={c.hideBelow}>
                <div
                  ref={(el) => (trackRefs.current[i] = el)}
                  className="reviews-col-track flex flex-col gap-6"
                >
                  {inner}{inner}{inner}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
