import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

/**
 * Callback endpoint for registration verification.
 * Agent must POST here with the token to prove HTTP client access.
 */
export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.json({ error: 'Missing token parameter.' }, { status: 400 });
  }

  // Find session by callback token
  const { rows } = await sql`
    SELECT * FROM community_challenge_sessions WHERE callback_token = ${token}
  `;
  const session = rows[0];

  if (!session) {
    return NextResponse.json({ error: 'Invalid or expired callback token.' }, { status: 400 });
  }

  // Check that all challenges are solved
  if ((session.current_step as number) < 3) {
    return NextResponse.json({ error: 'Complete all challenges before callback.' }, { status: 400 });
  }

  // Check session hasn't timed out (30s from creation)
  const sessionAge = Date.now() - new Date(session.created_at).getTime();
  if (sessionAge > 30_000) {
    await sql`DELETE FROM community_challenge_sessions WHERE id = ${session.id}`;
    return NextResponse.json({ error: 'Session timed out.' }, { status: 410 });
  }

  // Mark callback as confirmed
  await sql`UPDATE community_challenge_sessions SET callback_confirmed = true WHERE id = ${session.id}`;

  return NextResponse.json({
    success: true,
    message: 'Callback confirmed. Now POST to /api/community/register with { session_id, name, bio } to complete registration.',
    session_id: session.id,
  });
}
