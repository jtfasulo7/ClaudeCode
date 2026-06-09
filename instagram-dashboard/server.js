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
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const ELEVENLABS_VOICE_ID = process.env.ELEVENLABS_VOICE_ID || 'JBFqnCBsd6RMkjVDRZzb'; // George — British male

let cachedKB = null;

// ─── Instagram fetch & KB builder ────────────────────────────────────────────

async function fetchInstagramData() {
  const url = `https://graph.instagram.com/me/media?fields=id,caption,media_type,timestamp,like_count,comments_count,permalink,thumbnail_url,media_url&limit=25&access_token=${IG_TOKEN}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`IG API error ${res.status}: ${await res.text()}`);
  const json = await res.json();
  const posts = json.data || [];

  // Fetch insights (views, reach, shares, saves) for each post in parallel
  await Promise.all(posts.map(async p => {
    try {
      const iUrl = `https://graph.instagram.com/${p.id}/insights?metric=views,reach,shares,saved&access_token=${IG_TOKEN}`;
      const ir = await fetch(iUrl);
      if (!ir.ok) return;
      const iJson = await ir.json();
      const data = iJson.data || [];
      data.forEach(m => {
        const val = m.values?.[0]?.value ?? m.value ?? 0;
        if (m.name === 'views')  p.play_count       = val;
        if (m.name === 'reach')  p.reach_count      = val;
        if (m.name === 'shares') p.share_count      = val;
        if (m.name === 'saved')  p.save_count       = val;
      });
    } catch (_) { /* insights optional */ }
  }));

  return posts;
}

