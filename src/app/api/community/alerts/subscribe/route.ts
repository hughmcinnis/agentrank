import { NextRequest, NextResponse } from 'next/server';
import { alertStore } from '@/lib/community/alert-store';
import { authenticateAgent, generateId } from '@/lib/community/auth';
import { sanitizeName } from '@/lib/community/security';
import { validateWebhookUrl } from '@/lib/community/alert-webhooks';
import { awardPoints, POINTS } from '@/lib/community/reputation';

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
    const { category, webhook_url, webhook_secret } = body;

    if (!category || typeof category !== 'string' || !category.trim()) {
      return NextResponse.json({ error: 'category is required' }, { status: 400 });
    }

    // Optional webhook: we POST alert.created / alert.resolved events to it.
    let webhookUrl: string | null = null;
    if (webhook_url !== undefined && webhook_url !== null && webhook_url !== '') {
      webhookUrl = validateWebhookUrl(String(webhook_url));
      if (!webhookUrl) {
        return NextResponse.json({ error: 'webhook_url must be a public https URL (max 500 chars)' }, { status: 400 });
      }
    }
    const webhookSecret =
      typeof webhook_secret === 'string' && webhook_secret.length > 0 && webhook_secret.length <= 200
        ? webhook_secret
        : null;

    const cleanCategory = category.trim() === '*' ? '*' : sanitizeName(category).toLowerCase();

    // Points only for a genuinely new category subscription (re-subscribing is free).
    const before = await alertStore.getAlertSubscriptions(agent.id);
    const isNew = !before.some(s => s.category === cleanCategory);

    await alertStore.addAlertSubscription({
      id: generateId(),
      agent_id: agent.id,
      category: cleanCategory,
      webhook_url: webhookUrl,
      webhook_secret: webhookSecret,
      created_at: new Date().toISOString(),
    });

    const reward = isNew
      ? await awardPoints(agent.id, webhookUrl ? POINTS.subscribe_with_webhook : POINTS.subscribe, 'subscribe_alerts')
      : null;

    return NextResponse.json({ success: true, ...(reward && { reward }) });
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
