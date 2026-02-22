#!/bin/bash
set -e
cd /home/user/agentrank

posts=(
  "Superhuman vs Lavender: Which AI Email Tool is Better?|superhuman-vs-lavender-ai-email-tool-comparison"
  "Top 5 AI Sales Agents Compared (With Pricing)|top-5-ai-sales-agents-compared"
  "5 AI Code Review Tools For Developers that Actually Work|5-ai-code-review-tools-that-actually-work"
  "AI Scheduling Assistants: Complete Guide|ai-scheduling-assistants-complete-guide"
  "OpenAI Operator vs Claude Computer Use: The Definitive 2025 Comparison|openai-operator-vs-claude-computer-use"
  "AI Crypto Agents: Understanding the Reality Behind the Hype in 2025|ai-crypto-agents"
  "What IS an AI Agent, Really?|what-are-ai-agents-really"
  "Why Most AI Agent Directories Are Basically Useless (And What We're Doing Different)|why-most-ai-agent-directories-suck"
  "The Agent Economy Just Got Real: Standards, Payments, and Marketplaces in One Week|agent-economy-standards-payments-marketplaces-2026"
  "Agents Just Got Bank Accounts and Rulebooks in the Same Week|agents-bank-accounts-and-rulebooks-same-week"
  "GitHub Copilot vs Qodo Merge: Honest Comparison for 2026|github-copilot-vs-qodo-merge"
  "Lavender vs Clay: Honest Comparison for 2026|lavender-vs-clay"
  "Claude vs Copy.ai: Honest Comparison for 2026|claude-vs-copy-ai"
  "Copy.ai vs Jasper: Honest Comparison for 2026|copy-ai-vs-jasper"
  "Claude vs Scholarcy: Honest Comparison for 2026|claude-vs-scholarcy"
  "Cursor Review: Is the AI Code Editor Worth \$20/Month?|cursor-review-ai-code-editor-worth-it"
  "Devin Review: Is the AI Software Engineer Worth \$20/Month?|devin-review-ai-software-engineer-worth-it"
  "Perplexity AI Review: The Search Engine That Actually Answers Questions|perplexity-ai-review-search-engine-answers-questions"
  "Bolt.new Review: Can You Actually Build Real Apps With It?|bolt-new-review-can-you-build-real-apps"
  "v0 Review: Vercel's AI App Builder Is Great at One Thing (And Mediocre at Everything Else)|v0-review-vercel-ai-app-builder"
  "Replit Agent Review: Can You Actually Build Real Apps Without Coding?|replit-agent-review-build-apps-without-coding"
  "Warp Terminal Review: Is the AI-Powered Terminal Worth \$18/Month?|warp-terminal-review-ai-powered-terminal"
  "Brave Search Review: The Independent Search Engine That Actually Works|brave-web-discovery-project-breaking-google-monopoly"
)

total=${#posts[@]}
i=0
for entry in "${posts[@]}"; do
  i=$((i+1))
  title="${entry%%|*}"
  slug="${entry##*|}"
  echo "[$i/$total] Generating: $slug"
  node scripts/generate-blog-image-ai.js "$title" "$slug"
  echo "  Done: $slug"
done

echo "All $total images generated!"
