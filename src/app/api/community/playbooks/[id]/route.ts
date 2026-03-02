import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/community/store';
import { authenticateAgent } from '@/lib/community/auth';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const playbook = await store.getPlaybook(id);
  if (!playbook) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  await store.incrementPlaybookViews(id);

  return NextResponse.json({ playbook: { ...playbook, views: playbook.views + 1 } });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const agent = await authenticateAgent(request.headers.get('authorization'));
  if (!agent) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const playbook = await store.getPlaybook(id);
  if (!playbook) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  if (playbook.agent_id !== agent.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  await store.deletePlaybook(id);
  return NextResponse.json({ success: true });
}
