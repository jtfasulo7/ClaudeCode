---
name: animation-performance
description: Apply when building scroll-scrubbed animations, marquees, continuous SVG/canvas animations, or fixing reports of "laggy", "stuttering", "doesn't render", "disappears and reappears", "jumps". Encodes the perf rules learned from the realtor-website rebuild.
---

# Animation Performance

This skill encodes hard-won perf defaults for browser animations. Reach for it
whenever you build:

- a scroll-scrubbed video / image-frame canvas
- a vertical or horizontal marquee
- continuous SVG path / line / curve animations
- any "always running" CSS or JS animation

Or whenever the user reports lag, stutter, popping, drift, or "doesn't render."

---

## Decision tree

**Q: Animating SVG `stroke-dashoffset` / `stroke-dasharray` on more than ~10
paths simultaneously?**
→ Render to canvas instead. SVG dash animation does NOT GPU-accelerate in any
major engine; each animated path costs a main-thread raster every frame.

**Q: Animating `transform` continuously on the same element forever (marquee,
ticker, infinite scroll)?**
→ Use a CSS `@keyframes` animation, not a JS RAF loop. CSS keyframes on
`transform` run on the compositor thread with zero main-thread work.

**Q: Need a CSS animation to use a value JS measures (e.g. `scrollHeight / 3`)?**
→ Pause the animation in CSS until JS sets the var. Otherwise the first beat
runs against the fallback and the animation visibly drifts when the var
updates mid-flight.

**Q: Need to fade the top/bottom of a continuously-transforming list?**
→ Use gradient-overlay pseudo-elements, NOT `mask-image`. Mask forces a
compositing pass per frame on most GPUs.

**Q: Animation looks fine on your desktop but stutters on the user's machine?**
→ It's almost always one of: (a) SVG path animations exceeding budget,
(b) box-shadow on transforming elements, (c) backdrop-filter on transforming
elements. Remove or replace each.

---

## Patterns

### 1. Canvas-rendered flowing paths (replaces animated SVG)

When you have many bezier paths animating their dash offsets:

```html
<canvas class="paths-canvas" aria-hidden="true"></canvas>
```

```js
const canvas = document.querySelector('.paths-canvas');
const ctx = canvas.getContext('2d');
const dpr = Math.min(window.devicePixelRatio || 1, 2);
const VB_W = 696, VB_H = 316;          // your design viewBox

const paths = [];
function buildPaths() {
  // populate `paths` with control points + per-path { width, alpha, dashLen,
  // gapLen, speed (px/s), phase (initial offset), oPhase (opacity wave) }
}

let cssW = 0, cssH = 0;
function resize() {
  const r = canvas.parentElement.getBoundingClientRect();
  cssW = r.width;  cssH = r.height;
  canvas.width  = Math.floor(cssW * dpr);
  canvas.height = Math.floor(cssH * dpr);
  canvas.style.width  = cssW + 'px';
  canvas.style.height = cssH + 'px';
}

let last = performance.now(), running = false, raf = 0;
function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  const sx = cssW / VB_W, sy = cssH / VB_H;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, cssW, cssH);
  ctx.lineCap = 'round';

  for (const p of paths) {
    p.phase += p.speed * dt;
    ctx.beginPath();
    ctx.moveTo(p.x0 * sx, p.y0 * sy);
    ctx.bezierCurveTo(/* ...control points scaled by sx/sy */);
    const pulse = 0.55 + 0.45 * Math.sin(p.oPhase + now * p.oFreq);
    ctx.strokeStyle = `rgba(255,255,255,${(p.baseA * pulse).toFixed(3)})`;
    ctx.lineWidth = p.width;
    ctx.setLineDash([p.dashLen, p.gapLen]);
    ctx.lineDashOffset = -p.phase;
    ctx.stroke();
  }
  raf = requestAnimationFrame(frame);
}

// IntersectionObserver gate — stop RAF when offscreen
const io = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    if (!running) { running = true; last = performance.now(); raf = requestAnimationFrame(frame); }
  } else {
    if (running) { running = false; cancelAnimationFrame(raf); }
  }
}, { threshold: 0 });
io.observe(canvas.parentElement);

buildPaths();
resize();
window.addEventListener('resize', resize);
```

**Why this beats SVG:** one redraw per frame (~1 ms) regardless of path count
vs 30+ separate path rasters per frame.

### 2. Compositor-thread marquee with measure-then-unpause

When you have a continuously scrolling list (testimonials, logos, ticker):

