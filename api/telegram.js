const Anthropic = require('@anthropic-ai/sdk')

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const ALLOWED_CHAT_ID = process.env.TELEGRAM_ALLOWED_CHAT_ID

async function sendTelegramMessage(chatId, text) {
  const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' }),
  })
  return res.json()
}

async function sendTypingAction(chatId) {
  const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendChatAction`
  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, action: 'typing' }),
  })
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const update = req.body
    const message = update?.message

    // Ignore non-text messages and edits
    if (!message?.text) {
      return res.status(200).json({ ok: true })
    }

    const chatId = String(message.chat.id)
    const userText = message.text

    // Only respond to allowed chat
    if (ALLOWED_CHAT_ID && chatId !== ALLOWED_CHAT_ID) {
      return res.status(200).json({ ok: true })
    }

    // Handle /start command
    if (userText === '/start') {
      await sendTelegramMessage(chatId, "Hey! I'm your Claude assistant. Send me any message and I'll respond — even when your computer is off.")
      return res.status(200).json({ ok: true })
    }

    // Show typing indicator
    await sendTypingAction(chatId)

    // Call Claude API
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: `You are a helpful AI assistant for JT Fasulo, available via Telegram. Keep responses concise and conversational — this is a chat app, not an essay. Use short paragraphs. You can use Markdown formatting (bold, italic, code blocks). Today's date is ${new Date().toISOString().split('T')[0]}.`,
      messages: [{ role: 'user', content: userText }],
    })

    const reply = response.content[0]?.text || 'Sorry, I had trouble generating a response.'

    // Telegram has a 4096 char limit per message
    if (reply.length > 4000) {
      const chunks = reply.match(/[\s\S]{1,4000}/g) || [reply]
      for (const chunk of chunks) {
        await sendTelegramMessage(chatId, chunk)
      }
    } else {
      await sendTelegramMessage(chatId, reply)
    }

    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('Telegram webhook error:', err)
    return res.status(200).json({ ok: true }) // Always return 200 to Telegram
  }
}
