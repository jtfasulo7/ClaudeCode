import http from 'http';
import https from 'https';
import { readFileSync, writeFileSync } from 'fs';
import { URL } from 'url';

const env = {};
readFileSync(new URL('../.env', import.meta.url), 'utf8').split('\n').forEach(line => {
  const [key, ...val] = line.split('=');
  if (key && val.length) env[key.trim()] = val.join('=').trim();
});

const CLIENT_ID     = env.CJ_APP_CLIENT_ID;
const CLIENT_SECRET = env.CJ_APP_SECRET;
const SHOP          = '3dq16a-uc.myshopify.com';
const REDIRECT_URI  = 'http://localhost:3456/callback';
const SCOPES        = 'read_products,write_products,read_orders,write_orders,read_inventory,write_inventory,read_customers,write_customers,read_themes,write_themes';
const ENV_FILE      = new URL('../.env', import.meta.url).pathname.replace(/^\/([A-Za-z]):/, '$1:');

const server = http.createServer(async (req, res) => {
  const reqUrl = new URL(req.url, 'http://localhost:3456');

  // Root path or any non-callback path — redirect to Shopify OAuth authorize
  if (reqUrl.pathname !== '/callback') {
    const authUrl = `https://${SHOP}/admin/oauth/authorize?client_id=${CLIENT_ID}&scope=${encodeURIComponent(SCOPES)}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
    console.log('↪ Redirecting to Shopify OAuth...');
    res.writeHead(302, { Location: authUrl });
    res.end();
    return;
  }

  // Callback path — exchange code for token
  const code = reqUrl.searchParams.get('code');
  if (!code) {
    // No code yet — redirect to authorize
    const authUrl = `https://${SHOP}/admin/oauth/authorize?client_id=${CLIENT_ID}&scope=${encodeURIComponent(SCOPES)}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
    res.writeHead(302, { Location: authUrl });
    res.end();
    return;
  }

  const body = JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, code });
  const options = {
    hostname: SHOP,
    path: '/admin/oauth/access_token',
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
  };

  const token = await new Promise((resolve, reject) => {
    const request = https.request(options, (shopRes) => {
      let data = '';
      shopRes.on('data', chunk => data += chunk);
      shopRes.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(new Error('Failed to parse: ' + data)); }
      });
    });
    request.on('error', reject);
    request.write(body);
    request.end();
  });

  if (token.access_token) {
    let envContent = readFileSync(ENV_FILE, 'utf8');
    envContent = envContent.replace(/CJ_ACCESS_TOKEN=.*/, `CJ_ACCESS_TOKEN=${token.access_token}`);
    writeFileSync(ENV_FILE, envContent);

    const preview = token.access_token.substring(0, 8);
    const scope = token.scope || 'not reported';
    console.log('\\n✅ Token captured with scopes: ' + scope);
    console.log('   First 8: ' + preview + '...');
    console.log('   Saved to .env as CJ_ACCESS_TOKEN');

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`<html><body style="font-family:sans-serif;padding:40px;background:#f0fff4">
      <h2 style="color:#155724">✅ Token captured with theme access</h2>
      <p>Scopes granted: <code>${scope}</code></p>
      <p>First 8 characters: <strong>${preview}...</strong></p>
      <p>Saved to <code>.env</code>. You can close this tab.</p>
    </body></html>`);

    setTimeout(() => { server.close(); process.exit(0); }, 1000);
  } else {
    console.error('❌ Error:', JSON.stringify(token));
    res.writeHead(500, { 'Content-Type': 'text/html' });
    res.end(`<html><body style="font-family:sans-serif;padding:40px;background:#fff3f3">
      <h2 style="color:#721c24">❌ Token exchange failed</h2>
      <pre>${JSON.stringify(token, null, 2)}</pre>
    </body></html>`);
  }
});

server.listen(3456, () => {
  console.log('\\n🚀 OAuth server running on http://localhost:3456');
  console.log('   Scopes: ' + SCOPES);
  console.log('\\n👉 Now click CJ Automation4 in your Shopify admin.');
  console.log('   It will redirect here → Shopify OAuth → approve scopes → token captured.');
  console.log('\\nWaiting...\\n');
});
