require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

const PORT = process.env.PORT || 3000;
const IG_TOKEN = process.env.IG_TOKEN;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

let cachedKB = null;

// ─── Instagram fetch & KB builder ────────────────────────────────────────────

async function fetchInstagramData() {
  const url = `https://graph.instagram.com/me/media?fields=id,caption,media_type,timestamp,like_count,comments_count,permalink&limit=25&access_token=${IG_TOKEN}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`IG API error ${res.status}: ${await res.text()}`);
  const json = await res.json();
  return json.data || [];
}

function extractHashtags(caption) {
  if (!caption) return [];
  const matches = caption.match(/#\w+/g);
  return matches ? [...new Set(matches.map(h => h.toLowerCase()))] : [];
}

function buildKB(rawPosts) {
  const posts = rawPosts.map(p => {
    const likes = p.like_count || 0;
    const comments = p.comments_count || 0;
    const engRate = parseFloat(((likes + comments) / 108 * 100).toFixed(1));
    return {
      id: p.id,
      caption: p.caption || '',
      type: p.media_type || 'REEL',
      date: new Date(p.timestamp).toLocaleDateString('en-US', { month:'short', day:'numeric' }),
      timestamp: p.timestamp,
      likes,
      comments,
      permalink: p.permalink || '',
      engRate,
      hashtags: extractHashtags(p.caption)
    };
  });

  const totalLikes = posts.reduce((s, p) => s + p.likes, 0);
  const totalComments = posts.reduce((s, p) => s + p.comments, 0);
  const avgLikes = posts.length ? parseFloat((totalLikes / posts.length).toFixed(1)) : 0;
  const avgComments = posts.length ? parseFloat((totalComments / posts.length).toFixed(1)) : 0;
  const avgEngRate = posts.length
    ? parseFloat((posts.reduce((s, p) => s + p.engRate, 0) / posts.length).toFixed(1))
    : 0;
  const topPost = posts.reduce((best, p) => (!best || p.likes > best.likes ? p : best), null);

  // Hashtag frequency
  const tagMap = {};
  posts.forEach(p => {
    p.hashtags.forEach(tag => {
      if (!tagMap[tag]) tagMap[tag] = { tag, uses: 0, totalLikes: 0 };
      tagMap[tag].uses++;
      tagMap[tag].totalLikes += p.likes;
    });
  });
  const hashtags = Object.values(tagMap)
    .map(t => ({ ...t, avgLikes: parseFloat((t.totalLikes / t.uses).toFixed(1)) }))
    .sort((a, b) => b.uses - a.uses);

  return {
    updatedAt: new Date().toISOString(),
    account: {
      username: 'fasulostudio',
      name: 'JT Fasulo',
      followers: 108,
      accountType: 'BUSINESS'
    },
    posts,
    summary: {
      postsAnalyzed: posts.length,
      totalLikes,
      totalComments,
      avgLikes,
      avgComments,
      avgEngRate,
      topPost
    },
    hashtags
  };
}

function writeKBFiles(kb) {
  // JSON
  fs.writeFileSync(path.join(__dirname, 'knowledge-base.json'), JSON.stringify(kb, null, 2));

  // HTML
  const postsRows = kb.posts.map(p => `
    <tr>
      <td>${p.date}</td>
      <td>${(p.caption || '').slice(0, 60)}${p.caption && p.caption.length > 60 ? '…' : ''}</td>
      <td>${p.type}</td>
      <td>${p.likes}</td>
      <td>${p.comments}</td>
      <td>${p.engRate}%</td>
      <td><a href="${p.permalink}" target="_blank" style="color:#00D4FF">View</a></td>
    </tr>`).join('');

  const tagRows = kb.hashtags.slice(0, 20).map(t => `
    <tr>
      <td>${t.tag}</td>
      <td>${t.uses}</td>
      <td>${t.avgLikes}</td>
    </tr>`).join('');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>JARVIS Knowledge Base — @fasulostudio</title>
<style>
  body { background:#000814; color:#00D4FF; font-family:'Courier New',monospace; padding:2rem; }
  h1,h2 { color:#C8A96E; }
  table { border-collapse:collapse; width:100%; margin-bottom:2rem; }
  th { color:#C8A96E; border-bottom:1px solid #C8A96E44; padding:8px 12px; text-align:left; }
  td { padding:6px 12px; border-bottom:1px solid #00D4FF11; color:#F0EBE0; }
  .badge { display:inline-block; background:#C8A96E22; color:#C8A96E; border:1px solid #C8A96E44; border-radius:4px; padding:2px 8px; font-size:0.75rem; }
  .updated { color:#9A9488; font-size:0.8rem; margin-bottom:2rem; }
</style>
</head>
<body>
<h1>JARVIS Analytics — @${kb.account.username}</h1>
<p class="updated">Last updated: ${new Date(kb.updatedAt).toLocaleString()}</p>

<h2>Account Overview</h2>
<table>
  <tr><th>Field</th><th>Value</th></tr>
  <tr><td>Name</td><td>${kb.account.name}</td></tr>
  <tr><td>Username</td><td>@${kb.account.username}</td></tr>
  <tr><td>Followers</td><td>${kb.account.followers}</td></tr>
  <tr><td>Account Type</td><td><span class="badge">${kb.account.accountType}</span></td></tr>
  <tr><td>Posts Analyzed</td><td>${kb.summary.postsAnalyzed}</td></tr>
  <tr><td>Total Likes</td><td>${kb.summary.totalLikes}</td></tr>
  <tr><td>Total Comments</td><td>${kb.summary.totalComments}</td></tr>
  <tr><td>Avg Likes</td><td>${kb.summary.avgLikes}</td></tr>
  <tr><td>Avg Eng Rate</td><td>${kb.summary.avgEngRate}%</td></tr>
</table>

<h2>Recent Posts</h2>
<table>
  <tr><th>Date</th><th>Caption</th><th>Type</th><th>Likes</th><th>Comments</th><th>Eng Rate</th><th>Link</th></tr>
  ${postsRows}
</table>

<h2>Hashtag Intelligence</h2>
<table>
  <tr><th>Tag</th><th>Uses</th><th>Avg Likes</th></tr>
  ${tagRows}
</table>

<script>window.JARVIS_KB = ${JSON.stringify(kb)}</script>
</body>
</html>`;

  fs.writeFileSync(path.join(__dirname, 'knowledge-base.html'), html);
}

