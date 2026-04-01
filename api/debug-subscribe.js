module.exports = async function handler(req, res) {
  const checks = {}

  checks.hasGoogleSheetId = !!process.env.GOOGLE_SHEET_ID
  checks.hasClientId = !!process.env.GOOGLE_CLIENT_ID
  checks.clientIdPreview = (process.env.GOOGLE_CLIENT_ID || '').substring(0, 15) + '...'
  checks.hasClientSecret = !!process.env.GOOGLE_CLIENT_SECRET
  checks.secretPreview = (process.env.GOOGLE_CLIENT_SECRET || '').substring(0, 8) + '...'
  checks.hasRefreshToken = !!process.env.GOOGLE_REFRESH_TOKEN
  checks.refreshPreview = (process.env.GOOGLE_REFRESH_TOKEN || '').substring(0, 10) + '...'

  // Test manual token refresh
  try {
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
        grant_type: 'refresh_token',
      }),
    })
    const tokenData = await tokenResponse.json()
    checks.tokenRefresh = tokenData.access_token ? 'OK' : tokenData
  } catch (e) {
    checks.tokenRefresh = e.message
  }

  // Test sheets read
  try {
    const { checkDuplicate } = require('../lib/googleSheets')
    const dup = await checkDuplicate('nonexistent@test.com')
    checks.sheetsRead = 'OK, duplicate=' + dup
  } catch (e) {
    checks.sheetsRead = e.message
  }

  return res.status(200).json(checks)
}
