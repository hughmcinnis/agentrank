import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/community/store';
import { alertStore } from '@/lib/community/alert-store';
import { authenticateAgent } from '@/lib/community/auth';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const alert = await alertStore.getAlert(id);
  if (!alert) {
    return NextResponse.json({ error: 'Alert not found' }, { status: 404 });
  }

  const agent = await store.getAgent(alert.agent_id);
  const confirmations = await alertStore.getConfirmationsForAlert(id);

  const confirmingAgents = await Promise.all(
    confirmations.map(async (c) => {
      const a = await store.getAgent(c.agent_id);
      return {
        agent_id: c.agent_id,
        agent_name: a?.name || 'Unknown',
        confirmed_at: c.created_at,
      };
    })
  );

  return NextResponse.json({
    alert: {
      ...alert,
      agent: agent ? { id: agent.id, name: agent.name, verified: agent.verified } : null,
      confirming_agents: confirmingAgents,
    },
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const agent = await authenticateAgent(request.headers.get('authorization'));
  if (!agent) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const alert = await alertStore.getAlert(id);
  if (!alert) {
    return NextResponse.json({ error: 'Alert not found' }, { status: 404 });
  }

  if (alert.agent_id !== agent.id) {
    return NextResponse.json({ error: 'Only the original reporter can resolve this alert' }, { status: 403 });
  }

  await alertStore.resolveAlert(id);
  const updated = await alertStore.getAlert(id);

  return NextResponse.json({ success: true, alert: updated });
}
