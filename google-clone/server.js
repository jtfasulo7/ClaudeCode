import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.GOOGLE_API_KEY;
const CSE_ID = process.env.GOOGLE_CSE_ID;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/search', async (req, res) => {
  const q = (req.query.q || '').toString().trim();
  const start = Math.max(1, parseInt(req.query.start, 10) || 1);

  if (!q) {
    return res.status(400).json({ error: 'Missing query parameter "q".' });
  }
  if (!API_KEY || !CSE_ID) {
    return res.status(500).json({
      error: 'Server is missing GOOGLE_API_KEY or GOOGLE_CSE_ID. Copy .env.example to .env and fill in your credentials.',
    });
  }

  const url = new URL('https://www.googleapis.com/customsearch/v1');
  url.searchParams.set('key', API_KEY);
  url.searchParams.set('cx', CSE_ID);
  url.searchParams.set('q', q);
  url.searchParams.set('start', String(start));
  url.searchParams.set('num', '10');

  try {
    const upstream = await fetch(url, { headers: { Accept: 'application/json' } });
    const data = await upstream.json();

    if (!upstream.ok) {
      const message = data?.error?.message || `Upstream returned ${upstream.status}`;
      return res.status(upstream.status).json({ error: message });
    }

    res.json({
      query: q,
      start,
      searchTime: data.searchInformation?.searchTime ?? null,
      totalResults: data.searchInformation?.formattedTotalResults ?? '0',
      items: (data.items || []).map((item) => ({
        title: item.title,
        link: item.link,
        displayLink: item.displayLink,
        snippet: item.snippet,
        thumbnail: item.pagemap?.cse_thumbnail?.[0]?.src || null,
      })),
      nextPageStart: data.queries?.nextPage?.[0]?.startIndex ?? null,
      prevPageStart: data.queries?.previousPage?.[0]?.startIndex ?? null,
    });
  } catch (err) {
    res.status(502).json({ error: `Failed to reach Google: ${err.message}` });
  }
});

app.get('/search', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'search.html'));
});

app.listen(PORT, () => {
  console.log(`Google clone listening on http://localhost:${PORT}`);
  if (!API_KEY || !CSE_ID) {
    console.warn('WARNING: GOOGLE_API_KEY or GOOGLE_CSE_ID is not set. /api/search will return 500.');
  }
});
