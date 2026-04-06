const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const WEBHOOK_URL = 'https://jtfasulo.com/api/telegram'

async function getWebhookInfo() {
  const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/getWebhookInfo`)
  return res.json()
}

async function setWebhook() {
  const res = await fetch(
    `https://api.telegram.org/bot${TELEGRAM_TOKEN}/setWebhook?url=${encodeURIComponent(WEBHOOK_URL)}`
  )
  return res.json()
}

async function deleteWebhook() {
  const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/deleteWebhook`)
  return res.json()
}

module.exports = async function handler(req, res) {
  const secret = req.query.secret
  if (!secret || secret !== process.env.CRON_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const mode = req.query.mode

  // Switch to local mode: delete webhook so local plugin can poll
  if (mode === 'local') {
    const result = await deleteWebhook()
    return res.status(200).json({ mode: 'local', webhook: 'removed', result })
  }

  // Switch to cloud mode: set webhook so Vercel handles messages
  if (mode === 'cloud') {
    const result = await setWebhook()
    return res.status(200).json({ mode: 'cloud', webhook: 'set', result })
  }

  // Default (cron): ensure webhook is set if not already (crash recovery)
  const info = await getWebhookInfo()
  const currentUrl = info.result?.url || ''

  if (!currentUrl) {
    const result = await setWebhook()
    return res.status(200).json({ mode: 'cloud', restored: true, result })
  }

  return res.status(200).json({ mode: 'cloud', already_set: true, url: currentUrl })
}
