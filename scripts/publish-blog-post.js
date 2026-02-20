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

function checkForDuplicates(newPost) {
  const content = fs.readFileSync(BLOG_FILE, 'utf-8');
  const slugMatch = content.match(/slug:\s*"([^"]+)"/g);
  const titleMatch = content.match(/title:\s*"([^"]+)"/g);
  
  if (!slugMatch || !titleMatch) return;
  
  const existingSlugs = slugMatch.map(m => m.match(/"([^"]+)"/)[1]);
  const existingTitles = titleMatch.map(m => m.match(/"([^"]+)"/)[1]);
  
  // Exact slug match
  if (existingSlugs.includes(newPost.slug)) {
    throw new Error(`Duplicate post detected: A post with slug "${newPost.slug}" already exists!`);
  }
  
  // Check for similar slugs (potential duplicates)
  const slugWords = newPost.slug.split('-');
  for (const existingSlug of existingSlugs) {
    const existingWords = existingSlug.split('-');
    const commonWords = slugWords.filter(w => existingWords.includes(w) && w.length > 3);
    
    // If more than 50% of significant words match, it's likely a duplicate
    if (commonWords.length >= Math.min(slugWords.length, existingWords.length) * 0.5) {
      throw new Error(`Potential duplicate detected: New post slug "${newPost.slug}" is very similar to existing post "${existingSlug}". Please choose a different topic.`);
    }
  }
  
  // Check for similar titles
  const newTitleLower = newPost.title.toLowerCase();
  for (const existingTitle of existingTitles) {
    const existingLower = existingTitle.toLowerCase();
    if (newTitleLower === existingLower) {
      throw new Error(`Duplicate post detected: A post with title "${existingTitle}" already exists!`);
    }
  }
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
  
  // Check for duplicates before publishing
  checkForDuplicates(post);

  // Strip leading H1 title from content (the site renders title separately)
  post.content = post.content.replace(/^\s*#\s+[^\n]+\n+/, '');

  const id = getNextId();
  
  // Generate timestamp in PST (America/Los_Angeles)
  const now = new Date();
  const pstDate = new Date(now.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }));
  const publishedAt = pstDate.toISOString();
  const today = publishedAt.split('T')[0];
  
  const words = post.content.split(/\s+/).length;
  const readTime = `${Math.max(1, Math.ceil(words / 250))} min read`;

  // Generate featured image — use AI (Together.ai FLUX) if key available, else SVG fallback
  let imgFile;
  if (process.env.TOGETHER_API_KEY) {
    try {
      const { generate: aiGen } = require('./generate-blog-image-ai.js');
      const pngPath = path.resolve(__dirname, `../public/images/blog/${post.slug}.png`);
      await aiGen(post.title, post.slug, pngPath);
      imgFile = `/images/blog/${post.slug}.png`;
    } catch (e) {
      console.error(`AI image failed, using SVG: ${e.message}`);
    }
  }
  if (!imgFile) {
    const { generate: svgGen } = require('./generate-blog-image.js');
    const svgPath = path.resolve(__dirname, `../public/images/blog/${post.slug}.svg`);
    svgGen(post.title, post.slug, svgPath);
    imgFile = `/images/blog/${post.slug}.svg`;
  }

  // Build the new entry
  const entry = `    {
        id: "${id}",
        title: ${JSON.stringify(post.title)},
        slug: ${JSON.stringify(post.slug)},
        excerpt: ${JSON.stringify(post.excerpt)},
        content: \`${escapeForTemplate(post.content)}\`,
        author: "Hugh McInnis",
        publishDate: "${today}",
        publishedAt: "${publishedAt}",
        readTime: "${readTime}",
        categories: ${JSON.stringify(post.categories)},
        featuredImage: "${imgFile}",
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

  // Git commit and push
  execSync(`git add -A`, { cwd: REPO_DIR });
  execSync(`git commit -m "blog: ${post.title}"`, { cwd: REPO_DIR });
  execSync(`git push`, { cwd: REPO_DIR });

  // Cross-post to Dev.to and queue tweet (best-effort, don't fail the publish)
  try {
    execSync(`node ${path.resolve(__dirname, 'crosspost-devto.js')} ${fileArg || '/dev/stdin'}`, {
      input: fileArg ? undefined : input,
      cwd: REPO_DIR,
      timeout: 30000,
    });
  } catch (e) {
    console.error(`Dev.to crosspost failed (non-fatal): ${e.message}`);
  }

  try {
    const tweetInput = JSON.stringify({ title: post.title, slug: post.slug, excerpt: post.excerpt });
    execSync(`node ${path.resolve(__dirname, 'generate-tweet.js')}`, {
      input: tweetInput,
      cwd: REPO_DIR,
      timeout: 10000,
    });
  } catch (e) {
    console.error(`Tweet queue failed (non-fatal): ${e.message}`);
  }

  console.log(JSON.stringify({ success: true, id, slug: post.slug, title: post.title }));
}

main().catch(e => { console.error(e.message); process.exit(1); });
