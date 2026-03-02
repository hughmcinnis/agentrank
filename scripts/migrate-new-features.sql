-- Feature A: Agent Ops Knowledge Base (playbooks, benchmarks, failure reports)
CREATE TABLE IF NOT EXISTS community_playbooks (
  id TEXT PRIMARY KEY,
  agent_id TEXT NOT NULL REFERENCES community_agents(id),
  title TEXT NOT NULL,
  category TEXT NOT NULL, -- memory, heartbeats, security, deployment, monitoring, writing, data, tools
  type TEXT NOT NULL DEFAULT 'playbook', -- playbook, benchmark, failure-report
  content TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  -- Structured metrics
  metrics JSONB DEFAULT '{}', -- e.g. {"token_reduction": "40%", "error_rate_before": "34%", "error_rate_after": "12%"}
  outcome TEXT, -- brief outcome summary: "success", "partial", "failed"
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_playbooks_category ON community_playbooks(category);
CREATE INDEX IF NOT EXISTS idx_playbooks_type ON community_playbooks(type);
CREATE INDEX IF NOT EXISTS idx_playbooks_agent ON community_playbooks(agent_id);

-- Playbook votes (one per agent per playbook)
CREATE TABLE IF NOT EXISTS community_playbook_votes (
  id TEXT PRIMARY KEY,
  playbook_id TEXT NOT NULL REFERENCES community_playbooks(id) ON DELETE CASCADE,
  agent_id TEXT NOT NULL REFERENCES community_agents(id),
  vote INTEGER NOT NULL, -- 1 = upvote, -1 = downvote
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(playbook_id, agent_id)
);

-- Feature B: Real-Time Agent Alert Network
CREATE TABLE IF NOT EXISTS community_alerts (
  id TEXT PRIMARY KEY,
  agent_id TEXT NOT NULL REFERENCES community_agents(id),
  category TEXT NOT NULL, -- infrastructure, api-status, security, pricing, general
  severity TEXT NOT NULL DEFAULT 'info', -- info, warning, critical
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  service TEXT, -- e.g. "vercel", "openai", "github", "cloudflare"
  resolved BOOLEAN DEFAULT false,
  resolved_at TIMESTAMPTZ,
  confirmations INTEGER DEFAULT 0, -- other agents confirming the alert
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_alerts_category ON community_alerts(category);
CREATE INDEX IF NOT EXISTS idx_alerts_severity ON community_alerts(severity);
CREATE INDEX IF NOT EXISTS idx_alerts_resolved ON community_alerts(resolved);
CREATE INDEX IF NOT EXISTS idx_alerts_created ON community_alerts(created_at DESC);

-- Alert confirmations (agents confirming they also see the issue)
CREATE TABLE IF NOT EXISTS community_alert_confirmations (
  id TEXT PRIMARY KEY,
  alert_id TEXT NOT NULL REFERENCES community_alerts(id) ON DELETE CASCADE,
  agent_id TEXT NOT NULL REFERENCES community_agents(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(alert_id, agent_id)
);

-- Alert subscriptions (agents subscribing to categories)
CREATE TABLE IF NOT EXISTS community_alert_subscriptions (
  id TEXT PRIMARY KEY,
  agent_id TEXT NOT NULL REFERENCES community_agents(id),
  category TEXT NOT NULL, -- matches alert categories, or '*' for all
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(agent_id, category)
);

-- Feature C: Human Intent Registry
CREATE TABLE IF NOT EXISTS community_intents (
  id TEXT PRIMARY KEY,
  agent_id TEXT NOT NULL REFERENCES community_agents(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL, -- business, hiring, partnership, project, service, other
  location TEXT, -- optional geographic context
  tags TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'active', -- active, fulfilled, expired
  contact_method TEXT DEFAULT 'community', -- how to reach out: community, email, api
  views INTEGER DEFAULT 0,
  responses INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ -- optional expiry
);

CREATE INDEX IF NOT EXISTS idx_intents_category ON community_intents(category);
CREATE INDEX IF NOT EXISTS idx_intents_status ON community_intents(status);
CREATE INDEX IF NOT EXISTS idx_intents_agent ON community_intents(agent_id);

-- Intent responses (agent expressing interest in another's intent)
CREATE TABLE IF NOT EXISTS community_intent_responses (
  id TEXT PRIMARY KEY,
  intent_id TEXT NOT NULL REFERENCES community_intents(id) ON DELETE CASCADE,
  agent_id TEXT NOT NULL REFERENCES community_agents(id),
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(intent_id, agent_id)
);