async function refreshKB() {
  try {
    const raw = await fetchInstagramData();
    const kb = buildKB(raw);
    cachedKB = kb;
    writeKBFiles(kb);
    const time = new Date().toLocaleTimeString('en-US', { hour12: false });
    console.log(`[${time}] KB refreshed — ${kb.posts.length} posts`);
  } catch (err) {
    console.error('[KB refresh error]', err.message);
  }
}

// ─── Routes ──────────────────────────────────────────────────────────────────

app.get('/api/kb', (req, res) => {
  if (cachedKB) return res.json(cachedKB);
  // Try reading from disk if not yet in memory
  const diskPath = path.join(__dirname, 'knowledge-base.json');
  if (fs.existsSync(diskPath)) {
    try {
      const kb = JSON.parse(fs.readFileSync(diskPath, 'utf8'));
      cachedKB = kb;
      return res.json(kb);
    } catch (_) {}
  }
  res.status(503).json({ error: 'Knowledge base not yet loaded. Try again shortly.' });
});

app.post('/api/jarvis', async (req, res) => {
  const { message, history = [] } = req.body;

  if (!ANTHROPIC_API_KEY || ANTHROPIC_API_KEY === 'your-anthropic-api-key-here') {
    return res.status(500).json({ error: 'Configure ANTHROPIC_API_KEY in .env' });
  }

  const kbJson = cachedKB ? JSON.stringify(cachedKB, null, 2) : '{}';

  const systemPrompt = `You are JARVIS, the AI analytics assistant for @fasulostudio on Instagram. You serve JT Fasulo, your creator and operator.

Address the user as "sir" at natural moments (not every sentence). Speak with dry British wit, precision, and confidence. Be concise — your responses are read aloud via text-to-speech, so aim for 2–4 sentences unless detail is specifically requested. Avoid markdown formatting; use plain prose.

Your primary function is to analyze and report on @fasulostudio's Instagram performance. You have full access to the live analytics knowledge base below.

KNOWLEDGE BASE (live data):
${kbJson}

Key context:
- @fasulostudio has ${cachedKB?.account?.followers || 108} followers
- You track the last ${cachedKB?.summary?.postsAnalyzed || 25} posts
- Top performing post: ${cachedKB?.summary?.topPost ? `${cachedKB.summary.topPost.likes} likes on "${(cachedKB.summary.topPost.caption || '').slice(0, 50)}"` : 'N/A'}
- Average engagement rate: ${cachedKB?.summary?.avgEngRate || 0}%

When answering questions, reference specific numbers from the knowledge base. Be proactive in surfacing insights. If asked something outside your data, acknowledge it crisply and redirect to what you do know.`;

  // Build messages array: history (last 6 exchanges = 12 messages) + new user message
  const recentHistory = history.slice(-12);
  const messages = [
    ...recentHistory,
    { role: 'user', content: message }
  ];

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 350,
        system: systemPrompt,
        messages
      })
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Anthropic API error ${response.status}: ${err}`);
    }

    const data = await response.json();
    const reply = data.content?.[0]?.text || 'No response generated.';
    res.json({ reply });
  } catch (err) {
    console.error('[JARVIS API error]', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ─── Start ────────────────────────────────────────────────────────────────────

app.listen(PORT, async () => {
  console.log(`JARVIS Dashboard → http://localhost:${PORT}`);
  await refreshKB();
  setInterval(refreshKB, 15 * 60 * 1000);
});
