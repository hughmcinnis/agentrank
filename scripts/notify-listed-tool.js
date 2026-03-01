#!/usr/bin/env node
/**
 * notify-listed-tool.js
 * Sends an email to a tool's team notifying them they've been featured on AgentRank.
 * 
 * Usage: node notify-listed-tool.js '{"name":"ToolName","website":"https://tool.com","slug":"tool-name"}'
 * 
 * Tries to find a contact email from the tool's website, falls back to common patterns.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const { URL } = require('url');

const SITE_URL = 'https://www.agentrank.tech';
const CONTACTED_FILE = path.resolve('/home/user/agentrank/data/contacted-tools.txt');
const MANUAL_OUTREACH_FILE = path.resolve('/home/user/agentrank/data/tools-need-manual-outreach.txt');
const GMAIL_USER = 'hugh.e.mcinnis@gmail.com';
const GMAIL_APP_PASSWORD = 'qxvhgypoarhihgll';
const EMAIL_SCRIPT = '/home/user/.openclaw/scripts/send-email.py';

// Common paths to check for email addresses
const CONTACT_PATHS = [
  '/contact',
  '/about',
  '/team',
  '/support',
  '/about-us',
  '/contact-us',
  '/company',
  '/get-in-touch',
  '/' // Also check homepage
];

// Generic emails to filter out
const GENERIC_FILTERS = [
  /^noreply@/i,
  /^no-reply@/i,
  /^unsubscribe@/i,
  /^donotreply@/i,
  /^do-not-reply@/i,
  /^mailer-daemon@/i,
  /^postmaster@/i
];

// Email regex pattern
const EMAIL_REGEX = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;

function getContacted() {
  if (!fs.existsSync(CONTACTED_FILE)) {
    const dir = path.dirname(CONTACTED_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(CONTACTED_FILE, '');
    return new Set();
  }
  return new Set(fs.readFileSync(CONTACTED_FILE, 'utf-8').split('\n').filter(Boolean));
}

function logManualOutreach(name, website, slug) {
  const dir = path.dirname(MANUAL_OUTREACH_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const line = `${new Date().toISOString().split('T')[0]} | ${slug} | ${name} | ${website || 'N/A'}\n`;
  fs.appendFileSync(MANUAL_OUTREACH_FILE, line);
}

/**
 * Fetch a URL and return the HTML content
 */
function fetchUrl(url, timeout = 10000) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const client = parsedUrl.protocol === 'https:' ? https : http;
    
    const options = {
      timeout,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; AgentRank/1.0; +https://www.agentrank.tech)'
      }
    };
    
    const req = client.get(url, options, (res) => {
      // Follow redirects
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const redirectUrl = new URL(res.headers.location, url).href;
        return fetchUrl(redirectUrl, timeout).then(resolve).catch(reject);
      }
      
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    });
    
    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

/**
 * Check if a domain has MX records (can accept email)
 */
function hasMXRecords(domain) {
  try {
    const result = execSync(`dig +short MX ${domain}`, { 
      encoding: 'utf-8',
      timeout: 5000,
      stdio: ['pipe', 'pipe', 'ignore'] // Suppress stderr
    }).trim();
    return result.length > 0;
  } catch (e) {
    return false;
  }
}

/**
 * Extract emails from HTML content
 */
function extractEmails(html) {
  const emails = new Set();
  
  // Look for mailto: links
  const mailtoRegex = /mailto:([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,})/gi;
  let match;
  while ((match = mailtoRegex.exec(html)) !== null) {
    emails.add(match[1].toLowerCase());
  }
  
  // Look for plain email addresses
  const plainMatches = html.match(EMAIL_REGEX);
  if (plainMatches) {
    plainMatches.forEach(email => emails.add(email.toLowerCase()));
  }
  
  // Filter out generic addresses
  return Array.from(emails).filter(email => {
    return !GENERIC_FILTERS.some(regex => regex.test(email));
  });
}

/**
 * Check schema.org structured data for contact info
 */
