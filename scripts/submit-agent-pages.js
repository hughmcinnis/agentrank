#!/usr/bin/env node
/**
 * submit-agent-pages.js
 * 
 * Submits agent page URLs to Google Search Console for indexing.
 * Can submit specific slugs (args) or all agent pages.
 * 
 * Usage:
 *   node submit-agent-pages.js clara motion notta     # specific agents
 *   node submit-agent-pages.js --all                   # all agents
 *   node submit-agent-pages.js --new                   # only unsubmitted agents
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const AGENTS_FILE = path.resolve(__dirname, '../src/data/agents.ts');
const SUBMIT_SCRIPT = path.resolve(__dirname, 'submit-to-search-console.js');
const SUBMITTED_LOG = path.resolve(__dirname, '../data/submitted-agent-pages.json');
const BASE_URL = 'https://www.agentrank.tech/agents';

function getAgentSlugs() {
  const content = fs.readFileSync(AGENTS_FILE, 'utf8');
  return [...content.matchAll(/slug:\s*"([^"]+)"/g)].map(m => m[1]);
}

function getSubmittedSlugs() {
  try {
    return JSON.parse(fs.readFileSync(SUBMITTED_LOG, 'utf8'));
  } catch {
    return [];
  }
}

function saveSubmittedSlugs(slugs) {
  const dir = path.dirname(SUBMITTED_LOG);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(SUBMITTED_LOG, JSON.stringify(slugs, null, 2));
}

async function main() {
  const args = process.argv.slice(2);
  const allSlugs = getAgentSlugs();
  const submitted = getSubmittedSlugs();
  
  let slugsToSubmit;
  
  if (args.includes('--all')) {
    slugsToSubmit = allSlugs;
  } else if (args.includes('--new')) {
    slugsToSubmit = allSlugs.filter(s => !submitted.includes(s));
  } else if (args.length > 0) {
    slugsToSubmit = args.filter(a => !a.startsWith('--'));
  } else {
    // Default: only new/unsubmitted
    slugsToSubmit = allSlugs.filter(s => !submitted.includes(s));
  }

  if (slugsToSubmit.length === 0) {
    console.log('✅ No new agent pages to submit');
    return;
  }

  console.log(`📤 Submitting ${slugsToSubmit.length} agent pages to Search Console...`);
  
  let success = 0;
  let failed = 0;
  const newlySubmitted = [...submitted];

  for (const slug of slugsToSubmit) {
    const url = `${BASE_URL}/${slug}`;
    try {
      console.log(`  → ${slug}...`);
      execSync(`node ${SUBMIT_SCRIPT} ${url}`, {
        cwd: path.resolve(__dirname, '..'),
        timeout: 120000,
        stdio: 'pipe',
      });
      success++;
      if (!newlySubmitted.includes(slug)) newlySubmitted.push(slug);
      // Small delay between submissions
      await new Promise(r => setTimeout(r, 3000));
    } catch (e) {
      console.error(`  ❌ ${slug}: ${e.message.split('\n')[0]}`);
      failed++;
    }
  }

  saveSubmittedSlugs(newlySubmitted);
  console.log(`\n✅ Done: ${success} submitted, ${failed} failed`);
}

main().catch(e => {
  console.error(e.message);
  process.exit(1);
});
