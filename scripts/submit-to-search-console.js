#!/usr/bin/env node
/**
 * submit-to-search-console.js
 * 
 * Automates Google Search Console "Request Indexing" via Playwright browser automation.
 * Imports Google cookies from ~/.config/google-cookies.json for authentication.
 *
 * Usage:
 *   node submit-to-search-console.js <url> [url2] ...
 *   node submit-to-search-console.js --test   (test if cookies/auth work)
 */

const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = '/home/user/.cache/ms-playwright/chromium-1208/chrome-linux64/chrome';
const COOKIES_PATH = path.join(process.env.HOME, '.config/google-cookies.json');
const SITE_URL = 'https://www.agentrank.tech/';
const SC_BASE = 'https://search.google.com/search-console';
const TIMEOUT = 60000;

function loadCookies() {
  const raw = JSON.parse(fs.readFileSync(COOKIES_PATH, 'utf8'));
  // Convert from cookie-editor format to Playwright format
  return raw.map(c => {
    const cookie = {
      name: c.name,
      value: c.value,
      path: c.path || '/',
      secure: c.secure || false,
      httpOnly: c.httpOnly || false,
    };
    // Playwright needs either domain or url
    if (c.domain) {
      cookie.domain = c.domain;
    }
    // Handle sameSite
    if (c.sameSite === 'strict') cookie.sameSite = 'Strict';
    else if (c.sameSite === 'lax') cookie.sameSite = 'Lax';
    else if (c.sameSite === 'no_restriction') cookie.sameSite = 'None';
    else cookie.sameSite = 'None'; // default for Google cookies

    // Handle expiration
    if (c.expirationDate) {
      cookie.expires = Math.floor(c.expirationDate);
    }
    return cookie;
  });
}

async function requestIndexing(url) {
  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
  });

  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36',
  });

  try {
    // Load cookies
    const cookies = loadCookies();
    await context.addCookies(cookies);

    const page = await context.newPage();
    
    // Navigate to Search Console URL Inspection
    const encodedUrl = encodeURIComponent(url);
    const scUrl = `${SC_BASE}/inspect?resource_id=${encodeURIComponent(SITE_URL)}`;
    
    console.log(`🔍 Opening Search Console...`);
    await page.goto(scUrl, { waitUntil: 'networkidle', timeout: TIMEOUT });

    // Check if we're logged in
    if (page.url().includes('accounts.google.com')) {
      console.error('❌ Cookies expired or invalid. Need fresh cookies from Hugh.');
      await browser.close();
      return { status: 'auth_failed', url };
    }

    console.log(`📝 Entering URL: ${url}`);
    
    // Find the URL input field and type the URL
    // Search Console has an input field at the top for URL inspection
    const inputSelector = 'input[type="text"], input[aria-label*="Inspect"], input[placeholder*="Inspect"], input[name="url"]';
    
    try {
      await page.waitForSelector(inputSelector, { timeout: 15000 });
      const input = await page.$(inputSelector);
      if (input) {
        await input.click({ clickCount: 3 }); // Select all
        await input.fill(url);
        await page.keyboard.press('Enter');
      }
    } catch (e) {
      // Try the direct URL approach
      console.log('⏳ Trying direct URL inspection...');
      await page.goto(`${SC_BASE}/inspect?resource_id=${encodeURIComponent(SITE_URL)}&id=${encodedUrl}`, {
        waitUntil: 'networkidle',
        timeout: TIMEOUT,
      });
    }

    // Wait for inspection results to load
    console.log('⏳ Waiting for inspection results...');
    await page.waitForTimeout(8000);

    // Try to wait for the results to appear
    try {
      await page.waitForFunction(() => {
        const body = document.body.innerText;
        return body.includes('Request Indexing') || 
               body.includes('URL is on Google') ||
               body.includes('URL is not on Google') ||
               body.includes('not found') ||
               body.includes('Couldn\'t');
      }, { timeout: 30000 });
    } catch (e) {
      console.log('⏳ Still loading, waiting more...');
      await page.waitForTimeout(10000);
    }

    const bodyText = await page.textContent('body');

    // Check if already indexed
    if (bodyText.includes('URL is on Google')) {
      console.log(`✅ Already indexed: ${url}`);
      await browser.close();
      return { status: 'already_indexed', url };
    }

    // Look for and click "Request Indexing"
    const reqBtn = await page.$('text=Request Indexing')
      || await page.$('text=REQUEST INDEXING')
      || await page.$('[aria-label*="Request"]')
      || await page.$('button:has-text("Request")');

    if (reqBtn) {
      const isDisabled = await reqBtn.evaluate(el => el.disabled || el.getAttribute('aria-disabled') === 'true');
      if (isDisabled) {
        console.log(`⚠️  "Request Indexing" button is disabled (quota?): ${url}`);
        await browser.close();
        return { status: 'disabled', url };
      }

      await reqBtn.click();
      console.log('📤 Clicked "Request Indexing"...');

      // Wait for the indexing request to process (shows a loading modal)
      await page.waitForTimeout(15000);

      const resultText = await page.textContent('body');
      if (resultText.includes('Indexing requested') || resultText.includes('request has been received')) {
        console.log(`✅ Indexing requested: ${url}`);
        await browser.close();
        return { status: 'requested', url };
      } else if (resultText.includes('quota') || resultText.includes('limit')) {
        console.log(`⚠️  Daily quota reached: ${url}`);
        await browser.close();
        return { status: 'quota', url };
      } else {
        console.log(`✅ Request submitted (pending confirmation): ${url}`);
        await browser.close();
        return { status: 'submitted', url };
      }
    } else {
      // Save screenshot for debugging
      await page.screenshot({ path: '/tmp/sc-debug.png', fullPage: true });
      console.error(`❌ Could not find "Request Indexing" button. Screenshot: /tmp/sc-debug.png`);
      console.error(`   Page text snippet: ${bodyText.substring(0, 300)}`);
      await browser.close();
      return { status: 'button_not_found', url };
    }
  } catch (e) {
    console.error(`❌ Error for ${url}: ${e.message}`);
    try {
      const pages = context.pages();
      if (pages.length > 0) {
        await pages[0].screenshot({ path: '/tmp/sc-error.png', fullPage: true });
      }
    } catch (_) {}
    await browser.close();
    return { status: 'error', url, error: e.message };
  }
}

