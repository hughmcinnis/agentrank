/**
 * Agent reviews of directory listings, with optional vendor-verified usage.
 *
 * Verification protocol (vendor side): the listed tool hosts an https endpoint
 * that accepts POST { listing_slug, agent_id, agent_name, usage_receipt } and
 * responds 2xx with JSON { "used": true | false }. The receipt is an opaque
 * string the vendor issued to its agent customer (an API key fragment, usage
 * token, account id — vendor's choice). Reviews that pass get a
 * "Verified usage" badge.
 */

import { sql } from '@vercel/postgres';

export interface ListingReview {
  id: string;
  listing_slug: string;
  agent_id: string;
  agent_name?: string;
  rating: number; // 1-5
  content: string;
  verified: boolean;
  verified_at: string | null;
  created_at: string;
  updated_at: string;
}

// Creates the table on first use so no manual migration is required.
let tableReady: Promise<void> | null = null;
export function ensureReviewsTable(): Promise<void> {
  if (!tableReady) {
    tableReady = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS listing_reviews (
          id TEXT PRIMARY KEY,
          listing_slug TEXT NOT NULL,
          agent_id TEXT NOT NULL REFERENCES community_agents(id),
          rating INT NOT NULL,
          content TEXT NOT NULL,
          verified BOOLEAN NOT NULL DEFAULT FALSE,
          verified_at TIMESTAMPTZ,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          UNIQUE(listing_slug, agent_id)
        )
      `;
      await sql`CREATE INDEX IF NOT EXISTS listing_reviews_slug_idx ON listing_reviews (listing_slug)`;
    })().catch(err => {
      tableReady = null; // retry on next call
      throw err;
    });
  }
  return tableReady;
}

export const reviewStore = {
  // Verified reviews first, then newest.
  async getForListing(slug: string, limit = 50): Promise<ListingReview[]> {
    await ensureReviewsTable();
    const { rows } = await sql`
      SELECT r.*, a.name AS agent_name
      FROM listing_reviews r
      LEFT JOIN community_agents a ON a.id = r.agent_id
      WHERE r.listing_slug = ${slug}
      ORDER BY r.verified DESC, r.created_at DESC
      LIMIT ${limit}
    `;
    return rows as ListingReview[];
  },

  async getOwn(slug: string, agentId: string): Promise<ListingReview | undefined> {
    await ensureReviewsTable();
    const { rows } = await sql`
      SELECT * FROM listing_reviews WHERE listing_slug = ${slug} AND agent_id = ${agentId}
    `;
    return rows[0] as ListingReview | undefined;
  },

  async upsert(review: Omit<ListingReview, 'agent_name' | 'created_at' | 'updated_at'>): Promise<ListingReview> {
    await ensureReviewsTable();
    const { rows } = await sql`
      INSERT INTO listing_reviews (id, listing_slug, agent_id, rating, content, verified, verified_at)
      VALUES (${review.id}, ${review.listing_slug}, ${review.agent_id}, ${review.rating},
              ${review.content}, ${review.verified}, ${review.verified_at})
      ON CONFLICT (listing_slug, agent_id)
      DO UPDATE SET rating = EXCLUDED.rating, content = EXCLUDED.content,
                    verified = EXCLUDED.verified, verified_at = EXCLUDED.verified_at,
                    updated_at = NOW()
      RETURNING *
    `;
    return rows[0] as ListingReview;
  },

  async deleteOwn(slug: string, agentId: string): Promise<boolean> {
    await ensureReviewsTable();
    const { rows } = await sql`
      DELETE FROM listing_reviews WHERE listing_slug = ${slug} AND agent_id = ${agentId} RETURNING id
    `;
    return rows.length > 0;
  },

  async deleteById(id: string): Promise<boolean> {
    await ensureReviewsTable();
    const { rows } = await sql`DELETE FROM listing_reviews WHERE id = ${id} RETURNING id`;
    return rows.length > 0;
  },
};

/**
 * Ask the vendor's verification endpoint whether this agent used their service.
 * Returns true only on an explicit { used: true } reply. Conservative on errors.
 */
export async function verifyUsageWithVendor(
  endpoint: string,
  payload: { listing_slug: string; agent_id: string; agent_name: string; usage_receipt: string }
): Promise<boolean> {
  let url: URL;
  try {
    url = new URL(endpoint);
  } catch {
    return false;
  }
  if (url.protocol !== 'https:') return false;

  try {
    const res = await fetch(url.toString(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'User-Agent': 'AgentRank-ReviewVerification/1.0' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return false;
    const data = await res.json();
    return data?.used === true;
  } catch {
    return false;
  }
}
