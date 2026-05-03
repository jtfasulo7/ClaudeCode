/* Perspective marquee — single sentence scrolling across a 3D-tilted plane.
   Vanilla rebuild of the 21st.dev Remotion component. The original used
   Remotion's useCurrentFrame() to drive a JS-computed translateX every
   render — which is exactly the JS-RAF main-thread cost the
   animation-performance skill warns against.

   This version uses a CSS @keyframes animation on transform, so the marquee
   runs entirely on the GPU compositor with zero main-thread cost. The track
   is triple-buffered (3 copies of the sentence) and animates by exactly
   one-third of its own width — that wraps onto a visually identical position
   every cycle, no popping. */

const SENTENCE = 'All possible without learning how to code'

export default function PerspectiveMarquee() {
  // Render the same span three times so translateX(-33.3333%) wraps back
  // onto an identical pattern. Bullet separator gives visual rhythm.
  const text = (
    <span className="pm-line">
      {SENTENCE}
      <span className="pm-sep" aria-hidden="true">  ·  </span>
    </span>
  )

  return (
    <section
      aria-label={SENTENCE}
      // Mobile: pull the marquee up by a viewport-height to overlay the
      // hologram's post-sticky tail. Without this, the released sticky
      // child of HologramScroll scrolls a full 100vh up before the marquee
      // enters — that gap reads as dead black space. Desktop (md+) renders
      // normally with no overlap.
      className="pm-stage relative bg-black text-white overflow-hidden -mt-[100vh] md:mt-0"
    >
      <div className="pm-deck">
        <div className="pm-track">
          {text}
          {text}
          {text}
        </div>
      </div>

      {/* Edge fades — horizontal (cuts off scrolling text at viewport edges)
          and vertical (softens top/bottom into the section bg). Pure
          gradient overlays, free per frame. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(90deg, #000 0%, transparent 14%, transparent 86%, #000 100%)',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(180deg, #000 0%, transparent 28%, transparent 72%, #000 100%)',
        }}
      />
    </section>
  )
}
