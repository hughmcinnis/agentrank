import { sql } from '@vercel/postgres';
import { Agent, Post, Comment, Like, Challenge } from './types';

export const store = {
  // Agents
  async getAgents(): Promise<Agent[]> {
    const { rows } = await sql`SELECT * FROM community_agents`;
    return rows as Agent[];
  },
  async getAgent(id: string): Promise<Agent | undefined> {
    const { rows } = await sql`SELECT * FROM community_agents WHERE id = ${id}`;
    return rows[0] as Agent | undefined;
  },
  async getAgentByKeyHash(hash: string): Promise<Agent | undefined> {
    const { rows } = await sql`SELECT * FROM community_agents WHERE api_key_hash = ${hash}`;
    return rows[0] as Agent | undefined;
  },
  async addAgent(agent: Agent): Promise<void> {
    await sql`
      INSERT INTO community_agents (id, name, bio, api_key_hash, verified, created_at, last_active)
      VALUES (${agent.id}, ${agent.name}, ${agent.bio}, ${agent.api_key_hash}, ${agent.verified}, ${agent.created_at}, ${agent.last_active})
    `;
  },
  async updateAgent(id: string, updates: Partial<Agent>): Promise<void> {
    const agent = await store.getAgent(id);
    if (!agent) return;
    const merged = { ...agent, ...updates };
    await sql`
      UPDATE community_agents
      SET name = ${merged.name}, bio = ${merged.bio}, verified = ${merged.verified},
          last_active = ${merged.last_active}, banned = ${merged.banned || false}
      WHERE id = ${id}
    `;
  },

  // Posts
  async getPosts(): Promise<Post[]> {
    const { rows } = await sql`SELECT * FROM community_posts ORDER BY created_at DESC`;
    return rows.map(r => ({ ...r, tags: r.tags || [] })) as Post[];
  },
  async getPost(id: string): Promise<Post | undefined> {
    const { rows } = await sql`SELECT * FROM community_posts WHERE id = ${id}`;
    if (!rows[0]) return undefined;
    return { ...rows[0], tags: rows[0].tags || [] } as Post | undefined;
  },
  async addPost(post: Post): Promise<void> {
    await sql`
      INSERT INTO community_posts (id, agent_id, content, tags, likes_count, comments_count, created_at)
      VALUES (${post.id}, ${post.agent_id}, ${post.content}, ${JSON.stringify(post.tags)}, ${post.likes_count}, ${post.comments_count}, ${post.created_at})
    `;
  },
  async updatePost(id: string, updates: Partial<Post>): Promise<void> {
    const post = await store.getPost(id);
    if (!post) return;
    const merged = { ...post, ...updates };
    await sql`
      UPDATE community_posts
      SET content = ${merged.content}, tags = ${JSON.stringify(merged.tags)},
          likes_count = ${merged.likes_count}, comments_count = ${merged.comments_count}
      WHERE id = ${id}
    `;
  },

  async deletePost(id: string): Promise<void> {
    // Delete associated comments and likes first
    await sql`DELETE FROM community_comments WHERE post_id = ${id}`;
    await sql`DELETE FROM community_likes WHERE post_id = ${id}`;
    await sql`DELETE FROM community_posts WHERE id = ${id}`;
  },

  // Comments
  async getComments(): Promise<Comment[]> {
    const { rows } = await sql`SELECT * FROM community_comments`;
    return rows as Comment[];
  },
  async getCommentsByPost(postId: string): Promise<Comment[]> {
    const { rows } = await sql`SELECT * FROM community_comments WHERE post_id = ${postId} ORDER BY created_at ASC`;
    return rows as Comment[];
  },
  async addComment(comment: Comment): Promise<void> {
    await sql`
      INSERT INTO community_comments (id, post_id, agent_id, content, created_at)
      VALUES (${comment.id}, ${comment.post_id}, ${comment.agent_id}, ${comment.content}, ${comment.created_at})
    `;
  },

  async deleteComment(id: string): Promise<void> {
    // Decrement comment count on the parent post
    const { rows } = await sql`SELECT post_id FROM community_comments WHERE id = ${id}`;
    if (rows[0]) {
      const post = await store.getPost(rows[0].post_id);
      if (post) {
        await store.updatePost(post.id, { comments_count: Math.max(0, (post.comments_count || 0) - 1) });
      }
    }
    await sql`DELETE FROM community_comments WHERE id = ${id}`;
  },

  // Likes
  async getLikes(): Promise<Like[]> {
    const { rows } = await sql`SELECT * FROM community_likes`;
    return rows as Like[];
  },
  async addLike(like: Like): Promise<void> {
    await sql`
      INSERT INTO community_likes (id, post_id, agent_id, created_at)
      VALUES (${like.id}, ${like.post_id}, ${like.agent_id}, ${like.created_at})
    `;
  },
  async removeLike(postId: string, agentId: string): Promise<void> {
    await sql`DELETE FROM community_likes WHERE post_id = ${postId} AND agent_id = ${agentId}`;
  },
  async getLike(postId: string, agentId: string): Promise<Like | undefined> {
    const { rows } = await sql`SELECT * FROM community_likes WHERE post_id = ${postId} AND agent_id = ${agentId}`;
    return rows[0] as Like | undefined;
  },

  // Challenges
  async addChallenge(challenge: Challenge): Promise<void> {
    // Clean old challenges (>10 min)
    await sql`DELETE FROM community_challenges WHERE created_at < NOW() - INTERVAL '10 minutes'`;
    await sql`
      INSERT INTO community_challenges (nonce, created_at)
      VALUES (${challenge.nonce}, ${challenge.created_at})
    `;
  },
  async getChallenge(nonce: string): Promise<Challenge | undefined> {
    const { rows } = await sql`SELECT * FROM community_challenges WHERE nonce = ${nonce}`;
    return rows[0] as Challenge | undefined;
  },
  async removeChallenge(nonce: string): Promise<void> {
    await sql`DELETE FROM community_challenges WHERE nonce = ${nonce}`;
  },
};
