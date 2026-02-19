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

  // Generate SVG featured image using the rich image generator
  const { generate } = require('./generate-blog-image.js');
  const imgPath = path.resolve(__dirname, `../public/images/blog/${post.slug}.svg`);
  generate(post.title, post.slug, imgPath);

  // Git commit and push
  execSync(`git add -A`, { cwd: REPO_DIR });
  execSync(`git commit -m "blog: ${post.title}"`, { cwd: REPO_DIR });
  execSync(`git push`, { cwd: REPO_DIR });

  console.log(JSON.stringify({ success: true, id, slug: post.slug, title: post.title }));
}

main().catch(e => { console.error(e.message); process.exit(1); });
