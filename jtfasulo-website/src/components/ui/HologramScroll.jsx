import { useEffect, useRef } from 'react'

/* Scroll-scrubbed 120-frame canvas section. Same pattern as the realtor
   hero — sticky 100vh canvas inside a tall container; scroll position drives
   which frame is painted; drawCover() handles aspect-ratio fit; the
   `if (idx === lastIdx) return` is the load-bearing perf line. */

// 238 motion-interpolated WebP frames at 1920 wide. Was 120 JPEG frames at
// 1280 wide — half the per-frame scroll delta, less canvas-upscale blur,
// and cleaner motion (true synthesized in-betweens rather than duplicated
// source frames). minterpolate produced 240 → -frames:v truncated to 238.
const TOTAL = 238

// Four labels, each pointing at one panel of the fully-expanded hologram.
// `pos` = where the label sits in the sticky viewport (% of width/height).
// `appearAt` = scroll progress at which the label starts fading in.
// Stagger is intentional — labels reveal in reading order, NW → NE → SW → SE.
const LABELS = [
  {
    n: '01',
    title: 'Hero',
    description:
      "4 seconds to convince a stranger they're in the right place. Big idea, bigger pull.",
    pos: { top: '12%', left: '4%', maxWidth: '280px', textAlign: 'left' },
    appearAt: 0.58,
  },
  {
    n: '02',
    title: 'Features',
    description:
      "What you do — six honest bullets that earn the next scroll, not 30 vague ones.",
    pos: { top: '12%', right: '4%', maxWidth: '280px', textAlign: 'right' },
    appearAt: 0.66,
  },
  {
    n: '03',
    title: 'Reviews',
    description:
      "Social proof that's actually social. Real names, real outcomes, real photos.",
    pos: { bottom: '14%', left: '4%', maxWidth: '280px', textAlign: 'left' },
    appearAt: 0.74,
  },
  {
    n: '04',
    title: 'CTA',
    description:
      "The moment you ask. No shy buttons. The page has earned this — let it close.",
    pos: { bottom: '14%', right: '4%', maxWidth: '280px', textAlign: 'right' },
    appearAt: 0.82,
  },
]

