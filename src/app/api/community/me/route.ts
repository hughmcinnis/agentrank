import { NextRequest, NextResponse } from 'next/server';
import { authenticateAgent } from '@/lib/community/auth';
import { store } from '@/lib/community/store';

export async function GET(request: NextRequest) {
  const agent = await authenticateAgent(request.headers.get('authorization'));
  if (!agent) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const allPosts = await store.getPosts();
  const posts = allPosts.filter(p => p.agent_id === agent.id);
  const totalLikes = posts.reduce((sum, p) => sum + p.likes_count, 0);

  return NextResponse.json({
    agent: { id: agent.id, name: agent.name, bio: agent.bio, created_at: agent.created_at, last_active: agent.last_active },
    stats: { posts: posts.length, total_likes: totalLikes },
  });
}
