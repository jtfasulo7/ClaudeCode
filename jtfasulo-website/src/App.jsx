import { Routes, Route } from 'react-router-dom'
import './index.css'
import Header from './components/Header'
import Hero from './components/Hero'
import Services from './components/Services'
import Portfolio from './components/Portfolio'
import Process from './components/Process'
import About from './components/About'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Newsletter from './components/Newsletter'

function Home() {
  return (
    <div className="bg-background text-white min-h-screen">
      <Header />
      <main>
        <Hero />
        <Services />
        <Portfolio />
        <Process />
        <About />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/newsletter" element={<Newsletter />} />
    </Routes>
  )
}

export default App
