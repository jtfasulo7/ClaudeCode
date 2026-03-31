const { google } = require('googleapis')

const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID

function getSheetClient() {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  )
  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  })
  return google.sheets({ version: 'v4', auth: oauth2Client })
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
