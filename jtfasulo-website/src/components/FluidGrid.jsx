import { useRef, useEffect } from 'react'

const GRID = 70
const WAVE_SPEED = 2.8
const WAVE_DECAY = 0.976
const PRESENCE_RADIUS = 35
const PRESENCE_STRENGTH = 14
const WAVE_AMPLITUDE = 38
const WAVE_SIGMA = 1400

export default function FluidGrid() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    let ripples = []
    let mouseX = -9999
    let mouseY = -9999
    let lastX = -9999
    let lastY = -9999
    let animFrame = null

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    const onMouseMove = (e) => {
      const rect = canvas.parentElement.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      if (x < 0 || x > rect.width || y < 0 || y > rect.height) {
        mouseX = -9999
        mouseY = -9999
        lastX = -9999
        lastY = -9999
        return
      }

      const vx = x - lastX
      const vy = y - lastY
      const speed = Math.sqrt(vx * vx + vy * vy)

      if (speed > 1.5 && lastX > -1000) {
        ripples.push({
          x,
          y,
          radius: 0,
          intensity: Math.min(0.5 + speed * 0.045, 2.0),
          maxRadius: 2000,
        })
        if (ripples.length > 18) ripples.shift()
      }

      mouseX = x
      mouseY = y
      lastX = x
      lastY = y
    }

    const onMouseLeave = () => {
      mouseX = -9999
      mouseY = -9999
      lastX = -9999
      lastY = -9999
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseleave', onMouseLeave)

    const getDisplacement = (bx, by) => {
      let dx = 0
      let dy = 0

      // Expanding wave pressure from each ripple
      for (const r of ripples) {
        const ddx = bx - r.x
        const ddy = by - r.y
        const dist = Math.sqrt(ddx * ddx + ddy * ddy) || 0.001
        const diff = dist - r.radius
        // Gaussian bell centered on wavefront — positive outward push
        const bell = Math.exp(-(diff * diff) / WAVE_SIGMA) * r.intensity
        dx += (ddx / dist) * bell * WAVE_AMPLITUDE
        dy += (ddy / dist) * bell * WAVE_AMPLITUDE
      }

      // Continuous presence — grid parts around cursor like a finger through water
      if (mouseX > -1000) {
        const ddx = bx - mouseX
        const ddy = by - mouseY
        const dist = Math.sqrt(ddx * ddx + ddy * ddy) || 0.001
        const pressure = Math.max(0, 1 - dist / PRESENCE_RADIUS)
        const push = pressure * pressure * pressure * PRESENCE_STRENGTH
        dx += (ddx / dist) * push
        dy += (ddy / dist) * push
      }

      return { dx, dy }
    }

    const draw = () => {
      const { width, height } = canvas
      ctx.clearRect(0, 0, width, height)

      // Advance and decay ripples
      ripples.forEach((r) => {
        r.radius += WAVE_SPEED
        r.intensity *= WAVE_DECAY
      })
      ripples = ripples.filter((r) => r.intensity > 0.008 && r.radius < r.maxRadius)

      const cols = Math.ceil(width / GRID) + 3
      const rows = Math.ceil(height / GRID) + 3

      // Vertical grid lines with fluid displacement
      ctx.strokeStyle = 'rgba(6,182,212,0.1)'
      ctx.lineWidth = 1
      for (let i = -1; i < cols; i++) {
        ctx.beginPath()
        for (let j = -1; j <= rows; j++) {
          const bx = i * GRID
          const by = j * GRID
          const { dx, dy } = getDisplacement(bx, by)
          if (j === -1) ctx.moveTo(bx + dx, by + dy)
          else ctx.lineTo(bx + dx, by + dy)
        }
        ctx.stroke()
      }

      // Horizontal grid lines with fluid displacement
      for (let j = -1; j < rows; j++) {
        ctx.beginPath()
        for (let i = -1; i <= cols; i++) {
          const bx = i * GRID
          const by = j * GRID
          const { dx, dy } = getDisplacement(bx, by)
          if (i === -1) ctx.moveTo(bx + dx, by + dy)
          else ctx.lineTo(bx + dx, by + dy)
        }
        ctx.stroke()
      }

      // Cursor glow — brighten the grid where the mouse is
      if (mouseX > -1000) {
        const grd = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 120)
        grd.addColorStop(0, 'rgba(6,182,212,0.14)')
        grd.addColorStop(0.35, 'rgba(6,182,212,0.06)')
        grd.addColorStop(1, 'rgba(6,182,212,0)')
        ctx.fillStyle = grd
        ctx.fillRect(0, 0, width, height)
      }

      animFrame = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animFrame)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseleave', onMouseLeave)
      ro.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ width: '100%', height: '100%' }}
    />
  )
}
