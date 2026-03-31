module.exports = async function handler(req, res) {
  const checks = {}

  // Check env vars
  checks.hasGoogleSheetId = !!process.env.GOOGLE_SHEET_ID
  checks.hasGoogleEmail = !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
  checks.hasGoogleKey = !!process.env.GOOGLE_PRIVATE_KEY
  checks.googleKeyLength = (process.env.GOOGLE_PRIVATE_KEY || '').length
  checks.hasResendKey = !!process.env.RESEND_API_KEY

  // Check module resolution
  try {
    require('googleapis')
    checks.googleapis = 'OK'
  } catch (e) {
    checks.googleapis = e.message
  }

  try {
    require('resend')
    checks.resend = 'OK'
  } catch (e) {
    checks.resend = e.message
  }

  try {
    require('@anthropic-ai/sdk')
    checks.anthropic = 'OK'
  } catch (e) {
    checks.anthropic = e.message
  }

  // Try sheets connection
  try {
    const { google } = require('googleapis')
    const privateKey = (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n')
    const auth = new google.auth.JWT(
      process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      null,
      privateKey,
      ['https://www.googleapis.com/auth/spreadsheets']
    )
    const sheets = google.sheets({ version: 'v4', auth })
    const r = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Emails!A1:C1',
    })
    checks.sheetsRead = r.data.values
  } catch (e) {
    checks.sheetsRead = e.message
  }

  return res.status(200).json(checks)
}
