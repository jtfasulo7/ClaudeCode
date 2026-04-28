import { Routes, Route } from 'react-router-dom'
import './index.css'
import Header from './components/Header'
import LeadMagnet from './components/LeadMagnet'
import Footer from './components/Footer'

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
      <Route path="/" element={<Home />} />
      <Route path="*" element={<Home />} />
    </Routes>
  )
}

export default App
