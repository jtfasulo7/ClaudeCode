const Anthropic = require('@anthropic-ai/sdk')

const RESEARCH_PROMPT = `You are an AI newsletter writer for the Fasulo Studio weekly AI newsletter. Your job is to do DEEP web research to find the most important, specific, and surprising AI developments. Return them in a structured JSON format.

TODAY'S DATE: ${new Date().toLocaleDateString('en-CA')} (Sunday)

HARD CONSTRAINT — 7-DAY WINDOW (Sunday to Sunday):
This newsletter sends every Sunday at 9am ET. It covers ONLY events from the previous Sunday through this Sunday morning. The exact date range for this edition: ${new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-CA')} to ${new Date().toLocaleDateString('en-CA')}. If something happened outside this window, do NOT include it — no matter how interesting. A tool released 10 days ago is stale. An announcement from 2 weeks ago is old news. Be ruthless about this cutoff.

CRITICAL RESEARCH GUIDELINES:
- Do NOT write about well-known tools with generic advice (e.g. "use ChatGPT for writing" or "try Perplexity for research"). Your readers already know these tools exist.
- For established tools (Claude, ChatGPT, Midjourney, etc.), ONLY include them if there is a specific new release, update, or feature from within the 7-day window. When you do, focus on the hyper-specific update — version numbers, feature names, exact capabilities added.
- Prioritize lesser-known, newly launched, or niche tools that most people haven't heard of yet.
- Quick wins must be hyper-specific power-user tips, hidden features, or non-obvious workflows — NOT surface-level advice. Think "the kind of tip a power user shares on Twitter that gets 10k likes because nobody knew about it." Prefer tips tied to releases from the 7-day window.
- Search multiple sources: tech blogs, Product Hunt, Twitter/X, GitHub trending, AI newsletters, company blogs, and press releases. Cast a wide net. Include date qualifiers in your searches (e.g. "AI tools released this week March 2026").
- Every claim must be grounded in something you actually found via research from within the 7-day window. Do not fabricate or speculate.

WRITING VOICE — THIS IS CRITICAL:
Write like a sharp, opinionated human — not a content bot. Short punchy sentences mixed with longer ones. Have a point of view. Call out what's impressive and what's not. Use dry wit and casual asides. The reader should feel like they're getting insider intel from a friend who obsessively follows AI and actually tests this stuff. Avoid: marketing speak, filler phrases ("in today's rapidly evolving landscape"), excessive hedging, and anything that reads like a rewritten press release. Be direct. Be conversational. Have an edge.

Research and return a JSON object with exactly this structure:
{
  "subject_line": "a punchy, specific subject line under 60 characters referencing the biggest story this week",
  "tool_spotlight": [
    {
      "tool_name": "Name of tool",
      "url": "Direct URL to the tool's website or landing page",
      "what_it_does": "One sentence description",
      "how_to_use_it_now": "2-3 sentence actionable instruction someone can follow immediately — be specific with URLs, commands, or exact steps",
      "why_it_matters": "One sentence on the impact"
    }
  ],
  "quick_wins": [
    {
      "title": "Short name for the tip (3-5 words)",
      "why_care": "One sentence explaining why this matters to someone who isn't technical — what problem does it solve or what does it unlock?",
      "what_to_do": "2-3 sentences with clear, step-by-step instructions anyone can follow. Be specific but assume the reader is a beginner."
    }
  ],
  "technical": [
    {
      "title": "Short headline for the technical news",
      "detail": "2-3 sentences with specific technical details — API changes, architecture decisions, benchmark numbers, code-level implications",
      "url": "URL to the source article, blog post, or documentation"
    }
  ],
  "industry_moves": [
    {
      "company": "Company name",
      "what_happened": "One sentence summary of the specific news — include version numbers, feature names, dates",
      "what_it_means_for_you": "One sentence practical implication for AI users",
      "url": "URL to a credible article about this news"
    }
  ]
}

Rules:
- tool_spotlight must have 2-3 entries. Prefer newly launched or recently updated tools from the past 7 days. At least 1 must be a tool most readers won't have heard of. Each must include a direct URL.
- quick_wins must have exactly 5 entries. Write them for BEGINNERS — explain why they should care and give clear steps to take action. No jargon without explanation.
- technical must have 3-4 entries. These are for advanced users — developers, engineers, AI practitioners. Include specific technical details and a source URL.
- industry_moves must have 2-4 entries covering major AI companies. Each must reference a specific announcement or release from the past 7 days with concrete details and a source URL.
- Return only valid JSON, no markdown, no preamble, no explanation`

