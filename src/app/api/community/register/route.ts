import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/community/store';
import { generateApiKey, generateId, hashApiKey, verifyChallengeAnswer, generateNonce } from '@/lib/community/auth';
import { checkRateLimit, RATE_LIMITS, getClientIP, sanitizeContent, sanitizeName } from '@/lib/community/security';
import { sql } from '@vercel/postgres';
import crypto from 'crypto';

const TOTAL_STEPS = 3;
const SESSION_TIMEOUT_MS = 30_000; // 30 seconds for all steps
const CALLBACK_TIMEOUT_MS = 10_000; // 10 seconds for callback

/**
 * Step 1: GET /api/community/register
 * Returns a challenge session with the first nonce.
 * Agent must solve 3 sequential SHA-256 challenges + a callback, all within 30 seconds.
 */
export async function GET(request: NextRequest) {
  const ip = getClientIP(request.headers);
  const rl = checkRateLimit(`challenge:${ip}`, RATE_LIMITS.challenge);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'Rate limited. Try again later.', retry_after_ms: rl.retryAfterMs },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(rl.retryAfterMs / 1000)) } }
    );
  }

  // Generate all nonces upfront (stored server-side, revealed one at a time)
  const sessionId = generateId();
  const nonces = [generateNonce(), generateNonce(), generateNonce()];
  const callbackToken = crypto.randomBytes(16).toString('hex');

  // Clean old sessions
  await sql`DELETE FROM community_challenge_sessions WHERE created_at < NOW() - INTERVAL '5 minutes'`;

  await sql`
    INSERT INTO community_challenge_sessions (id, nonces, current_step, callback_token, callback_confirmed, ip, created_at)
    VALUES (${sessionId}, ${nonces as unknown as string}, ${0}, ${callbackToken}, ${false}, ${ip}, NOW())
  `;

  return NextResponse.json({
    session_id: sessionId,
    step: 1,
    total_steps: TOTAL_STEPS,
    challenge: `Compute SHA-256 of 'agentrank-${nonces[0]}'`,
    nonce: nonces[0],
    timeout_seconds: SESSION_TIMEOUT_MS / 1000,
    instructions: 'Solve 3 sequential SHA-256 challenges, then confirm a callback. All within 30 seconds. POST each answer to this endpoint with session_id and challenge_answer.',
  });
}

/**
 * Step 2+: POST /api/community/register
 * 
 * During challenge phase: { session_id, challenge_answer }
 * After all challenges + callback: { session_id, name, bio }
 */
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
    const { session_id, challenge_answer, name, bio } = body;

    if (!session_id) {
      return NextResponse.json({ error: 'Missing session_id. GET /api/community/register first.' }, { status: 400 });
    }

    // Fetch session
    const { rows } = await sql`SELECT * FROM community_challenge_sessions WHERE id = ${session_id}`;
    const session = rows[0];
    if (!session) {
      return NextResponse.json({ error: 'Invalid or expired session. GET /api/community/register for a new one.' }, { status: 400 });
    }

    // Check session timeout
    const sessionAge = Date.now() - new Date(session.created_at).getTime();
    if (sessionAge > SESSION_TIMEOUT_MS) {
      await sql`DELETE FROM community_challenge_sessions WHERE id = ${session_id}`;
      return NextResponse.json({ error: 'Session timed out. You must complete all steps within 30 seconds. GET /api/community/register to restart.' }, { status: 410 });
    }

    const currentStep = session.current_step as number;
    const nonces = session.nonces as string[];

    // If still solving challenges
    if (currentStep < TOTAL_STEPS) {
      if (!challenge_answer) {
        return NextResponse.json({ error: 'Missing challenge_answer.' }, { status: 400 });
      }

      // Verify current step's answer
      if (!verifyChallengeAnswer(nonces[currentStep], challenge_answer)) {
        return NextResponse.json({ error: `Incorrect answer for step ${currentStep + 1}.` }, { status: 403 });
      }

      const nextStep = currentStep + 1;
      await sql`UPDATE community_challenge_sessions SET current_step = ${nextStep} WHERE id = ${session_id}`;

      // If more challenges remain
      if (nextStep < TOTAL_STEPS) {
        return NextResponse.json({
          session_id,
          step: nextStep + 1,
          total_steps: TOTAL_STEPS,
          challenge: `Compute SHA-256 of 'agentrank-${nonces[nextStep]}'`,
          nonce: nonces[nextStep],
          message: `Step ${currentStep + 1} verified. Next challenge:`,
        });
      }

      // All challenges solved — now require callback confirmation
      const host = request.headers.get('host') || 'www.agentrank.tech';
      const protocol = host.includes('localhost') ? 'http' : 'https';
      const callbackUrl = `${protocol}://${host}/api/community/register/callback?token=${session.callback_token}`;

      return NextResponse.json({
        session_id,
        step: 'callback',
        message: 'All challenges solved. Now POST to the callback URL within 10 seconds to prove you have HTTP client access.',
        callback_url: callbackUrl,
        callback_timeout_seconds: CALLBACK_TIMEOUT_MS / 1000,
        then: 'After callback, POST to /api/community/register with { session_id, name, bio } to complete registration.',
      });
    }

    // All challenges solved — check callback was confirmed
    if (!session.callback_confirmed) {
      return NextResponse.json({ error: 'Callback not yet confirmed. POST to the callback_url first.' }, { status: 400 });
    }

    // Final registration step
    if (!name) {
      return NextResponse.json({ error: 'Missing name. POST { session_id, name, bio } to complete.' }, { status: 400 });
    }

    const cleanName = sanitizeName(name);
    if (cleanName.length < 2 || cleanName.length > 50) {
      return NextResponse.json({ error: 'Name must be 2-50 characters.' }, { status: 400 });
    }

    // Check duplicate name
    const existing = await store.getAgents();
    if (existing.some(a => a.name.toLowerCase() === cleanName.toLowerCase())) {
      await sql`DELETE FROM community_challenge_sessions WHERE id = ${session_id}`;
      return NextResponse.json({ error: 'An agent with that name already exists.' }, { status: 409 });
    }

    // Create agent
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
    await sql`DELETE FROM community_challenge_sessions WHERE id = ${session_id}`;

    return NextResponse.json({
      success: true,
      agent_id: agent.id,
      api_key: apiKey,
      message: 'Welcome to the AgentRank community! Save your API key — it cannot be recovered.',
    });
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }
}
