import * as React from 'react'
import { cn } from '@/lib/utils'

// Port of the 21st.dev hover-button. Tracks the cursor inside the button and
// drops short-lived gradient blur dots that fade in then out.
const HoverButton = React.forwardRef(function HoverButton(
  { className, children, ...props },
  ref
) {
  const innerRef = React.useRef(null)
  const buttonRef = ref || innerRef
  const [isListening, setIsListening] = React.useState(false)
  const [circles, setCircles] = React.useState([])
  const lastAddedRef = React.useRef(0)

  const createCircle = React.useCallback((x, y, btnEl) => {
    const buttonWidth = btnEl?.offsetWidth || 0
    const xPos = buttonWidth ? x / buttonWidth : 0.5
    const color = `linear-gradient(to right, var(--circle-start) ${xPos * 100}%, var(--circle-end) ${
      xPos * 100
    }%)`
    setCircles((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), x, y, color, fadeState: null },
    ])
  }, [])

  const handlePointerMove = React.useCallback(
    (event) => {
      if (!isListening) return
      const now = Date.now()
      if (now - lastAddedRef.current > 100) {
        lastAddedRef.current = now
        const rect = event.currentTarget.getBoundingClientRect()
        createCircle(event.clientX - rect.left, event.clientY - rect.top, event.currentTarget)
      }
    },
    [isListening, createCircle]
  )

  const handlePointerEnter = React.useCallback(() => setIsListening(true), [])
  const handlePointerLeave = React.useCallback(() => setIsListening(false), [])

  React.useEffect(() => {
    circles.forEach((circle) => {
      if (circle.fadeState) return
      const t1 = setTimeout(() => {
        setCircles((prev) =>
          prev.map((c) => (c.id === circle.id ? { ...c, fadeState: 'in' } : c))
        )
      }, 0)
      const t2 = setTimeout(() => {
        setCircles((prev) =>
          prev.map((c) => (c.id === circle.id ? { ...c, fadeState: 'out' } : c))
        )
      }, 1000)
      const t3 = setTimeout(() => {
        setCircles((prev) => prev.filter((c) => c.id !== circle.id))
      }, 2200)
      // Each circle's timers are local to its first scheduling; React re-runs
      // the effect after fadeState updates and the early-return skips re-arming.
      circle._timers = [t1, t2, t3]
    })
  }, [circles])

  return (
    <button
      ref={buttonRef}
      className={cn(
        'relative isolate px-8 py-3 rounded-3xl',
        'text-foreground font-medium text-base leading-6',
        'backdrop-blur-lg bg-[rgba(43,55,80,0.1)]',
        'cursor-pointer overflow-hidden',
        "before:content-[''] before:absolute before:inset-0",
        'before:rounded-[inherit] before:pointer-events-none',
        'before:z-[1]',
        'before:shadow-[inset_0_0_0_1px_rgba(170,202,255,0.2),inset_0_0_16px_0_rgba(170,202,255,0.1),inset_0_-3px_12px_0_rgba(170,202,255,0.15),0_1px_3px_0_rgba(0,0,0,0.50),0_4px_12px_0_rgba(0,0,0,0.45)]',
        'before:mix-blend-multiply before:transition-transform before:duration-300',
        'active:before:scale-[0.975]',
        className
      )}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      style={{
        '--circle-start': 'var(--tw-gradient-from, #a0d9f8)',
        '--circle-end':   'var(--tw-gradient-to,   #3a5bbf)',
      }}
      {...props}
    >
      {circles.map(({ id, x, y, color, fadeState }) => (
        <div
          key={id}
          className={cn(
            'absolute w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full',
            'blur-lg pointer-events-none z-[-1] transition-opacity duration-300',
            fadeState === 'in' && 'opacity-75',
            fadeState === 'out' && 'opacity-0 duration-[1.2s]',
            !fadeState && 'opacity-0'
          )}
          style={{ left: x, top: y, background: color }}
        />
      ))}
      {children}
    </button>
  )
})

HoverButton.displayName = 'HoverButton'

export { HoverButton }
