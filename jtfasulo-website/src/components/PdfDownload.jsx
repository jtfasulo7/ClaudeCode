import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Header from './Header'
import Footer from './Footer'

const PDF_URL      = '/files/build-10k-websites-2exK0lo32l0.pdf'
const PDF_FILENAME = 'Build-10k-Websites-With-Claude-Code.pdf'

export default function PdfDownload() {
  const [autoStarted, setAutoStarted] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
    const link = document.createElement('a')
    link.href = PDF_URL
    link.download = PDF_FILENAME
    link.rel = 'noopener'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    setAutoStarted(true)
  }, [])

  return (
    <div className="bg-background text-white min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-28 pb-24 flex items-center">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl mx-auto px-5 sm:px-6 lg:px-8 text-center"
        >
          <p className="text-[11px] tracking-[0.32em] uppercase text-accent font-semibold mb-6">
            Order Confirmed
          </p>

          <h1 className="text-4xl sm:text-5xl font-black leading-[1.05] tracking-tight mb-5">
            Thanks for your purchase.
            <br />
            Your download is starting.
          </h1>

          <p className="text-text-muted text-base sm:text-lg leading-relaxed mb-10 max-w-xl mx-auto">
            {autoStarted
              ? 'If the download didn’t start, your browser may have blocked it. Click the button below.'
              : 'Preparing your file…'}
          </p>

          <a
            href={PDF_URL}
            download={PDF_FILENAME}
            className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-md font-bold uppercase tracking-[0.18em] text-sm hover:bg-white/90 transition-colors"
          >
            Download the PDF
            <span aria-hidden="true">&rarr;</span>
          </a>

          <p className="mt-12 text-text-muted/70 text-xs">
            Trouble?{' '}
            <a
              href="mailto:newsletter@jtfasulo.com?subject=PDF%20download%20issue"
              className="underline underline-offset-2"
            >
              Email me
            </a>
            {' '}and I&rsquo;ll send it directly.
          </p>
        </motion.section>
      </main>
      <Footer />
    </div>
  )
}
