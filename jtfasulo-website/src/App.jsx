import { Routes, Route } from 'react-router-dom'
import './index.css'
import Header from './components/Header'
import Footer from './components/Footer'
import PrivacyPolicy from './components/PrivacyPolicy'
import PdfDownload from './components/PdfDownload'
import Splash from './components/Splash'
import LiquidMetalHero from './components/ui/LiquidMetalHero'
import FeatureShaderCards from './components/ui/FeatureShaderCards'
import HologramScroll from './components/ui/HologramScroll'
import PerspectiveMarquee from './components/ui/PerspectiveMarquee'
import BookCallCTA from './components/ui/BookCallCTA'

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
          title="Craft $10k Websites Without Coding"
          subtitle="Learn the exact system I use to build premium, high converting sites."
          subSubtitle="Built for beginners. No coding. No guessing."
          primaryCtaLabel="Get in touch"
          onPrimaryCtaClick={scrollToContact}
          features={[
            'Free discovery call',
            'Curated onboarding call',
            'Your own workbook',
          ]}
        />
        <FeatureShaderCards />
        <HologramScroll />
        <PerspectiveMarquee />
        <BookCallCTA />
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
      {/* Post-payment download landing — GHL/Stripe redirects here */}
      <Route path="/pdf-download" element={<PdfDownload />} />
      {/* Anything else falls through to the splash so the entry decision is preserved */}
      <Route path="*" element={<Splash />} />
    </Routes>
  )
}

export default App
