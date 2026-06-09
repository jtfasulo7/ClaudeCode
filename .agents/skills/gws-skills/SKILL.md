---
name: gws-skills
description: Interact with Google Workspace APIs (Gmail, Drive, Docs, Sheets, Calendar, Contacts) using the Google API Node.js client or Python client libraries. Use when the user asks to read/send emails, manage files on Drive, read/write Sheets, create Docs, manage Calendar events, or work with any Google Workspace product.
compatibility: "Requires Node.js or Python. Install: `npm install googleapis` (Node) or `pip install google-api-python-client google-auth-httplib2 google-auth-oauthlib` (Python). Requires OAuth2 credentials from Google Cloud Console."
allowed-tools: Bash, Read, Write, Edit
---

# Google Workspace Skills

Interact with Google Workspace products (Gmail, Drive, Docs, Sheets, Calendar, Contacts) via the official Google APIs.

## Setup

### 1. Create Google Cloud credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project (or select an existing one)
3. Enable the APIs you need (Gmail API, Drive API, Sheets API, etc.)
4. Go to **APIs & Services → Credentials → Create Credentials → OAuth 2.0 Client ID**
5. Choose **Desktop app**, download the `credentials.json` file
6. Place `credentials.json` in your project root

### 2. Install dependencies

**Node.js:**
```bash
npm install googleapis
```

**Python:**
```bash
pip install google-api-python-client google-auth-httplib2 google-auth-oauthlib
```

### 3. First-run authentication

On first run, a browser window opens for OAuth consent. After approval, a `token.json` file is saved locally for future runs.

---

## Gmail

### Read inbox (Node.js)
```js
const { google } = require('googleapis');
const { authenticate } = require('./auth'); // see Auth Helper below

async function listEmails() {
  const auth = await authenticate(['https://www.googleapis.com/auth/gmail.readonly']);
  const gmail = google.gmail({ version: 'v1', auth });
  const res = await gmail.users.messages.list({ userId: 'me', maxResults: 10 });
  const messages = res.data.messages || [];
  for (const msg of messages) {
    const detail = await gmail.users.messages.get({ userId: 'me', id: msg.id });
    const subject = detail.data.payload.headers.find(h => h.name === 'Subject')?.value;
    console.log(subject);
  }
}
```

### Send email (Node.js)
```js
async function sendEmail(to, subject, body) {
  const auth = await authenticate(['https://www.googleapis.com/auth/gmail.send']);
  const gmail = google.gmail({ version: 'v1', auth });
  const raw = Buffer.from(
    `To: ${to}\r\nSubject: ${subject}\r\n\r\n${body}`
  ).toString('base64url');
  await gmail.users.messages.send({ userId: 'me', requestBody: { raw } });
}
```

### Search emails
```js
const res = await gmail.users.messages.list({
  userId: 'me',
  q: 'from:someone@example.com is:unread',
});
```

---

## Google Drive

### List files
```js
async function listFiles() {
  const auth = await authenticate(['https://www.googleapis.com/auth/drive.readonly']);
  const drive = google.drive({ version: 'v3', auth });
  const res = await drive.files.list({
    pageSize: 20,
    fields: 'files(id, name, mimeType, modifiedTime)',
  });
  res.data.files.forEach(f => console.log(f.name, f.id));
}
```

### Upload a file
```js
const fs = require('fs');
await drive.files.create({
  requestBody: { name: 'my-file.txt', mimeType: 'text/plain' },
  media: { mimeType: 'text/plain', body: fs.createReadStream('local-file.txt') },
});
```

### Download a file
```js
const dest = fs.createWriteStream('output.pdf');
await drive.files.get(
  { fileId: 'FILE_ID', alt: 'media' },
  { responseType: 'stream' }
).then(res => res.data.pipe(dest));
```

### Search files
```js
const res = await drive.files.list({
  q: "name contains 'budget' and mimeType='application/vnd.google-apps.spreadsheet'",
  fields: 'files(id, name)',
});
```

---

## Google Sheets

### Read a sheet
```js
async function readSheet(spreadsheetId, range) {
  const auth = await authenticate(['https://www.googleapis.com/auth/spreadsheets.readonly']);
  const sheets = google.sheets({ version: 'v4', auth });
  const res = await sheets.spreadsheets.values.get({ spreadsheetId, range });
  return res.data.values; // 2D array of cell values
}
```

