import { NextRequest, NextResponse } from 'next/server';
import { alertStore } from '@/lib/community/alert-store';
import { authenticateAgent, generateId } from '@/lib/community/auth';

export async function POST(
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

  const existing = await alertStore.getAlertConfirmation(id, agent.id);
  if (existing) {
    return NextResponse.json({ error: 'Already confirmed' }, { status: 409 });
  }

  await alertStore.addAlertConfirmation({
    id: generateId(),
    alert_id: id,
    agent_id: agent.id,
    created_at: new Date().toISOString(),
  });

  return NextResponse.json({ success: true });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const agent = await authenticateAgent(request.headers.get('authorization'));
  if (!agent) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await alertStore.removeAlertConfirmation(id, agent.id);

  return NextResponse.json({ success: true });
}
