import { Routes, Route } from 'react-router-dom'
import './index.css'
import Header from './components/Header'
import Footer from './components/Footer'
import PrivacyPolicy from './components/PrivacyPolicy'
import PdfDownload from './components/PdfDownload'
import PdfShowcase from './components/PdfShowcase'
import Splash from './components/Splash'
import LiquidMetalHero from './components/ui/LiquidMetalHero'
import FeatureShaderCards from './components/ui/FeatureShaderCards'
import HologramScroll from './components/ui/HologramScroll'
import PerspectiveMarquee from './components/ui/PerspectiveMarquee'

const STRIPE_URL = 'https://buy.stripe.com/28E5kw2tXbZA7LBbqC8Zq03'

function Home() {
  const openStripe = () => {
    window.open(STRIPE_URL, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="bg-background text-white min-h-screen">
      <Header />
      <main>
        <LiquidMetalHero
          title="Craft $10k Websites Without Coding"
          subtitle="Learn the exact system I use to build premium, high converting sites."
          subSubtitle="Built for beginners. No coding. No guessing."
          primaryCtaLabel="Get your guide"
          onPrimaryCtaClick={openStripe}
          features={['Scroll to learn more']}
        />
        <PdfShowcase />
        <FeatureShaderCards />
        <HologramScroll />
        <PerspectiveMarquee />
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
