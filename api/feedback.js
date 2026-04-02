const { Resend } = require('resend')

const resend = new Resend(process.env.RESEND_API_KEY)

module.exports = async function handler(req, res) {
  // GET: serve the feedback form
  if (req.method === 'GET') {
    return res.status(200).send(renderForm())
  }

  // POST: process feedback submission
  if (req.method === 'POST') {
    const { feedback } = req.body

    if (!feedback || feedback.trim().length === 0) {
      return res.status(400).json({ error: 'Feedback cannot be empty.' })
    }

    if (feedback.length > 5000) {
      return res.status(400).json({ error: 'Feedback must be under 5000 characters.' })
    }

    try {
      await resend.emails.send({
        from: 'Fasulostudio AI Newsletter <newsletter@jtfasulo.com>',
        to: 'jtfasulo7@gmail.com',
        subject: 'Newsletter Feedback',
        html: `
<div style="font-family:Georgia,'Times New Roman',Times,serif;max-width:600px;margin:0 auto;padding:32px;background:#050505;color:#fff;border:1px solid #1a1a1a;">
  <p style="margin:0 0 8px;font-size:10px;letter-spacing:0.3em;text-transform:uppercase;color:#06b6d4;">Newsletter Feedback</p>
  <div style="background:#0a0a0a;border:1px solid #1a1a1a;border-left:2px solid #06b6d4;padding:20px;margin:16px 0;">
    <p style="color:#d0d0d0;margin:0;line-height:1.7;white-space:pre-wrap;">${feedback.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
  </div>
  <p style="color:#4a4a4a;font-size:12px;margin:16px 0 0;">
    Sent from the Fasulostudio newsletter feedback form
  </p>
</div>
        `,
      })

      return res.status(200).send(renderSuccess())
    } catch (err) {
      console.error('Feedback error:', err)
      return res.status(500).json({ error: 'Failed to send feedback.' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}

function renderForm() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Feedback — Fasulostudio AI Newsletter</title>
</head>
<body style="margin:0;padding:0;background-color:#050505;font-family:Georgia,'Times New Roman',Times,serif;min-height:100vh;display:flex;align-items:center;justify-content:center;">
  <div style="max-width:540px;width:100%;margin:0 auto;padding:60px 24px;">
    <div style="text-align:center;margin-bottom:40px;">
      <h1 style="font-size:28px;font-weight:400;letter-spacing:0.08em;text-transform:uppercase;color:#ffffff;margin:0 0 8px;">Fasulostudio</h1>
      <p style="font-size:12px;letter-spacing:0.25em;text-transform:uppercase;color:#8a8a8a;margin:0;">Newsletter Feedback</p>
    </div>
    <p style="font-size:15px;line-height:1.7;color:#999;margin:0 0 28px;text-align:center;">
      What's working? What's not? What do you want to see more of? I read every response.
    </p>
    <form method="POST" action="/api/feedback" style="margin:0;">
      <textarea
        name="feedback"
        maxlength="5000"
        required
        placeholder="Your feedback..."
        style="width:100%;min-height:180px;padding:20px;background:#0a0a0a;border:1px solid #1a1a1a;color:#d0d0d0;font-family:Georgia,'Times New Roman',Times,serif;font-size:15px;line-height:1.7;resize:vertical;box-sizing:border-box;outline:none;"
        onfocus="this.style.borderColor='#06b6d4'"
        onblur="this.style.borderColor='#1a1a1a'"
      ></textarea>
      <p style="margin:8px 0 24px;font-size:12px;color:#3a3a3a;text-align:right;">
        <span id="charCount">0</span> / 5,000
      </p>
      <div style="text-align:center;">
        <button
          type="submit"
          style="display:inline-block;padding:14px 48px;background:transparent;border:1px solid #06b6d4;color:#06b6d4;font-family:Georgia,'Times New Roman',Times,serif;font-size:13px;letter-spacing:0.2em;text-transform:uppercase;cursor:pointer;transition:all 0.2s;"
          onmouseover="this.style.background='#06b6d4';this.style.color='#050505'"
          onmouseout="this.style.background='transparent';this.style.color='#06b6d4'"
        >Submit Feedback</button>
      </div>
    </form>
  </div>
  <script>
    const textarea = document.querySelector('textarea');
    const counter = document.getElementById('charCount');
    textarea.addEventListener('input', () => {
      counter.textContent = textarea.value.length.toLocaleString();
    });
  </script>
</body>
</html>`
}

function renderSuccess() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thank You — Fasulostudio AI Newsletter</title>
</head>
<body style="margin:0;padding:0;background-color:#050505;font-family:Georgia,'Times New Roman',Times,serif;min-height:100vh;display:flex;align-items:center;justify-content:center;">
  <div style="max-width:480px;margin:0 auto;padding:60px 24px;text-align:center;">
    <p style="margin:0 0 12px;font-size:10px;letter-spacing:0.3em;text-transform:uppercase;color:#06b6d4;">Received</p>
    <h1 style="font-size:24px;font-weight:400;color:#ffffff;margin:0 0 16px;">Thanks for the feedback.</h1>
    <p style="font-size:15px;color:#8a8a8a;margin:0 0 32px;line-height:1.7;">
      I appreciate you taking the time. It helps shape what this newsletter becomes.
    </p>
    <a href="https://jtfasulo.com" style="display:inline-block;padding:14px 48px;border:1px solid #06b6d4;color:#06b6d4;text-decoration:none;font-size:13px;letter-spacing:0.2em;text-transform:uppercase;font-family:Georgia,'Times New Roman',Times,serif;">
      Back to site
    </a>
  </div>
</body>
</html>`
}