async function researchNewsletter() {
  const anthropic = new Anthropic()
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    tools: [{ type: 'web_search_20250305', name: 'web_search', max_uses: 20 }],
    messages: [{ role: 'user', content: RESEARCH_PROMPT }],
  })

  let jsonText = ''
  for (const block of response.content) {
    if (block.type === 'text') {
      jsonText += block.text
    }
  }

  jsonText = jsonText.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim()
  // Extract JSON object from response even if surrounded by text
  const jsonMatch = jsonText.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    throw new Error('No JSON found in response: ' + jsonText.substring(0, 200))
  }
  return JSON.parse(jsonMatch[0])
}

function renderNewsletterEmail(data, unsubscribeUrl) {
  const weekDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  const toolSpotlightHtml = data.tool_spotlight
    .map(
      (tool, i) => `
    <div style="margin-bottom:${i < data.tool_spotlight.length - 1 ? '36' : '0'}px;${i < data.tool_spotlight.length - 1 ? 'padding-bottom:36px;border-bottom:1px solid #1a1a1a;' : ''}">
      <h3 style="margin:0 0 10px;font-size:20px;font-weight:400;color:#ffffff;font-family:Georgia,'Times New Roman',Times,serif;">${tool.tool_name}</h3>
      <p style="margin:0 0 16px;font-size:14px;line-height:1.7;color:#8a8a8a;font-family:Georgia,'Times New Roman',Times,serif;">${tool.what_it_does}</p>
      <div style="border-left:2px solid #06b6d4;padding:16px 0 16px 20px;margin:0 0 16px;">
        <p style="margin:0 0 6px;font-size:10px;font-weight:400;color:#06b6d4;text-transform:uppercase;letter-spacing:0.3em;">How to use it now</p>
        <p style="margin:0;font-size:14px;line-height:1.7;color:#d0d0d0;font-family:Georgia,'Times New Roman',Times,serif;">${tool.how_to_use_it_now}</p>
      </div>
      <p style="margin:0 0 14px;font-size:13px;color:#6a6a6a;font-style:italic;font-family:Georgia,'Times New Roman',Times,serif;">${tool.why_it_matters}</p>
      ${tool.url ? `<a href="${tool.url}" style="font-size:12px;letter-spacing:0.15em;text-transform:uppercase;color:#06b6d4;text-decoration:none;border-bottom:1px solid #06b6d4;padding-bottom:2px;">Try ${tool.tool_name} &#8594;</a>` : ''}
    </div>`
    )
    .join('')

  const quickWinsHtml = data.quick_wins
    .map(
      (tip, i) => {
        const isObj = typeof tip === 'object'
        const title = isObj ? tip.title : ''
        const whyCare = isObj ? tip.why_care : ''
        const whatToDo = isObj ? tip.what_to_do : tip
        return `
    <div style="padding:16px 0;${i < data.quick_wins.length - 1 ? 'border-bottom:1px solid #141414;' : ''}">
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="width:28px;vertical-align:top;padding-top:2px;">
            <span style="font-size:12px;color:#06b6d4;font-family:Georgia,'Times New Roman',Times,serif;">${String(i + 1).padStart(2, '0')}</span>
          </td>
          <td style="font-family:Georgia,'Times New Roman',Times,serif;">
            ${title ? `<p style="margin:0 0 6px;font-size:15px;font-weight:400;color:#ffffff;">${title}</p>` : ''}
            ${whyCare ? `<p style="margin:0 0 8px;font-size:13px;line-height:1.6;color:#8a8a8a;font-style:italic;">Why this matters: ${whyCare}</p>` : ''}
            <p style="margin:0;font-size:14px;line-height:1.7;color:#d0d0d0;">${whatToDo}</p>
          </td>
        </tr>
      </table>
    </div>`
      }
    )
    .join('')

  const technicalHtml = (data.technical || [])
    .map(
      (item, i) => `
    <div style="padding:16px 0;${i < (data.technical || []).length - 1 ? 'border-bottom:1px solid #141414;' : ''}">
      <p style="margin:0 0 8px;font-size:15px;font-weight:400;color:#ffffff;font-family:Georgia,'Times New Roman',Times,serif;">${item.title}</p>
      <p style="margin:0 0 10px;font-size:14px;line-height:1.7;color:#d0d0d0;font-family:Georgia,'Times New Roman',Times,serif;">${item.detail}</p>
      ${item.url ? `<a href="${item.url}" style="font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#06b6d4;text-decoration:none;border-bottom:1px solid #06b6d4;padding-bottom:2px;">Read more &#8594;</a>` : ''}
    </div>`
    )
    .join('')

  const industryMovesHtml = data.industry_moves
    .map(
      (move, i) => `
    <div style="margin-bottom:${i < data.industry_moves.length - 1 ? '28' : '0'}px;${i < data.industry_moves.length - 1 ? 'padding-bottom:28px;border-bottom:1px solid #1a1a1a;' : ''}">
      <p style="margin:0 0 4px;font-size:11px;letter-spacing:0.25em;text-transform:uppercase;color:#06b6d4;font-weight:400;">${move.company}</p>
      <p style="margin:0 0 10px;font-size:15px;line-height:1.7;color:#e0e0e0;font-family:Georgia,'Times New Roman',Times,serif;">${move.what_happened}</p>
      <p style="margin:0 0 ${move.url ? '12' : '0'}px;font-size:13px;line-height:1.6;color:#6a6a6a;font-family:Georgia,'Times New Roman',Times,serif;">&#8594; ${move.what_it_means_for_you}</p>
      ${move.url ? `<a href="${move.url}" style="font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#06b6d4;text-decoration:none;border-bottom:1px solid #06b6d4;padding-bottom:2px;">Full story &#8594;</a>` : ''}
    </div>`
    )
    .join('')

  return `
<div style="background-color:#050505;padding:0;margin:0;font-family:Georgia,'Times New Roman',Times,serif;">
  <div style="max-width:620px;margin:0 auto;padding:60px 20px;">

    <!-- Masthead -->
    <div style="text-align:center;padding-bottom:40px;border-bottom:1px solid #06b6d4;">
      <h1 style="margin:0 0 10px;font-size:32px;font-weight:400;letter-spacing:0.08em;text-transform:uppercase;color:#ffffff;font-family:Georgia,'Times New Roman',Times,serif;">Fasulo Studio</h1>
      <p style="margin:0 0 6px;font-size:12px;letter-spacing:0.25em;text-transform:uppercase;color:#8a8a8a;">AI Newsletter</p>
      <p style="margin:0;font-size:12px;letter-spacing:0.15em;color:#4a4a4a;">Week of ${weekDate}</p>
    </div>

    <!-- Tool Spotlight -->
    <div style="padding:48px 8px 40px;">
      <p style="margin:0 0 8px;font-size:10px;letter-spacing:0.35em;text-transform:uppercase;color:#06b6d4;">Section I</p>
      <h2 style="margin:0 0 32px;font-size:24px;font-weight:400;color:#ffffff;font-family:Georgia,'Times New Roman',Times,serif;">Tool Spotlight</h2>
      ${toolSpotlightHtml}
    </div>

    <!-- Divider -->
    <div style="padding:0 8px;"><div style="width:100%;height:1px;background:linear-gradient(to right, #06b6d4, #1a1a1a);"></div></div>

    <!-- Quick Wins -->
    <div style="padding:40px 8px;">
      <p style="margin:0 0 8px;font-size:10px;letter-spacing:0.35em;text-transform:uppercase;color:#06b6d4;">Section II</p>
      <h2 style="margin:0 0 24px;font-size:24px;font-weight:400;color:#ffffff;font-family:Georgia,'Times New Roman',Times,serif;">Quick Wins</h2>
      ${quickWinsHtml}
    </div>

    <!-- Divider -->
    <div style="padding:0 8px;"><div style="width:100%;height:1px;background:linear-gradient(to right, #06b6d4, #1a1a1a);"></div></div>

    <!-- Technical -->
    ${technicalHtml ? `
    <div style="padding:40px 8px;">
      <p style="margin:0 0 8px;font-size:10px;letter-spacing:0.35em;text-transform:uppercase;color:#06b6d4;">Section III</p>
      <h2 style="margin:0 0 24px;font-size:24px;font-weight:400;color:#ffffff;font-family:Georgia,'Times New Roman',Times,serif;">Technical</h2>
      <p style="margin:0 0 20px;font-size:12px;color:#4a4a4a;font-style:italic;font-family:Georgia,'Times New Roman',Times,serif;">For developers and power users.</p>
      ${technicalHtml}
    </div>

    <!-- Divider -->
    <div style="padding:0 8px;"><div style="width:100%;height:1px;background:linear-gradient(to right, #06b6d4, #1a1a1a);"></div></div>
    ` : ''}

    <!-- Industry Moves -->
    <div style="padding:40px 8px 48px;">
      <p style="margin:0 0 8px;font-size:10px;letter-spacing:0.35em;text-transform:uppercase;color:#06b6d4;">Section ${technicalHtml ? 'IV' : 'III'}</p>
      <h2 style="margin:0 0 28px;font-size:24px;font-weight:400;color:#ffffff;font-family:Georgia,'Times New Roman',Times,serif;">Industry Moves</h2>
      ${industryMovesHtml}
    </div>

    <!-- Divider -->
    <div style="padding:0 8px;"><div style="width:100%;height:1px;background:linear-gradient(to right, #06b6d4, #1a1a1a);"></div></div>

    <!-- Feedback -->
    <div style="padding:40px 8px 48px;text-align:center;">
      <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#8a8a8a;font-family:Georgia,'Times New Roman',Times,serif;">
        Feel free to leave some feedback! I'm always looking for ways to improve this newsletter.
      </p>
      <a href="https://jtfasulo.com/api/feedback" style="display:inline-block;padding:14px 40px;border:1px solid #06b6d4;color:#06b6d4;text-decoration:none;font-family:Georgia,'Times New Roman',Times,serif;font-size:13px;letter-spacing:0.2em;text-transform:uppercase;">Give Feedback</a>
    </div>

    <!-- Footer -->
    <div style="border-top:1px solid #1a1a1a;padding:32px 8px 0;text-align:center;">
      <p style="margin:0 0 4px;font-size:10px;letter-spacing:0.25em;text-transform:uppercase;color:#3a3a3a;">Fasulo Studio &middot; jtfasulo.com</p>
      <p style="margin:0;font-size:10px;color:#3a3a3a;">
        <a href="${unsubscribeUrl}" style="color:#5a5a5a;text-decoration:none;letter-spacing:0.1em;">UNSUBSCRIBE</a>
      </p>
    </div>

  </div>
</div>`
}

module.exports = { researchNewsletter, renderNewsletterEmail }
