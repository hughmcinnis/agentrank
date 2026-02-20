#!/usr/bin/env node
/**
 * Reddit Queue Review Tool
 * 
 * Interactive CLI to review pending queue items.
 * 
 * Usage:
 *   node reddit-review.js              # Review pending items interactively
 *   node reddit-review.js --list       # List all items with status
 *   node reddit-review.js --approve ID # Approve item by ID
 *   node reddit-review.js --reject ID  # Reject item by ID
 *   node reddit-review.js --posted ID  # Mark item as posted
 *   node reddit-review.js --reset ID   # Reset item to pending
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const QUEUE_PATH = path.join(__dirname, '..', 'data', 'reddit-queue.json');

function loadQueue() {
  try {
    return JSON.parse(fs.readFileSync(QUEUE_PATH, 'utf8'));
  } catch {
    console.error('❌ No queue found. Run reddit-seeder.js first.');
    process.exit(1);
  }
}

function saveQueue(queue) {
  fs.writeFileSync(QUEUE_PATH, JSON.stringify(queue, null, 2));
}

function printItem(item, index) {
  const statusEmoji = {
    pending: '⏳',
    approved: '✅',
    rejected: '❌',
    posted: '📤'
  };
  
  console.log('\n' + '═'.repeat(70));
  console.log(`${statusEmoji[item.status] || '?'} [${item.id}] ${item.status.toUpperCase()} | ${item.type} | ${item.priority} priority`);
  console.log(`📍 ${item.subreddit} → "${item.thread_title}"`);
  if (item.agentrank_mention) console.log('   🏷️  AgentRank mention');
  if (item.fixy_mention) console.log('   🏷️  Fixy mention');
  console.log('─'.repeat(70));
  console.log(item.content);
  console.log('─'.repeat(70));
  if (item.notes) console.log(`💡 ${item.notes}`);
}

function listAll(queue) {
  const grouped = { pending: [], approved: [], rejected: [], posted: [] };
  queue.forEach(item => {
    (grouped[item.status] || grouped.pending).push(item);
  });

  for (const [status, items] of Object.entries(grouped)) {
    if (items.length === 0) continue;
    console.log(`\n${{ pending: '⏳', approved: '✅', rejected: '❌', posted: '📤' }[status]} ${status.toUpperCase()} (${items.length}):`);
    items.forEach(item => {
      const tags = [
        item.agentrank_mention ? 'AR' : null,
        item.fixy_mention ? 'FX' : null
      ].filter(Boolean).join(',');
      console.log(`   ${item.id} | ${item.subreddit} | ${item.type} | ${item.priority} ${tags ? `[${tags}]` : ''}`);
      console.log(`      "${item.thread_title}"`);
    });
  }
}

function updateStatus(queue, id, status) {
  const item = queue.find(i => i.id === id);
  if (!item) {
    console.error(`❌ Item "${id}" not found.`);
    return false;
  }
  item.status = status;
  item.reviewed = new Date().toISOString();
  saveQueue(queue);
  console.log(`${status === 'approved' ? '✅' : status === 'rejected' ? '❌' : '📤'} ${id} → ${status}`);
  return true;
}

async function interactiveReview(queue) {
  const pending = queue.filter(i => i.status === 'pending');
  if (pending.length === 0) {
    console.log('🎉 No pending items to review!');
    return;
  }

  console.log(`\n📋 ${pending.length} items pending review\n`);
  
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const ask = (q) => new Promise(r => rl.question(q, r));

  for (const item of pending) {
    printItem(item);
    
    let answer = '';
    while (!['a', 'r', 's', 'e', 'q'].includes(answer.toLowerCase())) {
      answer = await ask('\n[a]pprove / [r]eject / [s]kip / [e]dit / [q]uit? ');
    }

    switch (answer.toLowerCase()) {
      case 'a':
        item.status = 'approved';
        item.reviewed = new Date().toISOString();
        console.log('✅ Approved');
        break;
      case 'r':
        item.status = 'rejected';
        item.reviewed = new Date().toISOString();
        console.log('❌ Rejected');
        break;
      case 'e':
        console.log('Current content:');
        console.log(item.content);
        const newContent = await ask('\nNew content (or press enter to keep): ');
        if (newContent.trim()) {
          item.content = newContent;
          console.log('📝 Updated');
        }
        // Re-ask for approve/reject
        const verdict = await ask('[a]pprove / [r]eject / [s]kip? ');
        if (verdict === 'a') { item.status = 'approved'; item.reviewed = new Date().toISOString(); }
        if (verdict === 'r') { item.status = 'rejected'; item.reviewed = new Date().toISOString(); }
        break;
      case 's':
        console.log('⏭️  Skipped');
        break;
      case 'q':
        saveQueue(queue);
        console.log('\n💾 Queue saved.');
        rl.close();
        return;
    }
  }

  saveQueue(queue);
  console.log('\n💾 Queue saved. Review complete!');
  rl.close();
}

// Main
const args = process.argv.slice(2);

const queue = loadQueue();

if (args.includes('--list')) {
  listAll(queue);
} else if (args.includes('--approve') && args[args.indexOf('--approve') + 1]) {
  updateStatus(queue, args[args.indexOf('--approve') + 1], 'approved');
} else if (args.includes('--reject') && args[args.indexOf('--reject') + 1]) {
  updateStatus(queue, args[args.indexOf('--reject') + 1], 'rejected');
} else if (args.includes('--posted') && args[args.indexOf('--posted') + 1]) {
  updateStatus(queue, args[args.indexOf('--posted') + 1], 'posted');
} else if (args.includes('--reset') && args[args.indexOf('--reset') + 1]) {
  updateStatus(queue, args[args.indexOf('--reset') + 1], 'pending');
} else {
  interactiveReview(queue);
}
