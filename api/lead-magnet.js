const path = require('path')
const fs = require('fs')
const { Resend } = require('resend')
const { appendToEmailList, checkDuplicateInEmailList } = require('../lib/googleSheets')

const resend = new Resend(process.env.RESEND_API_KEY)

const PDF_FILENAME = 'AI_Entrepreneurship_Guide_2026.pdf'
const PDF_PUBLIC_URL = 'https://www.jtfasulo.com/AI_Entrepreneurship_Guide_2026.pdf'
const PDF_BUNDLED_PATH = path.join(__dirname, '_assets', PDF_FILENAME)

// Cache the PDF buffer in module memory across warm invocations
let pdfBufferCache = null

async function getPdfBuffer() {
  if (pdfBufferCache) return pdfBufferCache
  // Try the bundled file first (fastest, no network)
  try {
    if (fs.existsSync(PDF_BUNDLED_PATH)) {
      pdfBufferCache = fs.readFileSync(PDF_BUNDLED_PATH)
      return pdfBufferCache
    }
  } catch (_) {}
  // Fall back to fetching from the public URL (works after deploy)
  const res = await fetch(PDF_PUBLIC_URL)
  if (!res.ok) throw new Error(`Failed to fetch PDF: ${res.status}`)
  const arrayBuffer = await res.arrayBuffer()
  pdfBufferCache = Buffer.from(arrayBuffer)
  return pdfBufferCache
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { email } = req.body || {}

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' })
  }

  // 1) Record the lead in the "Email List" sheet (idempotent — skip on dupe)
  let sheetSaved = false
  let sheetError = null
  try {
    const isDuplicate = await checkDuplicateInEmailList(email)
    if (isDuplicate) {
      sheetSaved = true // already there — counts as saved
    } else {
      await appendToEmailList(email, 'AI Entrepreneurship Guide')
      sheetSaved = true
    }
  } catch (err) {
    sheetError = (err && err.message) || String(err)
    console.error('Sheet write failed:', sheetError)
    // Don't block the user from getting the PDF if Sheets is misconfigured
  }

  // 2) Email the PDF as an attachment + a warm welcome
  let emailSent = false
  try {
    const pdfBuffer = await getPdfBuffer()
    const pdfBase64 = pdfBuffer.toString('base64')

    await resend.emails.send({
      from: 'JT Fasulo <newsletter@jtfasulo.com>',
      to: email,
      subject: "Your AI Entrepreneurship Guide is here ✨",
      attachments: [
        {
          filename: PDF_FILENAME,
          content: pdfBase64,
        },
      ],
      html: `
<div style="background-color:#050505;padding:0;margin:0;font-family:Georgia,'Times New Roman',Times,serif;">
  <div style="max-width:620px;margin:0 auto;padding:60px 20px;">

    <!-- Masthead -->
    <div style="text-align:center;padding:48px 0 40px;border-bottom:1px solid #2F6779;">
      <p style="margin:0 0 16px;font-size:11px;letter-spacing:0.35em;text-transform:uppercase;color:#2F6779;">Free Guide · 2026 Edition</p>
      <h1 style="margin:0 0 12px;font-size:32px;font-weight:400;letter-spacing:0.04em;color:#ffffff;font-family:Georgia,'Times New Roman',Times,serif;">The Beginner's Guide to AI in Entrepreneurship</h1>
    </div>

    <!-- Body -->
    <div style="padding:48px 8px 40px;">
      <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.3em;text-transform:uppercase;color:#2F6779;">Welcome aboard</p>
      <h2 style="margin:0 0 24px;font-size:24px;font-weight:400;line-height:1.35;color:#ffffff;font-family:Georgia,'Times New Roman',Times,serif;">Glad you're here.</h2>

      <p style="margin:0 0 22px;font-size:16px;line-height:1.85;color:#b8b8b8;font-family:Georgia,'Times New Roman',Times,serif;">
        Your free copy of <em>The Beginner's Guide to AI in Entrepreneurship</em> is attached to this email — yours to keep, share, and come back to whenever you need it.
      </p>

      <p style="margin:0 0 28px;font-size:16px;line-height:1.85;color:#b8b8b8;font-family:Georgia,'Times New Roman',Times,serif;">
        I wrote it for the version of myself that was just getting started — overwhelmed by every tool launch on Twitter and unsure which threads were worth pulling. It's the no-fluff version of what actually moves the needle when you're trying to build a real business with AI in 2026.
      </p>

      <!-- Backup download link (in case mail client strips attachments) -->
      <div style="text-align:center;margin:28px 0 36px;">
        <a href="${PDF_PUBLIC_URL}" download="${PDF_FILENAME}"
           style="display:inline-block;padding:14px 28px;background-color:#2F6779;color:#ffffff;font-size:12px;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;text-decoration:none;border-radius:8px;font-family:Inter,Helvetica,Arial,sans-serif;">
          Or Download Online
        </a>
        <p style="margin:12px 0 0;font-size:11px;color:#5a5a5a;font-family:Inter,Helvetica,Arial,sans-serif;">
          (Backup link in case your mail client strips the attachment.)
        </p>
      </div>

      <!-- Inside -->
      <div style="border-left:2px solid #2F6779;padding-left:24px;margin:0 0 36px;">
        <p style="margin:0 0 14px;font-size:11px;letter-spacing:0.3em;text-transform:uppercase;color:#2F6779;">Inside the guide</p>
        <p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:#e0e0e0;font-family:Georgia,'Times New Roman',Times,serif;">— Picking the right AI tools for your stage of business</p>
        <p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:#e0e0e0;font-family:Georgia,'Times New Roman',Times,serif;">— A 90-day operating cadence that compounds AI leverage</p>
        <p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:#e0e0e0;font-family:Georgia,'Times New Roman',Times,serif;">— A lean tech stack that scales from solo founder to first hire</p>
        <p style="margin:0;font-size:15px;line-height:1.7;color:#e0e0e0;font-family:Georgia,'Times New Roman',Times,serif;">— The seven mistakes that cost early founders six figures</p>
      </div>

      <p style="margin:0 0 12px;font-size:15px;line-height:1.85;color:#b8b8b8;font-family:Georgia,'Times New Roman',Times,serif;">
        If anything in here sparks a question or you want a second pair of eyes on something you're building, just hit reply — these emails come straight to me.
      </p>
      <p style="margin:0 0 24px;font-size:15px;line-height:1.85;color:#b8b8b8;font-family:Georgia,'Times New Roman',Times,serif;">
        Cheering you on.
      </p>
      <p style="margin:0;font-size:16px;color:#ffffff;font-family:Georgia,'Times New Roman',Times,serif;">
        — JT
      </p>
    </div>

    <!-- Footer -->
    <div style="border-top:1px solid #1a1a1a;padding:28px 8px 0;text-align:center;">
      <p style="margin:0;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#3a3a3a;">jtfasulo.com</p>
    </div>

  </div>
</div>
      `,
    })
    emailSent = true
  } catch (err) {
    console.error('Lead magnet email error:', err)
  }

  // 3) Best-effort notify JT of new lead
  try {
    await resend.emails.send({
      from: 'JT Fasulo <newsletter@jtfasulo.com>',
      to: 'jtfasulo7@gmail.com',
      subject: `New guide download: ${email}`,
      html: `<div style="font-family:Georgia,'Times New Roman',Times,serif;padding:24px;background:#050505;color:#d0d0d0;border:1px solid #1a1a1a;"><p style="margin:0 0 4px;font-size:10px;letter-spacing:0.3em;text-transform:uppercase;color:#2F6779;">New Guide Download</p><p style="margin:0;font-size:16px;color:#fff;">${email}</p></div>`,
    })
  } catch (_) {}

  return res.status(200).json({ success: true, emailSent, sheetSaved, sheetError })
}
