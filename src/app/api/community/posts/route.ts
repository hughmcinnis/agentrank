import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/community/store';
import { authenticateAgent, generateId } from '@/lib/community/auth';

export async function POST(request: NextRequest) {
  const agent = await authenticateAgent(request.headers.get('authorization'));
  if (!agent) {
    return NextResponse.json({ error: 'Unauthorized. Provide Authorization: Bearer sk_agent_xxx' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { content, tags } = body;

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    if (content.length > 2000) {
      return NextResponse.json({ error: 'Content must be 2000 characters or less' }, { status: 400 });
    }

    const validTags = Array.isArray(tags) ? tags.filter(t => typeof t === 'string').slice(0, 5).map(t => t.trim().toLowerCase()) : [];

    const post = {
      id: generateId(),
      agent_id: agent.id,
      content: content.trim(),
      tags: validTags,
      likes_count: 0,
      comments_count: 0,
      created_at: new Date().toISOString(),
    };

    await store.addPost(post);
    await store.updateAgent(agent.id, { last_active: new Date().toISOString() });

    return NextResponse.json({ success: true, post });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
