#!/usr/bin/env node
/**
 * notify-search-engines.js
 * Notifies Google (via Indexing API), Bing, Yandex, and Brave (via IndexNow)
 * about new/updated URLs.
 *
 * Usage:
 *   node notify-search-engines.js <url> [url2] ...
 *   node notify-search-engines.js https://www.agentrank.tech/blog/my-new-post
 */

const { GoogleAuth } = require('google-auth-library');
const path = require('path');

const SITE_URL = 'https://www.agentrank.tech';
const SITEMAP_URL = `${SITE_URL}/sitemap.xml`;
const INDEXNOW_KEY = '80cd11cf3a544e6593c65a4c3e9c4a68';
const INDEXNOW_KEY_LOCATION = `${SITE_URL}/${INDEXNOW_KEY}.txt`;
const GOOGLE_SA_KEY = process.env.GOOGLE_APPLICATION_CREDENTIALS
  || '/home/user/.credentials/google-indexing-sa.json';
const GOOGLE_INDEXING_ENDPOINT = 'https://indexing.googleapis.com/v3/urlNotifications:publish';

// --- Google Indexing API ---
async function submitGoogleIndexingAPI(urls) {
  try {
    const auth = new GoogleAuth({
      keyFile: GOOGLE_SA_KEY,
      scopes: ['https://www.googleapis.com/auth/indexing'],
    });
    const client = await auth.getClient();

    for (const url of urls) {
      try {
        const res = await client.request({
          url: GOOGLE_INDEXING_ENDPOINT,
          method: 'POST',
          data: {
            url: url,
            type: 'URL_UPDATED',
          },
        });
        console.log(`✅ Google Indexing API: ${url} → ${res.status}`);
      } catch (e) {
        const status = e.response?.status || 'error';
        const msg = e.response?.data?.error?.message || e.message;
        console.error(`❌ Google Indexing API: ${url} → ${status} (${msg})`);
      }
    }
    return true;
  } catch (e) {
    console.error(`❌ Google Indexing API auth failed: ${e.message}`);
    return false;
  }
}

// --- IndexNow (Bing, Yandex, Brave) ---
async function submitIndexNow(urls) {
  const engines = [
    'https://api.indexnow.org/indexnow',
    'https://www.bing.com/indexnow',
    'https://yandex.com/indexnow',
  ];

  const payload = {
    host: 'www.agentrank.tech',
    key: INDEXNOW_KEY,
    keyLocation: INDEXNOW_KEY_LOCATION,
    urlList: urls,
  };

  for (const engine of engines) {
    try {
      const res = await fetch(engine, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify(payload),
      });
      const ok = res.status >= 200 && res.status < 300;
      console.log(`${ok ? '✅' : '⚠️'} IndexNow ${new URL(engine).hostname}: ${res.status}`);
    } catch (e) {
      console.error(`❌ IndexNow ${engine} failed: ${e.message}`);
    }
  }
}

// --- Google Sitemap Ping (deprecated but harmless) ---
async function pingGoogleSitemap() {
  try {
    const url = `https://www.google.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`;
    const res = await fetch(url);
    console.log(`ℹ️  Google sitemap ping: ${res.status} (deprecated endpoint)`);
  } catch (e) {
    // silently ignore
  }
}

async function main() {
  const urls = process.argv.slice(2).filter(u => u.startsWith('http'));

  if (urls.length === 0) {
    console.error('Usage: node notify-search-engines.js <url> [url2] ...');
    process.exit(1);
  }

  console.log(`\n🔍 Notifying search engines about ${urls.length} URL(s):`);
  urls.forEach(u => console.log(`   ${u}`));
  console.log('');

  // 1. Google Indexing API (direct, fastest indexing)
  await submitGoogleIndexingAPI(urls);

  // 2. IndexNow (Bing, Yandex, + hub for Brave)
  await submitIndexNow(urls);

  // 3. Google sitemap ping (legacy, best-effort)
  await pingGoogleSitemap();

  console.log('\n✅ Search engine notifications complete.');
}

main().catch(e => {
  console.error(e.message);
  process.exit(1);
});
