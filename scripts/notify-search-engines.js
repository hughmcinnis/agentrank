#!/usr/bin/env node
/**
 * notify-search-engines.js
 * Notifies Google, Bing, Yandex, and Brave (via IndexNow) about new/updated URLs.
 * Also pings Google's sitemap endpoint.
 *
 * Usage:
 *   node notify-search-engines.js <url>
 *   node notify-search-engines.js https://www.agentrank.tech/blog/my-new-post
 *
 * Can also accept multiple URLs:
 *   node notify-search-engines.js <url1> <url2> ...
 */

const SITE_URL = 'https://www.agentrank.tech';
const SITEMAP_URL = `${SITE_URL}/sitemap.xml`;
const INDEXNOW_KEY = '80cd11cf3a544e6593c65a4c3e9c4a68';
const INDEXNOW_KEY_LOCATION = `${SITE_URL}/${INDEXNOW_KEY}.txt`;

async function pingGoogleSitemap() {
  try {
    const url = `https://www.google.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`;
    const res = await fetch(url);
    console.log(`✅ Google sitemap ping: ${res.status}`);
    return true;
  } catch (e) {
    console.error(`❌ Google sitemap ping failed: ${e.message}`);
    return false;
  }
}

async function submitIndexNow(urls) {
  // IndexNow supports multiple search engines - we submit to the API hub
  // which distributes to Bing, Yandex, and others that support it
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

  const results = [];

  for (const engine of engines) {
    try {
      const res = await fetch(engine, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify(payload),
      });
      const status = res.status;
      // 200 = OK, 202 = Accepted (both are success)
      const ok = status >= 200 && status < 300;
      console.log(`${ok ? '✅' : '⚠️'} IndexNow ${engine}: ${status}`);
      results.push({ engine, status, ok });
    } catch (e) {
      console.error(`❌ IndexNow ${engine} failed: ${e.message}`);
      results.push({ engine, status: 0, ok: false });
    }
  }

  return results;
}

async function pingGoogleIndexingAPI(url) {
  // This requires Google Cloud credentials - skip if not configured
  // Placeholder for future setup
  try {
    const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    if (!credPath) {
      console.log('ℹ️  Google Indexing API: No credentials configured (optional)');
      return false;
    }
    // Future: implement OAuth2 + Indexing API call
    return false;
  } catch (e) {
    return false;
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

  // 1. Ping Google sitemap
  await pingGoogleSitemap();

  // 2. Submit to IndexNow (Bing, Yandex, + IndexNow hub which Brave can use)
  await submitIndexNow(urls);

  // 3. Google Indexing API (if credentials available)
  await pingGoogleIndexingAPI(urls[0]);

  console.log('\n✅ Search engine notifications complete.');
}

main().catch(e => {
  console.error(e.message);
  process.exit(1);
});
