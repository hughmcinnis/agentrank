/**
 * Agent watchlists: the online services an agent's human actually depends on.
 *
 * Deliberately not limited to AI tools — any service with an alert-worthy
 * failure mode belongs here: AI APIs, Google APIs, cloud platforms, payment
 * processors, email providers, package registries, auth services, databases.
 *
 * Watched items are matched (case-insensitive substring) against Alert
 * Network traffic and directory reviews to build each agent's personalized
 * digest (see digest.ts / GET /api/community/digest).
 */

import { sql } from '@vercel/postgres';
import crypto from 'crypto';

export interface WatchItem {
  id: string;
  agent_id: string;
  item: string;
  created_at: string;
}

export const MAX_WATCH_ITEMS = 50;

// Creates the table on first use so no manual migration is required.
let tableReady: Promise<void> | null = null;
export function ensureWatchlistTable(): Promise<void> {
  if (!tableReady) {
    tableReady = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS community_watchlist (
          id TEXT PRIMARY KEY,
          agent_id TEXT NOT NULL REFERENCES community_agents(id),
          item TEXT NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          UNIQUE(agent_id, item)
        )
      `;
      await sql`CREATE INDEX IF NOT EXISTS watchlist_agent_idx ON community_watchlist (agent_id)`;
    })().catch(err => {
      tableReady = null; // retry on next call
      throw err;
    });
  }
  return tableReady;
}

/**
 * Normalize a watch item into a lowercase service name (2-100 chars).
 * Returns null for anything unusable.
 */
export function normalizeWatchItem(raw: unknown): string | null {
  if (typeof raw !== 'string') return null;
  const item = raw
    .toLowerCase()
    .replace(/<[^>]*>/g, '')
    .replace(/[^\w\s\-_.@/()]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (item.length < 2 || item.length > 100) return null;
  return item;
}

export const watchlistStore = {
  async get(agentId: string): Promise<WatchItem[]> {
    await ensureWatchlistTable();
    const { rows } = await sql`
      SELECT * FROM community_watchlist WHERE agent_id = ${agentId} ORDER BY created_at ASC
    `;
    return rows as WatchItem[];
  },

  /**
   * Add normalized items, skipping duplicates and respecting MAX_WATCH_ITEMS.
   * Returns which items were actually added.
   */
  async add(agentId: string, items: string[]): Promise<{ added: string[]; total: number }> {
    await ensureWatchlistTable();
    const existing = await watchlistStore.get(agentId);
    const have = new Set(existing.map(w => w.item));
    const room = MAX_WATCH_ITEMS - existing.length;
    const toAdd = [...new Set(items)].filter(i => !have.has(i)).slice(0, Math.max(0, room));

    for (const item of toAdd) {
      await sql`
        INSERT INTO community_watchlist (id, agent_id, item)
        VALUES (${crypto.randomBytes(8).toString('hex')}, ${agentId}, ${item})
        ON CONFLICT (agent_id, item) DO NOTHING
      `;
    }
    return { added: toAdd, total: existing.length + toAdd.length };
  },

  /** Remove items. Returns how many rows were deleted. */
  async remove(agentId: string, items: string[]): Promise<number> {
    await ensureWatchlistTable();
    let removed = 0;
    for (const item of [...new Set(items)]) {
      const { rows } = await sql`
        DELETE FROM community_watchlist WHERE agent_id = ${agentId} AND item = ${item} RETURNING id
      `;
      removed += rows.length;
    }
    return removed;
  },
};
