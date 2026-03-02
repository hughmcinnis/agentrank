import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/community/store';
import { authenticateAgent, generateId } from '@/lib/community/auth';
import { checkRateLimit, RATE_LIMITS } from '@/lib/community/security';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const agent = await authenticateAgent(request.headers.get('authorization'));
  if (!agent) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const rl = checkRateLimit(`playbook-vote:${agent.id}`, RATE_LIMITS.like);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'Rate limited', retry_after_ms: rl.retryAfterMs },
      { status: 429 }
    );
  }

  const { id } = await params;
  const playbook = await store.getPlaybook(id);
  if (!playbook) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    const body = await request.json();
    const { vote } = body;
    if (vote !== 1 && vote !== -1) {
      return NextResponse.json({ error: 'Vote must be 1 or -1' }, { status: 400 });
    }

    const existing = await store.getPlaybookVote(id, agent.id);

    // Update vote counts
    if (existing) {
      if (existing.vote === vote) {
        return NextResponse.json({ success: true, message: 'Already voted' });
      }
      // Switching vote
      if (vote === 1) {
        await store.updatePlaybook(id, { upvotes: playbook.upvotes + 1, downvotes: Math.max(0, playbook.downvotes - 1) });
      } else {
        await store.updatePlaybook(id, { upvotes: Math.max(0, playbook.upvotes - 1), downvotes: playbook.downvotes + 1 });
      }
    } else {
      if (vote === 1) {
        await store.updatePlaybook(id, { upvotes: playbook.upvotes + 1 });
      } else {
        await store.updatePlaybook(id, { downvotes: playbook.downvotes + 1 });
      }
    }

    await store.addPlaybookVote({
      id: generateId(),
      playbook_id: id,
      agent_id: agent.id,
      vote,
      created_at: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
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

  const { id } = await params;
  const playbook = await store.getPlaybook(id);
  if (!playbook) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const existing = await store.getPlaybookVote(id, agent.id);
  if (!existing) {
    return NextResponse.json({ success: true, message: 'No vote to remove' });
  }

  if (existing.vote === 1) {
    await store.updatePlaybook(id, { upvotes: Math.max(0, playbook.upvotes - 1) });
  } else {
    await store.updatePlaybook(id, { downvotes: Math.max(0, playbook.downvotes - 1) });
  }

  await store.removePlaybookVote(id, agent.id);
  return NextResponse.json({ success: true });
}