```html
<div class="col-track">{cardA}{cardB}{cardC}{cardA}{cardB}{cardC}{cardA}{cardB}{cardC}</div>
```

(Triple-buffer the content. With 2 copies and a `-50%` wrap, variable card
heights cause sub-pixel drift and visible pops. With 3 copies and a wrap at
exactly `scrollHeight / 3`, the wrap is invisible.)

```css
.col-track {
  will-change: transform;
  transform: translate3d(0, 0, 0);
  animation: colScroll var(--col-duration, 30s) linear infinite paused;
}
.col-track.ready { animation-play-state: running; }
@keyframes colScroll {
  from { transform: translate3d(0, 0, 0); }
  to   { transform: translate3d(0, calc(-1 * var(--cycle, 1000px)), 0); }
}
```

```js
function applyAnims() {
  tracks.forEach((t) => {
    const cycle = t.el.scrollHeight / 3;
    if (!cycle) return;                                    // hidden columns
    t.el.style.setProperty('--cycle', cycle + 'px');
    t.el.style.setProperty('--col-duration', t.duration + 's');
    t.el.classList.add('ready');                           // unpause
  });
}

// Wait until web fonts have applied (they change row heights) AND layout has
// painted at least once. Without this, you measure the wrong cycle and the
// keyframe drifts.
function whenReady(cb) {
  const go = () => requestAnimationFrame(() => requestAnimationFrame(cb));
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(go);
  else if (document.readyState === 'complete') go();
  else window.addEventListener('load', go);
}
whenReady(applyAnims);

// Debounced resize (don't toggle `.ready` off — would cause a jump)
let t = 0;
window.addEventListener('resize', () => {
  clearTimeout(t);
  t = setTimeout(applyAnims, 120);
});
```

### 3. Gradient overlays instead of `mask-image`

```css
.fade-stage { position: relative; }
.fade-stage::before,
.fade-stage::after {
  content: ''; position: absolute; left: 0; right: 0; height: 110px;
  pointer-events: none; z-index: 2;
}
.fade-stage::before { top: 0;    background: linear-gradient(to bottom, #000, rgba(0,0,0,0)); }
.fade-stage::after  { bottom: 0; background: linear-gradient(to top,    #000, rgba(0,0,0,0)); }
```

The gradient fades blend to whatever your page background is. They are pure
compositing and cost nothing per frame, unlike `mask-image` which forces a
masking pass for every transform tick of the masked element.

### 4. Scroll-scrubbed frame canvas

When binding a scroll position to a frame index (Apple-style scrubbed video):

```js
const TOTAL = 120;
const images = new Array(TOTAL);

// Preload all frames in parallel; fall back to nearest loaded frame while
// loading, so the user sees something immediately
function preload() { /* fetch each frame_NNN.jpg into images[i-1] */ }

let lastIdx = -1;
function render() {
  const rect  = container.getBoundingClientRect();
  const range = rect.height - window.innerHeight;
  const p     = Math.min(1, Math.max(0, -rect.top / range));
  const idx   = Math.round(p * (TOTAL - 1));
  if (idx === lastIdx) return;            // critical: no redraw if frame unchanged
  lastIdx = idx;
  const img = nearestLoaded(idx);
  if (img) drawCover(img);
}

let ticking = false;
window.addEventListener('scroll', () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => { render(); ticking = false; });
}, { passive: true });
```

The `if (idx === lastIdx) return` is the most important line — without it the
canvas redraws on every scroll event even when the frame hasn't changed.

---

## Anti-patterns to remove on sight

- `box-shadow: 0 18px 40px ...` on cards inside a continuously transforming
  parent → re-rasterized every frame. Replace with `border: 1px solid rgba(255,255,255,0.1)`.
- `backdrop-filter: blur(...)` on cards inside a continuously transforming
  parent → same problem. Replace with a flat `bg-white/[0.04]` or similar.
- `mask-image` on a marquee → see pattern 3.
- `setInterval` for animation → use `requestAnimationFrame` always; sync with
  display refresh and pauses with the tab.
- JS `style.transform` written every frame for an animation that could be a
  CSS keyframe → see pattern 2.

---

## Verifying a fix

Open Chrome DevTools → Performance → record 2s while the animation runs.

- Compositor work should dominate, not main-thread.
- Long Frames warnings should be 0 within the visible section.
- "Layer count" should be small and stable.

If the user is on Windows and reports lag where you don't see any, suspect
hardware acceleration is disabled — `chrome://gpu` will show. The fixes above
help in that case too because they reduce CPU rasterization work, not just
GPU work.