function extractStructuredEmails(html) {
  const emails = new Set();
  
  // Look for JSON-LD structured data
  const jsonLdRegex = /<script[^>]+type=["']application\/ld\+json["'][^>]*>(.*?)<\/script>/gis;
  let match;
  
  while ((match = jsonLdRegex.exec(html)) !== null) {
    try {
      const data = JSON.parse(match[1]);
      const findEmails = (obj) => {
        if (typeof obj !== 'object' || obj === null) return;
        
        if (obj.email && typeof obj.email === 'string') {
          const cleaned = obj.email.replace(/^mailto:/i, '');
          if (EMAIL_REGEX.test(cleaned)) {
            emails.add(cleaned.toLowerCase());
          }
        }
        
        // Check ContactPoint
        if (obj['@type'] === 'ContactPoint' && obj.email) {
          const cleaned = obj.email.replace(/^mailto:/i, '');
          if (EMAIL_REGEX.test(cleaned)) {
            emails.add(cleaned.toLowerCase());
          }
        }
        
        // Recurse through object
        for (const key in obj) {
          if (typeof obj[key] === 'object') {
            findEmails(obj[key]);
          }
        }
      };
      
      findEmails(data);
    } catch (e) {
      // Invalid JSON, skip
    }
  }
  
  return Array.from(emails);
}

/**
 * Score an email address for prioritization
 * Higher score = better
 */
function scoreEmail(email, foundOnPage = false) {
  let score = 0;
  
  // Prefer emails found on actual pages
  if (foundOnPage) score += 100;
  
  const localPart = email.split('@')[0].toLowerCase();
  
  // High priority: specific people
  if (/^(founder|ceo|co-founder|cofounder|name|admin|owner)/i.test(localPart)) {
    score += 50;
  }
  
  // Medium priority: contact-related
  if (/^(hello|hi|contact|team)/i.test(localPart)) {
    score += 30;
  }
  
  // Lower priority: generic
  if (/^(info|support|sales|help)/i.test(localPart)) {
    score += 10;
  }
  
  return score;
}

/**
 * Comprehensive email discovery
 */
async function discoverEmail(website, toolName) {
  console.log(`[EMAIL DISCOVERY] Starting for ${toolName} at ${website}`);
  
  if (!website) {
    console.log('[EMAIL DISCOVERY] No website provided');
    return null;
  }
  
  const foundEmails = [];
  let baseUrl;
  
  try {
    baseUrl = new URL(website);
  } catch (e) {
    console.log(`[EMAIL DISCOVERY] Invalid URL: ${website}`);
    return null;
  }
  
  // Step 1: Check common contact/about/team pages
  console.log('[EMAIL DISCOVERY] Step 1: Checking common pages...');
  for (const pathToCheck of CONTACT_PATHS) {
    try {
      const url = `${baseUrl.origin}${pathToCheck}`;
      console.log(`  Checking ${url}...`);
      const html = await fetchUrl(url, 8000);
      
      // Extract emails from page
      const emails = extractEmails(html);
      const structuredEmails = extractStructuredEmails(html);
      const allEmails = [...new Set([...emails, ...structuredEmails])];
      
      if (allEmails.length > 0) {
        console.log(`  Found ${allEmails.length} email(s): ${allEmails.join(', ')}`);
        allEmails.forEach(email => {
          foundEmails.push({
            email,
            source: `page:${pathToCheck}`,
            score: scoreEmail(email, true)
          });
        });
      }
    } catch (e) {
      // Page doesn't exist or couldn't fetch, continue
      console.log(`  Failed: ${e.message}`);
    }
  }
  
  // Step 2: Try common email patterns if we have MX records
  console.log('[EMAIL DISCOVERY] Step 2: Checking common email patterns...');
  const domain = baseUrl.hostname.replace(/^www\./, '');
  
  if (hasMXRecords(domain)) {
    console.log(`  Domain ${domain} has MX records, trying common patterns...`);
    const commonPatterns = [
      'hello',
      'hi',
      'contact',
      'info',
      'support',
      'team',
      'founders'
    ];
    
    commonPatterns.forEach(prefix => {
      const email = `${prefix}@${domain}`;
      foundEmails.push({
        email,
        source: 'pattern',
        score: scoreEmail(email, false)
      });
    });
  } else {
    console.log(`  Domain ${domain} has no MX records, skipping pattern guessing`);
  }
  
  // Step 3: Sort by score and return best email
  if (foundEmails.length === 0) {
    console.log('[EMAIL DISCOVERY] No emails found');
    return null;
  }
  
  foundEmails.sort((a, b) => b.score - a.score);
  
  console.log('[EMAIL DISCOVERY] Found emails (sorted by priority):');
  foundEmails.slice(0, 10).forEach(({ email, source, score }) => {
    console.log(`  ${email} (score: ${score}, source: ${source})`);
  });
  
  const bestEmail = foundEmails[0].email;
  console.log(`[EMAIL DISCOVERY] Selected: ${bestEmail}`);
  
  return bestEmail;
}

async function main() {
  const input = JSON.parse(process.argv[2] || fs.readFileSync('/dev/stdin', 'utf-8'));
  const { name, website, slug, email } = input;
  
  if (!name || !slug) {
    console.error('Need at least name and slug');
    process.exit(1);
  }

  const contacted = getContacted();
  if (contacted.has(slug)) {
    console.log(JSON.stringify({ skipped: true, reason: 'already contacted', slug }));
    return;
  }

  const listingUrl = `${SITE_URL}/agents/${slug}`;
  
  const subject = `${name} is featured on AgentRank - AI Agent Directory`;
  
  const body = `Hi there,

I wanted to let you know that ${name} has been added to AgentRank (${SITE_URL}), an AI agent directory where people discover and compare AI tools.

Your listing is live here: ${listingUrl}

We'd love it if you could check the listing to make sure the details are accurate. If anything needs updating — pricing, features, description — just reply to this email and I'll get it fixed.

If you find the listing useful, feel free to share it or link to it from your site.

Cheers,
Hugh McInnis
${SITE_URL}`;

  // Discover email if not provided
  let contactEmail = email;
  if (!contactEmail) {
    console.log('No email provided, attempting discovery...');
    try {
      contactEmail = await discoverEmail(website, name);
    } catch (e) {
      console.error(`Email discovery error: ${e.message}`);
    }
  }

  // Write body to temp file
  const tmpFile = `/tmp/tool-notify-${slug}.txt`;
  fs.writeFileSync(tmpFile, body);

  if (contactEmail) {
    try {
      execSync(
        `GMAIL_USER='${GMAIL_USER}' GMAIL_APP_PASSWORD='${GMAIL_APP_PASSWORD}' python3 ${EMAIL_SCRIPT} '${contactEmail}' '${subject}' ${tmpFile}`,
        { timeout: 15000 }
      );
      console.log(JSON.stringify({ success: true, emailed: contactEmail, slug, discovered: !email }));
    } catch (e) {
      console.error(`Email failed: ${e.message}`);
    }
  } else {
    console.log(JSON.stringify({ success: true, queued: true, slug, note: 'No email found, logged for manual outreach' }));
    logManualOutreach(name, website, slug);
  }

  // Mark as contacted
  fs.appendFileSync(CONTACTED_FILE, `${slug}\n`);
  
  // Clean up
  try { fs.unlinkSync(tmpFile); } catch(e) {}
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
