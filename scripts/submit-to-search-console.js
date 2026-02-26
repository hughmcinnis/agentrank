#!/usr/bin/env node
/**
 * submit-to-search-console.js
 * 
 * Automates Google Search Console "Request Indexing" via Playwright browser automation.
 * Uses a persistent browser profile so Google login only needs to happen once.
 *
 * Usage:
 *   node submit-to-search-console.js <url> [url2] ...
 *   node submit-to-search-console.js --login   (one-time Google login)
 *
 * First run: use --login to authenticate with Google, then Ctrl+C when done.
 * Subsequent runs reuse the saved session.
 */

const { chromium } = require('playwright-core');
const path = require('path');

const CHROME_PATH = '/home/user/.cache/ms-playwright/chromium-1208/chrome-linux64/chrome';
const USER_DATA_DIR = path.join(process.env.HOME, '.config/search-console-browser');
const SITE_URL = 'https://www.agentrank.tech/';
const SC_PROPERTY = encodeURIComponent(SITE_URL);
const TIMEOUT = 60000;

async function requestIndexing(url) {
  const browser = await chromium.launchPersistentContext(USER_DATA_DIR, {
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
    timeout: TIMEOUT,
  });

  try {
    const page = await browser.newPage();
    
    // Navigate to URL Inspection with the URL pre-filled
    const inspectUrl = `https://search.google.com/search-console/inspect?resource_id=${SC_PROPERTY}&id=${encodeURIComponent(url)}`;
    console.log(`🔍 Inspecting: ${url}`);
    
    await page.goto(inspectUrl, { waitUntil: 'networkidle', timeout: TIMEOUT });
    
    // Check if we need to log in
    if (page.url().includes('accounts.google.com')) {
      console.error('❌ Not logged in. Run with --login first to authenticate.');
      await browser.close();
      return false;
    }

    // Wait for the inspection to complete (loading spinner)
    // The page shows "Retrieving data from Google index" while loading
    console.log('⏳ Waiting for inspection results...');
    
    // Wait for either the "Request Indexing" link or indexing status to appear
    try {
      await page.waitForSelector('[data-testid="request-indexing"], a[jsname], div[class*="index"]', { 
        timeout: 45000 
      });
    } catch (e) {
      // Try waiting for any actionable content
      await page.waitForTimeout(10000);
    }

    // Look for the "Request Indexing" button/link
    // Search Console uses various selectors - try multiple approaches
    const requestIndexBtn = await page.$('text=Request Indexing') 
      || await page.$('text=REQUEST INDEXING')
      || await page.$('[aria-label="Request Indexing"]')
      || await page.$('a:has-text("Request Indexing")')
      || await page.$('button:has-text("Request Indexing")');

    if (requestIndexBtn) {
      await requestIndexBtn.click();
      console.log('📤 Clicked "Request Indexing"');
      
      // Wait for confirmation dialog/toast
      await page.waitForTimeout(5000);
      
      // Check for success message or quota exceeded
      const pageContent = await page.textContent('body');
      if (pageContent.includes('Indexing requested') || pageContent.includes('successfully')) {
        console.log(`✅ Indexing requested for: ${url}`);
        await browser.close();
        return true;
      } else if (pageContent.includes('quota') || pageContent.includes('limit')) {
        console.log(`⚠️  Quota may be reached for: ${url}`);
        await browser.close();
        return false;
      } else {
        // Clicked but couldn't confirm outcome - likely worked
        console.log(`✅ Request submitted for: ${url} (confirmation pending)`);
        await browser.close();
        return true;
      }
    } else {
      // Check if URL is already indexed
      const pageContent = await page.textContent('body');
      if (pageContent.includes('URL is on Google') || pageContent.includes('URL is available')) {
        console.log(`ℹ️  Already indexed: ${url}`);
        await browser.close();
        return true;
      }
      
      // Take screenshot for debugging
      const screenshotPath = '/tmp/search-console-debug.png';
      await page.screenshot({ path: screenshotPath, fullPage: true });
      console.error(`❌ Could not find "Request Indexing" button. Screenshot saved: ${screenshotPath}`);
      await browser.close();
      return false;
    }
  } catch (e) {
    console.error(`❌ Error: ${e.message}`);
    try {
      await page.screenshot({ path: '/tmp/search-console-error.png', fullPage: true });
    } catch (_) {}
    await browser.close();
    return false;
  }
}

async function interactiveLogin() {
  console.log('🔐 Opening browser for Google login...');
  console.log('   Log into your Google account that has Search Console access.');
  console.log('   The browser session will be saved for future automated runs.');
  console.log('   Press Ctrl+C when done.\n');

  const browser = await chromium.launchPersistentContext(USER_DATA_DIR, {
    executablePath: CHROME_PATH,
    headless: false,
    args: ['--no-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();
  await page.goto('https://search.google.com/search-console');
  
  // Keep browser open for manual login
  await new Promise(() => {}); // Wait forever until Ctrl+C
}

async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--login')) {
    await interactiveLogin();
    return;
  }

  const urls = args.filter(u => u.startsWith('http'));
  if (urls.length === 0) {
    console.error('Usage:');
    console.error('  node submit-to-search-console.js <url> [url2] ...');
    console.error('  node submit-to-search-console.js --login');
    process.exit(1);
  }

  let success = 0;
  let failed = 0;

  for (const url of urls) {
    const result = await requestIndexing(url);
    if (result) success++;
    else failed++;
    
    // Small delay between submissions to avoid rate limiting
    if (urls.length > 1) {
      await new Promise(r => setTimeout(r, 3000));
    }
  }

  console.log(`\n📊 Results: ${success} submitted, ${failed} failed out of ${urls.length} URL(s)`);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch(e => {
  console.error(e.message);
  process.exit(1);
});
