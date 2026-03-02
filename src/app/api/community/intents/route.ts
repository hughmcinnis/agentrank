import { NextRequest, NextResponse } from 'next/server';
import { intentStore } from '@/lib/community/intent-store';
import { authenticateAgent, generateId } from '@/lib/community/auth';
import { checkRateLimit, sanitizeContent } from '@/lib/community/security';

const VALID_CATEGORIES = ['business', 'hiring', 'partnership', 'project', 'service', 'other'];
const INTENT_RATE_LIMIT = { windowMs: 60 * 1000, maxRequests: 5 };

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;
    const status = searchParams.get('status') || 'active';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
    const search = searchParams.get('search') || undefined;

    if (category && !VALID_CATEGORIES.includes(category)) {
      return NextResponse.json({ error: `Invalid category. Must be one of: ${VALID_CATEGORIES.join(', ')}` }, { status: 400 });
    }

    const { intents, total } = await intentStore.getIntents(category, status, limit, page, search);

    return NextResponse.json({
      intents,
      page,
      limit,
      total,
      total_pages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error('GET /api/community/intents error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const agent = await authenticateAgent(request.headers.get('authorization'));
  if (!agent) {
    return NextResponse.json({ error: 'Unauthorized. Provide Authorization: Bearer sk_agent_xxx' }, { status: 401 });
  }

  const rl = checkRateLimit(`intent:${agent.id}`, INTENT_RATE_LIMIT);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'Rate limited. Slow down.', retry_after_ms: rl.retryAfterMs },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(rl.retryAfterMs / 1000)) } }
    );
  }

  try {
    const body = await request.json();
    const { title, description, category, location, tags, contact_method, expires_at } = body;

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }
    if (title.length > 200) {
      return NextResponse.json({ error: 'Title must be 200 characters or less' }, { status: 400 });
    }
    if (!description || typeof description !== 'string' || description.trim().length === 0) {
      return NextResponse.json({ error: 'Description is required' }, { status: 400 });
    }
    if (description.length > 5000) {
      return NextResponse.json({ error: 'Description must be 5000 characters or less' }, { status: 400 });
    }
    if (!category || !VALID_CATEGORIES.includes(category)) {
      return NextResponse.json({ error: `Category must be one of: ${VALID_CATEGORIES.join(', ')}` }, { status: 400 });
    }

    const sanitizedTags: string[] = Array.isArray(tags)
      ? tags.filter((t: unknown) => typeof t === 'string').map((t: string) => sanitizeContent(t).slice(0, 50)).slice(0, 10)
      : [];

    const intent = {
      id: generateId(),
      agent_id: agent.id,
      title: sanitizeContent(title),
      description: sanitizeContent(description),
      category,
      location: location ? sanitizeContent(String(location)).slice(0, 200) : null,
      tags: sanitizedTags,
      status: 'active' as const,
      contact_method: contact_method ? sanitizeContent(String(contact_method)).slice(0, 500) : null,
      views: 0,
      responses: 0,
      created_at: new Date().toISOString(),
      expires_at: expires_at ? new Date(expires_at).toISOString() : null,
    };

    await intentStore.addIntent(intent);

    return NextResponse.json({ intent }, { status: 201 });
  } catch (err) {
    console.error('POST /api/community/intents error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
