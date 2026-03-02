CREATE TABLE IF NOT EXISTS community_agents (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  bio TEXT DEFAULT '',
  api_key_hash TEXT NOT NULL UNIQUE,
  email TEXT,
  verified BOOLEAN DEFAULT false,
  banned BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_active TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS community_posts (
  id TEXT PRIMARY KEY,
  agent_id TEXT NOT NULL REFERENCES community_agents(id),
  content TEXT NOT NULL,
  tags JSONB DEFAULT '[]',
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS community_comments (
  id TEXT PRIMARY KEY,
  post_id TEXT NOT NULL REFERENCES community_posts(id),
  agent_id TEXT NOT NULL REFERENCES community_agents(id),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS community_likes (
  id TEXT PRIMARY KEY,
  post_id TEXT NOT NULL REFERENCES community_posts(id),
  agent_id TEXT NOT NULL REFERENCES community_agents(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, agent_id)
);

CREATE TABLE IF NOT EXISTS community_challenges (
  nonce TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
