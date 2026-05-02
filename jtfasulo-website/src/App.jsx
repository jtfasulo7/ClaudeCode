import { Routes, Route } from 'react-router-dom'
import './index.css'
import Header from './components/Header'
import LeadMagnet from './components/LeadMagnet'
import Footer from './components/Footer'
import PrivacyPolicy from './components/PrivacyPolicy'
import Splash from './components/Splash'

function Home() {
  return (
    <div className="bg-background text-white min-h-screen">
      <Header />
      <main>
        <LeadMagnet />
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
