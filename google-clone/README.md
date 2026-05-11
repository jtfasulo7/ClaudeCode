# Google clone

A working Google-style search front-end backed by the [Google Custom Search JSON API](https://developers.google.com/custom-search/v1/overview).

## Stack

- Node.js 18+ with built-in `fetch`
- Express 4 (static files + `/api/search` proxy that hides your API key)
- Vanilla HTML/CSS/JS — no build step

## Setup

1. Get credentials:
   - **API key** — https://console.cloud.google.com/apis/credentials → *Create credentials* → *API key*. Then enable *Custom Search API* on the project.
   - **CSE ID (cx)** — https://programmablesearchengine.google.com/ → *Add* a new search engine. Set it to *Search the entire web* if you want broad results. Copy the *Search engine ID*.

2. Configure:
   ```bash
   cp .env.example .env
   # then edit .env and fill in GOOGLE_API_KEY and GOOGLE_CSE_ID
   ```

3. Install + run:
   ```bash
   npm install
   npm start
   ```

4. Open http://localhost:3000

## How it works

- `public/index.html` — Google homepage replica (logo, search box, two buttons).
- `public/search.html` + `public/app.js` — results page that calls `/api/search`.
- `server.js` — Express server. Serves static files and proxies `/api/search?q=…&start=…` to Google Custom Search, returning a trimmed JSON shape.

The API key never touches the browser.

## Free-tier limits

Google Custom Search JSON API gives 100 queries/day free. Beyond that it is paid (or returns a 429).