async function testAuth() {
  console.log('🔐 Testing Google Search Console authentication...');
  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
  });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36',
  });
  const cookies = loadCookies();
  await context.addCookies(cookies);
  const page = await context.newPage();
  await page.goto(SC_BASE, { waitUntil: 'networkidle', timeout: TIMEOUT });
  
  if (page.url().includes('accounts.google.com')) {
    console.error('❌ Authentication failed — cookies expired or invalid.');
    await browser.close();
    process.exit(1);
  }

  await page.screenshot({ path: '/tmp/sc-auth-test.png', fullPage: true });
  console.log(`✅ Authenticated! Current URL: ${page.url()}`);
  console.log('   Screenshot saved: /tmp/sc-auth-test.png');
  
  const bodyText = await page.textContent('body');
  if (bodyText.includes('agentrank')) {
    console.log('✅ AgentRank property found in Search Console');
  }
  
  await browser.close();
}

async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--test')) {
    await testAuth();
    return;
  }

  const urls = args.filter(u => u.startsWith('http'));
  if (urls.length === 0) {
    console.error('Usage:');
    console.error('  node submit-to-search-console.js <url> [url2] ...');
    console.error('  node submit-to-search-console.js --test');
    process.exit(1);
  }

  const results = [];
  for (const url of urls) {
    const result = await requestIndexing(url);
    results.push(result);
    console.log(`   → ${result.status}`);
    
    // Delay between submissions
    if (urls.length > 1) {
      await new Promise(r => setTimeout(r, 5000));
    }
  }

  const requested = results.filter(r => ['requested', 'submitted'].includes(r.status)).length;
  const indexed = results.filter(r => r.status === 'already_indexed').length;
  const failed = results.filter(r => ['error', 'auth_failed', 'button_not_found'].includes(r.status)).length;

  console.log(`\n📊 Results: ${requested} requested, ${indexed} already indexed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch(e => {
  console.error(e.message);
  process.exit(1);
});
