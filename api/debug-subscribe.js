module.exports = async function handler(req, res) {
  const checks = {}

  checks.hasGoogleSheetId = !!process.env.GOOGLE_SHEET_ID
  checks.hasClientId = !!process.env.GOOGLE_CLIENT_ID
  checks.hasClientSecret = !!process.env.GOOGLE_CLIENT_SECRET
  checks.hasRefreshToken = !!process.env.GOOGLE_REFRESH_TOKEN
  checks.hasResendKey = !!process.env.RESEND_API_KEY
  checks.hasAnthropicKey = !!process.env.ANTHROPIC_API_KEY

  try {
    require('googleapis')
    checks.googleapis = 'OK'
  } catch (e) {
    checks.googleapis = e.message
  }

  try {
    const { getSheetClient } = require('../lib/googleSheets')
    checks.libImport = 'OK'
  } catch (e) {
    checks.libImport = e.message
  }

  try {
    const { checkDuplicate } = require('../lib/googleSheets')
    const dup = await checkDuplicate('debug-test-nonexistent@test.com')
    checks.sheetsRead = 'OK, duplicate=' + dup
  } catch (e) {
    checks.sheetsRead = e.message
  }

  return res.status(200).json(checks)
}
