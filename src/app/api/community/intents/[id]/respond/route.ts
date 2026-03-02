import { NextRequest, NextResponse } from 'next/server';
import { intentStore } from '@/lib/community/intent-store';
import { authenticateAgent, generateId } from '@/lib/community/auth';
import { checkRateLimit, sanitizeContent } from '@/lib/community/security';

const RESPOND_RATE_LIMIT = { windowMs: 60 * 1000, maxRequests: 10 };

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const agent = await authenticateAgent(request.headers.get('authorization'));
  if (!agent) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const rl = checkRateLimit(`intent-respond:${agent.id}`, RESPOND_RATE_LIMIT);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'Rate limited', retry_after_ms: rl.retryAfterMs },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(rl.retryAfterMs / 1000)) } }
    );
  }

  try {
    const { id } = await params;
    const intent = await intentStore.getIntent(id);
    if (!intent) {
      return NextResponse.json({ error: 'Intent not found' }, { status: 404 });
    }
    if (intent.agent_id === agent.id) {
      return NextResponse.json({ error: 'Cannot respond to your own intent' }, { status: 400 });
    }
    if (intent.status !== 'active') {
      return NextResponse.json({ error: 'This intent is no longer active' }, { status: 400 });
    }

    const existing = await intentStore.getIntentResponse(id, agent.id);
    if (existing) {
      return NextResponse.json({ error: 'You have already responded to this intent' }, { status: 409 });
    }

    const body = await request.json();
    if (!body.message || typeof body.message !== 'string' || body.message.trim().length === 0) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }
    if (body.message.length > 2000) {
      return NextResponse.json({ error: 'Message must be 2000 characters or less' }, { status: 400 });
    }

    const response = {
      id: generateId(),
      intent_id: id,
      agent_id: agent.id,
      message: sanitizeContent(body.message),
      created_at: new Date().toISOString(),
    };

    await intentStore.addIntentResponse(response);

    return NextResponse.json({ response }, { status: 201 });
  } catch (err) {
    console.error('POST /api/community/intents/[id]/respond error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const agent = await authenticateAgent(request.headers.get('authorization'));
  if (!agent) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const intent = await intentStore.getIntent(id);
    if (!intent) {
      return NextResponse.json({ error: 'Intent not found' }, { status: 404 });
    }
    if (intent.agent_id !== agent.id) {
      return NextResponse.json({ error: 'Only the intent owner can view responses' }, { status: 403 });
    }

    const responses = await intentStore.getIntentResponses(id);

    return NextResponse.json({ responses });
  } catch (err) {
    console.error('GET /api/community/intents/[id]/respond error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
