module.exports = async function handler(req, res) {
  const checks = {}

  checks.sheetId = process.env.GOOGLE_SHEET_ID
  checks.sheetIdLength = (process.env.GOOGLE_SHEET_ID || '').length
  checks.hasClientId = !!process.env.GOOGLE_CLIENT_ID
  checks.hasClientSecret = !!process.env.GOOGLE_CLIENT_SECRET
  checks.hasRefreshToken = !!process.env.GOOGLE_REFRESH_TOKEN

  // Manual token refresh
  let accessToken = null
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
    if (tokenData.access_token) {
      accessToken = tokenData.access_token
      checks.tokenRefresh = 'OK'
      checks.scopes = tokenData.scope
    } else {
      checks.tokenRefresh = tokenData
    }
  } catch (e) {
    checks.tokenRefresh = e.message
  }

  // Direct Sheets API call (bypass googleapis library)
  if (accessToken) {
    try {
      const sheetId = process.env.GOOGLE_SHEET_ID
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Emails!A1:C1`
      const r = await fetch(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      const data = await r.json()
      checks.directApiCall = r.ok ? data : { status: r.status, body: data }
    } catch (e) {
      checks.directApiCall = e.message
    }
  }

  // Test via lib
  try {
    const { checkDuplicate } = require('../lib/googleSheets')
    const dup = await checkDuplicate('nonexistent@test.com')
    checks.libCall = 'OK, duplicate=' + dup
  } catch (e) {
    checks.libCall = e.message
  }

  return res.status(200).json(checks)
}
