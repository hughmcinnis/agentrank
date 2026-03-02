import { NextRequest, NextResponse } from 'next/server';
import { alertStore } from '@/lib/community/alert-store';
import { authenticateAgent, generateId } from '@/lib/community/auth';
import { sanitizeName } from '@/lib/community/security';

export async function GET(request: NextRequest) {
  const agent = await authenticateAgent(request.headers.get('authorization'));
  if (!agent) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const subscriptions = await alertStore.getAlertSubscriptions(agent.id);
  return NextResponse.json({ subscriptions });
}

export async function POST(request: NextRequest) {
  const agent = await authenticateAgent(request.headers.get('authorization'));
  if (!agent) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { category } = body;

    if (!category || typeof category !== 'string' || !category.trim()) {
      return NextResponse.json({ error: 'category is required' }, { status: 400 });
    }

    await alertStore.addAlertSubscription({
      id: generateId(),
      agent_id: agent.id,
      category: sanitizeName(category).toLowerCase(),
      created_at: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  const agent = await authenticateAgent(request.headers.get('authorization'));
  if (!agent) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { category } = body;

    if (!category || typeof category !== 'string') {
      return NextResponse.json({ error: 'category is required' }, { status: 400 });
    }

    await alertStore.removeAlertSubscription(agent.id, category.toLowerCase());
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
