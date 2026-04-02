const crypto = require('crypto')
const { Resend } = require('resend')
const { checkDuplicate, appendSubscriber } = require('../lib/googleSheets')

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
      from: 'Fasulostudio AI Newsletter <newsletter@jtfasulo.com>',
      to: email,
      subject: "Welcome to Fasulostudio — You're on the inside now.",
      html: `
<div style="background-color:#050505;padding:0;margin:0;font-family:Georgia,'Times New Roman',Times,serif;">
  <div style="max-width:620px;margin:0 auto;padding:60px 20px;">

    <!-- Masthead -->
    <div style="text-align:center;padding:48px 0 40px;border-bottom:1px solid #06b6d4;">
      <p style="margin:0 0 16px;font-size:11px;letter-spacing:0.35em;text-transform:uppercase;color:#06b6d4;">Est. 2026</p>
      <h1 style="margin:0 0 12px;font-size:36px;font-weight:400;letter-spacing:0.08em;text-transform:uppercase;color:#ffffff;font-family:Georgia,'Times New Roman',Times,serif;">Fasulostudio</h1>
      <p style="margin:0;font-size:13px;letter-spacing:0.2em;text-transform:uppercase;color:#8a8a8a;">AI Newsletter</p>
    </div>

    <!-- Welcome Message -->
    <div style="padding:48px 8px 40px;">
      <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.3em;text-transform:uppercase;color:#06b6d4;">Private Access Granted</p>
      <h2 style="margin:0 0 28px;font-size:28px;font-weight:400;line-height:1.3;color:#ffffff;font-family:Georgia,'Times New Roman',Times,serif;">You're on the inside now.</h2>
      <p style="margin:0 0 32px;font-size:16px;line-height:1.8;color:#b0b0b0;font-family:Georgia,'Times New Roman',Times,serif;">
        Every Sunday, a curated briefing arrives in your inbox — the tools, strategies, and moves shaping the AI landscape, distilled into what actually matters.
      </p>

      <!-- What You'll Receive -->
      <div style="border-left:2px solid #06b6d4;padding-left:24px;margin:0 0 36px;">
        <p style="margin:0 0 20px;font-size:15px;line-height:1.7;color:#e0e0e0;font-family:Georgia,'Times New Roman',Times,serif;">
          <strong style="color:#06b6d4;font-weight:400;letter-spacing:0.05em;">Tool Spotlight</strong><br>
          <span style="color:#999999;">The newest AI tools with clear, actionable instructions.</span>
        </p>
        <p style="margin:0 0 20px;font-size:15px;line-height:1.7;color:#e0e0e0;font-family:Georgia,'Times New Roman',Times,serif;">
          <strong style="color:#06b6d4;font-weight:400;letter-spacing:0.05em;">Quick Wins</strong><br>
          <span style="color:#999999;">Five things you can apply to your work today.</span>
        </p>
        <p style="margin:0;font-size:15px;line-height:1.7;color:#e0e0e0;font-family:Georgia,'Times New Roman',Times,serif;">
          <strong style="color:#06b6d4;font-weight:400;letter-spacing:0.05em;">Industry Moves</strong><br>
          <span style="color:#999999;">What the major players did and why it matters to you.</span>
        </p>
      </div>

      <!-- Divider -->
      <div style="width:40px;height:1px;background-color:#06b6d4;margin:0 0 32px;"></div>

      <p style="margin:0 0 8px;font-size:15px;line-height:1.8;color:#b0b0b0;font-style:italic;font-family:Georgia,'Times New Roman',Times,serif;">
        No fluff. No hype. Just signal.
      </p>
      <p style="margin:0;font-size:15px;color:#ffffff;font-family:Georgia,'Times New Roman',Times,serif;">
        — JT
      </p>
    </div>

    <!-- Footer -->
    <div style="border-top:1px solid #1a1a1a;padding:28px 8px 0;text-align:center;">
      <p style="margin:0 0 6px;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#3a3a3a;">Fasulostudio &middot; jtfasulo.com</p>
      <p style="margin:0;font-size:10px;color:#3a3a3a;">
        <a href="${unsubscribeUrl}" style="color:#5a5a5a;text-decoration:none;letter-spacing:0.1em;">UNSUBSCRIBE</a>
      </p>
    </div>

  </div>
</div>
      `,
    })

    // Notify JT of new subscriber
    try {
      await resend.emails.send({
        from: 'Fasulostudio AI Newsletter <newsletter@jtfasulo.com>',
        to: 'jtfasulo7@gmail.com',
        subject: `New subscriber: ${email}`,
        html: `<div style="font-family:Georgia,'Times New Roman',Times,serif;padding:24px;background:#050505;color:#d0d0d0;border:1px solid #1a1a1a;"><p style="margin:0 0 4px;font-size:10px;letter-spacing:0.3em;text-transform:uppercase;color:#06b6d4;">New Subscriber</p><p style="margin:0;font-size:16px;color:#fff;">${email}</p></div>`,
      })
    } catch (_) {}

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('Subscribe error:', err)
    return res.status(500).json({ error: 'Something went wrong. Please try again.' })
  }
}
