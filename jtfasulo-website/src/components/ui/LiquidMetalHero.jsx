import { LiquidMetal } from '@paper-design/shaders-react'
import { motion } from 'framer-motion'
import { Button } from './button'
import { Badge } from './badge'
import { Card } from './card'

/* ----------------------------------------------------------------------------
   Fluid parameters
   --------------------------------------------------------------------------
   shape: 'metaballs'  → multiple blobs that organically separate + coalesce.
                         The other shapes (none/circle/diamond/daisy) all look
                         like a fixed silhouette.
   distortion (0.85)   → noise-warps the blob field, producing the chaotic
                         "pulled taffy" curl that reads as fluid mechanics.
   softness   (0.92)   → smooths the blob boundaries so merge/split events
                         look like surface tension instead of pop-in.
   contour    (0.70)   → strong rim so the metallic edge stays visible while
                         everything else churns.
   speed      (1.6)    → fast enough that motion is obvious without being
                         frantic.
   repetition (5)      → multiple internal stripes per blob → liquid-chrome
                         shimmer.
   shiftRed/Blue       → chromatic aberration → iridescent fringe.
   ------------------------------------------------------------------------ */
const baseShader = {
  shape:      'metaballs',
  speed:       0.85,
  scale:       0.78,        // slightly larger blobs → fewer in view
  distortion:  0.32,        // calmer curl — was 0.55
  softness:    0.96,
  contour:     0.6,
  repetition:  1.8,         // way fewer internal stripes — was 3
  shiftRed:    0.14,
  shiftBlue:  -0.14,
  angle:       42,
  colorBack:  '#000000',
  colorTint:  '#ffffff',
  frame:       0,
}

const accentShader = {
  ...baseShader,
  speed:       1.05,        // was 1.25
  scale:       0.55,
  distortion:  0.38,        // was 0.6
  softness:    0.93,
  contour:     0.45,
  repetition:  1.4,         // was 2
  shiftRed:    0.18,
  shiftBlue:  -0.10,
  angle:      -25,
  colorBack:  '#000000',
  colorTint:  '#cfd6df',
}

const containerVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { delayChildren: 0.2, staggerChildren: 0.15 } },
}

const itemVariants = {
  hidden:  { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
}

const buttonVariants = {
  hidden:  { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
}

export default function LiquidMetalHero({
  badge,
  title,
  subtitle,
  primaryCtaLabel,
  secondaryCtaLabel,
  onPrimaryCtaClick,
  onSecondaryCtaClick,
  features = [],
}) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Two stacked LiquidMetal shaders. The base layer is a slow, large-scale
          metaball field; the accent layer is faster and smaller, blended on
          top with `screen` so highlights add. Two frequencies of motion
          overlapping is what reads as chaotic fluid mechanics — single-layer
          metaballs feel orderly. */}
      <LiquidMetal
        {...baseShader}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0 }}
      />
      <LiquidMetal
        {...accentShader}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
          mixBlendMode: 'screen',
          opacity: 0.42,
        }}
      />

      {/* Depth vignette — dims the fluid where text sits, so the headline
          reads as if it's casting a soft shadow onto the fluid behind it.
          This is the trick that gives the section a 3D layered feel. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.55) 28%, rgba(0,0,0,0.22) 60%, rgba(0,0,0,0) 82%)',
        }}
      />

      <div className="container mx-auto px-6 lg:px-8 max-w-7xl relative z-10">
        <motion.div
          className="text-center space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {badge && (
            <motion.div className="flex justify-center" variants={itemVariants}>
              <Badge
                variant="secondary"
                className="bg-foreground/10 text-foreground border-foreground/20 hover:bg-foreground/20 transition-colors duration-300 backdrop-blur-sm"
              >
                {badge}
              </Badge>
            </motion.div>
          )}

          <motion.div className="space-y-6" variants={itemVariants}>
            <motion.h1
              role="heading"
              aria-level={1}
              className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[1.05] tracking-tight"
              variants={itemVariants}
              style={{
                // High-contrast chrome gradient — bright white top, deeper
                // steel bottom — so the type itself looks like polished metal.
                background:
                  'linear-gradient(180deg, #ffffff 0%, #f7f8fa 32%, #d6dae0 68%, #9aa3b0 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                WebkitTextFillColor: 'transparent',
                // Four-layer shadow stack (rendered as drop-shadow filters so
                // they follow the glyph contours, not the bounding box):
                //   1) 1px white top-bevel highlight
                //   2) close ground shadow (8/14)
                //   3) long projected shadow (24/52) — main 3D lift
                //   4) wide ambient shadow (0/72) — gives "floating" feel
                filter:
                  'drop-shadow(0 1px 0 rgba(255,255,255,0.25))' +
                  ' drop-shadow(0 8px 14px rgba(0,0,0,0.55))' +
                  ' drop-shadow(0 24px 52px rgba(0,0,0,0.78))' +
                  ' drop-shadow(0 0 72px rgba(0,0,0,0.45))',
              }}
            >
              {title}
            </motion.h1>

            <motion.p
              className="max-w-3xl mx-auto text-xl sm:text-2xl text-white/95 leading-relaxed"
              variants={itemVariants}
              style={{ textShadow: '0 2px 18px rgba(0,0,0,0.85), 0 1px 4px rgba(0,0,0,0.7), 0 0 36px rgba(0,0,0,0.5)' }}
            >
              {subtitle}
            </motion.p>
          </motion.div>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            variants={buttonVariants}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={onPrimaryCtaClick}
                size="lg"
                className="bg-foreground text-background hover:bg-foreground/90 transition-all duration-300 shadow-2xl text-lg px-8 py-6 font-semibold"
              >
                {primaryCtaLabel}
              </Button>
            </motion.div>

            {secondaryCtaLabel && onSecondaryCtaClick && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={onSecondaryCtaClick}
                  variant="outline"
                  size="lg"
                  className="border-foreground/30 text-foreground hover:bg-foreground/10 hover:border-foreground/50 transition-all duration-300 backdrop-blur-sm text-lg px-8 py-6 font-semibold"
                >
                  {secondaryCtaLabel}
                </Button>
              </motion.div>
            )}
          </motion.div>

          {features.length > 0 && (
            <motion.div className="pt-12" variants={itemVariants}>
              <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.3 }}>
                <Card className="bg-foreground/10 border-foreground/20 backdrop-blur-md shadow-2xl">
                  <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {features.map((feature, index) => (
                        <motion.div
                          key={index}
                          className="flex items-center justify-center text-center"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                        >
                          <p className="text-foreground/90 font-medium text-lg">{feature}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
