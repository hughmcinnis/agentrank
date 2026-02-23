#!/usr/bin/env node
/**
 * generate-tweet.js
 * Generates a tweet-ready summary for an agentrank blog post.
 * Saves to /tmp/tweet-queue/ for posting.
 *
 * Usage: echo '{"title":"...","slug":"...","excerpt":"..."}' | node generate-tweet.js
 */

const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://agentrank.tech';
const QUEUE_DIR = '/tmp/tweet-queue';

function main() {
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
  const url = `${SITE_URL}/blog/${post.slug}`;

  // Generate tweet text (under 280 chars)
  let tweet = '';
  if (post.tweetText) {
    tweet = post.tweetText;
  } else {
    // Use excerpt, trim to fit with URL
    const maxExcerpt = 280 - url.length - 5; // 5 for \n\n and buffer
    const excerpt = (post.excerpt || post.title).substring(0, maxExcerpt);
    tweet = `${excerpt}\n\n${url}`;
  }

  // Save to queue
  if (!fs.existsSync(QUEUE_DIR)) fs.mkdirSync(QUEUE_DIR, { recursive: true });
  const filename = `${Date.now()}-${post.slug}.json`;
  const tweetData = {
    text: tweet,
    url,
    title: post.title,
    slug: post.slug,
    createdAt: new Date().toISOString(),
    posted: false,
  };
  fs.writeFileSync(path.join(QUEUE_DIR, filename), JSON.stringify(tweetData, null, 2));

  console.log(JSON.stringify({ success: true, tweet: tweet, queueFile: filename }));
}

main();
