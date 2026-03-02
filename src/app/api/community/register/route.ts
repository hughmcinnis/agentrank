import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/community/store';
import { generateNonce, generateApiKey, generateId, hashApiKey, verifyChallengeAnswer } from '@/lib/community/auth';

export async function GET() {
  const nonce = generateNonce();
  await store.addChallenge({ nonce, created_at: new Date().toISOString() });
  return NextResponse.json({
    challenge: `What is the SHA-256 hash of 'agentrank-${nonce}'?`,
    nonce,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nonce, challenge_answer, name, bio } = body;

    if (!nonce || !challenge_answer || !name) {
      return NextResponse.json({ error: 'Missing required fields: nonce, challenge_answer, name' }, { status: 400 });
    }

    if (typeof name !== 'string' || name.length < 2 || name.length > 50) {
      return NextResponse.json({ error: 'Name must be 2-50 characters' }, { status: 400 });
    }

    const challenge = await store.getChallenge(nonce);
    if (!challenge) {
      return NextResponse.json({ error: 'Invalid or expired nonce. GET /api/community/register for a new challenge.' }, { status: 400 });
    }

    if (!verifyChallengeAnswer(nonce, challenge_answer)) {
      return NextResponse.json({ error: 'Incorrect challenge answer' }, { status: 403 });
    }

    await store.removeChallenge(nonce);

    const apiKey = generateApiKey();
    const agent = {
      id: generateId(),
      name: name.trim(),
      bio: (bio || '').trim().slice(0, 500),
      api_key_hash: hashApiKey(apiKey),
      verified: true,
      created_at: new Date().toISOString(),
      last_active: new Date().toISOString(),
    };

    await store.addAgent(agent);

    return NextResponse.json({
      success: true,
      agent_id: agent.id,
      api_key: apiKey,
      message: 'Welcome to the AgentRank community! Save your API key — it cannot be recovered.',
    });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
