/**
 * CJ Automation2 — Shopify Token Auto-Refresh
 * Refreshes the access token every 23 hours (expires_in = 86400s / 24h)
 * Run once: node scripts/refresh-token.js
 * Runs silently in background, updates .env automatically
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ENV_PATH = join(__dirname, '../.env');
const REFRESH_INTERVAL_MS = 23 * 60 * 60 * 1000; // 23 hours

function loadEnv() {
  const env = {};
  readFileSync(ENV_PATH, 'utf8').split('\n').forEach(line => {
    const [key, ...val] = line.split('=');
    if (key && val.length) env[key.trim()] = val.join('=').trim();
  });
  return env;
}

async function refreshToken() {
  const env = loadEnv();
  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: env.CJ_APP_CLIENT_ID,
    client_secret: env.CJ_APP_SECRET
  });

  try {
    const res = await fetch('https://3dq16a-uc.myshopify.com/admin/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body
    });

    const data = await res.json();

    if (data.access_token) {
      let envContent = readFileSync(ENV_PATH, 'utf8');
      envContent = envContent.replace(/CJ_ACCESS_TOKEN=.*/, `CJ_ACCESS_TOKEN=${data.access_token}`);
      writeFileSync(ENV_PATH, envContent);
      console.log(`[${new Date().toISOString()}] ✅ CJ_ACCESS_TOKEN refreshed — first 8: ${data.access_token.substring(0, 8)}...`);
    } else {
      console.error(`[${new Date().toISOString()}] ❌ Token refresh failed:`, JSON.stringify(data));
    }
  } catch (err) {
    console.error(`[${new Date().toISOString()}] ❌ Network error:`, err.message);
  }
}

// Refresh immediately on start, then every 23 hours
console.log(`[${new Date().toISOString()}] 🔄 Token refresh service started (interval: 23h)`);
refreshToken();
setInterval(refreshToken, REFRESH_INTERVAL_MS);
