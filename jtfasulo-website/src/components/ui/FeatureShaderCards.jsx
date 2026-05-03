import { useEffect, useRef, useState } from 'react'
import { Warp } from '@paper-design/shaders-react'
import { Sparkles, Type, Gauge, MousePointerClick, Palette, Target } from 'lucide-react'

/* Six premium-website features. Copy is intentionally specific — vague
   "Elegant Design / High Performance" lists feel like every other AI-built
   features section. */
const features = [
  {
    title: 'Cinematic motion',
    description:
      "Scroll-driven hero sequences, fluid shader backdrops, frame-scrubbed video. Built once, locked to native refresh rate, never the reason your site feels slow.",
    Icon: Sparkles,
  },
  {
    title: 'Editorial typography',
    description:
      "Paired display + body type, considered kerning, hand-set tracking on display sizes. The page reads like a magazine spread, not a CMS export.",
    Icon: Type,
  },
  {
    title: 'Performance budget',
    description:
      "Sub-second LCP, Lighthouse 95+, 60fps animation on mid-range hardware. Speed is a design feature — measurable, defended, never traded for visuals.",
    Icon: Gauge,
  },
  {
    title: 'Bespoke micro-interactions',
    description:
      "Hover states, cursor moments, scroll-driven reveals — each one written for this site, not pulled from a library. Small details, total polish.",
    Icon: MousePointerClick,
  },
  {
    title: 'Considered material',
    description:
      "Restrained palette, real depth from light + shadow, glass and chrome surfaces with intent. The site looks like the brand, not like the framework.",
    Icon: Palette,
  },
  {
    title: 'Conversion-aware structure',
    description:
      "Every section earns its place. CTAs sit where eyes already are, copy carries the page, hierarchy survives a 5-second scan. Beauty that ships revenue.",
    Icon: Target,
  },
]

/* Per-card Warp shader settings (ported verbatim from the 21st.dev source).
   Each card has its own palette so the row reads as a deliberate spectrum. */
const shaderConfigs = [
  { proportion: 0.30, softness: 0.8, distortion: 0.15, swirl: 0.6,  swirlIterations: 8,
    shape: 'checks', shapeScale: 0.08,
    colors: ['hsl(280,100%,30%)', 'hsl(320,100%,60%)', 'hsl(340,90%,40%)',  'hsl(300,100%,70%)'] },
  { proportion: 0.40, softness: 1.2, distortion: 0.20, swirl: 0.9,  swirlIterations: 12,
    shape: 'dots',   shapeScale: 0.12,
    colors: ['hsl(200,100%,25%)', 'hsl(180,100%,65%)', 'hsl(160,90%,35%)',  'hsl(190,100%,75%)'] },
  { proportion: 0.35, softness: 0.9, distortion: 0.18, swirl: 0.7,  swirlIterations: 10,
    shape: 'checks', shapeScale: 0.10,
    colors: ['hsl(120,100%,25%)', 'hsl(140,100%,60%)', 'hsl(100,90%,30%)',  'hsl(130,100%,70%)'] },
  { proportion: 0.45, softness: 1.1, distortion: 0.22, swirl: 0.8,  swirlIterations: 15,
    shape: 'dots',   shapeScale: 0.09,
    colors: ['hsl( 30,100%,35%)', 'hsl( 50,100%,65%)', 'hsl( 40,90%,40%)',  'hsl( 45,100%,75%)'] },
  { proportion: 0.38, softness: 0.95, distortion: 0.16, swirl: 0.85, swirlIterations: 11,
    shape: 'checks', shapeScale: 0.11,
    colors: ['hsl(250,100%,30%)', 'hsl(270,100%,65%)', 'hsl(260,90%,35%)',  'hsl(265,100%,70%)'] },
  { proportion: 0.42, softness: 1.0, distortion: 0.19, swirl: 0.75, swirlIterations: 9,
    shape: 'dots',   shapeScale: 0.13,
    colors: ['hsl(330,100%,30%)', 'hsl(350,100%,60%)', 'hsl(340,90%,35%)',  'hsl(345,100%,75%)'] },
]

export default function FeatureShaderCards() {
  // Pause every Warp shader when the section is offscreen — 6 WebGL contexts
  // running continuously is the kind of GPU work that turns a smooth hero
  // into a stuttering one. speed=0 freezes the time uniform; canvases stay
  // alive so resume is instant.
  const sectionRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)
  useEffect(() => {
    if (!sectionRef.current) return
    const io = new IntersectionObserver(
      (entries) => setIsVisible(entries[0].isIntersecting),
      { rootMargin: '200px 0px', threshold: 0 }   // pre-warm just before scroll-in
    )
    io.observe(sectionRef.current)
    return () => io.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="bg-background text-white py-24 md:py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-[11px] tracking-[0.42em] uppercase text-white/55 mb-5">
            What “premium” actually means
          </p>
          <h2 className="font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[1.12] mb-6">
            Six things every premium site does.
          </h2>
          <p className="text-lg md:text-xl text-white/65 max-w-2xl mx-auto leading-relaxed">
            None of them are templates. All of them are deliberate choices.
            This is what separates a website from a brand.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7">
          {features.map(({ title, description, Icon }, i) => {
            const cfg = shaderConfigs[i % shaderConfigs.length]
            return (
              <div key={i} className="relative h-80 group">
                <div className="absolute inset-0 rounded-3xl overflow-hidden">
                  <Warp
                    style={{ width: '100%', height: '100%' }}
                    proportion={cfg.proportion}
                    softness={cfg.softness}
                    distortion={cfg.distortion}
                    swirl={cfg.swirl}
                    swirlIterations={cfg.swirlIterations}
                    shape={cfg.shape}
                    shapeScale={cfg.shapeScale}
                    scale={1}
                    rotation={0}
                    /* perf: per the animation-performance skill */
                    speed={isVisible ? 0.8 : 0}
                    maxPixelCount={520 * 360}
                    minPixelRatio={1}
                    webGlContextAttributes={{ powerPreference: 'high-performance', antialias: false }}
                    colors={cfg.colors}
                  />
                </div>

                <div className="relative z-10 p-8 rounded-3xl h-full flex flex-col bg-black/82 border border-white/15 transition-transform duration-300 group-hover:-translate-y-1">
                  <Icon className="w-10 h-10 text-white mb-6" strokeWidth={1.5} aria-hidden="true" />

                  <h3 className="text-xl font-semibold tracking-tight mb-3 text-white">
                    {title}
                  </h3>

                  <p className="text-[15px] leading-relaxed text-white/85 flex-grow">
                    {description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
