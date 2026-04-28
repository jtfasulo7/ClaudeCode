import { useRef, useEffect } from 'react'

const GRID = 70
const WAVE_SPEED = 2.8
const WAVE_DECAY = 0.976
const PRESENCE_RADIUS = 35
const PRESENCE_STRENGTH = 14
const WAVE_AMPLITUDE = 38
const WAVE_SIGMA = 1400
const DRIFT_X = 0.28
const DRIFT_Y = 0.18

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
    let driftT = 0

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    const getRect = () => canvas.parentElement.getBoundingClientRect()

    // Shared logic for both mouse and touch
    const handlePoint = (clientX, clientY) => {
      const rect = getRect()
      const x = clientX - rect.left
      const y = clientY - rect.top

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

    const clearPoint = () => {
      mouseX = -9999
      mouseY = -9999
      lastX = -9999
      lastY = -9999
    }

    // Mouse
    const onMouseMove = (e) => handlePoint(e.clientX, e.clientY)
    const onMouseLeave = () => clearPoint()

    // Touch — translate first touch into the same ripple logic
    const onTouchMove = (e) => {
      const touch = e.touches[0]
      if (touch) handlePoint(touch.clientX, touch.clientY)
    }
    const onTouchEnd = () => clearPoint()

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseleave', onMouseLeave)
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('touchend', onTouchEnd)

    const getDisplacement = (bx, by) => {
      let dx = 0
      let dy = 0

      for (const r of ripples) {
        const ddx = bx - r.x
        const ddy = by - r.y
        const dist = Math.sqrt(ddx * ddx + ddy * ddy) || 0.001
        const diff = dist - r.radius
        const bell = Math.exp(-(diff * diff) / WAVE_SIGMA) * r.intensity
        dx += (ddx / dist) * bell * WAVE_AMPLITUDE
        dy += (ddy / dist) * bell * WAVE_AMPLITUDE
      }

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

      ripples.forEach((r) => {
        r.radius += WAVE_SPEED
        r.intensity *= WAVE_DECAY
      })
      ripples = ripples.filter((r) => r.intensity > 0.008 && r.radius < r.maxRadius)

      driftT++
      const offsetX = (driftT * DRIFT_X) % GRID
      const offsetY = (driftT * DRIFT_Y) % GRID

      const cols = Math.ceil(width / GRID) + 3
      const rows = Math.ceil(height / GRID) + 3

      ctx.strokeStyle = 'rgba(47, 103, 121,0.1)'
      ctx.lineWidth = 1

      for (let i = -2; i < cols; i++) {
        ctx.beginPath()
        for (let j = -2; j <= rows; j++) {
          const bx = i * GRID + offsetX
          const by = j * GRID + offsetY
          const { dx, dy } = getDisplacement(bx, by)
          if (j === -2) ctx.moveTo(bx + dx, by + dy)
          else ctx.lineTo(bx + dx, by + dy)
        }
        ctx.stroke()
      }

      for (let j = -2; j < rows; j++) {
        ctx.beginPath()
        for (let i = -2; i <= cols; i++) {
          const bx = i * GRID + offsetX
          const by = j * GRID + offsetY
          const { dx, dy } = getDisplacement(bx, by)
          if (i === -2) ctx.moveTo(bx + dx, by + dy)
          else ctx.lineTo(bx + dx, by + dy)
        }
        ctx.stroke()
      }

      if (mouseX > -1000) {
        const grd = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 120)
        grd.addColorStop(0, 'rgba(47, 103, 121,0.14)')
        grd.addColorStop(0.35, 'rgba(47, 103, 121,0.06)')
        grd.addColorStop(1, 'rgba(47, 103, 121,0)')
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
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
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
