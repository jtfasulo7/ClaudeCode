const crypto = require('crypto')
const { Resend } = require('resend')
const { checkDuplicate, appendSubscriber } = require('../lib/googleSheets')
const { researchNewsletter, renderNewsletterEmail } = require('../lib/newsletter')

const resend = new Resend(process.env.RESEND_API_KEY)

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { email } = req.body

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' })
  }

  try {
    const isDuplicate = await checkDuplicate(email)
    if (isDuplicate) {
      return res.status(400).json({ error: "You're already subscribed!" })
    }

    const token = crypto.randomUUID()
    await appendSubscriber(email, token)

    const unsubscribeUrl = `https://jtfasulo.com/api/unsubscribe?token=${token}`

    // Send welcome email
    await resend.emails.send({
      from: 'JT Fasulo AI Newsletter <newsletter@jtfasulo.com>',
      to: email,
      subject: "You're in. Welcome to the JT Fasulo AI Newsletter.",
      html: `
<div style="background-color:#0a0a0a;padding:40px 20px;font-family:system-ui,-apple-system,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background-color:#111111;border-radius:12px;overflow:hidden;">
    <div style="padding:40px 32px;border-bottom:1px solid #222222;">
      <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;color:#7c3aed;">JT Fasulo AI Newsletter</h1>
      <p style="margin:0;font-size:14px;color:#a3a3a3;">Welcome aboard.</p>
    </div>
    <div style="padding:32px;">
      <p style="margin:0 0 20px;font-size:16px;line-height:1.6;color:#ffffff;">
        You're officially on the list. Every Sunday, you'll get a curated email with:
      </p>
      <div style="background-color:#1a1a1a;border-radius:8px;padding:20px;margin:0 0 24px;">
        <p style="margin:0 0 12px;font-size:14px;color:#ffffff;">&#128294; <strong>Tool Spotlight</strong> — the newest AI tools with step-by-step instructions</p>
        <p style="margin:0 0 12px;font-size:14px;color:#ffffff;">&#9889; <strong>Quick Wins</strong> — 5 actionable tips you can apply immediately</p>
        <p style="margin:0;font-size:14px;color:#ffffff;">&#127970; <strong>Industry Moves</strong> — what the big AI companies did and why it matters to you</p>
      </div>
      <p style="margin:0 0 32px;font-size:14px;line-height:1.6;color:#a3a3a3;">
        No fluff. No hype. Just practical AI content you can actually use.
      </p>
      <p style="margin:0;font-size:14px;color:#a3a3a3;">
        — JT
      </p>
    </div>
    <div style="padding:20px 32px;border-top:1px solid #222222;">
      <p style="margin:0;font-size:11px;color:#525252;">
        You're receiving this because you subscribed at jtfasulo.com.
        <a href="${unsubscribeUrl}" style="color:#7c3aed;text-decoration:none;">Unsubscribe</a>
      </p>
    </div>
  </div>
</div>
      `,
    })

    // Generate and send a real sample newsletter with this week's AI news
    try {
      const newsletterData = await researchNewsletter()
      await resend.emails.send({
        from: 'JT Fasulo AI Newsletter <newsletter@jtfasulo.com>',
        to: email,
        subject: newsletterData.subject_line,
        html: renderNewsletterEmail(newsletterData, unsubscribeUrl),
      })
    } catch (sampleErr) {
      // Don't fail the whole subscribe if the sample newsletter fails
      console.error('Sample newsletter send error:', sampleErr)
    }

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('Subscribe error:', err)
    return res.status(500).json({ error: 'Something went wrong. Please try again.' })
  }
}
