const Anthropic = require('@anthropic-ai/sdk')
const { Resend } = require('resend')
const { getActiveSubscribers, logSend } = require('../lib/googleSheets')

const resend = new Resend(process.env.RESEND_API_KEY)

function renderNewsletterEmail(data, unsubscribeUrl) {
  const weekDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  const toolSpotlightHtml = data.tool_spotlight
    .map(
      (tool) => `
    <div style="margin-bottom:24px;">
      <h3 style="margin:0 0 8px;font-size:18px;font-weight:700;color:#7c3aed;">${tool.tool_name}</h3>
      <p style="margin:0 0 12px;font-size:14px;line-height:1.5;color:#a3a3a3;">${tool.what_it_does}</p>
      <div style="background-color:#1a1a1a;border-radius:8px;padding:16px;margin:0 0 12px;border-left:3px solid #7c3aed;">
        <p style="margin:0 0 4px;font-size:11px;font-weight:600;color:#7c3aed;text-transform:uppercase;letter-spacing:0.05em;">How to use it now</p>
        <p style="margin:0;font-size:14px;line-height:1.5;color:#ffffff;">${tool.how_to_use_it_now}</p>
      </div>
      <p style="margin:0;font-size:13px;color:#a3a3a3;font-style:italic;">${tool.why_it_matters}</p>
    </div>`
    )
    .join('')

  const quickWinsHtml = data.quick_wins
    .map(
      (tip) => `
    <tr>
      <td style="padding:8px 0;font-size:14px;line-height:1.5;color:#ffffff;vertical-align:top;width:24px;">&#8226;</td>
      <td style="padding:8px 0 8px 8px;font-size:14px;line-height:1.5;color:#ffffff;">${tip}</td>
    </tr>`
    )
    .join('')

  const industryMovesHtml = data.industry_moves
    .map(
      (move) => `
    <div style="margin-bottom:20px;padding-bottom:20px;border-bottom:1px solid #222222;">
      <p style="margin:0 0 6px;font-size:15px;color:#ffffff;"><strong style="color:#7c3aed;">${move.company}</strong></p>
      <p style="margin:0 0 6px;font-size:14px;line-height:1.5;color:#ffffff;">${move.what_happened}</p>
      <p style="margin:0;font-size:13px;color:#a3a3a3;">&#8594; ${move.what_it_means_for_you}</p>
    </div>`
    )
    .join('')

  return `
<div style="background-color:#0a0a0a;padding:40px 20px;font-family:system-ui,-apple-system,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background-color:#111111;border-radius:12px;overflow:hidden;">

    <!-- Header -->
    <div style="padding:32px 32px 24px;border-bottom:1px solid #222222;">
      <h1 style="margin:0 0 6px;font-size:22px;font-weight:700;color:#7c3aed;">JT Fasulo AI Newsletter</h1>
      <p style="margin:0;font-size:13px;color:#a3a3a3;">Week of ${weekDate}</p>
    </div>

    <!-- Tool Spotlight -->
    <div style="padding:32px;">
      <h2 style="margin:0 0 24px;font-size:20px;font-weight:700;color:#ffffff;">&#128294; Tool Spotlight</h2>
      ${toolSpotlightHtml}
    </div>

    <!-- Quick Wins -->
    <div style="padding:0 32px 32px;">
      <h2 style="margin:0 0 16px;font-size:20px;font-weight:700;color:#ffffff;">&#9889; Quick Wins</h2>
      <table style="width:100%;border-collapse:collapse;">
        ${quickWinsHtml}
      </table>
    </div>

    <!-- Industry Moves -->
    <div style="padding:0 32px 32px;">
      <h2 style="margin:0 0 20px;font-size:20px;font-weight:700;color:#ffffff;">&#127970; Industry Moves</h2>
      ${industryMovesHtml}
    </div>

    <!-- Footer -->
    <div style="padding:20px 32px;border-top:1px solid #222222;">
      <p style="margin:0;font-size:11px;color:#525252;">
        You're receiving this because you subscribed at jtfasulo.com.
        <a href="${unsubscribeUrl}" style="color:#7c3aed;text-decoration:none;">Unsubscribe</a>
      </p>
    </div>

  </div>
</div>`
}

const RESEARCH_PROMPT = `You are an AI newsletter writer for JT Fasulo's weekly AI newsletter. Your job is to research the internet for the most important AI developments from the past 7 days and return them in a structured JSON format. Focus exclusively on actionable, practical content that readers can use immediately. Do not include fluff or vague summaries.

Research and return a JSON object with exactly this structure:
{
  "subject_line": "a punchy, specific subject line under 60 characters referencing the biggest story this week",
  "tool_spotlight": [
    {
      "tool_name": "Name of tool",
      "what_it_does": "One sentence description",
      "how_to_use_it_now": "2-3 sentence actionable instruction someone can follow immediately",
      "why_it_matters": "One sentence on the impact"
    }
  ],
  "quick_wins": [
    "Actionable one-liner tip people can apply today"
  ],
  "industry_moves": [
    {
      "company": "Company name",
      "what_happened": "One sentence summary of the news",
      "what_it_means_for_you": "One sentence practical implication for AI users"
    }
  ]
}

Rules:
- tool_spotlight must have 2-3 entries covering tools released or updated in the last 7 days
- quick_wins must have exactly 5 entries
- industry_moves must have 2-4 entries covering OpenAI, Anthropic, Google, Meta, or Microsoft
- Return only valid JSON, no markdown, no preamble, no explanation`

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

    // Research with Claude using web_search
    const anthropic = new Anthropic()
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      tools: [{ type: 'web_search_20250305' }],
      messages: [{ role: 'user', content: RESEARCH_PROMPT }],
    })

    // Extract the final text response from Claude
    let jsonText = ''
    for (const block of response.content) {
      if (block.type === 'text') {
        jsonText += block.text
      }
    }

    // Clean potential markdown code fences
    jsonText = jsonText.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim()
    const newsletterData = JSON.parse(jsonText)

    // Send to all subscribers via Resend batch
    const emails = subscribers.map((row) => {
      const [email, , token] = row
      const unsubscribeUrl = `https://jtfasulo.com/api/unsubscribe?token=${token}`
      return {
        from: 'JT Fasulo AI Newsletter <newsletter@jtfasulo.com>',
        to: email,
        subject: newsletterData.subject_line,
        html: renderNewsletterEmail(newsletterData, unsubscribeUrl),
      }
    })

    // Resend batch supports up to 100 emails per call
    const batchSize = 100
    for (let i = 0; i < emails.length; i += batchSize) {
      const batch = emails.slice(i, i + batchSize)
      await resend.batch.send(batch)
    }

    // Log the send
    const today = new Date().toISOString().split('T')[0]
    await logSend(today, newsletterData.subject_line, subscribers.length, 'sent')

    return res.status(200).json({
      success: true,
      sent: subscribers.length,
      subject: newsletterData.subject_line,
    })
  } catch (err) {
    console.error('Send newsletter error:', err)

    // Log the failure
    try {
      const today = new Date().toISOString().split('T')[0]
      await logSend(today, 'ERROR', 0, `failed: ${err.message}`)
    } catch (_) {}

    return res.status(500).json({ error: 'Failed to send newsletter' })
  }
}
