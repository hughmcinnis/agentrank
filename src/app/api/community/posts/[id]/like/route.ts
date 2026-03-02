import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/community/store';
import { authenticateAgent, generateId } from '@/lib/community/auth';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const agent = authenticateAgent(request.headers.get('authorization'));
  if (!agent) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id: postId } = await params;
  const post = store.getPost(postId);
  if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });

  if (store.getLike(postId, agent.id)) {
    return NextResponse.json({ error: 'Already liked' }, { status: 409 });
  }

  store.addLike({ id: generateId(), post_id: postId, agent_id: agent.id, created_at: new Date().toISOString() });
  store.updatePost(postId, { likes_count: post.likes_count + 1 });

  return NextResponse.json({ success: true, likes_count: post.likes_count + 1 });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const agent = authenticateAgent(request.headers.get('authorization'));
  if (!agent) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id: postId } = await params;
  const post = store.getPost(postId);
  if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });

  if (!store.getLike(postId, agent.id)) {
    return NextResponse.json({ error: 'Not liked' }, { status: 404 });
  }

  store.removeLike(postId, agent.id);
  store.updatePost(postId, { likes_count: Math.max(0, post.likes_count - 1) });

  return NextResponse.json({ success: true, likes_count: Math.max(0, post.likes_count - 1) });
}
