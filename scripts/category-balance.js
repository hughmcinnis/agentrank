#!/usr/bin/env node
/**
 * category-balance.js
 * 
 * Analyzes agent category distribution and recommends which categories
 * to prioritize for new agent discovery. Outputs priority categories
 * that the discovery cron should focus on.
 * 
 * Usage:
 *   node category-balance.js              # print analysis
 *   node category-balance.js --json       # output JSON for other scripts
 */

const fs = require('fs');
const path = require('path');

const AGENTS_FILE = path.resolve(__dirname, '../src/data/agents.ts');
const OUTPUT_PATH = path.resolve(__dirname, '../data/category-priorities.json');

// All valid categories
const ALL_CATEGORIES = [
  'writing', 'coding', 'sales', 'customer-support', 'data-analysis',
  'research', 'marketing', 'productivity', 'email', 'transcription',
  'document-analysis', 'scheduling', 'seo', 'social-media', 'accounting',
  'home-improvement', 'image-generation', 'video-generation', 'voice-audio',
  'automation'
];

// Minimum target per category (aim for balanced directory)
const MIN_TARGET = 5;

function analyze() {
  const content = fs.readFileSync(AGENTS_FILE, 'utf8');
  
  // Get category counts
  const allCats = [...content.matchAll(/categories:\s*\[([^\]]+)\]/g)]
    .flatMap(m => (m[1].match(/"([^"]+)"/g) || []))
    .map(c => c.replace(/"/g, ''));
  
  const counts = {};
  ALL_CATEGORIES.forEach(c => counts[c] = 0);
  allCats.forEach(c => { if (counts[c] !== undefined) counts[c]++; });
  
  // Calculate priority score (lower count = higher priority)
  const maxCount = Math.max(...Object.values(counts));
  const priorities = ALL_CATEGORIES.map(cat => {
    const count = counts[cat];
    const deficit = Math.max(0, MIN_TARGET - count);
    // Priority score: categories with fewer agents get higher priority
    // Heavily weight categories with 0-2 agents
    const score = deficit > 0 
      ? deficit * 20 + (MIN_TARGET - count) * 10 
      : Math.max(0, 10 - count);
    
    return {
      category: cat,
      currentCount: count,
      deficit,
      priorityScore: score,
      status: count === 0 ? 'EMPTY' : count < 3 ? 'LOW' : count < MIN_TARGET ? 'BELOW_TARGET' : 'OK',
    };
  }).sort((a, b) => b.priorityScore - a.priorityScore);

  const output = {
    generatedAt: new Date().toISOString(),
    totalAgents: [...content.matchAll(/slug:\s*"/g)].length,
    totalCategories: ALL_CATEGORIES.length,
    minTarget: MIN_TARGET,
    categoriesBelow: priorities.filter(p => p.currentCount < MIN_TARGET).length,
    priorities,
    topPriority: priorities.slice(0, 5).map(p => p.category),
    distribution: Object.fromEntries(
      Object.entries(counts).sort((a, b) => b[1] - a[1])
    ),
  };

  // Save output
  const dir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2));

  // Print analysis
  if (!process.argv.includes('--json')) {
    console.log('📊 Agent Category Balance Report');
    console.log('='.repeat(50));
    console.log(`Total agents: ${output.totalAgents}`);
    console.log(`Categories below target (${MIN_TARGET}): ${output.categoriesBelow}/${ALL_CATEGORIES.length}`);
    console.log('\n🎯 PRIORITY CATEGORIES (focus discovery here):');
    
    priorities.forEach(p => {
      const bar = '█'.repeat(p.currentCount) + '░'.repeat(Math.max(0, MIN_TARGET - p.currentCount));
      const flag = p.status === 'EMPTY' ? ' ⚠️  EMPTY' : 
                   p.status === 'LOW' ? ' ⚡ LOW' : 
                   p.status === 'BELOW_TARGET' ? ' 📈 BELOW' : ' ✅';
      console.log(`  ${p.currentCount.toString().padStart(2)} ${bar} ${p.category}${flag}`);
    });
    
    console.log(`\n💡 Recommendation: Focus on these categories: ${output.topPriority.join(', ')}`);
  } else {
    console.log(JSON.stringify(output, null, 2));
  }

  return output;
}

analyze();
