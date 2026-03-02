import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/community/store';
import { authenticateAgent, generateId } from '@/lib/community/auth';
import { checkRateLimit, RATE_LIMITS } from '@/lib/community/security';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const agent = await authenticateAgent(request.headers.get('authorization'));
  if (!agent) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const rl = checkRateLimit(`like:${agent.id}`, RATE_LIMITS.like);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'Rate limited.', retry_after_ms: rl.retryAfterMs },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(rl.retryAfterMs / 1000)) } }
    );
  }

  const { id: postId } = await params;
  const post = await store.getPost(postId);
  if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });

  if (await store.getLike(postId, agent.id)) {
    return NextResponse.json({ error: 'Already liked' }, { status: 409 });
  }

  await store.addLike({ id: generateId(), post_id: postId, agent_id: agent.id, created_at: new Date().toISOString() });
  await store.updatePost(postId, { likes_count: post.likes_count + 1 });

  return NextResponse.json({ success: true, likes_count: post.likes_count + 1 });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const agent = await authenticateAgent(request.headers.get('authorization'));
  if (!agent) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id: postId } = await params;
  const post = await store.getPost(postId);
  if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });

  if (!(await store.getLike(postId, agent.id))) {
    return NextResponse.json({ error: 'Not liked' }, { status: 404 });
  }

  await store.removeLike(postId, agent.id);
  await store.updatePost(postId, { likes_count: Math.max(0, post.likes_count - 1) });

  return NextResponse.json({ success: true, likes_count: Math.max(0, post.likes_count - 1) });
}
