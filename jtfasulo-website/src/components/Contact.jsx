import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Send, Mail, MapPin, Clock, CheckCircle2, AlertCircle } from 'lucide-react'

const services = [
  'Campaign Creatives Made with AI',
  'Social Media Strategy',
  'Content Optimization',
  'Strategy Consulting',
  'Other / Not Sure Yet',
]

const budgets = [
  'Under $2,500',
  '$2,500 – $5,000',
  '$5,000 – $15,000',
  '$15,000+',
  'Let\'s discuss',
]

const ContactInfo = ({ icon, label, value }) => (
  <div className="flex items-start gap-4">
    <div className="w-10 h-10 border border-border flex items-center justify-center text-accent flex-shrink-0">
      {icon}
    </div>
    <div>
      <div className="text-[10px] tracking-[0.25em] uppercase text-text-dim mb-0.5">{label}</div>
      <div className="text-white text-sm">{value}</div>
    </div>
  </div>
)

export default function Contact() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    service: '',
    budget: '',
    message: '',
  })
  const [status, setStatus] = useState(null) // null | 'success' | 'error'
  const [loading, setLoading] = useState(false)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  const handleChange = (e) => {
    setFormState((s) => ({ ...s, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const subject = encodeURIComponent(`New Project Inquiry from ${formState.name}`)
    const body = encodeURIComponent(
      `Name: ${formState.name}\nEmail: ${formState.email}\nService: ${formState.service}\nBudget: ${formState.budget}\n\nMessage:\n${formState.message}`
    )
    window.location.href = `mailto:jtfasulo7@gmail.com?subject=${subject}&body=${body}`
    setStatus('success')
    setFormState({ name: '', email: '', service: '', budget: '', message: '' })
  }

  return (
    <section id="contact" className="relative py-32 lg:py-40 bg-surface/20 overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-border" />
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-accent/[0.04] rounded-full blur-3xl -translate-y-1/2" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div ref={ref} className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 mb-5"
          >
            <span className="section-label">Contact</span>
            <div className="h-px w-12 bg-accent/40" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-[clamp(2rem,5vw,4rem)] font-black leading-tight tracking-tight text-white"
          >
            Let's Build<br />
            <span className="text-gradient">Something Great</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Left: form */}
          <motion.div
            initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
            animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="lg:col-span-3"
          >
            {status === 'success' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="border border-accent/30 bg-accent/5 p-10 text-center"
              >
                <CheckCircle2 size={40} className="text-accent mx-auto mb-4" />
                <h3 className="text-white text-xl font-bold mb-2">Message Sent!</h3>
                <p className="text-text-muted text-sm leading-relaxed mb-6">
                  Thanks for reaching out. I'll review your project details and get back to you within 24 hours.
                </p>
                <button
                  onClick={() => setStatus(null)}
                  className="text-accent text-xs tracking-[0.2em] uppercase font-semibold hover:text-white transition-colors"
                >
                  Send Another Message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name + Email row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] tracking-[0.2em] uppercase text-text-dim mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formState.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-[0.2em] uppercase text-text-dim mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formState.email}
                      onChange={handleChange}
                      placeholder="you@company.com"
                      className="form-input"
                    />
                  </div>
                </div>

                {/* Service */}
                <div>
                  <label className="block text-[10px] tracking-[0.2em] uppercase text-text-dim mb-2">
                    Service Needed *
                  </label>
                  <select
                    name="service"
                    required
                    value={formState.service}
                    onChange={handleChange}
                    className="form-input appearance-none"
                  >
                    <option value="" disabled>Select a service...</option>
                    {services.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* Budget */}
                <div>
                  <label className="block text-[10px] tracking-[0.2em] uppercase text-text-dim mb-2">
                    Project Budget
                  </label>
                  <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-2">
                    {budgets.map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setFormState((s) => ({ ...s, budget: b }))}
                        className={`py-2.5 px-3 text-xs border text-left transition-all duration-200 ${
                          formState.budget === b
                            ? 'border-accent bg-accent/10 text-accent'
                            : 'border-border text-text-muted hover:border-accent/40 hover:text-white'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-[10px] tracking-[0.2em] uppercase text-text-dim mb-2">
                    Project Details *
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    value={formState.message}
                    onChange={handleChange}
                    placeholder="Tell me about your brand, goals, and what you're looking to achieve..."
                    className="form-input resize-none"
                  />
                </div>

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className={`btn-primary w-full justify-center text-sm ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send size={15} className="relative z-10" />
                    </>
                  )}
                </motion.button>

                <p className="text-text-dim text-xs text-center">
                  Typically respond within 24 hours. All inquiries are confidential.
                </p>
              </form>
            )}
          </motion.div>

          {/* Right: info */}
          <motion.div
            initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
            animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
            className="lg:col-span-2 flex flex-col gap-8"
          >
            {/* Contact details */}
            <div className="space-y-6">
              <ContactInfo
                icon={<Mail size={16} />}
                label="Email"
                value="jtfasulo7@gmail.com"
              />
              <ContactInfo
                icon={<MapPin size={16} />}
                label="Location"
                value="Remote — Serving clients worldwide"
              />
              <ContactInfo
                icon={<Clock size={16} />}
                label="Response Time"
                value="Within 24 hours on business days"
              />
            </div>

            {/* Divider */}
            <div className="divider" />

            {/* What to expect */}
            <div>
              <div className="text-xs tracking-[0.25em] uppercase text-text-dim mb-5">What Happens Next</div>
              <ol className="space-y-4">
                {[
                  'I review your project details carefully',
                  'We schedule a 30-min discovery call',
                  'I send you a tailored proposal within 48 hrs',
                  'We kick off within days of agreement',
                ].map((step, i) => (
                  <li key={step} className="flex items-start gap-3">
                    <span className="text-accent font-mono text-xs mt-0.5 flex-shrink-0">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="text-text-muted text-sm">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Divider */}
            <div className="divider" />

            {/* Availability note */}
            <div className="border border-accent/20 bg-accent/5 p-5">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-white text-sm font-semibold">Currently Accepting Projects</span>
              </div>
              <p className="text-text-muted text-xs leading-relaxed">
                I take on a limited number of new clients each quarter to ensure exceptional quality and attention. Reach out early to secure your spot.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
