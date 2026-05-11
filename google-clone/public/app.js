const params = new URLSearchParams(location.search);
const query = (params.get('q') || '').trim();
const start = parseInt(params.get('start'), 10) || 1;
const lucky = params.get('lucky') === '1';

const input = document.getElementById('q');
const resultsEl = document.getElementById('results');

if (query) {
  input.value = query;
  document.title = `${query} · Google`;
  runSearch(query, start, lucky);
} else {
  resultsEl.innerHTML = '<p class="empty">Type something in the search bar above to begin.</p>';
}

async function runSearch(q, startIndex, luckyMode) {
  resultsEl.innerHTML = '<p class="empty">Searching…</p>';
  try {
    const url = `/api/search?q=${encodeURIComponent(q)}&start=${startIndex}`;
    const res = await fetch(url);
    const data = await res.json();

    if (!res.ok) {
      resultsEl.innerHTML = `<p class="error">${escapeHtml(data.error || 'Search failed.')}</p>`;
      return;
    }

    if (luckyMode && data.items && data.items.length > 0) {
      window.location.replace(data.items[0].link);
      return;
    }

    if (!data.items || data.items.length === 0) {
      resultsEl.innerHTML = `<p class="empty">No results found for <strong>${escapeHtml(q)}</strong>.</p>`;
      return;
    }

    const meta = `About ${data.totalResults} results${data.searchTime ? ` (${data.searchTime} seconds)` : ''}`;

    const itemsHtml = data.items.map((item) => `
      <article class="result">
        <div class="url">${escapeHtml(item.displayLink || '')}</div>
        <h3><a href="${escapeAttr(item.link)}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.title || item.link)}</a></h3>
        <p class="snippet">${escapeHtml(item.snippet || '')}</p>
      </article>
    `).join('');

    const pager = [];
    if (data.prevPageStart) {
      pager.push(`<a href="/search?q=${encodeURIComponent(q)}&start=${data.prevPageStart}">‹ Previous</a>`);
    }
    if (data.nextPageStart) {
      pager.push(`<a href="/search?q=${encodeURIComponent(q)}&start=${data.nextPageStart}">Next ›</a>`);
    }

    resultsEl.innerHTML = `
      <div class="search-meta">${escapeHtml(meta)}</div>
      ${itemsHtml}
      ${pager.length ? `<nav class="pager">${pager.join('')}</nav>` : ''}
    `;
  } catch (err) {
    resultsEl.innerHTML = `<p class="error">Network error: ${escapeHtml(err.message)}</p>`;
  }
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}
function escapeAttr(str) {
  return escapeHtml(str);
}
