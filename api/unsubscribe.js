const { removeSubscriber } = require('../lib/googleSheets')

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { token } = req.query

  if (!token) {
    return res.status(400).send(renderPage('Invalid unsubscribe link.', true))
  }

  try {
    const removed = await removeSubscriber(token)

    if (!removed) {
      return res.status(200).send(
        renderPage("Looks like you've already been unsubscribed or the link is invalid.")
      )
    }

    return res.status(200).send(
      renderPage("You've been unsubscribed. You won't receive any more emails from us.")
    )
  } catch (err) {
    console.error('Unsubscribe error:', err)
    return res.status(500).send(
      renderPage('Something went wrong. Please try again later.', true)
    )
  }
}

function renderPage(message, isError = false) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Unsubscribed — JT Fasulo AI Newsletter</title>
</head>
<body style="margin:0;padding:0;background-color:#0a0a0a;font-family:system-ui,-apple-system,sans-serif;min-height:100vh;display:flex;align-items:center;justify-content:center;">
  <div style="max-width:480px;margin:0 auto;padding:40px 24px;text-align:center;">
    <h1 style="font-size:20px;font-weight:700;color:${isError ? '#ef4444' : '#ffffff'};margin:0 0 16px;">
      ${message}
    </h1>
    <p style="font-size:14px;color:#a3a3a3;margin:0 0 32px;line-height:1.5;">
      ${isError ? '' : 'We\'re sorry to see you go.'}
    </p>
    <a href="https://jtfasulo.com" style="display:inline-block;padding:12px 24px;background-color:#7c3aed;color:#ffffff;text-decoration:none;border-radius:8px;font-size:14px;font-weight:500;">
      Back to jtfasulo.com
    </a>
  </div>
</body>
</html>`
}
