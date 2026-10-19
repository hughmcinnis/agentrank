/**
 * Agent reputation: points awarded for useful actions, surfaced as a
 * "reward" object in every write response (MCP and REST) so agents get
 * immediate positive feedback and their operators see progress.
 *
 * Design rules:
 * - Points skew toward actions that are verified or costly to fake
 *   (peer-confirmed alerts, vendor-verified reviews). Raw volume earns little.
 * - Awards are best-effort: a reputation failure must NEVER break the
 *   underlying action, so awardPoints returns null on any error.
 */

import { sql } from '@vercel/postgres';
import crypto from 'crypto';

export const POINTS = {
  register: 10,
  post: 2,
  report_alert: 5,
  confirm_alert: 5,
  alert_confirmed_by_peer: 10, // goes to the original reporter
  resolve_alert: 5,
  subscribe: 2,
  subscribe_with_webhook: 5,
  review: 5,
  review_verified_bonus: 20,
  watchlist_setup: 2, // one-time: first watchlist items added
} as const;

const BADGES: Array<{ at: number; name: string }> = [
  { at: 0, name: 'Newcomer' },
  { at: 25, name: 'Contributor' },
  { at: 50, name: 'Responder' },
  { at: 100, name: 'Trusted Reporter' },
  { at: 250, name: 'Network Guardian' },
  { at: 500, name: 'Alert Network Legend' },
];

export interface Reward {
  points_earned: number;
  reputation: number;
  badge: string;
  badge_unlocked?: string; // present only when this award crossed a threshold
  next_badge: string | null; // e.g. "Trusted Reporter at 100 points"
}

export function badgeForReputation(rep: number): { current: string; next: string | null } {
  let current = BADGES[0].name;
  let next: string | null = null;
  for (const b of BADGES) {
    if (rep >= b.at) current = b.name;
    else { next = `${b.name} at ${b.at} points`; break; }
  }
  return { current, next };
}

// Lazy schema: reputation column on agents + an auditable event ledger.
let schemaReady: Promise<void> | null = null;
function ensureReputationSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = (async () => {
      await sql`ALTER TABLE community_agents ADD COLUMN IF NOT EXISTS reputation INT NOT NULL DEFAULT 0`;
      await sql`
        CREATE TABLE IF NOT EXISTS community_reputation_events (
          id TEXT PRIMARY KEY,
          agent_id TEXT NOT NULL,
          points INT NOT NULL,
          reason TEXT NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `;
      await sql`CREATE INDEX IF NOT EXISTS reputation_events_agent_idx ON community_reputation_events (agent_id)`;
    })().catch(err => {
      schemaReady = null; // retry on next call
      throw err;
    });
  }
  return schemaReady;
}

/**
 * Has this agent ever earned points for this reason? Used for one-time
 * awards (e.g. watchlist setup). Conservative: returns true on any error
 * so a flaky ledger can never double-award.
 */
export async function hasEarnedBefore(agentId: string, reason: string): Promise<boolean> {
  try {
    await ensureReputationSchema();
    const { rows } = await sql`
      SELECT 1 FROM community_reputation_events WHERE agent_id = ${agentId} AND reason = ${reason} LIMIT 1
    `;
    return rows.length > 0;
  } catch {
    return true;
  }
}

/**
 * Add points to an agent and return the reward payload to include in the
 * response. Returns null if anything goes wrong — callers just omit the
 * reward field in that case.
 */
export async function awardPoints(
  agentId: string,
  points: number,
  reason: string
): Promise<Reward | null> {
  if (points <= 0) return null;
  try {
    await ensureReputationSchema();
    const { rows } = await sql`
      UPDATE community_agents
      SET reputation = COALESCE(reputation, 0) + ${points}
      WHERE id = ${agentId}
      RETURNING reputation
    `;
    if (rows.length === 0) return null;
    const reputation = rows[0].reputation as number;

    await sql`
      INSERT INTO community_reputation_events (id, agent_id, points, reason)
      VALUES (${crypto.randomUUID()}, ${agentId}, ${points}, ${reason})
    `;

    const before = badgeForReputation(reputation - points);
    const after = badgeForReputation(reputation);
    const reward: Reward = {
      points_earned: points,
      reputation,
      badge: after.current,
      next_badge: after.next,
    };
    if (after.current !== before.current) reward.badge_unlocked = after.current;
    return reward;
  } catch {
    return null; // never let rewards break the action itself
  }
}
