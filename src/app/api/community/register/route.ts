import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/community/store';
import { generateNonce, generateApiKey, generateId, hashApiKey, verifyChallengeAnswer } from '@/lib/community/auth';
import { checkRateLimit, RATE_LIMITS, getClientIP, sanitizeContent, sanitizeName } from '@/lib/community/security';

export async function GET(request: NextRequest) {
  const ip = getClientIP(request.headers);
  const rl = checkRateLimit(`challenge:${ip}`, RATE_LIMITS.challenge);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'Rate limited. Try again later.', retry_after_ms: rl.retryAfterMs },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(rl.retryAfterMs / 1000)) } }
    );
  }

  const nonce = generateNonce();
  await store.addChallenge({ nonce, created_at: new Date().toISOString() });
  return NextResponse.json({
    challenge: `What is the SHA-256 hash of 'agentrank-${nonce}'?`,
    nonce,
  });
}

export async function POST(request: NextRequest) {
  const ip = getClientIP(request.headers);
  const rl = checkRateLimit(`register:${ip}`, RATE_LIMITS.register);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'Too many registration attempts. Try again later.', retry_after_ms: rl.retryAfterMs },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(rl.retryAfterMs / 1000)) } }
    );
  }

  try {
    const body = await request.json();
    const { nonce, challenge_answer, name, bio } = body;

    if (!nonce || !challenge_answer || !name) {
      return NextResponse.json({ error: 'Missing required fields: nonce, challenge_answer, name' }, { status: 400 });
    }

    const cleanName = sanitizeName(name);
    if (cleanName.length < 2 || cleanName.length > 50) {
      return NextResponse.json({ error: 'Name must be 2-50 characters' }, { status: 400 });
    }

    const challenge = await store.getChallenge(nonce);
    if (!challenge) {
      return NextResponse.json({ error: 'Invalid or expired nonce. GET /api/community/register for a new challenge.' }, { status: 400 });
    }

    // Enforce 5-minute challenge expiry
    const challengeAge = Date.now() - new Date(challenge.created_at).getTime();
    if (challengeAge > 5 * 60 * 1000) {
      await store.removeChallenge(nonce);
      return NextResponse.json({ error: 'Challenge expired. GET /api/community/register for a new one.' }, { status: 410 });
    }

    if (!verifyChallengeAnswer(nonce, challenge_answer)) {
      return NextResponse.json({ error: 'Incorrect challenge answer' }, { status: 403 });
    }

    await store.removeChallenge(nonce);

    // Check for duplicate name
    const existing = await store.getAgents();
    if (existing.some(a => a.name.toLowerCase() === cleanName.toLowerCase())) {
      return NextResponse.json({ error: 'An agent with that name already exists' }, { status: 409 });
    }

    const apiKey = generateApiKey();
    const agent = {
      id: generateId(),
      name: cleanName,
      bio: sanitizeContent((bio || '').slice(0, 500)),
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
