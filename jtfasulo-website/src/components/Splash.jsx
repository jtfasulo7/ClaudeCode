import { useNavigate } from 'react-router-dom'
import { HoverButton } from './ui/HoverButton'

export default function Splash() {
  const navigate = useNavigate()

  return (
    <div className="relative min-h-screen w-full bg-background text-white overflow-hidden flex items-center justify-center px-6 py-16">
      {/* Atmospheric backdrop — soft radial spotlights */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(80vmin 60vmin at 22% 18%, rgba(47,103,121,0.22), transparent 60%),' +
            'radial-gradient(70vmin 55vmin at 82% 78%, rgba(58,91,191,0.18), transparent 60%),' +
            'radial-gradient(120vmin 80vmin at 50% 120%, rgba(160,217,248,0.08), transparent 70%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />

      <div className="relative z-10 max-w-3xl w-full text-center">
        <p className="text-[11px] md:text-xs tracking-[0.42em] uppercase text-white/55 mb-6">
          Welcome
        </p>
        <h1 className="font-display font-light text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight leading-[1.05]">
          Which path are you on?
        </h1>
        <p className="mt-5 text-base md:text-lg text-white/65 max-w-xl mx-auto">
          Two ways forward. Pick the one that fits where you&rsquo;re trying to go.
        </p>

        <div className="mt-12 md:mt-14 grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 max-w-2xl mx-auto">
          <HoverButton
            onClick={() => {
              window.location.href = 'https://sybago.ai'
            }}
            className="!py-7 !px-7 text-left text-[15px] md:text-base leading-snug"
          >
            <span className="block text-[10px] tracking-[0.32em] uppercase text-white/55 mb-2">
              For your business
            </span>
            <span className="block">
              I&rsquo;m looking to have a professional website built for my business.
            </span>
            <span className="mt-3 inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-white/70">
              Continue to Sybago
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </span>
          </HoverButton>

          <HoverButton
            onClick={() => navigate('/home')}
            className="!py-7 !px-7 text-left text-[15px] md:text-base leading-snug"
          >
            <span className="block text-[10px] tracking-[0.32em] uppercase text-white/55 mb-2">
              For yourself
            </span>
            <span className="block">
              I want to learn how to build professional websites myself.
            </span>
            <span className="mt-3 inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-white/70">
              Enter the site
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </span>
          </HoverButton>
        </div>

        <p className="mt-12 text-[11px] tracking-[0.28em] uppercase text-white/35">
          JT Fasulo
        </p>
      </div>
    </div>
  )
}
