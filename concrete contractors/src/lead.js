import { config } from './client.config.js'

// ═══════════════════════════════════════════════════════════════════════════
//  submitLead(payload)  —  fires the Step-4 lead to the client's endpoint.
// ───────────────────────────────────────────────────────────────────────────
//  This is the CRITICAL capture step: it runs on Step-4 submit, BEFORE the
//  calendar flip, so the lead is saved even if the visitor never books a time.
//
//  Notes:
//   - Body is sent as text/plain so the browser skips the CORS preflight that
//     GHL inbound webhooks don't answer. The JSON still arrives intact; GHL
//     parses it fine.
//   - keepalive lets the request survive if the page is navigated/backgrounded.
//   - We time out after 8s so a stalled network never traps the visitor on the
//     form. The caller advances to the calendar regardless of the result.
//   - Returns { ok, skipped?, error? } — never throws to the caller path that
//     matters (the caller also wraps this in try/finally as a belt-and-braces).
// ═══════════════════════════════════════════════════════════════════════════

const TIMEOUT_MS = 8000

export async function submitLead(payload) {
  const url = config.ghlWebhookUrl

  // Template not configured yet — don't attempt a POST to a dummy URL.
  if (!url || url.includes('REPLACE_ME')) {
    console.warn('[lead] ghlWebhookUrl not configured — skipping POST. Payload:', payload)
    return { ok: false, skipped: true }
  }

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
      body: JSON.stringify(payload),
      keepalive: true,
      signal: controller.signal,
    })
    return { ok: res.ok }
  } catch (err) {
    // CORS-opaque failures, aborts, offline, etc. The lead may still have been
    // delivered server-side; we log and let the funnel continue either way.
    console.error('[lead] POST failed (advancing anyway):', err)
    return { ok: false, error: String(err) }
  } finally {
    clearTimeout(timer)
  }
}
