#!/usr/bin/env node
/**
 * publish-blog-post.js
 * Reads a JSON blog post from stdin or a file argument,
 * appends it to blog-posts.ts with auto-incremented ID,
 * and commits + pushes to GitHub.
 *
 * Usage:
 *   echo '{"title":"...","slug":"...","excerpt":"...","content":"...","categories":["AI"],"tags":["ai"]}' | node publish-blog-post.js
 *   node publish-blog-post.js post.json
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const BLOG_FILE = path.resolve(__dirname, '../src/data/blog-posts.ts');
const REPO_DIR = path.resolve(__dirname, '..');

function getNextId() {
  const content = fs.readFileSync(BLOG_FILE, 'utf-8');
  const ids = [...content.matchAll(/id:\s*"(\d+)"/g)].map(m => parseInt(m[1]));
  return String(Math.max(0, ...ids) + 1);
}

function escapeForTemplate(str) {
  return str.replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
}

async function main() {
  let input;
  const fileArg = process.argv[2];
  if (fileArg) {
    input = fs.readFileSync(fileArg, 'utf-8');
  } else {
    input = fs.readFileSync('/dev/stdin', 'utf-8');
  }

  const post = JSON.parse(input);
  const required = ['title', 'slug', 'excerpt', 'content', 'categories', 'tags'];
  for (const f of required) {
    if (!post[f]) throw new Error(`Missing required field: ${f}`);
  }

  const id = getNextId();
  const today = new Date().toISOString().split('T')[0];
  const words = post.content.split(/\s+/).length;
  const readTime = `${Math.max(1, Math.ceil(words / 250))} min read`;

  // Build the new entry
  const entry = `    {
        id: "${id}",
        title: ${JSON.stringify(post.title)},
        slug: ${JSON.stringify(post.slug)},
        excerpt: ${JSON.stringify(post.excerpt)},
        content: \`${escapeForTemplate(post.content)}\`,
        author: "Hugh McInnis",
        publishDate: "${today}",
        readTime: "${readTime}",
        categories: ${JSON.stringify(post.categories)},
        featuredImage: "/images/blog/${post.slug}.svg",
        tags: ${JSON.stringify(post.tags)},
    }`;

  // Insert before the closing ];
  let content = fs.readFileSync(BLOG_FILE, 'utf-8');
  const closingIndex = content.lastIndexOf('];');
  if (closingIndex === -1) throw new Error('Could not find closing ]; in blog-posts.ts');

  // Check if we need a comma after the last entry
  const before = content.substring(0, closingIndex).trimEnd();
  const needsComma = before.endsWith('}') || before.endsWith('},');
  const separator = before.endsWith(',') ? '\n' : ',\n';

  content = before + separator + entry + '\n' + content.substring(closingIndex);
  fs.writeFileSync(BLOG_FILE, content);

  // Generate SVG featured image
  generateSvgImage(post.title, post.slug);

  // Git commit and push
  execSync(`git add -A`, { cwd: REPO_DIR });
  execSync(`git commit -m "blog: ${post.title}"`, { cwd: REPO_DIR });
  execSync(`git push`, { cwd: REPO_DIR });

  console.log(JSON.stringify({ success: true, id, slug: post.slug, title: post.title }));
}

function generateSvgImage(title, slug) {
  const palettes = [
    ['#667eea', '#764ba2'], ['#f093fb', '#f5576c'], ['#4facfe', '#00f2fe'],
    ['#43e97b', '#38f9d7'], ['#fa709a', '#fee140'], ['#a18cd1', '#fbc2eb'],
    ['#fccb90', '#d57eeb'], ['#e0c3fc', '#8ec5fc']
  ];
  let hash = 0;
  for (const c of slug) hash = ((hash << 5) - hash + c.charCodeAt(0)) | 0;
  const [c1, c2] = palettes[Math.abs(hash) % palettes.length];

  // Word-wrap title
  const words = title.split(' ');
  const lines = [];
  let line = '';
  for (const w of words) {
    if ((line + ' ' + w).length > 30 && line) { lines.push(line); line = w; }
    else { line = line ? line + ' ' + w : w; }
  }
  if (line) lines.push(line);

  const textY = 315 - (lines.length * 22);
  const tspans = lines.map((l, i) =>
    `<tspan x="600" dy="${i === 0 ? 0 : 48}">${l.replace(/&/g,'&amp;').replace(/</g,'&lt;')}</tspan>`
  ).join('');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs><linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" style="stop-color:${c1}"/>
    <stop offset="100%" style="stop-color:${c2}"/>
  </linearGradient></defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <text x="600" y="${textY}" text-anchor="middle" fill="white" font-family="Arial,Helvetica,sans-serif" font-size="42" font-weight="bold">${tspans}</text>
  <text x="600" y="560" text-anchor="middle" fill="rgba(255,255,255,0.7)" font-family="Arial,sans-serif" font-size="22">agentrank.tech</text>
</svg>`;

  const imgDir = path.resolve(__dirname, '../public/images/blog');
  if (!fs.existsSync(imgDir)) fs.mkdirSync(imgDir, { recursive: true });
  fs.writeFileSync(path.join(imgDir, `${slug}.svg`), svg);
}

main().catch(e => { console.error(e.message); process.exit(1); });
