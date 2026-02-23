#!/usr/bin/env node
/**
 * crosspost-devto.js
 * Cross-posts an agentrank blog post to Dev.to (@theagenteconomy)
 * with backlinks to the original article.
 *
 * Usage: echo '{"title":"...","slug":"...","excerpt":"...","tags":["ai"]}' | node crosspost-devto.js
 *   or:  node crosspost-devto.js post.json
 */

const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const DEVTO_WRAPPER = path.resolve('/home/user/devto-api-secure.js');
const SITE_URL = 'https://agentrank.tech';

async function main() {
  let input;
  const fileArg = process.argv[2];
  if (fileArg && fileArg !== '/dev/stdin') {
    input = fs.readFileSync(fileArg, 'utf-8');
  } else {
    // Read from stdin as stream (works in non-TTY/background contexts)
    const chunks = [];
    const buf = Buffer.alloc(4096);
    try {
      let n;
      while ((n = fs.readSync(0, buf, 0, buf.length)) > 0) {
        chunks.push(buf.slice(0, n));
      }
    } catch {}
    input = Buffer.concat(chunks).toString('utf-8');
  }

  const post = JSON.parse(input);
  const articleUrl = `${SITE_URL}/blog/${post.slug}`;

  // Create a condensed Dev.to version with backlink
  const devtoBody = `*Originally published on [AgentRank](${articleUrl})*

${post.content || post.excerpt}

---

📊 **[Read the full analysis on AgentRank →](${articleUrl})**

AgentRank is the honest AI agent directory — real reviews, real comparisons, no sponsored rankings. [Browse all agents →](${SITE_URL})`;

  // Map tags to Dev.to format (max 4, lowercase, no spaces)
  const tagMap = {
    'ai': 'ai',
    'ai-agents': 'aiagents',
    'automation': 'automation',
    'productivity': 'productivity',
    'tools': 'tools',
    'comparison': 'comparison',
    'review': 'review',
    'sales': 'sales',
    'coding': 'coding',
    'writing': 'writing',
    'email': 'email',
    'marketing': 'marketing',
  };

  const devtoTags = (post.tags || [])
    .map(t => tagMap[t.toLowerCase()] || t.toLowerCase().replace(/[^a-z0-9]/g, ''))
    .filter(Boolean)
    .slice(0, 4);

  // Ensure 'ai' is always included
  if (!devtoTags.includes('ai')) {
    devtoTags.unshift('ai');
    if (devtoTags.length > 4) devtoTags.pop();
  }

  const articleData = {
    account: 'theagenteconomy',
    article: {
      title: post.title,
      body_markdown: devtoBody,
      tags: devtoTags,
      published: true,
      canonical_url: articleUrl,
    },
  };

  // Use the secure wrapper
  const result = execSync(
    `node ${DEVTO_WRAPPER} create_article '${JSON.stringify(articleData).replace(/'/g, "'\\''")}'`,
    { encoding: 'utf-8', timeout: 30000 }
  );

  console.log(JSON.stringify({ success: true, devto: result.trim(), originalUrl: articleUrl }));
}

main().catch(e => { console.error(e.message); process.exit(1); });
