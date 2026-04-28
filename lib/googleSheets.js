const { google } = require('googleapis')

const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID

async function getSheetClient() {
  // Manually refresh the token to get an access token, then use it
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

  if (!tokenData.access_token) {
    throw new Error('Failed to refresh Google token: ' + JSON.stringify(tokenData))
  }

  const oauth2Client = new google.auth.OAuth2()
  oauth2Client.setCredentials({ access_token: tokenData.access_token })
  return google.sheets({ version: 'v4', auth: oauth2Client })
}

async function getActiveSubscribers() {
  const sheets = await getSheetClient()
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Emails!A2:C',
  })
  return res.data.values || []
}

async function appendSubscriber(email, token) {
  const sheets = await getSheetClient()
  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Emails!A:C',
    valueInputOption: 'RAW',
    requestBody: {
      values: [[email, new Date().toISOString(), token]],
    },
  })
}

async function removeSubscriber(token) {
  const sheets = await getSheetClient()
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Emails!A2:C',
  })
  const rows = res.data.values || []
  const rowIndex = rows.findIndex((row) => row[2] === token)
  if (rowIndex === -1) return false

  const meta = await sheets.spreadsheets.get({
    spreadsheetId: SPREADSHEET_ID,
    fields: 'sheets.properties',
  })
  const emailsSheet = meta.data.sheets.find(
    (s) => s.properties.title === 'Emails'
  )
  const sheetId = emailsSheet.properties.sheetId

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SPREADSHEET_ID,
    requestBody: {
      requests: [
        {
          deleteDimension: {
            range: {
              sheetId,
              dimension: 'ROWS',
              startIndex: rowIndex + 1,
              endIndex: rowIndex + 2,
            },
          },
        },
      ],
    },
  })
  return true
}

async function logSend(date, subjectLine, recipientCount, status) {
  const sheets = await getSheetClient()
  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Send Log!A:D',
    valueInputOption: 'RAW',
    requestBody: {
      values: [[date, subjectLine, recipientCount, status]],
    },
  })
}

async function checkDuplicate(email) {
  const sheets = await getSheetClient()
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Emails!A2:A',
  })
  const rows = res.data.values || []
  const lowerEmail = email.toLowerCase()
  return rows.some((row) => row[0] && row[0].toLowerCase() === lowerEmail)
}

// ── Lead-magnet ("Email List" tab) helpers ────────────────────────
// Uses LEAD_MAGNET_SHEET_ID if set (dedicated spreadsheet for lead-magnet
// signups), otherwise falls back to the shared GOOGLE_SHEET_ID.
const LEAD_MAGNET_SHEET_ID = () =>
  process.env.LEAD_MAGNET_SHEET_ID || process.env.GOOGLE_SHEET_ID

async function appendToEmailList(email, source = 'AI Entrepreneurship Guide') {
  const sheets = await getSheetClient()
  await sheets.spreadsheets.values.append({
    spreadsheetId: LEAD_MAGNET_SHEET_ID(),
    range: 'Email List!A:C',
    valueInputOption: 'RAW',
    requestBody: {
      values: [[email, new Date().toISOString(), source]],
    },
  })
}

async function checkDuplicateInEmailList(email) {
  const sheets = await getSheetClient()
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: LEAD_MAGNET_SHEET_ID(),
    range: 'Email List!A2:A',
  })
  const rows = res.data.values || []
  const lowerEmail = email.toLowerCase()
  return rows.some((row) => row[0] && row[0].toLowerCase() === lowerEmail)
}

module.exports = {
  getSheetClient,
  getActiveSubscribers,
  appendSubscriber,
  removeSubscriber,
  logSend,
  checkDuplicate,
  appendToEmailList,
  checkDuplicateInEmailList,
}
