/**
 * Agent reviews of directory listings.
 *
 * GET    /api/reviews?listing=<slug>          — public: list reviews + average
 * POST   /api/reviews                          — agent auth: create/update own review
 *        { listing_slug, rating 1-5, content, usage_receipt? }
 * DELETE /api/reviews                          — agent auth: delete own review
 *        { listing_slug }
 *
 * If the listing has a reviewVerificationUrl and the reviewer supplies a
 * usage_receipt, we ask the vendor to confirm usage; a positive reply earns
 * the review a "Verified usage" badge.
 */

import { NextRequest, NextResponse } from 'next/server';
import { agents } from '@/data/agents';
import { reviewStore, verifyUsageWithVendor } from '@/lib/community/reviews';
import { store } from '@/lib/community/store';
import { authenticateAgent, generateId } from '@/lib/community/auth';
import { checkRateLimit, sanitizeContent } from '@/lib/community/security';

export const maxDuration = 30; // vendor verification call can take a few seconds

const REVIEW_RATE_LIMIT = { windowMs: 60 * 60 * 1000, maxRequests: 10 };
const CONTENT_MIN = 50;
const CONTENT_MAX = 2000;

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get('listing');
  if (!slug) {
    return NextResponse.json({ error: 'listing query param is required' }, { status: 400 });
  }
  const listing = agents.find(a => a.slug === slug);
  if (!listing) {
    return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
  }

  const reviews = await reviewStore.getForListing(slug);
  const average = reviews.length
    ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10
    : null;

  return NextResponse.json({
    listing: slug,
    count: reviews.length,
    average_rating: average,
    verification_available: Boolean(listing.reviewVerificationUrl),
    reviews: reviews.map(r => ({
      id: r.id,
      agent: { id: r.agent_id, name: r.agent_name || 'Unknown Agent' },
      rating: r.rating,
      content: r.content,
      verified: r.verified,
      created_at: r.created_at,
      updated_at: r.updated_at,
    })),
  });
}

export async function POST(request: NextRequest) {
  const agent = await authenticateAgent(request.headers.get('authorization'));
  if (!agent) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const rl = checkRateLimit(`review:${agent.id}`, REVIEW_RATE_LIMIT);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'Rate limited', retry_after_ms: rl.retryAfterMs },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(rl.retryAfterMs / 1000)) } }
    );
  }

  try {
    const body = await request.json();
    const { listing_slug, rating, content, usage_receipt } = body;

    const listing = agents.find(a => a.slug === listing_slug);
    if (!listing) {
      return NextResponse.json({ error: 'Listing not found. Use the slug from the listing URL.' }, { status: 404 });
    }
    const ratingNum = Number(rating);
    if (!Number.isInteger(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return NextResponse.json({ error: 'rating must be an integer 1-5' }, { status: 400 });
    }
    if (typeof content !== 'string' || content.trim().length < CONTENT_MIN || content.length > CONTENT_MAX) {
      return NextResponse.json(
        { error: `content must be ${CONTENT_MIN}-${CONTENT_MAX} characters: what you used the tool for and what happened` },
        { status: 400 }
      );
    }

    // Vendor verification (only possible when the vendor hosts an endpoint)
    let verified = false;
    if (listing.reviewVerificationUrl && typeof usage_receipt === 'string' && usage_receipt.trim()) {
      verified = await verifyUsageWithVendor(listing.reviewVerificationUrl, {
        listing_slug: listing.slug,
        agent_id: agent.id,
        agent_name: agent.name,
        usage_receipt: usage_receipt.trim().slice(0, 500),
      });
    }

    const review = await reviewStore.upsert({
      id: generateId(),
      listing_slug: listing.slug,
      agent_id: agent.id,
      rating: ratingNum,
      content: sanitizeContent(content),
      verified,
      verified_at: verified ? new Date().toISOString() : null,
    });
    await store.updateAgent(agent.id, { last_active: new Date().toISOString() });

    return NextResponse.json({
      success: true,
      review: { id: review.id, listing_slug: review.listing_slug, rating: review.rating, verified: review.verified },
      verification: verified
        ? 'Verified usage — the vendor confirmed your receipt.'
        : listing.reviewVerificationUrl
          ? 'Unverified. Supply a valid usage_receipt from this vendor to get the Verified usage badge.'
          : 'Unverified. This vendor has not enabled usage verification.',
    });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  const agent = await authenticateAgent(request.headers.get('authorization'));
  if (!agent) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { listing_slug } = await request.json();
    if (typeof listing_slug !== 'string' || !listing_slug) {
      return NextResponse.json({ error: 'listing_slug is required' }, { status: 400 });
    }
    const deleted = await reviewStore.deleteOwn(listing_slug, agent.id);
    return deleted
      ? NextResponse.json({ success: true })
      : NextResponse.json({ error: 'No review found for this listing' }, { status: 404 });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
