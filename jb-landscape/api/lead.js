// J.B. Landscape — lead intake endpoint
// Accepts POSTs from the website contact form. Forwards a normalized payload
// to the GoHighLevel Inbound Webhook configured in env var GHL_WEBHOOK_URL.

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const webhookUrl = process.env.GHL_WEBHOOK_URL;
  if (!webhookUrl) {
    res.status(500).json({
      error: 'Lead pipeline not configured. Set GHL_WEBHOOK_URL in Vercel env vars.',
    });
    return;
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  body = body || {};

  const trim = (v, max) =>
    typeof v === 'string' ? v.trim().slice(0, max || 4000) : '';

  const full_name = trim(body.full_name, 120);
  const phone     = trim(body.phone, 20);
  const email     = trim(body.email, 160);
  const message   = trim(body.message, 2000);
  const source    = trim(body.source, 60) || 'website';
  const sms_consent = body.sms_consent === true || body.sms_consent === 'true';

  if (!full_name || !phone || !email || !message) {
    res.status(400).json({ error: 'Missing required fields.' });
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    res.status(400).json({ error: 'Invalid email address.' });
    return;
  }
  if (phone.replace(/\D/g, '').length < 10) {
    res.status(400).json({ error: 'Invalid phone number.' });
    return;
  }

  const first_name = body.first_name ? trim(body.first_name, 60) : full_name.split(/\s+/)[0] || '';
  const last_name  = body.last_name  ? trim(body.last_name, 60)  : full_name.split(/\s+/).slice(1).join(' ') || '';

  const ip =
    (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
    req.socket?.remoteAddress || '';
  const user_agent = trim(req.headers['user-agent'] || '', 240);
  const page_url   = trim(body.page_url, 500);
  const submitted_at = trim(body.submitted_at, 40) || new Date().toISOString();

  const payload = {
    source, full_name, first_name, last_name,
    phone, email, message, sms_consent,
    submitted_at, page_url, ip, user_agent,
    business: 'J.B. Landscape',
  };

  try {
    const upstream = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!upstream.ok) {
      const text = await upstream.text().catch(() => '');
      console.error('GHL webhook non-2xx', upstream.status, text.slice(0, 400));
      res.status(502).json({ error: 'Lead service unavailable' });
      return;
    }
    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('GHL webhook error', err);
    res.status(500).json({ error: 'Lead service unavailable' });
  }
};
