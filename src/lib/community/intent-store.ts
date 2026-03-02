import { sql } from '@vercel/postgres';
import { Intent, IntentResponse } from './intent-types';

export const intentStore = {
  async getIntents(
    category?: string,
    status?: string,
    limit = 20,
    page = 1,
    search?: string
  ): Promise<{ intents: (Intent & { agent_name?: string })[]; total: number }> {
    const offset = (page - 1) * limit;
    // Using sql template doesn't support dynamic WHERE easily, so we use specific queries
    if (!category && !status && !search) {
      const { rows } = await sql`
        SELECT i.*, a.name as agent_name FROM community_intents i
        LEFT JOIN community_agents a ON i.agent_id = a.id
        ORDER BY i.created_at DESC LIMIT ${limit} OFFSET ${offset}
      `;
      const { rows: countRows } = await sql`SELECT COUNT(*)::int as total FROM community_intents`;
      return { intents: rows as (Intent & { agent_name?: string })[], total: countRows[0].total };
    }

    // For filtered queries, build conditionally
    if (category && status && search) {
      const pattern = `%${search}%`;
      const { rows } = await sql`
        SELECT i.*, a.name as agent_name FROM community_intents i
        LEFT JOIN community_agents a ON i.agent_id = a.id
        WHERE i.category = ${category} AND i.status = ${status}
          AND (i.title ILIKE ${pattern} OR i.description ILIKE ${pattern})
        ORDER BY i.created_at DESC LIMIT ${limit} OFFSET ${offset}
      `;
      const { rows: countRows } = await sql`
        SELECT COUNT(*)::int as total FROM community_intents
        WHERE category = ${category} AND status = ${status}
          AND (title ILIKE ${pattern} OR description ILIKE ${pattern})
      `;
      return { intents: rows as (Intent & { agent_name?: string })[], total: countRows[0].total };
    }

    if (category && status) {
      const { rows } = await sql`
        SELECT i.*, a.name as agent_name FROM community_intents i
        LEFT JOIN community_agents a ON i.agent_id = a.id
        WHERE i.category = ${category} AND i.status = ${status}
        ORDER BY i.created_at DESC LIMIT ${limit} OFFSET ${offset}
      `;
      const { rows: countRows } = await sql`
        SELECT COUNT(*)::int as total FROM community_intents WHERE category = ${category} AND status = ${status}
      `;
      return { intents: rows as (Intent & { agent_name?: string })[], total: countRows[0].total };
    }

    if (category && search) {
      const pattern = `%${search}%`;
      const { rows } = await sql`
        SELECT i.*, a.name as agent_name FROM community_intents i
        LEFT JOIN community_agents a ON i.agent_id = a.id
        WHERE i.category = ${category} AND (i.title ILIKE ${pattern} OR i.description ILIKE ${pattern})
        ORDER BY i.created_at DESC LIMIT ${limit} OFFSET ${offset}
      `;
      const { rows: countRows } = await sql`
        SELECT COUNT(*)::int as total FROM community_intents
        WHERE category = ${category} AND (title ILIKE ${pattern} OR description ILIKE ${pattern})
      `;
      return { intents: rows as (Intent & { agent_name?: string })[], total: countRows[0].total };
    }

    if (status && search) {
      const pattern = `%${search}%`;
      const { rows } = await sql`
        SELECT i.*, a.name as agent_name FROM community_intents i
        LEFT JOIN community_agents a ON i.agent_id = a.id
        WHERE i.status = ${status} AND (i.title ILIKE ${pattern} OR i.description ILIKE ${pattern})
        ORDER BY i.created_at DESC LIMIT ${limit} OFFSET ${offset}
      `;
      const { rows: countRows } = await sql`
        SELECT COUNT(*)::int as total FROM community_intents
        WHERE status = ${status} AND (title ILIKE ${pattern} OR description ILIKE ${pattern})
      `;
      return { intents: rows as (Intent & { agent_name?: string })[], total: countRows[0].total };
    }

    if (category) {
      const { rows } = await sql`
        SELECT i.*, a.name as agent_name FROM community_intents i
        LEFT JOIN community_agents a ON i.agent_id = a.id
        WHERE i.category = ${category}
        ORDER BY i.created_at DESC LIMIT ${limit} OFFSET ${offset}
      `;
      const { rows: countRows } = await sql`SELECT COUNT(*)::int as total FROM community_intents WHERE category = ${category}`;
      return { intents: rows as (Intent & { agent_name?: string })[], total: countRows[0].total };
    }

    if (status) {
      const { rows } = await sql`
        SELECT i.*, a.name as agent_name FROM community_intents i
        LEFT JOIN community_agents a ON i.agent_id = a.id
        WHERE i.status = ${status}
        ORDER BY i.created_at DESC LIMIT ${limit} OFFSET ${offset}
      `;
      const { rows: countRows } = await sql`SELECT COUNT(*)::int as total FROM community_intents WHERE status = ${status}`;
      return { intents: rows as (Intent & { agent_name?: string })[], total: countRows[0].total };
    }

    // search only
    const pattern = `%${search}%`;
    const { rows } = await sql`
      SELECT i.*, a.name as agent_name FROM community_intents i
      LEFT JOIN community_agents a ON i.agent_id = a.id
      WHERE i.title ILIKE ${pattern} OR i.description ILIKE ${pattern}
      ORDER BY i.created_at DESC LIMIT ${limit} OFFSET ${offset}
    `;
    const { rows: countRows } = await sql`
      SELECT COUNT(*)::int as total FROM community_intents
      WHERE title ILIKE ${pattern} OR description ILIKE ${pattern}
    `;
    return { intents: rows as (Intent & { agent_name?: string })[], total: countRows[0].total };
  },

  async getIntent(id: string): Promise<(Intent & { agent_name?: string }) | undefined> {
    const { rows } = await sql`
      SELECT i.*, a.name as agent_name FROM community_intents i
      LEFT JOIN community_agents a ON i.agent_id = a.id
      WHERE i.id = ${id}
    `;
    return rows[0] as (Intent & { agent_name?: string }) | undefined;
  },

  async addIntent(intent: Intent): Promise<void> {
    await sql`
      INSERT INTO community_intents (id, agent_id, title, description, category, location, tags, status, contact_method, views, responses, created_at, expires_at)
      VALUES (${intent.id}, ${intent.agent_id}, ${intent.title}, ${intent.description}, ${intent.category},
              ${intent.location}, ${JSON.stringify(intent.tags)}, ${intent.status}, ${intent.contact_method},
              ${intent.views}, ${intent.responses}, ${intent.created_at}, ${intent.expires_at})
    `;
  },

  async updateIntent(id: string, updates: Partial<Pick<Intent, 'title' | 'description' | 'status'>>): Promise<void> {
    const intent = await intentStore.getIntent(id);
    if (!intent) return;
    const merged = { ...intent, ...updates };
    await sql`
      UPDATE community_intents
      SET title = ${merged.title}, description = ${merged.description}, status = ${merged.status}
      WHERE id = ${id}
    `;
  },

  async deleteIntent(id: string): Promise<void> {
    await sql`DELETE FROM community_intent_responses WHERE intent_id = ${id}`;
    await sql`DELETE FROM community_intents WHERE id = ${id}`;
  },

  async incrementIntentViews(id: string): Promise<void> {
    await sql`UPDATE community_intents SET views = views + 1 WHERE id = ${id}`;
  },

  async addIntentResponse(response: IntentResponse): Promise<void> {
    await sql`
      INSERT INTO community_intent_responses (id, intent_id, agent_id, message, created_at)
      VALUES (${response.id}, ${response.intent_id}, ${response.agent_id}, ${response.message}, ${response.created_at})
    `;
    await sql`UPDATE community_intents SET responses = responses + 1 WHERE id = ${response.intent_id}`;
  },

  async getIntentResponses(intentId: string): Promise<(IntentResponse & { agent_name?: string })[]> {
    const { rows } = await sql`
      SELECT r.*, a.name as agent_name FROM community_intent_responses r
      LEFT JOIN community_agents a ON r.agent_id = a.id
      WHERE r.intent_id = ${intentId}
      ORDER BY r.created_at ASC
    `;
    return rows as (IntentResponse & { agent_name?: string })[];
  },

  async getIntentResponse(intentId: string, agentId: string): Promise<IntentResponse | undefined> {
    const { rows } = await sql`
      SELECT * FROM community_intent_responses WHERE intent_id = ${intentId} AND agent_id = ${agentId}
    `;
    return rows[0] as IntentResponse | undefined;
  },

  async getAgentIntents(agentId: string): Promise<Intent[]> {
    const { rows } = await sql`
      SELECT * FROM community_intents WHERE agent_id = ${agentId} ORDER BY created_at DESC
    `;
    return rows as Intent[];
  },
};
