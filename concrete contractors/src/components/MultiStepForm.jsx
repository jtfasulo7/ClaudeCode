import { useState } from 'react'
import { config } from '../client.config.js'
import { submitLead } from '../lead.js'

// One question per screen. Steps 1–4 are the form (progress "N of 4");
// Step 5 is the booking flip. All state lives in React — no storage.

const PROJECT_OPTIONS = [
  { id: 'driveway', label: 'Driveway', icon: DrivewayIcon },
  { id: 'patio', label: 'Patio', icon: PatioIcon },
  { id: 'stamped', label: 'Stamped or decorative', icon: StampedIcon },
  { id: 'walkway', label: 'Walkway or steps', icon: StepsIcon },
  { id: 'other', label: 'Something else', icon: OtherIcon },
]

const TIMELINE_OPTIONS = [
  { id: 'asap', label: 'ASAP' },
  { id: 'soon', label: 'Next month or two' },
  { id: 'season', label: 'This season' },
  { id: 'planning', label: 'Just planning ahead' },
]

const TOTAL_QUESTION_STEPS = 4

export default function MultiStepForm() {
  const [step, setStep] = useState(1)
  const [dir, setDir] = useState('fwd')          // 'fwd' | 'back' — drives the flip direction
  const [answers, setAnswers] = useState({
    projectType: '', timeline: '', location: '', name: '', phone: '', consent: false,
  })
  const [submitting, setSubmitting] = useState(false)
  const [calLoaded, setCalLoaded] = useState(false)

  const set = (patch) => setAnswers((a) => ({ ...a, ...patch }))
  const go = (next) => { setDir(next > step ? 'fwd' : 'back'); setStep(next) }

  // Steps 1 & 2: tap a tile → record answer → auto-advance.
  const pick = (field, value, nextStep) => { set({ [field]: value }); go(nextStep) }

  // ── Step 4 submit: fire the lead FIRST, THEN flip to the calendar. ─────────
  async function handleSubmit(e) {
    e.preventDefault()
    if (!(answers.name.trim() && answers.phone.trim() && answers.consent)) return
    setSubmitting(true)

    const payload = {
      projectType: answers.projectType,
      timeline: answers.timeline,
      location: answers.location.trim(),
      name: answers.name.trim(),
      phone: answers.phone.trim(),
      consent: answers.consent,
      submittedAt: new Date().toISOString(),
      businessName: config.businessName,
      source: 'concrete-lp',
    }

    // Capture the lead before the booking flip. Never let a POST failure trap
    // the visitor — advance in `finally` regardless of the result.
    try {
      await submitLead(payload)
    } catch (err) {
      console.error('[form] lead submit threw (advancing anyway):', err)
    } finally {
      setSubmitting(false)
      go(5)
    }
  }

  const labelFor = (opts, id) => (opts.find((o) => o.id === id)?.label) || ''

  return (
    <div className="form-card" aria-live="polite">
      {/* Progress + back (form steps only) */}
      {step <= TOTAL_QUESTION_STEPS && (
        <div className="form-top">
          {step > 1 ? (
            <button type="button" className="back-btn" onClick={() => go(step - 1)}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
              Back
            </button>
          ) : <span />}
          <span className="progress-label">Step {step} of {TOTAL_QUESTION_STEPS}</span>
        </div>
      )}
      {step <= TOTAL_QUESTION_STEPS && (
        <div className="progress-track" aria-hidden="true">
          <div className="progress-fill" style={{ width: `${(step / TOTAL_QUESTION_STEPS) * 100}%` }} />
        </div>
      )}

      {/* Animated step panel — keyed by step so the flip replays on change */}
      <div className={`panel panel-${dir}`} key={step}>

        {step === 1 && (
          <fieldset className="step">
            <legend className="step-q">What&rsquo;s your project?</legend>
            <div className="tiles">
              {PROJECT_OPTIONS.map((o) => (
                <button
                  type="button"
                  key={o.id}
                  className={`tile ${answers.projectType === o.id ? 'is-selected' : ''}`}
                  onClick={() => pick('projectType', o.id, 2)}
                >
                  <span className="tile-icon"><o.icon /></span>
                  <span className="tile-label">{o.label}</span>
                </button>
              ))}
            </div>
          </fieldset>
        )}

        {step === 2 && (
          <fieldset className="step">
            <legend className="step-q">When are you hoping to get it done?</legend>
            <div className="tiles tiles-wide">
              {TIMELINE_OPTIONS.map((o) => (
                <button
                  type="button"
                  key={o.id}
                  className={`tile ${answers.timeline === o.id ? 'is-selected' : ''}`}
                  onClick={() => pick('timeline', o.id, 3)}
                >
                  <span className="tile-label">{o.label}</span>
                </button>
              ))}
            </div>
          </fieldset>
        )}

        {step === 3 && (
          <form
            className="step"
            onSubmit={(e) => { e.preventDefault(); if (answers.location.trim()) go(4) }}
          >
            <label className="step-q" htmlFor="loc">Where&rsquo;s the project?</label>
            <input
              id="loc"
              className="text-input"
              type="text"
              inputMode="text"
              autoComplete="postal-code"
              placeholder="ZIP or city"
              value={answers.location}
              onChange={(e) => set({ location: e.target.value })}
              autoFocus
            />
            <button type="submit" className="btn-primary" disabled={!answers.location.trim()}>
              Continue
            </button>
          </form>
        )}

        {step === 4 && (
          <form className="step" onSubmit={handleSubmit}>
            <div className="step-q">Where should we send your estimate details?</div>
            <input
              className="text-input"
              type="text"
              autoComplete="name"
              placeholder="Your name"
              value={answers.name}
              onChange={(e) => set({ name: e.target.value })}
              required
            />
            <input
              className="text-input"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="Phone number"
              value={answers.phone}
              onChange={(e) => set({ phone: e.target.value })}
              required
            />
            <label className="consent">
              <input
                type="checkbox"
                checked={answers.consent}
                onChange={(e) => set({ consent: e.target.checked })}
                required
              />
              <span>
                By submitting, you agree {config.businessName} may text you about your
                estimate. Reply STOP to opt out.
              </span>
            </label>
            <button
              type="submit"
              className="btn-primary btn-lg"
              disabled={submitting || !(answers.name.trim() && answers.phone.trim() && answers.consent)}
            >
              {submitting ? 'Sending…' : 'Get My Free Estimate'}
            </button>
          </form>
        )}

        {step === 5 && (
          <div className="step step-booking">
            <button type="button" className="back-btn back-btn-solo" onClick={() => go(4)}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
              Back
            </button>
            <h2 className="booking-h">Last step — pick a time for your free on-site estimate.</h2>
            <p className="booking-sub">Prefer to talk first? We&rsquo;ll call you shortly either way.</p>

            <div className="cal-wrap">
              {config.ghlCalendarEmbedUrl.includes('REPLACE_ME') ? (
                <div className="cal-placeholder">
                  <strong>Calendar loads here.</strong>
                  <span>Set <code>ghlCalendarEmbedUrl</code> in <code>client.config.js</code>.</span>
                  <span className="cal-recap">
                    Lead captured: {labelFor(PROJECT_OPTIONS, answers.projectType)} ·
                    {' '}{labelFor(TIMELINE_OPTIONS, answers.timeline)} · {answers.location || '—'}
                  </span>
                </div>
              ) : (
                <>
                  {!calLoaded && <div className="cal-loading">Loading your calendar…</div>}
                  <iframe
                    className="cal-iframe"
                    // id must match the GHL booking id so form_embed.js can
                    // post resize messages to the right iframe.
                    id={config.ghlCalendarEmbedUrl.split('/').pop().split('?')[0]}
                    title="Book your free estimate"
                    src={config.ghlCalendarEmbedUrl}
                    onLoad={() => setCalLoaded(true)}
                    scrolling="no"
                    loading="lazy"
                  />
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Minimal inline tile icons (stroke uses currentColor) ─────────────────── */
function DrivewayIcon() {
  return (<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 21 9 3h6l4 18" /><path d="M12 7v2M12 12v2M12 17v2" /></svg>)
}
function PatioIcon() {
  return (<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="1" /><path d="M3 10h18M3 15h18M9 4v16M15 4v16" /></svg>)
}
function StampedIcon() {
  return (<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 3 8v8l9 5 9-5V8z" /><path d="m3 8 9 5 9-5M12 13v8" /></svg>)
}
function StepsIcon() {
  return (<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h4v-4h4v-4h4V8h4" /></svg>)
}
function OtherIcon() {
  return (<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 8v.01M12 11v5" /></svg>)
}
