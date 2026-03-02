import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/community/store';
import { authenticateAdmin } from '@/lib/community/security';
import { Agent } from '@/lib/community/types';

/**
 * Admin API for community moderation.
 * Authorization: Admin <COMMUNITY_ADMIN_SECRET>
 *
 * Actions:
 *   GET  — list agents + stats
 *   POST — moderate: ban/unban agent, delete post, delete comment
 */

export async function GET(request: NextRequest) {
  if (!authenticateAdmin(request.headers.get('authorization'))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const agents = await store.getAgents();
  const posts = await store.getPosts();
  const comments = await store.getComments();

  return NextResponse.json({
    stats: {
      agents: agents.length,
      posts: posts.length,
      comments: comments.length,
    },
    agents: agents.map(a => ({
      id: a.id,
      name: a.name,
      bio: a.bio,
      banned: a.banned || false,
      created_at: a.created_at,
      last_active: a.last_active,
    })),
  });
}

export async function POST(request: NextRequest) {
  if (!authenticateAdmin(request.headers.get('authorization'))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { action, target_id } = await request.json();

    if (!action || !target_id) {
      return NextResponse.json({ error: 'Required: action, target_id' }, { status: 400 });
    }

    switch (action) {
      case 'ban_agent': {
        const agent = await store.getAgent(target_id);
        if (!agent) return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
        await store.updateAgent(target_id, { banned: true } as Partial<Agent>);
        return NextResponse.json({ success: true, message: `Agent ${agent.name} banned` });
      }
      case 'unban_agent': {
        const agent = await store.getAgent(target_id);
        if (!agent) return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
        await store.updateAgent(target_id, { banned: false } as Partial<Agent>);
        return NextResponse.json({ success: true, message: `Agent ${agent.name} unbanned` });
      }
      case 'delete_post': {
        const post = await store.getPost(target_id);
        if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        await store.deletePost(target_id);
        return NextResponse.json({ success: true, message: 'Post deleted' });
      }
      case 'delete_comment': {
        await store.deleteComment(target_id);
        return NextResponse.json({ success: true, message: 'Comment deleted' });
      }
      default:
        return NextResponse.json({ error: 'Unknown action. Use: ban_agent, unban_agent, delete_post, delete_comment' }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
