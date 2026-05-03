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
  const sectionRef       = useRef(null)
  const stickyRef        = useRef(null)
  const canvasRef        = useRef(null)
  const openingRef       = useRef(null)
  const labelRefs        = useRef([])
  const mobileLabelRefs  = useRef([])

  useEffect(() => {
    const section = sectionRef.current
    const canvas  = canvasRef.current
    if (!section || !canvas) return

    const ctx = canvas.getContext('2d')
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    // Default in Chrome is 'low' — costs nothing visible at 1× scale, but the
    // canvas is upscaling 1920 → ~3400 backing-store, so a better resampler
    // makes a real difference on fine detail (laptop screen text, hologram
    // panel edges, "ELEVATE YOUR PLATFORM" type).
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'

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
      // Setting canvas.width/.height resets context state, so re-apply both:
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
    }

    function drawFit(img) {
      // "Contain" fit instead of "cover" — the source video is 16:9 widescreen
      // and getting cropped hard on portrait viewports. Letterbox top/bottom
      // (or left/right on ultra-narrow) so the full hologram is always visible.
      const cw = canvas.clientWidth, ch = canvas.clientHeight
      const ir = img.naturalWidth / img.naturalHeight
      const cr = cw / ch
      const isMobile = cw < 768
      const padding  = isMobile ? 0.92 : 0.78  // 92% width on mobile, 78% on desktop
      let dw, dh, dx, dy
      if (ir > cr) {
        dw = cw * padding
        dh = dw / ir
        dx = (cw - dw) / 2
        // On mobile: pin the image to the upper third of the viewport so the
        // crossfading text below it sits in actual breathing room rather than
        // crammed against the bottom edge. Desktop stays vertically centered.
        dy = isMobile ? ch * 0.16 : (ch - dh) / 2
      } else {
        dh = ch * padding
        dw = dh * ir
        dx = (cw - dw) / 2
        dy = (ch - dh) / 2
      }
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
        if (img) drawFit(img)
      }

      // Opening text: visible 0 → 0.30, fading out 0.30 → 0.40 (used to fade
      // out at 0.42-0.58, but the new mobile label windows start at 0.40 so
      // the opening line has to clear out earlier).
      const openingOpacity = 1 - Math.min(1, Math.max(0, (p - 0.30) / 0.10))
      if (openingRef.current) {
        openingRef.current.style.opacity = openingOpacity
        openingRef.current.style.transform =
          `translate(-50%, calc(-50% + ${(1 - openingOpacity) * -16}px))`
      }

      // Desktop labels: each fades in over 0.12 scroll units after appearAt
      LABELS.forEach((lbl, i) => {
        const o = Math.min(1, Math.max(0, (p - lbl.appearAt) / 0.12))
        const el = labelRefs.current[i]
        if (!el) return
        el.style.opacity = o
        el.style.transform = `translateY(${(1 - o) * 14}px)`
      })

      // Mobile labels — the opening line is hidden on mobile, so the four
      // pillars get the full 0 → 1 progress range. Each visible window is
      // wider than before; the user can't scroll past one without reading.
      // Crossfade gap between adjacent windows = FADE so only one label is
      // fully opaque at any moment (no double-stacking).
      const FADE = 0.05
      const windows = [
        { start: 0.06, end: 0.30 },   // Hero      (visible ~24% of progress)
        { start: 0.35, end: 0.55 },   // Features  (~20%)
        { start: 0.60, end: 0.80 },   // Reviews   (~20%)
        { start: 0.85, end: 1.30 },   // CTA       (last, holds through end)
      ]
      windows.forEach((w, i) => {
        const el = mobileLabelRefs.current[i]
        if (!el) return
        let o
        if (p < w.start - FADE)        o = 0
        else if (p < w.start)          o = (p - (w.start - FADE)) / FADE
        else if (p < w.end)            o = 1
        else if (p < w.end + FADE)     o = 1 - (p - w.end) / FADE
        else                           o = 0
        el.style.opacity = o
        el.style.transform = `translateY(${(1 - o) * 10}px)`
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
      // Mobile dropped from 380vh → 280vh. The post-sticky 100vh tail (where
      // the canvas sat frozen at frame 238 + the CTA label, no new info, just
      // black-ish space scrolling up) was reading as ~one viewport of dead
      // scroll before the marquee section. Shorter parent = same pin pattern,
      // proportionally less dead tail.
      className="relative bg-black text-white h-[280vh] md:h-[320vh]"
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
          // Mobile drops the "Or maybe you wanna go a little crazy..." line
          // entirely — the freed-up scroll progress is redistributed to the
          // four pillar windows below so each one dwells longer.
          className="absolute z-10 px-6 text-center hidden md:block"
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
          <h2 className="font-bold text-3xl sm:text-4xl md:text-6xl lg:text-7xl tracking-tight leading-[1.08] px-4">
            Or maybe you wanna go a little&nbsp;crazy<span className="text-white/60" style={{ letterSpacing: '0.18em' }}>...</span>
          </h2>
        </div>

        {/* Section labels — fade in staggered as the hologram fully expands. */}
        {LABELS.map((lbl, i) => (
          <div
            key={lbl.n}
            ref={(el) => (labelRefs.current[i] = el)}
            className="absolute z-10 pointer-events-none hidden md:block"
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

        {/* Mobile-only: a single crossfading label below the hologram that
            cycles through the four sections as the user scrolls. Sits at
            ~46% from top so it's directly below the now-upper-positioned
            hologram, not pinned to the bottom edge. */}
        <div className="absolute inset-x-0 top-[46%] z-10 px-6 md:hidden pointer-events-none">
          <div className="relative h-[140px]">
            {LABELS.map((lbl, i) => (
              <div
                key={lbl.n}
                ref={(el) => (mobileLabelRefs.current[i] = el)}
                className="absolute inset-x-0 text-center"
                style={{
                  opacity: 0,
                  transition: 'opacity 140ms linear, transform 220ms cubic-bezier(0.16,1,0.3,1)',
                  willChange: 'opacity, transform',
                }}
              >
                <div className="text-[10px] tracking-[0.42em] uppercase text-white/55 mb-2">
                  {lbl.n} ·  Section
                </div>
                <div
                  className="font-display font-light text-3xl text-white tracking-tight leading-none mb-2"
                  style={{ textShadow: '0 4px 22px rgba(0,0,0,0.85), 0 1px 4px rgba(0,0,0,0.7)' }}
                >
                  {lbl.title}
                </div>
                <p
                  className="text-sm leading-relaxed text-white/85 max-w-xs mx-auto"
                  style={{ textShadow: '0 2px 14px rgba(0,0,0,0.85)' }}
                >
                  {lbl.description}
                </p>
              </div>
            ))}
          </div>
        </div>

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
