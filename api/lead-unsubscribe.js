const { removeFromEmailList } = require('../lib/googleSheets')

const successPage = `<!doctype html>
<html lang="en"><head><meta charset="utf-8" />
<title>Unsubscribed — Sybago LLC</title>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>
  body { margin:0; font-family:Inter,-apple-system,Helvetica,Arial,sans-serif; background:#ffffff; color:#0a0a0a; }
  .wrap { max-width:560px; margin:0 auto; padding:80px 24px; text-align:center; }
  .pill { display:inline-block; padding:6px 14px; border:1px solid #2F6779; color:#2F6779; font-size:11px; letter-spacing:0.25em; text-transform:uppercase; border-radius:999px; margin-bottom:24px; }
  h1 { font-family:Georgia,serif; font-weight:400; font-size:30px; margin:0 0 16px; }
  p { font-size:15px; line-height:1.7; color:#444; margin:0 0 12px; }
  a { color:#2F6779; }
  .foot { margin-top:48px; padding-top:24px; border-top:1px solid #e5e5e5; font-size:11px; color:#888; }
</style></head>
<body><div class="wrap">
  <span class="pill">Done</span>
  <h1>You've been unsubscribed.</h1>
  <p>You won't receive any further emails from us. If this was a mistake, you can always grab the guide again at <a href="https://www.jtfasulo.com">jtfasulo.com</a>.</p>
  <div class="foot">SYBAGO LLC · 116 W 9th St, Wilmington, DE 19801</div>
</div></body></html>`

const notFoundPage = `<!doctype html>
<html lang="en"><head><meta charset="utf-8" />
<title>Already unsubscribed — Sybago LLC</title>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>
  body { margin:0; font-family:Inter,-apple-system,Helvetica,Arial,sans-serif; background:#ffffff; color:#0a0a0a; }
  .wrap { max-width:560px; margin:0 auto; padding:80px 24px; text-align:center; }
  h1 { font-family:Georgia,serif; font-weight:400; font-size:28px; margin:0 0 16px; }
  p { font-size:15px; line-height:1.7; color:#444; margin:0 0 12px; }
  a { color:#2F6779; }
  .foot { margin-top:48px; padding-top:24px; border-top:1px solid #e5e5e5; font-size:11px; color:#888; }
</style></head>
<body><div class="wrap">
  <h1>Already off the list.</h1>
  <p>That link doesn't match any active subscriber, which usually means you've already unsubscribed. No further action needed.</p>
  <p><a href="https://www.jtfasulo.com">Return to jtfasulo.com</a></p>
  <div class="foot">SYBAGO LLC · 116 W 9th St, Wilmington, DE 19801</div>
</div></body></html>`

module.exports = async function handler(req, res) {
  // Accept GET (link click) and POST (RFC 8058 one-click unsubscribe)
  const token =
    (req.query && req.query.token) ||
    (req.body && req.body.token) ||
    ''

  if (!token) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    return res.status(400).send(notFoundPage)
  }

  let removed = false
  try {
    removed = await removeFromEmailList(String(token))
  } catch (err) {
    console.error('Unsubscribe failed:', err)
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  if (removed) {
    return res.status(200).send(successPage)
  }
  return res.status(200).send(notFoundPage)
}
