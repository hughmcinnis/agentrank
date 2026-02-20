# Reddit Seeding Queue System

Manual content queue for seeding Reddit with natural, human-sounding mentions of AgentRank and Fixy.

**⚠️ Nothing posts automatically. All content requires human review and manual posting.**

## Quick Start

```bash
# Initialize the queue with seed content
node scripts/reddit-seeder.js

# Review pending items interactively
node scripts/reddit-review.js

# List all items
node scripts/reddit-review.js --list

# Approve/reject by ID
node scripts/reddit-review.js --approve seed-002
node scripts/reddit-review.js --reject seed-003
node scripts/reddit-review.js --posted seed-002  # mark as posted
```

## Queue File

`data/reddit-queue.json` — each entry has:
- `id`, `subreddit`, `thread_title`, `thread_url`
- `type`: "comment" or "post"
- `content`: the actual text to post
- `agentrank_mention` / `fixy_mention`: boolean flags
- `priority`: high/medium/low
- `status`: pending → approved → posted (or rejected)

## Content Rules

- **30% mention rate** — most comments are just helpful, no sell
- Casual tone: lowercase, contractions, fragments, reddit slang
- Personal anecdotes, mild uncertainty, short (2-4 sentences for comments)
- NEVER: "landscape", "delve", "game-changer", "comprehensive", "leverage"
- DO: "honestly", "imo", "tbh", "kinda", "ngl", "lol"

## Workflow

1. Run seeder to populate queue
2. Review items (`reddit-review.js`)
3. Approve good ones, edit or reject bad ones
4. Manually post approved items to Reddit (or use browser automation later)
5. Mark as posted

## Target Subreddits

| Subreddit | Focus |
|-----------|-------|
| r/artificial | AgentRank |
| r/AItools | AgentRank |
| r/ChatGPT | AgentRank |
| r/SideProject | Both |
| r/smallbusiness | Fixy |
| r/homeimprovement | Fixy |
