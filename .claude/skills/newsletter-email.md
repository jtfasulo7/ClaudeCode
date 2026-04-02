# Fasulostudio AI Newsletter — Editing Guide

This skill must be referenced any time edits are made to the email newsletter templates or newsletter research logic.

## Project Overview

**Brand:** Fasulostudio AI Newsletter (formerly "JT Fasulo AI Newsletter")
**Sender:** `Fasulostudio AI Newsletter <newsletter@jtfasulo.com>`
**Frequency:** Every Sunday (cron: `0 14 * * 0` UTC)
**Platform:** Vercel serverless functions + Resend email API
**Subscriber store:** Google Sheets via googleapis
**Content generation:** Claude API with web search tool

## Key Files

- `api/subscribe.js` — Welcome email HTML + sample newsletter send on signup
- `api/send-newsletter.js` — Batch sends newsletter to all active subscribers
- `api/unsubscribe.js` — Token-based unsubscribe handler
- `api/contact.js` — Contact form email (uses `hello@jtfasulo.com`)
- `lib/newsletter.js` — Research prompt + `renderNewsletterEmail()` HTML template
- `lib/googleSheets.js` — Subscriber CRUD (check duplicate, append, get active, log send)

## Design System (Email)

The emails use an ultra-luxury editorial aesthetic. All styles are inline (email client compatibility).

- **Background:** `#050505` (deep noir)
- **Accent color:** `#06b6d4` (cyan — matches jtfasulo.com website)
- **Text primary:** `#ffffff`, `#e0e0e0`, `#d0d0d0`
- **Text secondary:** `#8a8a8a`, `#999999`, `#6a6a6a`
- **Text muted:** `#4a4a4a`, `#3a3a3a`
- **Borders:** `#1a1a1a` (sections), `#141414` (subtle)
- **Typography:** Georgia, 'Times New Roman', Times, serif (all elements)
- **Masthead:** Centered, uppercase "FASULOSTUDIO" with letter-spacing `0.08em`, "AI NEWSLETTER" subtitle
- **Section labels:** "SECTION I / II / III" in small caps with cyan accent, `letter-spacing: 0.35em`
- **Tool callouts:** Left border `2px solid #06b6d4` with "HOW TO USE IT NOW" label
- **Quick wins:** Numbered `01, 02, 03...` in cyan (not bullets)
- **Industry moves:** Company name as uppercase tracked cyan label
- **Dividers:** Gradient from `#06b6d4` to `#1a1a1a`
- **Footer:** Centered, minimal — "FASULOSTUDIO · JTFASULO.COM" + UNSUBSCRIBE link

## Content Quality Standards — CRITICAL

The newsletter research prompt (in `lib/newsletter.js`) enforces these rules. They must be preserved on any edit:

1. **HARD CONSTRAINT — 7-day window only.** Every piece of content in the newsletter MUST be about events, releases, or announcements that happened within the 7 days immediately preceding the send date. The newsletter sends on Sundays, so the April 6 edition covers March 31–April 6 ONLY. Anything older is stale and must NOT be included, even if it's interesting. If a tool was released 10 days ago, it does not belong in this week's letter. No exceptions.
2. **No generic tool coverage.** Do NOT write about well-known tools with surface-level advice. Readers already know ChatGPT, Perplexity, Midjourney, etc. exist.
3. **Hyper-specific updates only.** If covering an established tool, it must be tied to a specific new release, feature, or update from within the 7-day window — with version numbers, feature names, and exact capabilities.
4. **Prioritize discovery.** At least 1 tool spotlight entry must be a lesser-known or newly launched tool most readers haven't encountered.
5. **Power-user quick wins.** Tips must be specific, non-obvious workflows, hidden features, or expert-level techniques — not common knowledge. Think "the tip that goes viral on Twitter because nobody knew about it." Tips should be tied to tools or features released/updated within the 7-day window when possible.
6. **Deep web research required.** The prompt instructs Claude to search tech blogs, Product Hunt, Twitter/X, GitHub trending, AI newsletters, company blogs, and press releases. Every claim must be grounded in actual research from within the 7-day window.
7. **No fabrication.** All tool names, features, and announcements must be verified via web search. Do not speculate or invent.
8. **Voice — human with personality.** The writing must feel like it was written by a sharp, opinionated person — not a corporate content team or an AI. Use short punchy sentences mixed with longer ones. Have a point of view — call things out, be direct about what's impressive and what's not. Inject dry wit, casual asides, and the kind of commentary you'd hear from a smart friend who follows AI obsessively. Avoid: marketing speak, filler phrases ("in today's rapidly evolving landscape"), excessive hedging ("it could potentially"), and anything that reads like a press release was copy-pasted. The reader should feel like they're getting insider intel from someone who actually tests this stuff, not a summary bot.

## Newsletter Structure

1. **Masthead** — FASULOSTUDIO / AI NEWSLETTER / Week of [date] · Covering [date range]
2. **Section I: Tool Spotlight** — 2-3 tools with name, description, "How to use it now" callout, "why it matters", and a **direct link** to the tool (styled as uppercase tracked text with underline: "TRY [TOOL] →")
3. **Section II: Quick Wins** — 5 numbered tips. Each has a **title**, **"Why this matters"** (italic, explains in beginner-friendly terms why the reader should care), and **step-by-step instructions** anyone can follow regardless of technical level.
4. **Section III: Technical** — 3-4 entries for developers and power users. Highly technical news with specific details (API changes, architecture, benchmark numbers, code-level implications). Each entry includes a **source link** (styled as "READ MORE →").
5. **Section IV: Industry Moves** — 2-4 company updates with implications. Each includes a **source link** to a credible article (styled as "FULL STORY →").
6. **Feedback CTA** — Centered text: "Feel free to leave some feedback! I'm always looking for ways to improve this newsletter." with a "GIVE FEEDBACK" button linking to `https://jtfasulo.com/api/feedback`
7. **Footer** — Brand + unsubscribe

## Link Styling

All links in the newsletter use this consistent style:
```
font-size:11-12px; letter-spacing:0.15em; text-transform:uppercase; color:#06b6d4; text-decoration:none; border-bottom:1px solid #06b6d4; padding-bottom:2px;
```

## Welcome Email Structure

1. **Masthead** — EST. 2026 / FASULOSTUDIO / AI NEWSLETTER
2. **"Private Access Granted"** label + "You're on the inside now." heading
3. **Section descriptions** — Tool Spotlight, Quick Wins, Industry Moves (gold left border)
4. **Sign-off** — "No fluff. No hype. Just signal." / — JT
5. **Footer** — Brand + unsubscribe

## Important Notes

- All email HTML must use inline styles only (no classes, no `<style>` blocks)
- The `from` field must always be `Fasulostudio AI Newsletter <newsletter@jtfasulo.com>`
- Contact form uses `Website Contact <hello@jtfasulo.com>`
- `api/feedback.js` serves a feedback form (GET) and processes submissions (POST), emailing to jtfasulo7@gmail.com
- New subscriber notifications are sent to jtfasulo7@gmail.com automatically on every signup
- Unsubscribe URLs use token-based auth: `https://jtfasulo.com/api/unsubscribe?token=${token}`
- Resend batch API supports max 100 emails per call (handled in send-newsletter.js)
- The research prompt uses `claude-sonnet-4-6` with `web_search_20250305` tool
