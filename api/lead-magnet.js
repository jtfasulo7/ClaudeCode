const crypto = require('crypto')
const { Resend } = require('resend')
const { checkDuplicate, appendSubscriber } = require('../lib/googleSheets')

const resend = new Resend(process.env.RESEND_API_KEY)

const PDF_URL = 'https://jtfasulo.com/AI_Entrepreneurship_Guide_2026.pdf'
const PDF_FILENAME = 'AI_Entrepreneurship_Guide_2026.pdf'

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { email } = req.body || {}

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' })
  }

  // Record the lead — silently skip on duplicate so the user can still get the PDF
  try {
    const isDuplicate = await checkDuplicate(email).catch(() => false)
    if (!isDuplicate) {
      const token = crypto.randomUUID()
      await appendSubscriber(email, token).catch(() => {})
    }
  } catch (_) {
    // Don't block the user from getting the PDF if Sheets is misconfigured
  }

  // Send the email with the download link
  try {
    await resend.emails.send({
      from: 'JT Fasulo <newsletter@jtfasulo.com>',
      to: email,
      subject: "Your AI Entrepreneurship Guide is here",
      html: `
<div style="background-color:#050505;padding:0;margin:0;font-family:Georgia,'Times New Roman',Times,serif;">
  <div style="max-width:620px;margin:0 auto;padding:60px 20px;">

    <!-- Masthead -->
    <div style="text-align:center;padding:48px 0 40px;border-bottom:1px solid #2E7D8C;">
      <p style="margin:0 0 16px;font-size:11px;letter-spacing:0.35em;text-transform:uppercase;color:#2E7D8C;">Free Guide · 2026 Edition</p>
      <h1 style="margin:0 0 12px;font-size:36px;font-weight:400;letter-spacing:0.04em;color:#ffffff;font-family:Georgia,'Times New Roman',Times,serif;">The Beginner's Guide to AI in Entrepreneurship</h1>
    </div>

    <!-- Body -->
    <div style="padding:48px 8px 40px;">
      <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.3em;text-transform:uppercase;color:#2E7D8C;">Here's your guide</p>
      <h2 style="margin:0 0 24px;font-size:24px;font-weight:400;line-height:1.35;color:#ffffff;font-family:Georgia,'Times New Roman',Times,serif;">Glad you're here. Let's get you started.</h2>

      <p style="margin:0 0 28px;font-size:16px;line-height:1.8;color:#b0b0b0;font-family:Georgia,'Times New Roman',Times,serif;">
        This is the no-fluff PDF I wish I had when I started using AI to build a business. Skim it, save it, and come back to it when you need it.
      </p>

      <!-- Download CTA -->
      <div style="text-align:center;margin:36px 0 40px;">
        <a href="${PDF_URL}" download="${PDF_FILENAME}"
           style="display:inline-block;padding:16px 32px;background-color:#2E7D8C;color:#ffffff;font-size:13px;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;text-decoration:none;border-radius:10px;font-family:Inter,Helvetica,Arial,sans-serif;">
          Download the Guide (PDF)
        </a>
        <p style="margin:14px 0 0;font-size:12px;color:#5a5a5a;">
          Or copy this link: <a href="${PDF_URL}" style="color:#2E7D8C;text-decoration:underline;">${PDF_URL}</a>
        </p>
      </div>

      <!-- Inside -->
      <div style="border-left:2px solid #2E7D8C;padding-left:24px;margin:0 0 36px;">
        <p style="margin:0 0 14px;font-size:11px;letter-spacing:0.3em;text-transform:uppercase;color:#2E7D8C;">Inside the guide</p>
        <p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:#e0e0e0;font-family:Georgia,'Times New Roman',Times,serif;">— Picking the right AI tools for your stage of business</p>
        <p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:#e0e0e0;font-family:Georgia,'Times New Roman',Times,serif;">— A 90-day operating cadence that compounds AI leverage</p>
        <p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:#e0e0e0;font-family:Georgia,'Times New Roman',Times,serif;">— A lean tech stack that scales from solo founder to first hire</p>
        <p style="margin:0;font-size:15px;line-height:1.7;color:#e0e0e0;font-family:Georgia,'Times New Roman',Times,serif;">— The seven mistakes that cost early founders six figures</p>
      </div>

      <p style="margin:0 0 8px;font-size:15px;line-height:1.8;color:#b0b0b0;font-family:Georgia,'Times New Roman',Times,serif;">
        If you have a question or want to chat about something specific, just reply to this email. It comes straight to me.
      </p>
      <p style="margin:24px 0 0;font-size:15px;color:#ffffff;font-family:Georgia,'Times New Roman',Times,serif;">
        — JT
      </p>
    </div>

    <!-- Footer -->
    <div style="border-top:1px solid #1a1a1a;padding:28px 8px 0;text-align:center;">
      <p style="margin:0;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#3a3a3a;">jtfasulo.com</p>
    </div>

  </div>
</div>
      `,
    })
  } catch (err) {
    // Email send failed — but the user can still download via the success state on the page.
    // Return success but include a flag the client can use if needed.
    console.error('Lead magnet email error:', err)
    return res.status(200).json({ success: true, emailSent: false })
  }

  // Best-effort notify JT of new lead
  try {
    await resend.emails.send({
      from: 'JT Fasulo <newsletter@jtfasulo.com>',
      to: 'jtfasulo7@gmail.com',
      subject: `New guide download: ${email}`,
      html: `<div style="font-family:Georgia,'Times New Roman',Times,serif;padding:24px;background:#050505;color:#d0d0d0;border:1px solid #1a1a1a;"><p style="margin:0 0 4px;font-size:10px;letter-spacing:0.3em;text-transform:uppercase;color:#2E7D8C;">New Guide Download</p><p style="margin:0;font-size:16px;color:#fff;">${email}</p></div>`,
    })
  } catch (_) {}

  return res.status(200).json({ success: true, emailSent: true })
}
