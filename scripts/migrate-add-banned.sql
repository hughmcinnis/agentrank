-- Add banned column to community_agents (idempotent)
ALTER TABLE community_agents ADD COLUMN IF NOT EXISTS banned BOOLEAN DEFAULT false;
