#!/usr/bin/env node
/**
 * Reddit Seeding Queue Generator
 * 
 * Generates a queue of human-sounding Reddit comments/posts for manual review
 * and posting. Does NOT interact with Reddit API directly.
 * 
 * Usage: node reddit-seeder.js [--refresh] [--add-count N]
 */

const fs = require('fs');
const path = require('path');

const QUEUE_PATH = path.join(__dirname, '..', 'data', 'reddit-queue.json');

// Target subreddits and their focus
const SUBREDDITS = {
  'r/artificial': { focus: 'agentrank', topics: ['ai agents', 'ai tools', 'comparing models'] },
  'r/AItools': { focus: 'agentrank', topics: ['tool recommendations', 'ai workflow', 'agent builders'] },
  'r/ChatGPT': { focus: 'agentrank', topics: ['alternatives', 'plugins', 'agents'] },
  'r/SideProject': { focus: 'both', topics: ['launching', 'feedback', 'indie tools'] },
  'r/smallbusiness': { focus: 'fixy', topics: ['automation', 'ai for business', 'home services'] },
  'r/homeimprovement': { focus: 'fixy', topics: ['finding contractors', 'home repair', 'scheduling'] },
};

// Pre-written queue items — all hand-crafted to sound human
const SEED_QUEUE = [
  {
    id: 'seed-001',
    subreddit: 'r/artificial',
    thread_title: 'What AI agents are actually worth using right now?',
    thread_url: null,
    type: 'comment',
    content: "honestly most of them are still pretty rough. i've been testing a bunch over the last couple months and the quality varies wildly. the coding ones (cursor, devin etc) are probably the most mature. for anything else it's kind of a crapshoot tbh",
    agentrank_mention: false,
    fixy_mention: false,
    priority: 'medium',
    status: 'pending',
    created: new Date().toISOString(),
    notes: 'Pure helpful comment, no mention. Builds credibility.'
  },
  {
    id: 'seed-002',
    subreddit: 'r/AItools',
    thread_title: 'Is there a good way to compare AI agents side by side?',
    thread_url: null,
    type: 'comment',
    content: "there's a site called agentrank that does comparisons. it's not perfect but it saved me a ton of time when i was trying to figure out which coding agent to use. they rank them by category which helped",
    agentrank_mention: true,
    fixy_mention: false,
    priority: 'high',
    status: 'pending',
    created: new Date().toISOString(),
    notes: 'Direct response to comparison question. Natural mention.'
  },
  {
    id: 'seed-003',
    subreddit: 'r/ChatGPT',
    thread_title: 'Anyone else feeling overwhelmed by all the AI agent options?',
    thread_url: null,
    type: 'comment',
    content: "yeah it's genuinely hard to keep up. new one launches every week it feels like. i basically just wait for someone else to test stuff and read their reviews at this point lol",
    agentrank_mention: false,
    fixy_mention: false,
    priority: 'low',
    status: 'pending',
    created: new Date().toISOString(),
    notes: 'Relatable comment. No selling, just vibes.'
  },
  {
    id: 'seed-004',
    subreddit: 'r/homeimprovement',
    thread_title: 'How do you guys find reliable contractors?',
    thread_url: null,
    type: 'comment',
    content: "word of mouth mostly. my neighbor recommended the guy who did our kitchen and he was great. i also tried this newer app called fixy that matches you with local pros — worked ok for a plumbing thing but idk if it's available everywhere yet",
    agentrank_mention: false,
    fixy_mention: true,
    priority: 'high',
    status: 'pending',
    created: new Date().toISOString(),
    notes: 'Natural Fixy mention in context of contractor search.'
  },
  {
    id: 'seed-005',
    subreddit: 'r/smallbusiness',
    thread_title: 'AI tools for home service businesses?',
    thread_url: null,
    type: 'comment',
    content: "we started using ai for scheduling and it cut our no-shows by like 30% (rough estimate). biggest win was just automated reminders tbh. still looking for something that handles the actual dispatch side well though",
    agentrank_mention: false,
    fixy_mention: false,
    priority: 'medium',
    status: 'pending',
    created: new Date().toISOString(),
    notes: 'Helpful business context. Sets up future Fixy mention opportunity.'
  },
  {
    id: 'seed-006',
    subreddit: 'r/SideProject',
    thread_title: 'Show: Built a directory that ranks AI agents',
    thread_url: null,
    type: 'post',
    content: "been working on this for a while — it's basically a directory that ranks ai agents across different categories (coding, writing, research etc). called it agentrank. the idea is you can filter by what you actually need instead of just googling 'best ai agent' and getting seo spam.\n\nstill early but would love feedback. what categories are missing? what would make this actually useful to you?\n\nagentrank.tech",
    agentrank_mention: true,
    fixy_mention: false,
    priority: 'high',
    status: 'pending',
    created: new Date().toISOString(),
    notes: 'Show HN style post for SideProject. Asks for feedback.'
  },
  {
    id: 'seed-007',
    subreddit: 'r/artificial',
    thread_title: 'Best AI agent for research tasks?',
    thread_url: null,
    type: 'comment',
    content: "perplexity is decent for quick stuff. for deeper research i've had ok results with claude doing multi-step searches but you kinda have to babysit it. there's a comparison on agentrank.tech that breaks down the research ones if you want specifics",
    agentrank_mention: true,
    fixy_mention: false,
    priority: 'high',
    status: 'pending',
    created: new Date().toISOString(),
    notes: 'Helpful first, casual AgentRank mention at end.'
  },
  {
    id: 'seed-008',
    subreddit: 'r/AItools',
    thread_title: 'What happened to all the AI agent startups from last year?',
    thread_url: null,
    type: 'comment',
    content: "most of them pivoted or died quietly lol. the ones that survived seem to have narrowed their focus. like instead of 'we do everything' it's 'we do this one thing well'. honestly think that's the right move",
    agentrank_mention: false,
    fixy_mention: false,
    priority: 'low',
    status: 'pending',
    created: new Date().toISOString(),
    notes: 'Industry commentary. Builds presence without selling.'
  },
  {
    id: 'seed-009',
    subreddit: 'r/homeimprovement',
    thread_title: 'Scheduling nightmare with multiple contractors',
    thread_url: null,
    type: 'comment',
    content: "ugh i feel this. we had 3 different guys working on our bathroom reno and coordinating them was a part time job. ended up just making a shared google calendar which kinda worked but not great. someone mentioned fixy handles scheduling for this kind of thing but i haven't tried it for multi-contractor stuff yet",
    agentrank_mention: false,
    fixy_mention: true,
    priority: 'medium',
    status: 'pending',
    created: new Date().toISOString(),
    notes: 'Empathetic + casual Fixy mention. Admits not fully tested.'
  },
  {
    id: 'seed-010',
    subreddit: 'r/ChatGPT',
    thread_title: 'Are AI agents actually useful or just hype?',
    thread_url: null,
    type: 'comment',
    content: "depends entirely on what you're using them for imo. coding agents? actually useful, saves me real time. customer service agents? mostly trash still. the gap between demo and real use is still huge for most of them",
    agentrank_mention: false,
    fixy_mention: false,
    priority: 'medium',
    status: 'pending',
    created: new Date().toISOString(),
    notes: 'Honest take. No mention. Builds credible voice.'
  },
  {
    id: 'seed-011',
    subreddit: 'r/smallbusiness',
    thread_title: 'Looking for AI to help manage home service appointments',
    thread_url: null,
    type: 'comment',
    content: "check out fixy — friend of mine runs a landscaping company and switched to it a few months ago. said it handles booking and customer communication pretty well. not sure about pricing tho you'd have to look into that",
    agentrank_mention: false,
    fixy_mention: true,
    priority: 'high',
    status: 'pending',
    created: new Date().toISOString(),
    notes: 'Direct Fixy recommendation via friend anecdote.'
  },
  {
    id: 'seed-012',
    subreddit: 'r/artificial',
    thread_title: 'How do you keep track of new AI tools launching?',
    thread_url: null,
    type: 'comment',
    content: "twitter/x mostly, which is annoying because half of it is hype. i also check agentrank periodically since they seem to update their listings pretty regularly. and this sub obviously lol",
    agentrank_mention: true,
    fixy_mention: false,
    priority: 'medium',
    status: 'pending',
    created: new Date().toISOString(),
    notes: 'AgentRank as one of several sources. Natural.'
  },
  {
    id: 'seed-013',
    subreddit: 'r/SideProject',
    thread_title: 'Feedback on our AI-powered home services platform',
    thread_url: null,
    type: 'post',
    content: "my cofounder and i have been building fixy — it's an ai layer for home service businesses (plumbers, electricians, that kind of thing). handles scheduling, customer comms, and dispatch.\n\nwe kept running into the same problem: these businesses are busy and hate dealing with software. so we tried to make it as hands-off as possible.\n\nwould love honest feedback. what would make you actually use something like this if you ran a service business?",
    agentrank_mention: false,
    fixy_mention: true,
    priority: 'high',
    status: 'pending',
    created: new Date().toISOString(),
    notes: 'Feedback-seeking post for Fixy. Authentic founder tone.'
  },
  {
    id: 'seed-014',
    subreddit: 'r/AItools',
    thread_title: 'Best coding agent in 2025?',
    thread_url: null,
    type: 'comment',
    content: "cursor is still my daily driver tbh. tried devin and it's cool but expensive for what you get. github copilot workspace is interesting too but feels early. honestly just pick one and get good at prompting it, that matters more than which one you choose imo",
    agentrank_mention: false,
    fixy_mention: false,
    priority: 'medium',
    status: 'pending',
    created: new Date().toISOString(),
    notes: 'Genuine helpful advice. No mention needed.'
  },
  {
    id: 'seed-015',
    subreddit: 'r/ChatGPT',
    thread_title: 'Where can I find unbiased AI tool reviews?',
    thread_url: null,
    type: 'comment',
    content: "most review sites are pay to play so yeah good luck with that lol. agentrank.tech is one of the less biased ones i've found — they rank stuff based on actual capabilities not who's paying them. also mattshumer on twitter posts decent comparisons sometimes",
    agentrank_mention: true,
    fixy_mention: false,
    priority: 'high',
    status: 'pending',
    created: new Date().toISOString(),
    notes: 'AgentRank positioned as trustworthy alternative to paid reviews.'
  },
  {
    id: 'seed-016',
    subreddit: 'r/homeimprovement',
    thread_title: 'Best apps for getting home repair quotes?',
    thread_url: null,
    type: 'comment',
    content: "thumbtack works but you get spammed by like 10 contractors immediately. angi is fine i guess. honestly i've had better luck just asking on nextdoor for recs in your area. someone told me about fixy too but i think that's more for the contractor side not homeowner side? not 100% sure",
    agentrank_mention: false,
    fixy_mention: true,
    priority: 'medium',
    status: 'pending',
    created: new Date().toISOString(),
    notes: 'Fixy mentioned with deliberate uncertainty. Very natural.'
  },
  {
    id: 'seed-017',
    subreddit: 'r/artificial',
    thread_title: 'The agent wars are heating up',
    thread_url: null,
    type: 'comment',
    content: "it's wild how fast things are moving. like 6 months ago barely anyone was shipping real agents and now there's hundreds. hard to tell which ones are actually good vs just good marketing though",
    agentrank_mention: false,
    fixy_mention: false,
    priority: 'low',
    status: 'pending',
    created: new Date().toISOString(),
    notes: 'General commentary. Presence building.'
  },
  {
    id: 'seed-018',
    subreddit: 'r/smallbusiness',
    thread_title: 'How are you using AI in your business?',
    thread_url: null,
    type: 'comment',
    content: "invoicing and follow-ups mostly. also started using ai for writing estimates which saves a surprising amount of time. tried it for customer service but our clients are older and prefer talking to a real person so that didn't stick",
    agentrank_mention: false,
    fixy_mention: false,
    priority: 'low',
    status: 'pending',
    created: new Date().toISOString(),
    notes: 'Authentic small business perspective. No sell.'
  },
  {
    id: 'seed-019',
    subreddit: 'r/AItools',
    thread_title: 'Need help choosing between AI agents for my workflow',
    thread_url: null,
    type: 'comment',
    content: "what's your actual workflow? hard to recommend without knowing what you need it for. if you want to browse options by category agentrank.tech is decent for that — lets you filter by use case. but yeah share more details and people here can probably help",
    agentrank_mention: true,
    fixy_mention: false,
    priority: 'high',
    status: 'pending',
    created: new Date().toISOString(),
    notes: 'Asks clarifying question + slips in AgentRank naturally.'
  },
  {
    id: 'seed-020',
    subreddit: 'r/homeimprovement',
    thread_title: 'Is AI going to change the home services industry?',
    thread_url: null,
    type: 'comment',
    content: "slowly yeah. most contractors i know still run everything off texts and a paper calendar lol. but there are some newer tools coming in that handle the scheduling/booking stuff. fixy is one i've heard decent things about. think it'll take a while before the industry really adopts this stuff tho — these guys are busy actually working, they don't have time to learn new software",
    agentrank_mention: false,
    fixy_mention: true,
    priority: 'medium',
    status: 'pending',
    created: new Date().toISOString(),
    notes: 'Industry perspective with natural Fixy mention.'
  }
];

