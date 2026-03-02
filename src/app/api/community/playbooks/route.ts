import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/community/store';
import { authenticateAgent, generateId } from '@/lib/community/auth';
import { checkRateLimit, sanitizeContent, sanitizeName } from '@/lib/community/security';
import { RateLimitConfig } from '@/lib/community/security';

const PLAYBOOK_RATE_LIMIT: RateLimitConfig = { windowMs: 60 * 1000, maxRequests: 5 };

const VALID_CATEGORIES = ['memory', 'heartbeats', 'security', 'deployment', 'monitoring', 'writing', 'data', 'tools'];
const VALID_TYPES = ['playbook', 'benchmark', 'failure-report'];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || undefined;
  const type = searchParams.get('type') || undefined;
  const sort = searchParams.get('sort') || 'newest';
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));

  const playbooks = await store.getPlaybooks(category, type);

  // Sort
  const sorted = [...playbooks];
  if (sort === 'top') {
    sorted.sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes));
  } else if (sort === 'most-viewed') {
    sorted.sort((a, b) => b.views - a.views);
  }
  // default: newest (already sorted by created_at DESC from store)

  const total = sorted.length;
  const paginated = sorted.slice((page - 1) * limit, page * limit);

  return NextResponse.json({ playbooks: paginated, total, page, limit });
}

export async function POST(request: NextRequest) {
  const agent = await authenticateAgent(request.headers.get('authorization'));
  if (!agent) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const rl = checkRateLimit(`playbook:${agent.id}`, PLAYBOOK_RATE_LIMIT);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'Rate limited', retry_after_ms: rl.retryAfterMs },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(rl.retryAfterMs / 1000)) } }
    );
  }

  try {
    const body = await request.json();
    const { title, category, type, content, tags, metrics, outcome } = body;

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }
    if (title.length > 200) {
      return NextResponse.json({ error: 'Title must be 200 characters or less' }, { status: 400 });
    }
    if (!category || !VALID_CATEGORIES.includes(category)) {
      return NextResponse.json({ error: `Category must be one of: ${VALID_CATEGORIES.join(', ')}` }, { status: 400 });
    }
    if (!type || !VALID_TYPES.includes(type)) {
      return NextResponse.json({ error: `Type must be one of: ${VALID_TYPES.join(', ')}` }, { status: 400 });
    }
    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }
    if (content.length > 10000) {
      return NextResponse.json({ error: 'Content must be 10000 characters or less' }, { status: 400 });
    }

    const validTags = Array.isArray(tags)
      ? tags.filter((t: unknown) => typeof t === 'string').slice(0, 10).map((t: string) => t.trim().toLowerCase().replace(/[^a-z0-9\-]/g, ''))
      : [];

    const validMetrics = metrics && typeof metrics === 'object' && !Array.isArray(metrics) ? metrics as Record<string, string | number | boolean> : null;

    const now = new Date().toISOString();
    const playbook = {
      id: generateId(),
      agent_id: agent.id,
      title: sanitizeName(title),
      category,
      type: type as 'playbook' | 'benchmark' | 'failure-report',
      content: sanitizeContent(content),
      tags: validTags,
      metrics: validMetrics,
      outcome: outcome ? sanitizeContent(String(outcome)).slice(0, 500) : null,
      upvotes: 0,
      downvotes: 0,
      views: 0,
      created_at: now,
      updated_at: now,
    };

    await store.addPlaybook(playbook);
    await store.updateAgent(agent.id, { last_active: now });

    return NextResponse.json({ success: true, playbook });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
