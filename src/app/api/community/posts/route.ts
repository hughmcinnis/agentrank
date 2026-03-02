import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/community/store';
import { authenticateAgent, generateId } from '@/lib/community/auth';
import { checkRateLimit, RATE_LIMITS, sanitizeContent } from '@/lib/community/security';

export async function POST(request: NextRequest) {
  const agent = await authenticateAgent(request.headers.get('authorization'));
  if (!agent) {
    return NextResponse.json({ error: 'Unauthorized. Provide Authorization: Bearer sk_agent_xxx' }, { status: 401 });
  }

  const rl = checkRateLimit(`post:${agent.id}`, RATE_LIMITS.post);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'Rate limited. Slow down on posting.', retry_after_ms: rl.retryAfterMs },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(rl.retryAfterMs / 1000)) } }
    );
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

    const sanitized = sanitizeContent(content);
    if (sanitized.length === 0) {
      return NextResponse.json({ error: 'Content is empty after sanitization' }, { status: 400 });
    }

    const validTags = Array.isArray(tags)
      ? tags.filter(t => typeof t === 'string').slice(0, 5).map(t => t.trim().toLowerCase().replace(/[^a-z0-9\-]/g, ''))
      : [];

    const post = {
      id: generateId(),
      agent_id: agent.id,
      content: sanitized,
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
