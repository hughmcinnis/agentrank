#!/usr/bin/env node
/**
 * content-intelligence.js
 * 
 * Analyzes Google Search Console data to identify content opportunities
 * and recommend future article topics. Outputs a ranked list of opportunities.
 * 
 * Strategies:
 * 1. "Striking distance" — queries at position 8-25 with decent impressions (almost page 1)
 * 2. "High impression, low CTR" — we show up but nobody clicks (title/content mismatch)
 * 3. "Content gaps" — queries with impressions but no matching blog post
 * 4. "Double down" — topics already getting clicks, write more related content
 * 5. "Agent page → blog post" — agent pages getting impressions could benefit from a review article
 */

const fs = require('fs');
const path = require('path');

const SC_DATA_PATH = '/home/user/dashboard/data/search-console.json';
const BLOG_POSTS_PATH = '/home/user/agentrank/src/data/blog-posts.ts';
const AGENTS_PATH = '/home/user/agentrank/src/data/agents.ts';
const OUTPUT_PATH = '/home/user/agentrank/data/content-opportunities.json';

function loadSearchConsoleData() {
  const data = JSON.parse(fs.readFileSync(SC_DATA_PATH, 'utf8'));
  // Use 3m range for trends, 28d for recent momentum
  return {
    threeMonth: data.ranges?.['3m'] || null,
    oneMonth: data.ranges?.['28d'] || null,
    sevenDay: data.ranges?.['7d'] || null,
  };
}