export default function HologramScroll() {
  const sectionRef = useRef(null)
  const stickyRef  = useRef(null)
  const canvasRef  = useRef(null)
  const openingRef = useRef(null)
  const labelRefs  = useRef([])

  useEffect(() => {
    const section = sectionRef.current
    const canvas  = canvasRef.current
    if (!section || !canvas) return

    const ctx = canvas.getContext('2d')
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    /* Preload all frames in parallel. Each load invalidates lastIdx so the
       next render() call paints whatever's now available — without this, the
       initial render() runs before any image has decoded and the canvas
       stays black until the user scrolls. */
    const images = new Array(TOTAL)
    for (let i = 1; i <= TOTAL; i++) {
      const img = new Image()
      img.decoding = 'async'
      img.src = `/hologram-frames/frame_${String(i).padStart(3, '0')}.webp`
      img.onload = () => { lastIdx = -1; render() }
      images[i - 1] = img
    }

    function nearestLoaded(idx) {
      if (images[idx]?.complete && images[idx].naturalWidth) return images[idx]
      for (let d = 1; d < TOTAL; d++) {
        const a = images[idx - d]
        if (a?.complete && a.naturalWidth) return a
        const b = images[idx + d]
        if (b?.complete && b.naturalWidth) return b
      }
      return null
    }

    function resize() {
      const w = stickyRef.current.clientWidth
      const h = stickyRef.current.clientHeight
      canvas.width  = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width  = w + 'px'
      canvas.style.height = h + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    function drawCover(img) {
      const cw = canvas.clientWidth, ch = canvas.clientHeight
      const ir = img.naturalWidth / img.naturalHeight
      const cr = cw / ch
      let dw, dh, dx, dy
      if (ir > cr) { dh = ch; dw = ch * ir; dx = (cw - dw) / 2; dy = 0 }
      else         { dw = cw; dh = cw / ir; dx = 0; dy = (ch - dh) / 2 }
      ctx.clearRect(0, 0, cw, ch)
      ctx.drawImage(img, dx, dy, dw, dh)
    }

    let lastIdx = -1
    function render() {
      const rect  = section.getBoundingClientRect()
      const range = rect.height - window.innerHeight
      const p     = Math.min(1, Math.max(0, -rect.top / range))

      const idx = Math.min(TOTAL - 1, Math.max(0, Math.round(p * (TOTAL - 1))))
      if (idx !== lastIdx) {
        lastIdx = idx
        const img = nearestLoaded(idx)
        if (img) drawCover(img)
      }

      // Opening text: visible 0 → 0.42, fading out 0.42 → 0.58
      const openingOpacity = 1 - Math.min(1, Math.max(0, (p - 0.42) / 0.16))
      if (openingRef.current) {
        openingRef.current.style.opacity = openingOpacity
        openingRef.current.style.transform =
          `translate(-50%, calc(-50% + ${(1 - openingOpacity) * -16}px))`
      }

      // Labels: each fades in over 0.12 scroll units after its appearAt
      LABELS.forEach((lbl, i) => {
        const o = Math.min(1, Math.max(0, (p - lbl.appearAt) / 0.12))
        const el = labelRefs.current[i]
        if (!el) return
        el.style.opacity = o
        el.style.transform = `translateY(${(1 - o) * 14}px)`
      })
    }

    let ticking = false
    function onScroll() {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => { render(); ticking = false })
    }

    resize()
    render()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', () => { resize(); lastIdx = -1; render() })

    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative bg-black text-white"
      style={{ height: '320vh' }}
    >
      <div ref={stickyRef} className="sticky top-0 h-screen overflow-hidden bg-black">
        {/* Frame canvas */}
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="absolute inset-0 block"
        />

        {/* Soft top + bottom gradient so the canvas blends into the sections
            above and below without a hard seam. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 14%, rgba(0,0,0,0) 86%, rgba(0,0,0,0.55) 100%)',
          }}
        />

        {/* Opening line — sits over the laptop phase, fades out as the
            hologram begins to lift. */}
        <div
          ref={openingRef}
          className="absolute z-10 px-6 text-center"
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            maxWidth: 'min(880px, 92vw)',
            transition: 'opacity 80ms linear, transform 80ms linear',
            willChange: 'opacity, transform',
            textShadow: '0 6px 30px rgba(0,0,0,0.8), 0 2px 8px rgba(0,0,0,0.6)',
          }}
        >
          <h2 className="font-bold text-4xl md:text-6xl lg:text-7xl tracking-tight leading-[1.05]">
            Or maybe you wanna go a little&nbsp;crazy<span className="text-white/60" style={{ letterSpacing: '0.18em' }}>...</span>
          </h2>
        </div>

        {/* Section labels — fade in staggered as the hologram fully expands. */}
        {LABELS.map((lbl, i) => (
          <div
            key={lbl.n}
            ref={(el) => (labelRefs.current[i] = el)}
            className="absolute z-10 pointer-events-none"
            style={{
              ...lbl.pos,
              opacity: 0,
              transition: 'opacity 120ms linear, transform 200ms cubic-bezier(0.16,1,0.3,1)',
              willChange: 'opacity, transform',
            }}
          >
            <div
              className="text-[10px] tracking-[0.42em] uppercase text-white/55 mb-2"
              style={{ textAlign: lbl.pos.textAlign }}
            >
              {lbl.n} ·  Section
            </div>
            <div
              className="font-display font-light text-3xl md:text-4xl text-white tracking-tight leading-none mb-3"
              style={{
                textAlign: lbl.pos.textAlign,
                textShadow: '0 4px 22px rgba(0,0,0,0.85), 0 1px 4px rgba(0,0,0,0.7)',
              }}
            >
              {lbl.title}
            </div>
            <p
              className="text-sm md:text-[15px] leading-relaxed text-white/85"
              style={{
                textAlign: lbl.pos.textAlign,
                textShadow: '0 2px 14px rgba(0,0,0,0.85)',
              }}
            >
              {lbl.description}
            </p>
          </div>
        ))}

        {/* Scroll hint — only visible at start */}
        <div
          aria-hidden="true"
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-[10px] tracking-[0.42em] uppercase text-white/40 animate-pulse"
        >
          Scroll
        </div>
      </div>
    </section>
  )
}
