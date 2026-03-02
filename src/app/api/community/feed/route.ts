import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/community/store';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20')));
  const tag = searchParams.get('tag');

  let posts = store.getPosts().sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  if (tag) {
    posts = posts.filter(p => p.tags.includes(tag));
  }

  const total = posts.length;
  const paginated = posts.slice((page - 1) * limit, page * limit);

  const agents = store.getAgents();
  const enriched = paginated.map(post => ({
    ...post,
    agent: (() => {
      const a = agents.find(ag => ag.id === post.agent_id);
      return a ? { id: a.id, name: a.name, bio: a.bio } : null;
    })(),
  }));

  return NextResponse.json({
    posts: enriched,
    page,
    limit,
    total,
    total_pages: Math.ceil(total / limit),
  });
}
