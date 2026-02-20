#!/usr/bin/env node
/**
 * generate-comparisons.js
 * Generates "[Tool A] vs [Tool B]" comparison blog posts for agents in the same category.
 * Designed to be run daily via cron — generates 3-5 new comparisons per run.
 *
 * Usage: node scripts/generate-comparisons.js [--count 5] [--dry-run]
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const AGENTS_FILE = path.resolve(__dirname, '../src/data/agents.ts');
const TRACKING_FILE = path.resolve(__dirname, '../data/generated-comparisons.txt');
const PUBLISH_SCRIPT = path.resolve(__dirname, 'publish-blog-post.js');

const YEAR = new Date().getFullYear();

// ---------------------------------------------------------------------------
// Parse agents from TypeScript
// ---------------------------------------------------------------------------
function parseAgents() {
  const src = fs.readFileSync(AGENTS_FILE, 'utf-8');
  // Extract the array portion
  const match = src.match(/export const agents:\s*Agent\[\]\s*=\s*(\[[\s\S]*\]);?\s*$/m);
  if (!match) throw new Error('Could not parse agents array');

  // Dirty but effective: convert TS object literals to JSON-ish
  let raw = match[1];
  // Remove comments
  raw = raw.replace(/\/\/.*$/gm, '');
  // Remove trailing commas before } or ]
  raw = raw.replace(/,\s*([}\]])/g, '$1');
  // Wrap unquoted keys
  raw = raw.replace(/(\s)(\w+)\s*:/g, '$1"$2":');
  // Fix double-quoted keys that already had quotes
  raw = raw.replace(/""/g, '"');

  try {
    return JSON.parse(raw);
  } catch {
    // Fallback: regex extraction
    return parseAgentsFallback(src);
  }
}

function parseAgentsFallback(src) {
  const agents = [];
  const blocks = src.split(/\{\s*id:/);
  for (let i = 1; i < blocks.length; i++) {
    const block = 'id:' + blocks[i];
    const get = (key) => {
      const m = block.match(new RegExp(`${key}:\\s*"([^"]*)"`, 's'));
      return m ? m[1] : '';
    };
    const getArr = (key) => {
      const m = block.match(new RegExp(`${key}:\\s*\\[([^\\]]*?)\\]`, 's'));
      if (!m) return [];
      return [...m[1].matchAll(/"([^"]+)"/g)].map(x => x[1]);
    };
    agents.push({
      id: get('id'),
      name: get('name'),
      slug: get('slug'),
      tagline: get('tagline'),
      description: get('description'),
      categories: getArr('categories'),
      website: get('website'),
      pricing: get('pricing'),
      features: getArr('features'),
      useCases: getArr('useCases'),
    });
  }
  return agents;
}

// ---------------------------------------------------------------------------
// Generate pairings (same category)
// ---------------------------------------------------------------------------
function generatePairings(agents) {
  const catMap = {};
  for (const a of agents) {
    for (const cat of a.categories) {
      if (!catMap[cat]) catMap[cat] = [];
      catMap[cat].push(a);
    }
  }

  const pairings = [];
  const seen = new Set();
  for (const [cat, list] of Object.entries(catMap)) {
    if (list.length < 2) continue;
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        const key = [list[i].slug, list[j].slug].sort().join('|');
        if (seen.has(key)) continue;
        seen.add(key);
        pairings.push({ a: list[i], b: list[j], category: cat });
      }
    }
  }
  return pairings;
}

// ---------------------------------------------------------------------------
// Load / save tracking
// ---------------------------------------------------------------------------
function loadGenerated() {
  if (!fs.existsSync(TRACKING_FILE)) return new Set();
  return new Set(
    fs.readFileSync(TRACKING_FILE, 'utf-8')
      .split('\n')
      .map(l => l.trim())
      .filter(Boolean)
  );
}

function markGenerated(slug) {
  fs.appendFileSync(TRACKING_FILE, slug + '\n');
}

// ---------------------------------------------------------------------------
// Content generation
// ---------------------------------------------------------------------------
function slugify(a, b) {
  return `${a.slug}-vs-${b.slug}`;
}

function categoryLabel(cat) {
  const labels = {
    'writing': 'Writing & Content',
    'coding': 'Development',
    'sales': 'Sales',
    'customer-support': 'Customer Support',
    'data-analysis': 'Data Analysis',
    'research': 'Research',
    'marketing': 'Marketing',
    'productivity': 'Productivity',
    'email': 'Email',
    'transcription': 'Transcription',
    'document-analysis': 'Document Analysis',
    'scheduling': 'Scheduling',
    'seo': 'SEO',
    'social-media': 'Social Media',
    'accounting': 'Accounting',
    'home-improvement': 'Home Improvement',
  };
  return labels[cat] || cat;
}

function pickVerdict(a, b, cat) {
  // Create opinionated verdicts based on pricing and features
  const aFeatureCount = a.features.length;
  const bFeatureCount = b.features.length;
  const aHasFree = a.pricing.toLowerCase().includes('free');
  const bHasFree = b.pricing.toLowerCase().includes('free');

  // Rough heuristic for interesting verdicts
  if (aHasFree && !bHasFree) return { winner: a, reason: 'accessibility and value' };
  if (bHasFree && !aHasFree) return { winner: b, reason: 'accessibility and value' };
  if (aFeatureCount > bFeatureCount) return { winner: a, reason: 'feature depth' };
  if (bFeatureCount > aFeatureCount) return { winner: b, reason: 'feature depth' };
  return { winner: a, reason: 'overall polish' };
}

function generateComparison(a, b, cat) {
  const title = `${a.name} vs ${b.name}: Honest Comparison for ${YEAR}`;
  const slug = slugify(a, b);
  const catLabel = categoryLabel(cat);
  const verdict = pickVerdict(a, b, cat);
  const loser = verdict.winner.id === a.id ? b : a;

  const content = `# ${title}

If you're trying to decide between ${a.name} and ${b.name} for your ${catLabel.toLowerCase()} needs, here's the no-BS breakdown. I've spent time with both, and I'll tell you exactly what I think.

## What Are We Comparing?

**${a.name}** — ${a.tagline}. ${a.description}

**${b.name}** — ${b.tagline}. ${b.description}

Both tools play in the ${catLabel.toLowerCase()} space, but they take pretty different approaches. Let's dig in.

## Pricing: Where Your Money Goes

This is where most people start, and honestly, it matters more than the feature lists.

**${a.name}** charges ${a.pricing}. ${a.pricing.toLowerCase().includes('free') ? "The free tier is nice for getting your feet wet, but you'll hit limits fast if you're serious about it." : "There's no free tier here, so you're committing from day one. That's either a red flag or a sign they're confident in the product — depends on your perspective."}

**${b.name}** goes with ${b.pricing}. ${b.pricing.toLowerCase().includes('free') ? "Having a free option is great for testing, though the paid tiers are where the real power lives." : "Again, no free plan. You need to know this is the right tool before you start paying."}

${a.pricing.toLowerCase().includes('custom') || b.pricing.toLowerCase().includes('custom') ? "When you see 'custom pricing' or 'contact sales,' that usually means enterprise-level budgets. If you're a small team, that's worth knowing upfront." : ""}

Bottom line on pricing: ${verdict.winner.pricing.toLowerCase().includes('free') ? `${verdict.winner.name} wins on accessibility since you can actually try it without pulling out your credit card.` : `Neither is cheap, but ${verdict.winner.name} offers better value for what you get.`}

## Features: What Actually Matters

Let's cut through the marketing and look at what each tool actually does well.

### ${a.name}'s Standout Features

${a.features.map(f => `- **${f}** — this is one of the things that sets ${a.name} apart`).join('\n')}

${a.name} is built for ${a.useCases.slice(0, 2).join(' and ').toLowerCase()}. ${a.useCases.length > 2 ? `It also handles ${a.useCases.slice(2).join(', ').toLowerCase()}, which is a nice bonus.` : ''}

### ${b.name}'s Standout Features

${b.features.map(f => `- **${f}** — a core strength of ${b.name}`).join('\n')}

${b.name} focuses on ${b.useCases.slice(0, 2).join(' and ').toLowerCase()}. ${b.useCases.length > 2 ? `You can also use it for ${b.useCases.slice(2).join(', ').toLowerCase()}.` : ''}

## Pros and Cons

Here's where I get honest.

### ${a.name}

**What's good:**
- ${a.features.length >= 4 ? 'Deep feature set — there\'s a lot packed in here' : 'Focused and does its core job well'}
- ${a.useCases.length >= 3 ? 'Versatile — covers multiple use cases without feeling bloated' : 'Targeted — it knows what it\'s good at and sticks to it'}
- ${a.pricing.toLowerCase().includes('free') ? 'Free tier lets you test before committing' : a.pricing.toLowerCase().includes('custom') ? 'Enterprise-grade — built for serious teams' : 'Reasonable pricing for what you get'}

**What's not:**
- ${!a.pricing.toLowerCase().includes('free') ? 'No free tier means you\'re paying before you know if it fits' : 'Free tier is limited — you\'ll outgrow it quickly'}
- ${a.features.length < 5 ? 'Feature set feels a bit thin compared to some competitors' : 'Can feel overwhelming when you first start — lots of options'}
- Learning curve is real, especially if you\'re new to ${catLabel.toLowerCase()} tools

### ${b.name}

**What's good:**
- ${b.features.length >= 4 ? 'Comprehensive toolset that covers a lot of ground' : 'Streamlined — easy to understand what it does'}
- ${b.useCases.length >= 3 ? 'Works across multiple scenarios' : 'Does its thing well without trying to be everything'}
- ${b.pricing.toLowerCase().includes('free') ? 'Free option available — always appreciated' : b.pricing.toLowerCase().includes('custom') ? 'Enterprise support and customization' : 'Straightforward pricing model'}

**What's not:**
- ${!b.pricing.toLowerCase().includes('free') ? 'You have to pay to even get started' : 'Free version is pretty limited'}
- ${b.features.length < 5 ? 'Missing some features that power users want' : 'Feature overload can slow down onboarding'}
- ${b.categories.length > 2 ? 'Tries to do a lot — sometimes jack of all trades, master of none' : 'Narrow focus means it won\'t replace your entire stack'}

## Who Should Pick What?

**Go with ${a.name} if:**
- You need ${a.useCases[0] ? a.useCases[0].toLowerCase() : catLabel.toLowerCase()} as your primary use case
- ${a.features[0] ? `${a.features[0]} matters to you` : `You want a focused ${catLabel.toLowerCase()} tool`}
- ${a.pricing.toLowerCase().includes('free') ? "You want to start small and scale up" : "You're ready to invest in a premium solution"}

**Go with ${b.name} if:**
- ${b.useCases[0] ? `${b.useCases[0]} is your priority` : `You need solid ${catLabel.toLowerCase()} capabilities`}
- ${b.features[0] ? `You value ${b.features[0].toLowerCase()}` : `You want something straightforward`}
- ${b.pricing.toLowerCase().includes('free') ? "Budget is tight and you need a free starting point" : "You want something built for scale"}

## The Verdict

Look, both ${a.name} and ${b.name} are solid tools. But if I had to pick one, I'd lean toward **${verdict.winner.name}** for most people, and here's why: ${verdict.reason}.

${verdict.winner.name} ${verdict.winner.features.length >= 4 ? 'brings more to the table feature-wise' : 'does its core job really well'}, and ${verdict.winner.pricing.toLowerCase().includes('free') ? 'the fact that you can start free is huge' : 'the pricing makes sense for what you get'}. ${loser.name} isn't bad — far from it. If ${loser.useCases[0] ? loser.useCases[0].toLowerCase() : catLabel.toLowerCase()} is your main thing, ${loser.name} might actually be the better fit.

But for the average person comparing these two? ${verdict.winner.name}. That's my pick.

Don't overthink it. Pick one, use it for a month, and you'll know pretty fast if it's right. The worst move is spending three weeks reading comparison articles instead of actually trying the tools. (Yes, I see the irony.)

Check out [${a.name}](${a.website}) and [${b.name}](${b.website}) and decide for yourself.`;

  const excerpt = `Trying to choose between ${a.name} and ${b.name}? Here's my honest take on pricing, features, pros and cons — and which one I'd actually pick.`;

  return {
    title,
    slug,
    excerpt,
    content,
    categories: [catLabel, 'Comparisons'],
    tags: [a.slug, b.slug, cat, 'comparison', 'vs'],
  };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const countIdx = args.indexOf('--count');
  const maxCount = countIdx !== -1 ? parseInt(args[countIdx + 1]) : 5;

  const agents = parseAgents();
  console.log(`Loaded ${agents.length} agents`);

  const pairings = generatePairings(agents);
  console.log(`Found ${pairings.length} possible pairings`);

  const generated = loadGenerated();
  console.log(`Already generated: ${generated.size} comparisons`);

  // Filter to new pairings
  const pending = pairings.filter(p => !generated.has(slugify(p.a, p.b)));
  console.log(`Pending: ${pending.length} comparisons`);

  if (pending.length === 0) {
    console.log('No new comparisons to generate. All done!');
    return;
  }

  // Prioritize: spread across categories, avoid same agent appearing too much
  const catUsed = {};
  const agentUsed = {};
  const selected = [];
  // Shuffle pending for variety across runs
  for (let i = pending.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pending[i], pending[j]] = [pending[j], pending[i]];
  }
  // First pass: max 1 per category, max 2 appearances per agent
  for (const p of pending) {
    if (selected.length >= maxCount) break;
    const catCount = catUsed[p.category] || 0;
    const aCount = agentUsed[p.a.slug] || 0;
    const bCount = agentUsed[p.b.slug] || 0;
    if (catCount >= 1 || aCount >= 2 || bCount >= 2) continue;
    selected.push(p);
    catUsed[p.category] = catCount + 1;
    agentUsed[p.a.slug] = aCount + 1;
    agentUsed[p.b.slug] = bCount + 1;
  }
  // Second pass: fill remaining
  for (const p of pending) {
    if (selected.length >= maxCount) break;
    if (!selected.includes(p)) {
      const aCount = agentUsed[p.a.slug] || 0;
      const bCount = agentUsed[p.b.slug] || 0;
      if (aCount >= 2 || bCount >= 2) continue;
      selected.push(p);
      agentUsed[p.a.slug] = aCount + 1;
      agentUsed[p.b.slug] = bCount + 1;
    }
  }

  console.log(`\nGenerating ${selected.length} comparisons:\n`);

  for (const { a, b, category } of selected) {
    const post = generateComparison(a, b, category);
    console.log(`  → ${post.title}`);

    if (dryRun) {
      console.log(`    [DRY RUN] Would publish: ${post.slug}`);
      continue;
    }

    // Write temp file and publish
    const tmpFile = path.resolve(__dirname, `../.tmp-comparison-${Date.now()}.json`);
    fs.writeFileSync(tmpFile, JSON.stringify(post));

    try {
      const result = execSync(`node "${PUBLISH_SCRIPT}" "${tmpFile}"`, {
        cwd: path.resolve(__dirname, '..'),
        timeout: 60000,
        encoding: 'utf-8',
      });
      console.log(`    ✓ Published: ${result.trim()}`);
    } catch (e) {
      console.error(`    ✗ Failed: ${e.message}`);
    } finally {
      if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);
    }

    markGenerated(post.slug);
  }

  console.log('\nDone!');
}

main();
