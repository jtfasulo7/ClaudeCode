const { google } = require('googleapis')

const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID

function getSheetClient() {
  const privateKey = (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n')
  const auth = new google.auth.JWT(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    null,
    privateKey,
    ['https://www.googleapis.com/auth/spreadsheets']
  )
  return google.sheets({ version: 'v4', auth })
}

async function getActiveSubscribers() {
  const sheets = getSheetClient()
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Emails!A2:C',
  })
  return res.data.values || []
}

async function appendSubscriber(email, token) {
  const sheets = getSheetClient()
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
  const sheets = getSheetClient()
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Emails!A2:C',
  })
  const rows = res.data.values || []
  const rowIndex = rows.findIndex((row) => row[2] === token)
  if (rowIndex === -1) return false

  // Get the sheet ID for the "Emails" tab
  const meta = await sheets.spreadsheets.get({
    spreadsheetId: SPREADSHEET_ID,
    fields: 'sheets.properties',
  })
  const emailsSheet = meta.data.sheets.find(
    (s) => s.properties.title === 'Emails'
  )
  const sheetId = emailsSheet.properties.sheetId

  // Delete the row (rowIndex + 2 because row 1 is header, and data starts at row 2)
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SPREADSHEET_ID,
    requestBody: {
      requests: [
        {
          deleteDimension: {
            range: {
              sheetId,
              dimension: 'ROWS',
              startIndex: rowIndex + 1, // 0-indexed, +1 for header row
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
  const sheets = getSheetClient()
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
  const sheets = getSheetClient()
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Emails!A2:A',
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
}
