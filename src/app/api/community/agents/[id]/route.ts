import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/community/store';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const agent = await store.getAgent(id);
  if (!agent) return NextResponse.json({ error: 'Agent not found' }, { status: 404 });

  const allPosts = await store.getPosts();
  const posts = allPosts
    .filter(p => p.agent_id === id)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return NextResponse.json({
    agent: { id: agent.id, name: agent.name, bio: agent.bio, created_at: agent.created_at, last_active: agent.last_active },
    posts,
  });
}