### Write to a sheet
```js
async function writeSheet(spreadsheetId, range, values) {
  const auth = await authenticate(['https://www.googleapis.com/auth/spreadsheets']);
  const sheets = google.sheets({ version: 'v4', auth });
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values }, // e.g. [['Name', 'Score'], ['Alice', 95]]
  });
}
```

### Append rows
```js
await sheets.spreadsheets.values.append({
  spreadsheetId,
  range: 'Sheet1',
  valueInputOption: 'USER_ENTERED',
  requestBody: { values: [['new row', 'data']] },
});
```

---

## Google Docs

### Create a document
```js
async function createDoc(title) {
  const auth = await authenticate(['https://www.googleapis.com/auth/documents']);
  const docs = google.docs({ version: 'v1', auth });
  const res = await docs.documents.create({ requestBody: { title } });
  return res.data.documentId;
}
```

### Read a document
```js
const res = await docs.documents.get({ documentId: 'DOC_ID' });
const text = res.data.body.content
  .flatMap(el => el.paragraph?.elements || [])
  .map(el => el.textRun?.content || '')
  .join('');
```

### Insert text
```js
await docs.documents.batchUpdate({
  documentId: 'DOC_ID',
  requestBody: {
    requests: [{
      insertText: { location: { index: 1 }, text: 'Hello, world!\n' }
    }]
  }
});
```

---

## Google Calendar

### List upcoming events
```js
async function listEvents() {
  const auth = await authenticate(['https://www.googleapis.com/auth/calendar.readonly']);
  const calendar = google.calendar({ version: 'v3', auth });
  const res = await calendar.events.list({
    calendarId: 'primary',
    timeMin: new Date().toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime',
  });
  res.data.items.forEach(e => console.log(e.summary, e.start.dateTime));
}
```

### Create an event
```js
await calendar.events.insert({
  calendarId: 'primary',
  requestBody: {
    summary: 'Team Standup',
    start: { dateTime: '2026-03-25T09:00:00-05:00' },
    end: { dateTime: '2026-03-25T09:30:00-05:00' },
    attendees: [{ email: 'teammate@example.com' }],
  },
});
```

---

## Auth Helper (Node.js)

Save this as `auth.js` in your project:

```js
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const TOKEN_PATH = 'token.json';
const CREDENTIALS_PATH = 'credentials.json';

async function authenticate(scopes) {
  const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
  const { client_id, client_secret, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  if (fs.existsSync(TOKEN_PATH)) {
    oAuth2Client.setCredentials(JSON.parse(fs.readFileSync(TOKEN_PATH)));
    return oAuth2Client;
  }

  const authUrl = oAuth2Client.generateAuthUrl({ access_type: 'offline', scope: scopes });
  console.log('Open this URL to authorize:\n', authUrl);

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const code = await new Promise(resolve => rl.question('Enter the code: ', resolve));
  rl.close();

  const { tokens } = await oAuth2Client.getToken(code);
  oAuth2Client.setCredentials(tokens);
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
  return oAuth2Client;
}

module.exports = { authenticate };
```

---

## Common Scopes Reference

| Product | Read-only scope | Read/write scope |
|---------|----------------|-----------------|
| Gmail | `gmail.readonly` | `gmail.modify` or `gmail.send` |
| Drive | `drive.readonly` | `drive` or `drive.file` |
| Sheets | `spreadsheets.readonly` | `spreadsheets` |
| Docs | `documents.readonly` | `documents` |
| Calendar | `calendar.readonly` | `calendar` or `calendar.events` |

Full scope URLs are prefixed with `https://www.googleapis.com/auth/`.

Use the **least privileged scope** needed for the task.

---

## Best Practices

1. **Never commit `credentials.json` or `token.json`** — add them to `.gitignore`
2. **Use read-only scopes** unless writes are required
3. **Handle pagination** — most list endpoints return a `nextPageToken`; loop until exhausted
4. **Batch requests** where possible (Sheets `batchUpdate`, Drive batch) to stay within quota
5. **Respect rate limits** — add exponential backoff on 429/503 responses
6. **Use service accounts** for server-to-server automation (no browser OAuth flow needed)

---

## Troubleshooting

- **"Access blocked: App not verified"** — add your Google account as a test user in Cloud Console → OAuth consent screen
- **"insufficient authentication scopes"** — delete `token.json` and re-authenticate with the correct scopes
- **"Quota exceeded"** — check quotas in Cloud Console → APIs & Services → Quotas
- **"File not found" on Drive** — confirm the file ID is correct and the authenticated user has access