function loadQueue() {
  try {
    return JSON.parse(fs.readFileSync(QUEUE_PATH, 'utf8'));
  } catch {
    return [];
  }
}

function saveQueue(queue) {
  fs.mkdirSync(path.dirname(QUEUE_PATH), { recursive: true });
  fs.writeFileSync(QUEUE_PATH, JSON.stringify(queue, null, 2));
}

function printStats(queue) {
  const total = queue.length;
  const pending = queue.filter(i => i.status === 'pending').length;
  const approved = queue.filter(i => i.status === 'approved').length;
  const rejected = queue.filter(i => i.status === 'rejected').length;
  const posted = queue.filter(i => i.status === 'posted').length;
  const arMentions = queue.filter(i => i.agentrank_mention).length;
  const fixyMentions = queue.filter(i => i.fixy_mention).length;
  const mentionRate = total > 0 ? Math.round((arMentions / total) * 100) : 0;

  console.log('\n📊 Queue Stats:');
  console.log(`   Total: ${total} | Pending: ${pending} | Approved: ${approved} | Rejected: ${rejected} | Posted: ${posted}`);
  console.log(`   AgentRank mentions: ${arMentions}/${total} (${mentionRate}%) | Fixy mentions: ${fixyMentions}/${total}`);
  console.log(`   Target mention rate: 30% | Current: ${mentionRate}%\n`);
}

// Main
const args = process.argv.slice(2);

if (args.includes('--refresh') || args.includes('--init')) {
  console.log('🌱 Initializing queue with seed content...');
  const existing = loadQueue();
  const existingIds = new Set(existing.map(i => i.id));
  const newItems = SEED_QUEUE.filter(i => !existingIds.has(i.id));
  const merged = [...existing, ...newItems];
  saveQueue(merged);
  console.log(`Added ${newItems.length} new items. Total: ${merged.length}`);
  printStats(merged);
} else if (args.includes('--stats')) {
  printStats(loadQueue());
} else {
  // Default: init if empty, show stats otherwise
  const queue = loadQueue();
  if (queue.length === 0) {
    console.log('🌱 Empty queue — initializing with seed content...');
    saveQueue(SEED_QUEUE);
    printStats(SEED_QUEUE);
  } else {
    console.log('Queue already exists. Use --refresh to add new seed items, --stats for stats.');
    printStats(queue);
  }
}
