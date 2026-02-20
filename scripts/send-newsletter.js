#!/usr/bin/env node
// ============================================================
// AgentRank Weekly Newsletter
// ============================================================
// Cron recommendation (Fridays at 10 AM PST / 18:00 UTC):
//   0 18 * * 5 cd /home/user/agentrank && node scripts/send-newsletter.js
// ============================================================

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const SITE_URL = 'https://agentrank.tech';
const SUBSCRIBERS_FILE = path.join(__dirname, '..', 'data', 'newsletter-subscribers.txt');
const BLOG_POSTS_FILE = path.join(__dirname, '..', 'src', 'data', 'blog-posts.ts');
const AGENTS_FILE = path.join(__dirname, '..', 'src', 'data', 'agents.ts');

// ---- Parse data from TS files ----

function parseBlogPosts() {
  const src = fs.readFileSync(BLOG_POSTS_FILE, 'utf-8');
  const posts = [];
  const regex = /\{[^}]*?id:\s*"[^"]*"[\s\S]*?publishDate:\s*"([^"]*)"[\s\S]*?\}/g;
  // Simpler: extract each object between { } in the array
  const blockRegex = /\{\s*id:\s*"([^"]*)"[\s\S]*?title:\s*"([^"]*)"[\s\S]*?slug:\s*"([^"]*)"[\s\S]*?excerpt:\s*"([^"]*)"[\s\S]*?publishDate:\s*"([^"]*)"[\s\S]*?readTime:\s*"([^"]*)"/g;
  let m;
  while ((m = blockRegex.exec(src)) !== null) {
    posts.push({
      id: m[1], title: m[2], slug: m[3],
      excerpt: m[4], publishDate: m[5], readTime: m[6]
    });
  }
  return posts;
}

function parseAgents() {
  const src = fs.readFileSync(AGENTS_FILE, 'utf-8');
  const agents = [];
  const blockRegex = /\{\s*id:\s*"([^"]*)"[\s\S]*?name:\s*"([^"]*)"[\s\S]*?slug:\s*"([^"]*)"[\s\S]*?tagline:\s*"([^"]*)"[\s\S]*?addedDate:\s*"([^"]*)"/g;
  let m;
  while ((m = blockRegex.exec(src)) !== null) {
    agents.push({ id: m[1], name: m[2], slug: m[3], tagline: m[4], addedDate: m[5] });
  }
  return agents;
}

function getRecentItems(items, dateField, days = 7) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return items.filter(i => new Date(i[dateField]) >= cutoff);
}

// ---- Build HTML email ----

