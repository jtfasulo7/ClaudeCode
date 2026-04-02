const { Resend } = require('resend')

const resend = new Resend(process.env.RESEND_API_KEY)

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { name, email, service, budget, message } = req.body

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  try {
    const { error } = await resend.emails.send({
      from: 'Fasulo Studio <hello@jtfasulo.com>',
      to: 'jtfasulo7@gmail.com',
      replyTo: email,
      subject: `New inquiry from ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #0a0a0a; color: #fff; border: 1px solid #222;">
          <h2 style="color: #fff; margin-top: 0;">New Project Inquiry</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #222; color: #999; width: 120px;">Name</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #222; color: #fff;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #222; color: #999;">Email</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #222; color: #fff;"><a href="mailto:${email}" style="color: #a78bfa;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #222; color: #999;">Service</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #222; color: #fff;">${service || '—'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #222; color: #999;">Budget</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #222; color: #fff;">${budget || '—'}</td>
            </tr>
          </table>
          <div style="background: #111; border: 1px solid #222; padding: 20px; border-radius: 4px;">
            <p style="color: #999; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 12px;">Message</p>
            <p style="color: #fff; margin: 0; line-height: 1.7; white-space: pre-wrap;">${message}</p>
          </div>
          <p style="color: #555; font-size: 12px; margin-top: 24px; margin-bottom: 0;">
            Sent from jtfasulo.com · Reply directly to this email to respond to ${name}
          </p>
        </div>
      `,
    })

    if (error) {
      console.error('Resend error:', error)
      return res.status(500).json({ error: error.message })
    }

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('Handler error:', err)
    return res.status(500).json({ error: 'Failed to send message' })
  }
}
