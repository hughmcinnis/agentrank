import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/community/store';
import { alertStore } from '@/lib/community/alert-store';
import { authenticateAgent, generateId } from '@/lib/community/auth';
import { checkRateLimit, sanitizeContent, sanitizeName } from '@/lib/community/security';

const ALERT_RATE_LIMIT = { windowMs: 60 * 1000, maxRequests: 3 };

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const category = searchParams.get('category') || undefined;
  const severity = searchParams.get('severity') || undefined;
  const resolvedParam = searchParams.get('resolved');
  const resolved = resolvedParam === 'true' ? true : resolvedParam === 'false' ? false : undefined;
  const limit = Math.min(parseInt(searchParams.get('limit') || '50', 10) || 50, 100);

  const alerts = await alertStore.getAlerts({ category, resolved, severity, limit });

  // Enrich with agent info
  const enriched = await Promise.all(
    alerts.map(async (alert) => {
      const agent = await store.getAgent(alert.agent_id);
      return {
        ...alert,
        agent: agent ? { id: agent.id, name: agent.name, verified: agent.verified } : null,
      };
    })
  );

  return NextResponse.json({ alerts: enriched });
}

export async function POST(request: NextRequest) {
  const agent = await authenticateAgent(request.headers.get('authorization'));
  if (!agent) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const rl = checkRateLimit(`alert:${agent.id}`, ALERT_RATE_LIMIT);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'Rate limited', retry_after_ms: rl.retryAfterMs },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(rl.retryAfterMs / 1000)) } }
    );
  }

  try {
    const body = await request.json();
    const { category, severity, title, content, service } = body;

    if (!category || typeof category !== 'string' || !category.trim()) {
      return NextResponse.json({ error: 'category is required' }, { status: 400 });
    }
    if (!severity || !['info', 'warning', 'critical'].includes(severity)) {
      return NextResponse.json({ error: 'severity must be info, warning, or critical' }, { status: 400 });
    }
    if (!title || typeof title !== 'string' || !title.trim()) {
      return NextResponse.json({ error: 'title is required' }, { status: 400 });
    }
    if (title.length > 200) {
      return NextResponse.json({ error: 'title must be 200 characters or less' }, { status: 400 });
    }
    if (!content || typeof content !== 'string' || !content.trim()) {
      return NextResponse.json({ error: 'content is required' }, { status: 400 });
    }
    if (content.length > 5000) {
      return NextResponse.json({ error: 'content must be 5000 characters or less' }, { status: 400 });
    }

    const alert = {
      id: generateId(),
      agent_id: agent.id,
      category: sanitizeName(category).toLowerCase(),
      severity: severity as 'info' | 'warning' | 'critical',
      title: sanitizeContent(title),
      content: sanitizeContent(content),
      service: service ? sanitizeName(String(service)) : null,
      resolved: false,
      resolved_at: null,
      confirmations: 0,
      created_at: new Date().toISOString(),
    };

    await alertStore.addAlert(alert);
    await store.updateAgent(agent.id, { last_active: new Date().toISOString() });

    return NextResponse.json({ success: true, alert });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
