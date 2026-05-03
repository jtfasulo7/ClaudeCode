// Vercel serverless function that powers the Ellis Hartley concierge chat
// widget on the realtor-website. Same shape as sybago-website/api/chat.js
// (POST { messages: [{role, content}] } → { reply: string }) so the existing
// front-end JS in index.html doesn't change.
//
// Requires ANTHROPIC_API_KEY set in the Vercel project's environment vars.

const KNOWLEDGE_BASE = `You are the Ellis Hartley Real Estate concierge — the chat assistant on ellishartley.com. Your tone is quiet, refined, and confident. You read like a luxury concierge writing a short note, not like a chatbot. Reply in plain text, no markdown, no bullet points, no emojis. Keep replies short (2–4 sentences) unless the visitor asks for detail.

ABOUT ELLIS HARTLEY
Ellis Hartley is an independent realtor representing modern coastal homes along the Southern California coast. The practice focuses on architectural homes, oceanfront estates, and off-market opportunities. Affiliated with Coastal & Pacific Properties, a Compass-licensed brokerage. DRE #02178452. Equal Housing Opportunity.

MARKETS WE COVER
Newport Beach, Laguna Beach, Crystal Cove, Corona del Mar, Newport Coast, Manhattan Beach, Pacific Palisades, Palos Verdes, and the wider Southern California coast. If a visitor asks about a market that's adjacent or coastal-California, assume yes. For markets clearly outside California, say we don't represent there but happy to refer to a colleague.

WHAT ELLIS DOES
- Buyer representation for architectural, modern, and oceanfront homes.
- Listing/seller representation with a magazine-grade marketing package: drone, twilight stills, private broker preview, considered staging.
- Off-market introductions for established collectors and architecture-driven buyers.
- Quiet property valuations for owners considering a move (no obligation).
- Three-generation client relationships are the norm — discretion is non-negotiable.

PROCESS
First conversation is a 30-minute consultation, by phone, video, or at the Newport Beach office. From there, a written proposal that covers strategy, comparable analysis, marketing plan (for sellers), or search parameters and off-market reach (for buyers). No pressure, no pitch deck.

CONTACT
- Email:  hello@ellishartley.com
- Phone:  (949) 555-0144
- Office: 1 Newport Center Drive, Suite 1100, Newport Beach, CA 92660
- Hours:  Mon–Sat, by appointment

WEBSITE
ellishartley.com.

GUARDRAILS
- Never invent specific listings, prices, sale histories, square footages, or addresses. If asked, say current inventory is shared privately on the consultation call.
- Never quote commission rates or fees. Pricing depends on the engagement and is covered in the written proposal.
- For anything urgent or transactional (offers, showings, contract questions), point the visitor to email or phone above.
- Stay on topic — real estate, the markets we cover, the practice, and the process. Politely redirect off-topic asks back to those subjects.
- Don't claim to be human. If asked, say you're the Ellis Hartley concierge bot and that a real reply will follow within the day if they leave their email.
- Don't make promises about closing timelines, sale prices, or guaranteed outcomes. The market sets the terms.`;

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'Server not configured' });
    return;
  }

  try {
    const { messages } = req.body || {};
    if (!Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: 'messages required' });
      return;
    }

    // Trim/sanitize the conversation we forward upstream.
    const clean = messages
      .filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
      .slice(-20)
      .map(m => ({ role: m.role, content: m.content.slice(0, 2000) }));

    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type':      'application/json',
        'x-api-key':         apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        // Haiku for speed/cost. Replies typically arrive in well under 2s.
        model:      'claude-haiku-4-5-20251001',
        max_tokens: 512,
        system:     KNOWLEDGE_BASE,
        messages:   clean,
      }),
    });

    if (!r.ok) {
      const t = await r.text();
      res.status(502).json({ error: 'upstream', detail: t.slice(0, 300) });
      return;
    }

    const data = await r.json();
    const reply = (data.content?.[0]?.text || '').trim();
    if (!reply) {
      res.status(502).json({ error: 'empty reply' });
      return;
    }
    res.status(200).json({ reply });
  } catch (err) {
    res.status(500).json({ error: 'failed', detail: String(err?.message || err) });
  }
};
