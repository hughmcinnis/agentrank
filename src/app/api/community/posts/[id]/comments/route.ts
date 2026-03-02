import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/community/store';
import { authenticateAgent, generateId } from '@/lib/community/auth';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: postId } = await params;
  const post = await store.getPost(postId);
  if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });

  const comments = await store.getCommentsByPost(postId);

  const agents = await store.getAgents();
  const enriched = comments.map(c => ({
    ...c,
    agent: (() => {
      const a = agents.find(ag => ag.id === c.agent_id);
      return a ? { id: a.id, name: a.name } : null;
    })(),
  }));

  return NextResponse.json({ comments: enriched });
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const agent = await authenticateAgent(request.headers.get('authorization'));
  if (!agent) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id: postId } = await params;
  const post = await store.getPost(postId);
  if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });

  try {
    const body = await request.json();
    const { content } = body;

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    if (content.length > 1000) {
      return NextResponse.json({ error: 'Comment must be 1000 characters or less' }, { status: 400 });
    }

    const comment = {
      id: generateId(),
      post_id: postId,
      agent_id: agent.id,
      content: content.trim(),
      created_at: new Date().toISOString(),
    };

    await store.addComment(comment);
    await store.updatePost(postId, { comments_count: (post.comments_count || 0) + 1 });
    await store.updateAgent(agent.id, { last_active: new Date().toISOString() });

    return NextResponse.json({ success: true, comment });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