function loadExistingContent() {
  const blogContent = fs.readFileSync(BLOG_POSTS_PATH, 'utf8');
  const blogSlugs = [...blogContent.matchAll(/slug:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
  const blogTitles = [...blogContent.matchAll(/title:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
  
  let agentSlugs = [];
  try {
    const agentContent = fs.readFileSync(AGENTS_PATH, 'utf8');
    agentSlugs = [...agentContent.matchAll(/slug:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
  } catch (e) {}
  
  return { blogSlugs, blogTitles, agentSlugs };
}

function analyze() {
  const sc = loadSearchConsoleData();
  const content = loadExistingContent();
  
  if (!sc.threeMonth) {
    console.error('No 3-month Search Console data available');
    process.exit(1);
  }

  const opportunities = [];
  const queries3m = sc.threeMonth.topQueries || [];
  const queries28d = sc.oneMonth?.topQueries || [];
  const pages3m = sc.threeMonth.topPages || [];

  // Build lookup for 28d data to detect momentum
  const recentQueryMap = {};
  queries28d.forEach(q => { recentQueryMap[q.query] = q; });

  // Strategy 1: Striking Distance Keywords (position 8-25, 5+ impressions)
  const strikingDistance = queries3m
    .filter(q => q.position >= 8 && q.position <= 25 && q.impressions >= 5)
    .sort((a, b) => b.impressions - a.impressions)
    .map(q => ({
      type: 'striking_distance',
      query: q.query,
      impressions: q.impressions,
      clicks: q.clicks,
      position: q.position,
      ctr: q.ctr,
      recentTrend: recentQueryMap[q.query] ? 'active' : 'declining',
      recommendation: `Optimize or create focused content for "${q.query}" — currently at position ${q.position.toFixed(1)}, could reach page 1`,
      priority: Math.round(q.impressions * (30 - q.position) / 10), // Higher score = better opportunity
    }));

  // Strategy 2: High Impression, Low CTR (position 1-10, CTR < 5%)
  const lowCtr = queries3m
    .filter(q => q.position <= 15 && q.impressions >= 10 && q.ctr < 0.05)
    .sort((a, b) => b.impressions - a.impressions)
    .map(q => ({
      type: 'low_ctr',
      query: q.query,
      impressions: q.impressions,
      clicks: q.clicks,
      position: q.position,
      ctr: q.ctr,
      recommendation: `"${q.query}" gets ${q.impressions} impressions but ${(q.ctr * 100).toFixed(1)}% CTR — improve title/meta description or write a more targeted article`,
      priority: Math.round(q.impressions * (1 - q.ctr) * 10),
    }));

  // Strategy 3: Agent pages with impressions but no blog review
  const agentOpportunities = pages3m
    .filter(p => p.page.includes('/agents/'))
    .filter(p => p.impressions >= 5)
    .map(p => {
      const agentSlug = p.page.split('/agents/')[1]?.replace(/\/$/, '');
      const hasBlogPost = content.blogSlugs.some(slug => slug.includes(agentSlug));
      return { ...p, agentSlug, hasBlogPost };
    })
    .filter(p => !p.hasBlogPost && p.agentSlug)
    .sort((a, b) => b.impressions - a.impressions)
    .map(p => ({
      type: 'agent_needs_review',
      query: p.agentSlug,
      impressions: p.impressions,
      clicks: p.clicks,
      position: p.position,
      recommendation: `Agent "${p.agentSlug}" has ${p.impressions} impressions — write a detailed review blog post to capture this traffic`,
      priority: Math.round(p.impressions * 2),
    }));

  // Strategy 4: Double down on winners (pages with clicks)
  const winners = pages3m
    .filter(p => p.clicks >= 1 && p.page.includes('/blog/'))
    .sort((a, b) => b.clicks - a.clicks)
    .map(p => {
      const slug = p.page.split('/blog/')[1]?.replace(/\/$/, '');
      return {
        type: 'winner_expand',
        query: slug,
        impressions: p.impressions,
        clicks: p.clicks,
        position: p.position,
        recommendation: `"${slug}" is getting clicks — write related/follow-up content to build topical authority`,
        priority: Math.round(p.clicks * 20 + p.impressions / 10),
      };
    });

  // Strategy 5: Content gap — high-impression queries we don't have dedicated content for
  const contentGaps = queries3m
    .filter(q => q.impressions >= 20 && q.clicks === 0)
    .filter(q => {
      const queryTerms = q.query.toLowerCase().split(' ');
      // Check if any blog post or agent covers this query
      const covered = content.blogSlugs.some(slug => 
        queryTerms.some(term => term.length > 3 && slug.includes(term))
      );
      return !covered;
    })
    .sort((a, b) => b.impressions - a.impressions)
    .map(q => ({
      type: 'content_gap',
      query: q.query,
      impressions: q.impressions,
      clicks: q.clicks,
      position: q.position,
      recommendation: `No dedicated content for "${q.query}" (${q.impressions} impressions) — create a targeted article`,
      priority: Math.round(q.impressions * 1.5),
    }));

  // Combine and sort all opportunities
  const allOpportunities = [
    ...strikingDistance,
    ...lowCtr,
    ...agentOpportunities,
    ...winners,
    ...contentGaps,
  ].sort((a, b) => b.priority - a.priority);

  const output = {
    generatedAt: new Date().toISOString(),
    dataRange: '3 months',
    summary: {
      totalOpportunities: allOpportunities.length,
      strikingDistance: strikingDistance.length,
      lowCtr: lowCtr.length,
      agentNeedsReview: agentOpportunities.length,
      winnerExpand: winners.length,
      contentGaps: contentGaps.length,
    },
    topRecommendations: allOpportunities.slice(0, 15),
    allOpportunities,
  };

  // Ensure output dir exists
  const dir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2));
  
  console.log('📊 Content Intelligence Report');
  console.log('='.repeat(50));
  console.log(`Total opportunities: ${allOpportunities.length}`);
  console.log(`  Striking distance: ${strikingDistance.length}`);
  console.log(`  Low CTR (fix titles): ${lowCtr.length}`);
  console.log(`  Agents needing reviews: ${agentOpportunities.length}`);
  console.log(`  Winners to expand: ${winners.length}`);
  console.log(`  Content gaps: ${contentGaps.length}`);
  console.log('\n🏆 TOP 10 RECOMMENDATIONS:');
  allOpportunities.slice(0, 10).forEach((o, i) => {
    console.log(`\n${i + 1}. [${o.type}] Priority: ${o.priority}`);
    console.log(`   ${o.recommendation}`);
    console.log(`   📈 ${o.impressions} imp, ${o.clicks} clicks, pos ${typeof o.position === 'number' ? o.position.toFixed(1) : o.position}`);
  });
  
  console.log(`\n✅ Full report saved to ${OUTPUT_PATH}`);
  
  return output;
}

analyze();
