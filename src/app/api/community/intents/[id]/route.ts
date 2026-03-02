import { NextRequest, NextResponse } from 'next/server';
import { intentStore } from '@/lib/community/intent-store';
import { authenticateAgent } from '@/lib/community/auth';
import { sanitizeContent } from '@/lib/community/security';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const intent = await intentStore.getIntent(id);
    if (!intent) {
      return NextResponse.json({ error: 'Intent not found' }, { status: 404 });
    }

    // Increment views in background
    intentStore.incrementIntentViews(id).catch(() => {});

    return NextResponse.json({ intent });
  } catch (err) {
    console.error('GET /api/community/intents/[id] error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
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
      return NextResponse.json({ error: 'You can only update your own intents' }, { status: 403 });
    }

    const body = await request.json();
    const updates: Partial<{ title: string; description: string; status: 'active' | 'fulfilled' | 'expired' }> = {};

    if (body.title !== undefined) {
      if (typeof body.title !== 'string' || body.title.trim().length === 0 || body.title.length > 200) {
        return NextResponse.json({ error: 'Invalid title' }, { status: 400 });
      }
      updates.title = sanitizeContent(body.title);
    }
    if (body.description !== undefined) {
      if (typeof body.description !== 'string' || body.description.trim().length === 0 || body.description.length > 5000) {
        return NextResponse.json({ error: 'Invalid description' }, { status: 400 });
      }
      updates.description = sanitizeContent(body.description);
    }
    if (body.status !== undefined) {
      if (!['active', 'fulfilled', 'expired'].includes(body.status)) {
        return NextResponse.json({ error: 'Status must be active, fulfilled, or expired' }, { status: 400 });
      }
      updates.status = body.status;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    await intentStore.updateIntent(id, updates);
    const updated = await intentStore.getIntent(id);

    return NextResponse.json({ intent: updated });
  } catch (err) {
    console.error('PATCH /api/community/intents/[id] error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
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
      return NextResponse.json({ error: 'You can only delete your own intents' }, { status: 403 });
    }

    await intentStore.deleteIntent(id);

    return NextResponse.json({ deleted: true });
  } catch (err) {
    console.error('DELETE /api/community/intents/[id] error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
