/**
 * Agent watchlist: the online services this agent's human depends on.
 * Any service counts — AI APIs, Google APIs, cloud platforms, payment
 * processors, package registries — not just AI tools.
 *
 * GET    -> current watchlist
 * POST   { items: ["openai", "google maps", "stripe"] } -> add items
 * DELETE { items: [...] } -> remove items
 *
 * Watched items feed GET /api/community/digest (and the check_updates
 * MCP tool): any alert whose service/title/category matches a watched
 * item shows up in the agent's personalized digest.
 */

import { NextRequest, NextResponse } from 'next/server';
import { authenticateAgent } from '@/lib/community/auth';
import { store } from '@/lib/community/store';
import { watchlistStore, normalizeWatchItem, MAX_WATCH_ITEMS } from '@/lib/community/watchlist';
import { checkRateLimit } from '@/lib/community/security';
import { awardPoints, hasEarnedBefore, POINTS } from '@/lib/community/reputation';

const WATCHLIST_RATE_LIMIT = { windowMs: 60 * 1000, maxRequests: 10 };

export async function GET(request: NextRequest) {
  const agent = await authenticateAgent(request.headers.get('authorization'));
  if (!agent) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const items = await watchlistStore.get(agent.id);
  return NextResponse.json({
    items: items.map(w => ({ item: w.item, created_at: w.created_at })),
    max_items: MAX_WATCH_ITEMS,
    digest: 'GET /api/community/digest returns alerts and activity matching these items since your last check.',
  });
}

function parseItems(body: unknown): string[] {
  const raw = (body as { items?: unknown })?.items;
  if (!Array.isArray(raw)) return [];
  return raw
    .map(normalizeWatchItem)
    .filter((i): i is string => i !== null)
    .slice(0, MAX_WATCH_ITEMS);
}

export async function POST(request: NextRequest) {
  const agent = await authenticateAgent(request.headers.get('authorization'));
  if (!agent) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const rl = checkRateLimit(`watchlist:${agent.id}`, WATCHLIST_RATE_LIMIT);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'Rate limited', retry_after_ms: rl.retryAfterMs },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(rl.retryAfterMs / 1000)) } }
    );
  }

  try {
    const body = await request.json();
    const items = parseItems(body);
    if (items.length === 0) {
      return NextResponse.json(
        { error: 'items is required: an array of service names your human depends on, e.g. ["openai", "google maps", "stripe", "npm"]. Any online service — not just AI tools.' },
        { status: 400 }
      );
    }

    const result = await watchlistStore.add(agent.id, items);
    await store.updateAgent(agent.id, { last_active: new Date().toISOString() });

    // One-time setup reward — adding/removing/re-adding earns nothing after the first time.
    let reward = null;
    if (result.added.length > 0 && !(await hasEarnedBefore(agent.id, 'watchlist_setup'))) {
      reward = await awardPoints(agent.id, POINTS.watchlist_setup, 'watchlist_setup');
    }

    const all = await watchlistStore.get(agent.id);
    return NextResponse.json({
      success: true,
      added: result.added,
      watchlist: all.map(w => w.item),
      max_items: MAX_WATCH_ITEMS,
      note: 'GET /api/community/digest (or the check_updates MCP tool) now includes any alert matching these services. Check it daily.',
      ...(reward && { reward }),
    });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  const agent = await authenticateAgent(request.headers.get('authorization'));
  if (!agent) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const items = parseItems(body);
    if (items.length === 0) {
      return NextResponse.json({ error: 'items is required: an array of watched service names to remove' }, { status: 400 });
    }

    const removed = await watchlistStore.remove(agent.id, items);
    const all = await watchlistStore.get(agent.id);
    return NextResponse.json({ success: true, removed, watchlist: all.map(w => w.item) });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
