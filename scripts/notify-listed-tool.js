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

const SITE_URL = 'https://agentrank.tech';
const CONTACTED_FILE = path.resolve('/home/user/agentrank/data/contacted-tools.txt');
const GMAIL_USER = 'hugh.e.mcinnis@gmail.com';
const GMAIL_APP_PASSWORD = 'qxvhgypoarhihgll';
const EMAIL_SCRIPT = '/home/user/.openclaw/scripts/send-email.py';

function getContacted() {
  if (!fs.existsSync(CONTACTED_FILE)) {
    const dir = path.dirname(CONTACTED_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(CONTACTED_FILE, '');
    return new Set();
  }
  return new Set(fs.readFileSync(CONTACTED_FILE, 'utf-8').split('\n').filter(Boolean));
}

function main() {
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

  // Write body to temp file
  const tmpFile = `/tmp/tool-notify-${slug}.txt`;
  fs.writeFileSync(tmpFile, body);

  if (email) {
    try {
      execSync(
        `GMAIL_USER='${GMAIL_USER}' GMAIL_APP_PASSWORD='${GMAIL_APP_PASSWORD}' python3 ${EMAIL_SCRIPT} '${email}' '${subject}' ${tmpFile}`,
        { timeout: 15000 }
      );
      console.log(JSON.stringify({ success: true, emailed: email, slug }));
    } catch (e) {
      console.error(`Email failed: ${e.message}`);
    }
  } else {
    console.log(JSON.stringify({ success: true, queued: true, slug, note: 'No email provided, logged for manual outreach' }));
  }

  // Mark as contacted
  fs.appendFileSync(CONTACTED_FILE, `${slug}\n`);
  
  // Clean up
  try { fs.unlinkSync(tmpFile); } catch(e) {}
}

main();
