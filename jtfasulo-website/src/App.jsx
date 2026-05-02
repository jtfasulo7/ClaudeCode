import { Routes, Route } from 'react-router-dom'
import './index.css'
import Header from './components/Header'
import Footer from './components/Footer'
import PrivacyPolicy from './components/PrivacyPolicy'
import Splash from './components/Splash'
import LiquidMetalHero from './components/ui/LiquidMetalHero'
import FeatureShaderCards from './components/ui/FeatureShaderCards'

function Home() {
  const scrollToContact = () => {
    const el = document.getElementById('contact')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="bg-background text-white min-h-screen">
      <Header />
      <main>
        <LiquidMetalHero
          badge="✦  Now accepting students"
          title="Premium websites, designed by you."
          subtitle="Private mentorship from JT Fasulo. I'll teach you how to think about design, build, and ship websites that look like they belong on Apple's homepage — not a template marketplace."
          primaryCtaLabel="Get in touch"
          secondaryCtaLabel="See my work"
          onPrimaryCtaClick={scrollToContact}
          onSecondaryCtaClick={() => window.open('https://sybago.ai', '_blank', 'noopener')}
          features={[
            '1-on-1 weekly sessions',
            'Real client projects',
            'Direct portfolio review',
          ]}
        />
        <FeatureShaderCards />
      </main>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <Routes>
      {/* Splash page — visitors land here and pick their path */}
      <Route path="/" element={<Splash />} />
      {/* Existing site content moved to /home so the splash can route to it */}
      <Route path="/home" element={<Home />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      {/* Anything else falls through to the splash so the entry decision is preserved */}
      <Route path="*" element={<Splash />} />
    </Routes>
  )
}

export default App