function buildNewsletter(recentPosts, newAgents) {
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  const postsHtml = recentPosts.length > 0
    ? recentPosts.slice(0, 3).map(p => `
      <tr><td style="padding: 16px 0; border-bottom: 1px solid #eee;">
        <a href="${SITE_URL}/blog/${p.slug}" style="color: #6366f1; font-size: 18px; font-weight: 600; text-decoration: none;">${p.title}</a>
        <p style="margin: 6px 0 0; color: #555; font-size: 14px; line-height: 1.5;">${p.excerpt}</p>
        <span style="color: #999; font-size: 12px;">${p.readTime} read</span>
      </td></tr>`).join('')
    : '<tr><td style="padding: 16px 0; color: #888;">Quiet week on the blog — we\'re cooking up something good.</td></tr>';

  const agentsHtml = newAgents.length > 0
    ? newAgents.map(a => `
      <tr><td style="padding: 12px 0; border-bottom: 1px solid #eee;">
        <a href="${SITE_URL}/agents/${a.slug}" style="color: #6366f1; font-weight: 600; text-decoration: none;">${a.name}</a>
        <span style="color: #555; font-size: 14px;"> — ${a.tagline}</span>
      </td></tr>`).join('')
    : '<tr><td style="padding: 12px 0; color: #888;">No new agents this week. The bar is high.</td></tr>';

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:32px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">

  <!-- Header -->
  <tr><td style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:32px 40px;">
    <h1 style="margin:0;color:#fff;font-size:24px;">📡 AgentRank Weekly</h1>
    <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">${dateStr}</p>
  </td></tr>

  <!-- Intro -->
  <tr><td style="padding:32px 40px 16px;">
    <p style="margin:0;color:#333;font-size:15px;line-height:1.6;">Hey — here's your weekly roundup from the AI agent world. What's new, what's worth your time, and what just landed on AgentRank. Let's get into it.</p>
  </td></tr>

  <!-- Articles -->
  <tr><td style="padding:16px 40px;">
    <h2 style="margin:0 0 12px;color:#333;font-size:18px;">📝 This Week's Reads</h2>
    <table width="100%" cellpadding="0" cellspacing="0">${postsHtml}</table>
  </td></tr>

  <!-- New Agents -->
  <tr><td style="padding:16px 40px 32px;">
    <h2 style="margin:0 0 12px;color:#333;font-size:18px;">🤖 New on AgentRank</h2>
    <table width="100%" cellpadding="0" cellspacing="0">${agentsHtml}</table>
  </td></tr>

  <!-- CTA -->
  <tr><td align="center" style="padding:0 40px 32px;">
    <a href="${SITE_URL}" style="display:inline-block;background:#6366f1;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">Browse All Agents →</a>
  </td></tr>

  <!-- Footer -->
  <tr><td style="background:#f9fafb;padding:24px 40px;border-top:1px solid #eee;">
    <p style="margin:0;color:#999;font-size:12px;line-height:1.6;text-align:center;">
      You're getting this because you signed up at <a href="${SITE_URL}" style="color:#6366f1;">AgentRank</a>.<br>
      <a href="${SITE_URL}/unsubscribe" style="color:#999;">Unsubscribe</a> · <a href="${SITE_URL}" style="color:#999;">agentrank.tech</a>
    </p>
  </td></tr>

</table>
</td></tr></table>
</body></html>`;
}

// ---- Send email via send-email.py (with proper HTML) ----

function sendEmail(to, subject, htmlBody) {
  // Write HTML to temp file, then use python to send with proper HTML MIME
  const tmpFile = path.join('/tmp', `newsletter-${Date.now()}.html`);
  fs.writeFileSync(tmpFile, htmlBody);

  // Use inline python for proper HTML email (send-email.py wraps in <pre>)
  const pyScript = `
import smtplib, sys
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from pathlib import Path

html = Path("${tmpFile}").read_text()
msg = MIMEMultipart("alternative")
msg["From"] = "${process.env.GMAIL_USER || 'hugh.e.mcinnis@gmail.com'}"
msg["To"] = "${to}"
msg["Subject"] = """${subject}"""
msg.attach(MIMEText(html, "html"))
with smtplib.SMTP_SSL("smtp.gmail.com", 465) as s:
    s.login("${process.env.GMAIL_USER || 'hugh.e.mcinnis@gmail.com'}", "${process.env.GMAIL_APP_PASSWORD || ''}")
    s.send_message(msg)
print(f"✓ Sent to ${to}")
`;
  const pyTmpFile = path.join('/tmp', `newsletter-send-${Date.now()}.py`);
  fs.writeFileSync(pyTmpFile, pyScript);

  try {
    const out = execSync(`python3 "${pyTmpFile}"`, {
      encoding: 'utf-8',
      env: { ...process.env }
    });
    console.log(out.trim());
  } catch (e) {
    console.error(`✗ Failed to send to ${to}:`, e.message);
  } finally {
    try { fs.unlinkSync(tmpFile); fs.unlinkSync(pyTmpFile); } catch {}
  }
}

// ---- Main ----

function main() {
  console.log('🗞️  AgentRank Weekly Newsletter\n');

  const posts = parseBlogPosts();
  const agents = parseAgents();

  // For test runs or when data is older, show all if none recent
  let recentPosts = getRecentItems(posts, 'publishDate', 7);
  let newAgents = getRecentItems(agents, 'addedDate', 7);

  // Fallback: if nothing recent, grab latest 3 posts and 5 agents
  if (recentPosts.length === 0 && posts.length > 0) {
    console.log('ℹ️  No posts from last 7 days — using latest 3');
    recentPosts = posts.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate)).slice(0, 3);
  }
  if (newAgents.length === 0 && agents.length > 0) {
    console.log('ℹ️  No agents from last 7 days — using latest 5');
    newAgents = agents.sort((a, b) => new Date(b.addedDate) - new Date(a.addedDate)).slice(0, 5);
  }

  console.log(`📝 Posts: ${recentPosts.length} | 🤖 Agents: ${newAgents.length}`);

  const html = buildNewsletter(recentPosts, newAgents);
  const subject = `AgentRank Weekly — ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;

  // Load subscribers
  const subscribers = fs.readFileSync(SUBSCRIBERS_FILE, 'utf-8')
    .split('\n').map(s => s.trim()).filter(Boolean);

  console.log(`📬 Sending to ${subscribers.length} subscriber(s)...\n`);

  for (const email of subscribers) {
    sendEmail(email, subject, html);
  }

  console.log('\n✅ Done!');
}

main();
