const { Resend } = require('resend')
const { getActiveSubscribers, logSend } = require('../lib/googleSheets')
const { researchNewsletter, renderNewsletterEmail } = require('../lib/newsletter')

const resend = new Resend(process.env.RESEND_API_KEY)

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const secret = req.query.secret
  if (!secret || secret !== process.env.CRON_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    const subscribers = await getActiveSubscribers()
    if (subscribers.length === 0) {
      console.log('No subscribers found. Skipping send.')
      return res.status(200).json({ message: 'No subscribers', sent: 0 })
    }

    const newsletterData = await researchNewsletter()

    // Schedule delivery for exactly 9:00am ET on this Sunday
    const now = new Date()
    const sendAt = new Date(now)
    sendAt.setUTCHours(13, 0, 0, 0) // 1pm UTC = 9am ET
    // If we're already past 9am ET, send immediately
    const scheduledAt = sendAt > now ? sendAt.toISOString() : undefined

    // Send to all subscribers via Resend batch
    const emails = subscribers.map((row) => {
      const [email, , token] = row
      const unsubscribeUrl = `https://jtfasulo.com/api/unsubscribe?token=${token}`
      const msg = {
        from: 'Fasulo Studio AI Newsletter <newsletter@jtfasulo.com>',
        to: email,
        subject: newsletterData.subject_line,
        html: renderNewsletterEmail(newsletterData, unsubscribeUrl),
      }
      if (scheduledAt) msg.scheduledAt = scheduledAt
      return msg
    })

    // Resend batch supports up to 100 emails per call
    const batchSize = 100
    for (let i = 0; i < emails.length; i += batchSize) {
      const batch = emails.slice(i, i + batchSize)
      await resend.batch.send(batch)
    }

    // Log the send
    const today = new Date().toISOString().split('T')[0]
    await logSend(today, newsletterData.subject_line, subscribers.length, scheduledAt ? `scheduled for ${scheduledAt}` : 'sent')

    return res.status(200).json({
      success: true,
      sent: subscribers.length,
      subject: newsletterData.subject_line,
    })
  } catch (err) {
    console.error('Send newsletter error:', err)

    try {
      const today = new Date().toISOString().split('T')[0]
      await logSend(today, 'ERROR', 0, `failed: ${err.message}`)
    } catch (_) {}

    return res.status(500).json({ error: 'Failed to send newsletter' })
  }
}