function extractHashtags(caption) {
  if (!caption) return [];
  const matches = caption.match(/#\w+/g);
  return matches ? [...new Set(matches.map(h => h.toLowerCase()))] : [];
}

function categorisePost(caption) {
  const c = (caption || '').toLowerCase();
  if (/joke|cooked|lol|just how|all joke|chat|meme|funny/.test(c))          return 'humor';
  if (/foundation|learn|use case|how to|tips|personal use|every day/.test(c)) return 'educational';
  if (/concept|cinematic|trojan|set|brand|visual|music|dj|chef|spotify|apple music/.test(c)) return 'cinematic_collab';
  if (/kling|nanobanana|nanobana|higgsfield|ai\.|ai$|claude|codex|\.ai/.test(c)) return 'ai_tools';
  return 'general';
}

function buildKB(rawPosts) {
  const FOLLOWERS = 108;

  const now = new Date();
  const daysAgo = d => Math.floor((now - new Date(d)) / (1000 * 60 * 60 * 24));

  const posts = rawPosts.map(p => {
    const likes    = p.like_count    || 0;
    const comments = p.comments_count || 0;
    const views    = p.play_count      || 0;
    const reach    = p.reach_count     || 0;
    const impressions = p.impression_count || 0;
    const engRate  = parseFloat(((likes + comments) / FOLLOWERS * 100).toFixed(1));
    const viewRate = views > 0 && FOLLOWERS > 0 ? parseFloat((views / FOLLOWERS * 100).toFixed(1)) : 0;
    const dt       = new Date(p.timestamp);
    const age      = daysAgo(p.timestamp);
    const days     = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    return {
      id:         p.id,
      caption:    p.caption || '',
      type:       p.media_type || 'VIDEO',
      date:       dt.toLocaleDateString('en-US', { month:'short', day:'numeric' }),
      dayOfWeek:  days[dt.getDay()],
      hour:       dt.getHours(),
      timestamp:  p.timestamp,
      daysAgo:    age,
      likes,
      comments,
      views,
      reach,
      impressions,
      totalEngagement: likes + comments,
      likeToCommentRatio: comments > 0 ? parseFloat((likes / comments).toFixed(1)) : likes,
      permalink:   p.permalink || '',
      thumbnailUrl: p.thumbnail_url || p.media_url || null,
      engRate,
      viewRate,
      hashtags:   extractHashtags(p.caption),
      hashtagCount: extractHashtags(p.caption).length,
      category:   categorisePost(p.caption),
    };
  });

  // ── Core stats ──────────────────────────────────────────────────────────────
  const sorted       = [...posts].sort((a,b) => b.likes - a.likes);
  const totalLikes   = posts.reduce((s,p) => s + p.likes, 0);
  const totalComments= posts.reduce((s,p) => s + p.comments, 0);
  const totalViews   = posts.reduce((s,p) => s + p.views, 0);
  const avgLikes     = parseFloat((totalLikes   / posts.length).toFixed(1));
  const avgComments  = parseFloat((totalComments / posts.length).toFixed(1));
  const avgViews     = parseFloat((totalViews    / posts.length).toFixed(1));
  const avgEngRate   = parseFloat((posts.reduce((s,p) => s+p.engRate, 0) / posts.length).toFixed(1));
  const medianLikes  = (() => { const s=[...posts].sort((a,b)=>a.likes-b.likes); const m=Math.floor(s.length/2); return s.length%2 ? s[m].likes : (s[m-1].likes+s[m].likes)/2; })();
  const topPost      = sorted[0];
  const bottomPost   = sorted[sorted.length - 1];
  const viralPost    = sorted.find(p => p.likes > avgLikes * 3) || null;
  const mostViewed   = [...posts].sort((a,b) => b.views - a.views)[0];
  const hasViewData  = totalViews > 0;

  // ── Time-window helper ───────────────────────────────────────────────────────
  function windowStats(days) {
    const subset = posts.filter(p => p.daysAgo <= days);
    if (!subset.length) return { posts: 0, days };
    return {
      days,
      posts:      subset.length,
      totalLikes: subset.reduce((s,p) => s+p.likes, 0),
      totalViews: subset.reduce((s,p) => s+p.views, 0),
      totalComments: subset.reduce((s,p) => s+p.comments, 0),
      avgLikes:   parseFloat((subset.reduce((s,p)=>s+p.likes,0)  / subset.length).toFixed(1)),
      avgViews:   parseFloat((subset.reduce((s,p)=>s+p.views,0)  / subset.length).toFixed(1)),
      avgEngRate: parseFloat((subset.reduce((s,p)=>s+p.engRate,0)/ subset.length).toFixed(1)),
      topPost:    [...subset].sort((a,b)=>b.likes-a.likes)[0],
      topViewed:  [...subset].sort((a,b)=>b.views-a.views)[0],
      postDates:  subset.map(p => `${p.date} (${p.daysAgo}d ago, ${p.likes} likes${p.views ? ', '+p.views+' views' : ''})`),
    };
  }
  const windows = {
    last7:  windowStats(7),
    last14: windowStats(14),
    last30: windowStats(30),
  };

  // ── Performance tiers ───────────────────────────────────────────────────────
  posts.forEach(p => {
    const ratio = p.likes / avgLikes;
    if      (ratio >= 4)   p.tier = 'viral';
    else if (ratio >= 1.5) p.tier = 'above_average';
    else if (ratio >= 0.7) p.tier = 'average';
    else                   p.tier = 'below_average';
    p.vsAvgPercent = parseFloat(((p.likes - avgLikes) / avgLikes * 100).toFixed(0));
  });

  // ── Hashtag intelligence ────────────────────────────────────────────────────
  const tagMap = {};
  posts.forEach(p => {
    p.hashtags.forEach(tag => {
      if (!tagMap[tag]) tagMap[tag] = { tag, uses:0, totalLikes:0, totalComments:0, posts:[] };
      tagMap[tag].uses++;
      tagMap[tag].totalLikes    += p.likes;
      tagMap[tag].totalComments += p.comments;
      tagMap[tag].posts.push({ date:p.date, likes:p.likes });
    });
  });
  const hashtags = Object.values(tagMap).map(t => ({
    tag:        t.tag,
    uses:       t.uses,
    avgLikes:   parseFloat((t.totalLikes    / t.uses).toFixed(1)),
    avgComments:parseFloat((t.totalComments / t.uses).toFixed(1)),
    bestPost:   t.posts.sort((a,b) => b.likes-a.likes)[0],
    performanceVsAvg: parseFloat(((t.totalLikes/t.uses - avgLikes) / avgLikes * 100).toFixed(0)),
  })).sort((a,b) => b.avgLikes - a.avgLikes);

  // ── Category analysis ───────────────────────────────────────────────────────
  const catMap = {};
  posts.forEach(p => {
    if (!catMap[p.category]) catMap[p.category] = { count:0, totalLikes:0, totalComments:0, totalEngRate:0 };
    catMap[p.category].count++;
    catMap[p.category].totalLikes    += p.likes;
    catMap[p.category].totalComments += p.comments;
    catMap[p.category].totalEngRate  += p.engRate;
  });
  const categories = Object.entries(catMap).map(([name, d]) => ({
    name,
    count:      d.count,
    avgLikes:   parseFloat((d.totalLikes    / d.count).toFixed(1)),
    avgComments:parseFloat((d.totalComments / d.count).toFixed(1)),
    avgEngRate: parseFloat((d.totalEngRate  / d.count).toFixed(1)),
    shareOfFeed: parseFloat((d.count / posts.length * 100).toFixed(0)) + '%',
  })).sort((a,b) => b.avgLikes - a.avgLikes);

  // ── Day-of-week analysis ────────────────────────────────────────────────────
  const dowMap = {};
  posts.forEach(p => {
    if (!dowMap[p.dayOfWeek]) dowMap[p.dayOfWeek] = { count:0, totalLikes:0, totalEngRate:0 };
    dowMap[p.dayOfWeek].count++;
    dowMap[p.dayOfWeek].totalLikes   += p.likes;
    dowMap[p.dayOfWeek].totalEngRate += p.engRate;
  });
  const byDayOfWeek = Object.entries(dowMap).map(([day, d]) => ({
    day, count: d.count,
    avgLikes:   parseFloat((d.totalLikes   / d.count).toFixed(1)),
    avgEngRate: parseFloat((d.totalEngRate / d.count).toFixed(1)),
  })).sort((a,b) => b.avgLikes - a.avgLikes);

  // ── Trend analysis (chronological) ─────────────────────────────────────────
  const chrono       = [...posts].sort((a,b) => new Date(a.timestamp)-new Date(b.timestamp));
  const firstHalf    = chrono.slice(0, Math.floor(chrono.length/2));
  const secondHalf   = chrono.slice(Math.floor(chrono.length/2));
  const firstAvgLikes  = parseFloat((firstHalf.reduce((s,p)=>s+p.likes,0)  / firstHalf.length).toFixed(1));
  const secondAvgLikes = parseFloat((secondHalf.reduce((s,p)=>s+p.likes,0) / secondHalf.length).toFixed(1));
  const trendDirection = secondAvgLikes > firstAvgLikes ? 'improving' : secondAvgLikes < firstAvgLikes ? 'declining' : 'stable';
  const trendPercent   = parseFloat(((secondAvgLikes - firstAvgLikes) / firstAvgLikes * 100).toFixed(1));

  // ── Hashtag vs no-hashtag comparison ───────────────────────────────────────
  const withTags    = posts.filter(p => p.hashtagCount > 0);
  const withoutTags = posts.filter(p => p.hashtagCount === 0);
  const avgLikesWithTags    = withTags.length    ? parseFloat((withTags.reduce((s,p)=>s+p.likes,0)    / withTags.length).toFixed(1))    : 0;
  const avgLikesWithoutTags = withoutTags.length ? parseFloat((withoutTags.reduce((s,p)=>s+p.likes,0) / withoutTags.length).toFixed(1)) : 0;

  // ── Engagement quality ──────────────────────────────────────────────────────
  const mostCommented = [...posts].sort((a,b) => b.comments - a.comments)[0];
  const highestEngRate = [...posts].sort((a,b) => b.engRate - a.engRate)[0];
  const mostConsistentEngagement = posts.filter(p => Math.abs(p.vsAvgPercent) < 30);

  // ── Strategic insights (computed) ───────────────────────────────────────────
  const bestCategory   = categories[0];
  const bestDay        = byDayOfWeek[0];
  const bestHashtag    = hashtags[0];
  const insights = [
    `Best content category is "${bestCategory?.name}" with an average of ${bestCategory?.avgLikes} likes.`,
    `Humor-led content achieves ${((categories.find(c=>c.name==='humor')?.avgLikes||0) / avgLikes * 100).toFixed(0)}% of account average likes.`,
    `Posts ${withoutTags.length > 0 ? (avgLikesWithoutTags > avgLikesWithTags ? 'WITHOUT' : 'WITH') : 'with'} hashtags perform better on average (${Math.max(avgLikesWithTags, avgLikesWithoutTags)} vs ${Math.min(avgLikesWithTags, avgLikesWithoutTags)} avg likes).`,
    `Engagement trend is ${trendDirection}: ${trendPercent > 0 ? '+' : ''}${trendPercent}% comparing first half to second half of analyzed posts.`,
    `Best posting day observed: ${bestDay?.day} (${bestDay?.avgLikes} avg likes).`,
    `Top hashtag by avg likes: ${bestHashtag?.tag} (${bestHashtag?.avgLikes} avg likes, ${bestHashtag?.uses} uses).`,
    `Viral threshold for this account: posts exceeding ${Math.round(avgLikes * 3)} likes (3x average).`,
    `Most commented post: "${(mostCommented?.caption||'').slice(0,60)}" with ${mostCommented?.comments} comments.`,
    `Account engagement rate of ${avgEngRate}% is exceptional — industry benchmark for micro-influencers is 3-6%.`,
    `${viralPost ? `One viral post detected (${viralPost.likes} likes on "${(viralPost.caption||'').slice(0,40)}") — study this for replication.` : 'No viral posts in recent batch — focus on replicating top tier content.'}`,
  ];

  return {
    updatedAt:  new Date().toISOString(),
    account: {
      username:       'fasulostudio',
      name:           'JT Fasulo',
      followers:      FOLLOWERS,
      accountType:    'BUSINESS',
      platform:       'Instagram',
      contentFocus:   'AI-generated video, cinematic content, AI tools education',
      tools:          ['Kling 3.0', 'Nano Banana Pro', 'Higgsfield AI', 'Claude Code'],
    },
    posts,
    summary: {
      postsAnalyzed:   posts.length,
      totalLikes,
      totalComments,
      totalViews,
      hasViewData,
      totalEngagement: totalLikes + totalComments,
      avgLikes,
      avgComments,
      avgViews,
      avgEngRate,
      medianLikes,
      topPost,
      bottomPost,
      viralPost,
      mostCommented,
      mostViewed,
      highestEngRate,
      viralThreshold:  Math.round(avgLikes * 3),
      postsAboveAvg:   posts.filter(p => p.tier === 'above_average' || p.tier === 'viral').length,
      postsBelowAvg:   posts.filter(p => p.tier === 'below_average').length,
    },
    windows,
    hashtags,
    hashtagInsight: {
      avgLikesWithHashtags:    avgLikesWithTags,
      avgLikesWithoutHashtags: avgLikesWithoutTags,
      hashtagsHelpPerformance: avgLikesWithTags >= avgLikesWithoutTags,
      totalUniqueHashtags:     hashtags.length,
    },
    categories,
    byDayOfWeek,
    trend: {
      direction:       trendDirection,
      percentChange:   trendPercent,
      firstHalfAvgLikes:  firstAvgLikes,
      secondHalfAvgLikes: secondAvgLikes,
      interpretation:  trendPercent > 10 ? 'Strong growth momentum.' : trendPercent < -10 ? 'Declining — review recent content strategy.' : 'Relatively stable performance.',
    },
    insights,
  };
}

function writeKBFiles(kb) {
  // JSON
  fs.writeFileSync(path.join(__dirname, 'knowledge-base.json'), JSON.stringify(kb, null, 2));

  // ── Detailed Markdown memory file for JARVIS ────────────────────────────────
  const s = kb.summary;
  const postLines = kb.posts
    .sort((a, b) => b.likes - a.likes)
    .map((p, i) => {
      const caption = (p.caption || '(no caption)').replace(/\n/g, ' ').slice(0, 120);
      const viewStr = p.views > 0 ? ` | ${p.views} views` : '';
      const reachStr = p.reach > 0 ? ` | ${p.reach} reach` : '';
      return `${i + 1}. [${p.tier.toUpperCase()}] ${p.date} (${p.dayOfWeek}, ${p.daysAgo}d ago) | ${p.likes} likes | ${p.comments} comments${viewStr}${reachStr} | ${p.engRate}% eng | ${p.vsAvgPercent >= 0 ? '+' : ''}${p.vsAvgPercent}% vs avg | ${p.type} | category: ${p.category}
   Caption: "${caption}"
   Tags: ${p.hashtags.length ? p.hashtags.join(', ') : 'none'}
   URL: ${p.permalink}`;
    }).join('\n\n');

  const windowLines = Object.entries(kb.windows).map(([key, w]) => {
    if (!w.posts) return `### ${w.days}-day window\n- No posts in this period.`;
    const topStr = w.topPost ? `top post: ${w.topPost.date} (${w.topPost.likes} likes)` : '';
    const viewStr = w.totalViews > 0 ? ` | total views: ${w.totalViews} | avg views: ${w.avgViews}` : '';
    const topViewStr = w.topViewed?.views > 0 ? ` | most viewed: ${w.topViewed.date} (${w.topViewed.views} views)` : '';
    return `### Last ${w.days} days\n- Posts: ${w.posts} | avg likes: ${w.avgLikes} | avg eng: ${w.avgEngRate}%${viewStr}\n- ${topStr}${topViewStr}\n- Posts: ${w.postDates.join('; ')}`;
  }).join('\n\n');

  const hashtagLines = kb.hashtags.slice(0, 30).map(t =>
    `- ${t.tag}: ${t.uses} uses | avg ${t.avgLikes} likes | avg ${t.avgComments} comments | ${t.performanceVsAvg >= 0 ? '+' : ''}${t.performanceVsAvg}% vs account avg | best post: ${t.bestPost?.date} (${t.bestPost?.likes} likes)`
  ).join('\n');

  const categoryLines = kb.categories.map(c =>
    `- ${c.name}: ${c.count} posts (${c.shareOfFeed}) | avg ${c.avgLikes} likes | avg ${c.avgComments} comments | avg ${c.avgEngRate}% eng rate`
  ).join('\n');

  const dowLines = kb.byDayOfWeek.map(d =>
    `- ${d.day}: ${d.count} posts | avg ${d.avgLikes} likes | avg ${d.avgEngRate}% eng rate`
  ).join('\n');

  const insightLines = kb.insights.map((ins, i) => `${i + 1}. ${ins}`).join('\n');

  const md = `# JARVIS Memory — @${kb.account.username}
_Last updated: ${new Date(kb.updatedAt).toLocaleString()}_

---

## ACCOUNT PROFILE
- **Name:** ${kb.account.name}
- **Username:** @${kb.account.username}
- **Followers:** ${kb.account.followers}
- **Account type:** ${kb.account.accountType} on ${kb.account.platform}
- **Content focus:** ${kb.account.contentFocus}
- **Primary tools used:** ${kb.account.tools.join(', ')}

---

## SUMMARY STATISTICS (last ${s.postsAnalyzed} posts)
- **Total likes:** ${s.totalLikes}
- **Total comments:** ${s.totalComments}
- **Total views (plays):** ${s.hasViewData ? s.totalViews : 'not available via API'}
- **Average views per post:** ${s.hasViewData ? s.avgViews : 'n/a'}
- **Total engagement actions:** ${s.totalEngagement}
- **Average likes per post:** ${s.avgLikes}
- **Average comments per post:** ${s.avgComments}
- **Median likes:** ${s.medianLikes}
- **Average engagement rate:** ${s.avgEngRate}% (followers: ${kb.account.followers})
- **Posts above average:** ${s.postsAboveAvg} of ${s.postsAnalyzed}
- **Posts below average:** ${s.postsBelowAvg} of ${s.postsAnalyzed}
- **Viral threshold (3× avg):** ${s.viralThreshold} likes

### Top Post (most liked)
- Date: ${s.topPost?.date} | Likes: ${s.topPost?.likes} | Comments: ${s.topPost?.comments}${s.topPost?.views > 0 ? ' | Views: '+s.topPost.views : ''} | Eng: ${s.topPost?.engRate}%
- Caption: "${(s.topPost?.caption || '').slice(0, 100)}"
- URL: ${s.topPost?.permalink}

${s.hasViewData && s.mostViewed?.views > 0 ? `### Most Viewed Post
- Date: ${s.mostViewed.date} | Views: ${s.mostViewed.views} | Likes: ${s.mostViewed.likes}
- Caption: "${(s.mostViewed.caption || '').slice(0, 100)}"
- URL: ${s.mostViewed.permalink}

` : ''}### Bottom Post
- Date: ${s.bottomPost?.date} | Likes: ${s.bottomPost?.likes} | Comments: ${s.bottomPost?.comments}
- Caption: "${(s.bottomPost?.caption || '').slice(0, 100)}"

### Most Commented Post
- Date: ${s.mostCommented?.date} | Comments: ${s.mostCommented?.comments} | Likes: ${s.mostCommented?.likes}
- Caption: "${(s.mostCommented?.caption || '').slice(0, 100)}"

${s.viralPost ? `### Viral Post Detected
- Date: ${s.viralPost.date} | Likes: ${s.viralPost.likes} (${s.viralPost.vsAvgPercent}% above average)
- Caption: "${(s.viralPost.caption || '').slice(0, 100)}"
- URL: ${s.viralPost.permalink}` : '### No Viral Posts in Analyzed Batch\n- No post exceeded 3× the account average in recent content.'}

---

## TIME WINDOWS (relative to today: ${new Date().toLocaleDateString('en-US', {month:'short',day:'numeric',year:'numeric'})})
${windowLines}

---

## ENGAGEMENT TREND
- **Direction:** ${kb.trend.direction.toUpperCase()}
- **Percent change:** ${kb.trend.percentChange >= 0 ? '+' : ''}${kb.trend.percentChange}%
- **First half avg likes:** ${kb.trend.firstHalfAvgLikes}
- **Second half avg likes:** ${kb.trend.secondHalfAvgLikes}
- **Interpretation:** ${kb.trend.interpretation}

---

## HASHTAG PERFORMANCE
- **Total unique hashtags used:** ${kb.hashtagInsight.totalUniqueHashtags}
- **Avg likes WITH hashtags:** ${kb.hashtagInsight.avgLikesWithHashtags}
- **Avg likes WITHOUT hashtags:** ${kb.hashtagInsight.avgLikesWithoutHashtags}
- **Hashtags help performance:** ${kb.hashtagInsight.hashtagsHelpPerformance ? 'YES' : 'NO'}

### Top 30 Hashtags by Avg Likes
${hashtagLines}

---

## CONTENT CATEGORY ANALYSIS
${categoryLines}

---

## DAY-OF-WEEK PERFORMANCE (sorted by avg likes)
${dowLines}

---

## STRATEGIC INSIGHTS
${insightLines}

---

## ALL POSTS (sorted by likes, highest first)
${postLines}
`;

  fs.writeFileSync(path.join(__dirname, 'jarvis-memory.md'), md);

  // ── HTML viewer ─────────────────────────────────────────────────────────────
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
  if (!message || typeof message !== 'string' || message.trim().length === 0 || message.trim() === 'undefined') {
    return res.status(400).json({ error: 'Empty or invalid message.' });
  }

  // Load the human-readable markdown memory (far better for LLM comprehension than raw JSON)
  let memoryContent = '';
  const memoryPath = path.join(__dirname, 'jarvis-memory.md');
  if (fs.existsSync(memoryPath)) {
    memoryContent = fs.readFileSync(memoryPath, 'utf8');
  } else if (cachedKB) {
    // Fallback: minimal summary if markdown not yet written
    const s = cachedKB.summary;
    memoryContent = `Account: @fasulostudio | ${cachedKB.account.followers} followers | ${s.postsAnalyzed} posts | avg ${s.avgLikes} likes | avg eng rate ${s.avgEngRate}% | top post: ${s.topPost?.likes} likes`;
  }

  const systemPrompt = `You are JARVIS — Just A Rather Very Intelligent System — the AI assistant of Tony Stark, now repurposed as an Instagram analytics intelligence for @fasulostudio, operated by JT Fasulo.

VOICE AND TONE:
- Speak exactly as JARVIS does in the Iron Man films: crisp, British, precise, faintly sardonic.
- Address the user as "sir" once per response, naturally placed — never at the start of every sentence.
- Use short, declarative sentences separated by periods. Never use ellipses. Commas for natural breathing pauses only.
- No markdown. No bullet points. Plain prose optimised for spoken delivery.
- Dry wit is permitted. Sycophancy is not.

CONCISENESS RULES (strictly enforced):
- MAXIMUM 2 sentences for simple factual questions ("what is my best post?", "how many views?")
- MAXIMUM 3 sentences for analytical questions ("why is X performing well?", "what should I post?")
- MAXIMUM 4 sentences only when user explicitly asks for a breakdown or trend analysis
- Never pad responses. Never restate the question. Get to the number immediately.

CRITICAL INSTRUCTION: You have REAL analytics data below. When asked ANY question about the Instagram account, posts, performance, hashtags, views, or strategy — answer using the SPECIFIC NUMBERS in the data. Do NOT say "I remain at your service" or give generic responses. Quote actual figures.

TIME AWARENESS: The data includes a TIME WINDOWS section with stats for the last 7, 14, and 30 days including post dates, view counts, and averages. Use this when asked about recent trends, "last week", "this week", "recent posts", etc.

VIEW DATA: Each post includes a views/plays count (from Instagram Insights API). Use this when asked about views, reach, or video performance. If view data shows 0 for all posts, note that insights may not yet be available.

EXAMPLE RESPONSE STYLE:
"Your top reel hit 517 likes, sir — eleven times your account average. Humour content dominates by a wide margin."

INSTAGRAM ANALYTICS — @fasulostudio (refreshed every 15 minutes):
${memoryContent}

Reference specific numbers. Surface non-obvious insights. If asked something outside your data, acknowledge it in one sentence and pivot to what you do know.`;

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
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 200,
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
    console.log(`[JARVIS] Q: "${message.slice(0,60)}" → "${reply.slice(0,80)}"`);
    res.json({ reply });
  } catch (err) {
    console.error('[JARVIS API error]', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ─── Reel Analysis ───────────────────────────────────────────────────────────

app.post('/api/analyze-reel', async (req, res) => {
  const { post } = req.body;
  if (!post) return res.status(400).json({ error: 'No post provided.' });
  if (!ANTHROPIC_API_KEY) return res.status(500).json({ error: 'No API key.' });

  const kb = cachedKB;
  const s  = kb?.summary || {};

  const systemPrompt = `You are an Instagram Reels strategist analysing content for @fasulostudio (JT Fasulo). You have deep expertise in the 2025/2026 Instagram algorithm, content psychology, and the AI-tools niche.

ACCOUNT BENCHMARKS:
- Followers: ${kb?.account?.followers || 108}
- Average likes per post: ${s.avgLikes || 'unknown'}
- Average engagement rate: ${s.avgEngRate || 'unknown'}%
- Viral threshold (3× avg): ${s.viralThreshold || 'unknown'} likes
- Best content category: ${kb?.categories?.[0]?.name || 'unknown'} (${kb?.categories?.[0]?.avgLikes || '?'} avg likes)
- Best posting day: ${kb?.byDayOfWeek?.[0]?.day || 'unknown'}

PLAYBOOK PRINCIPLES (apply these to your analysis):
- 3-second hold rate >60% is the #1 distribution signal. Hook quality determines everything.
- DM shares are the dominant signal for unconnected reach (new followers).
- Watch time completion rate is the single most important algorithmic signal.
- Ideal hashtag count: 3–5 targeted, niche-specific tags. Excessive hashtags signal spam.
- Captions: open with a hook, include 2–5 keywords naturally, end with ONE specific CTA.
- Hook must work in the first 1.5 seconds with sound off.
- Never open with introductions — start in the middle of the thought.
- Optimal reel length: 30–60s for educational/tutorial, 15–30s for tips/demos.
- Content pillars: Tool Demos, Tutorials/Workflows, News/Updates, Comparisons/Opinions.
- Engagement rate benchmarks for <5K followers: 3–6% is strong. Above 10% is exceptional.
- Performance tiers: VIRAL = 4× avg+, ABOVE_AVERAGE = 1.5×+, AVERAGE = 0.7×+, BELOW = under 0.7×.
- Below-average posts: diagnose whether hook failed (low 3s hold), delivery failed (mid-video drop), or content wasn't shareable enough.
- If a reel significantly underperforms, the creative direction should be reconsidered entirely.
- Strong performers: look for micro-improvements in CTA, hook reinforcement, or mid-video retention bridges.

FORMAT YOUR RESPONSE AS JSON with this exact structure:
{
  "verdict": "HIT" | "ABOVE_AVERAGE" | "AVERAGE" | "FLOP",
  "summary": "One sentence overall verdict.",
  "wentWell": ["specific point 1", "specific point 2", "specific point 3"],
  "needsImprovement": ["specific point 1", "specific point 2"],
  "nextSteps": ["actionable step 1 with data", "actionable step 2 with data", "actionable step 3 with data"],
  "creativeDirection": "Keep and refine" | "Pivot partially" | "Scrap and rethink",
  "creativeNote": "One specific sentence on creative direction."
}

Be hyper-specific. Reference the actual caption text, hashtags used, posting day, and numbers. Do NOT be generic.`;

  const userMsg = `Analyse this reel:
Date: ${post.date} (${post.dayOfWeek}, posted at ${post.hour}:00)
Days ago: ${post.daysAgo}
Type: ${post.type}
Category: ${post.category}
Tier: ${post.tier} (${post.vsAvgPercent >= 0 ? '+' : ''}${post.vsAvgPercent}% vs account avg)
Likes: ${post.likes} | Comments: ${post.comments} | Views: ${post.views || 'n/a'} | Reach: ${post.reach || 'n/a'}
Engagement rate: ${post.engRate}%
Hashtags (${post.hashtagCount}): ${post.hashtags?.join(', ') || 'none'}
Caption: "${post.caption || '(no caption)'}"
URL: ${post.permalink}`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 800,
        system: systemPrompt,
        messages: [{ role: 'user', content: userMsg }]
      })
    });

    if (!response.ok) throw new Error(`Anthropic error ${response.status}`);
    const data = await response.json();
    const text = data.content?.[0]?.text || '{}';
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : { error: 'Parse failed', raw: text };
    res.json(analysis);
  } catch (err) {
    console.error('[Analyze reel error]', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ─── ElevenLabs TTS ──────────────────────────────────────────────────────────

app.post('/api/tts', async (req, res) => {
  const { text } = req.body;

  if (!ELEVENLABS_API_KEY || ELEVENLABS_API_KEY === 'your-elevenlabs-api-key-here') {
    return res.status(400).json({ error: 'Configure ELEVENLABS_API_KEY in .env' });
  }

  try {
    const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`, {
      method: 'POST',
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg'
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_turbo_v2_5',
        voice_settings: {
          stability: 0.55,
          similarity_boost: 0.80,
          style: 0.30,
          use_speaker_boost: true,
          speed: 1.15
        }
      })
    });

    if (!r.ok) {
      const err = await r.text();
      throw new Error(`ElevenLabs error ${r.status}: ${err}`);
    }

    const buffer = await r.arrayBuffer();
    res.set('Content-Type', 'audio/mpeg');
    res.send(Buffer.from(buffer));
  } catch (err) {
    console.error('[TTS error]', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ─── Start ────────────────────────────────────────────────────────────────────

app.listen(PORT, async () => {
  console.log(`JARVIS Dashboard → http://localhost:${PORT}`);
  await refreshKB();
  setInterval(refreshKB, 15 * 60 * 1000);
});
