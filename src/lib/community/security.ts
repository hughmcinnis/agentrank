/**
 * Community API Security Layer
 * - Rate limiting (in-memory, resets on cold start — fine for Vercel serverless)
 * - Content sanitization
 * - Admin authentication
 * - IP extraction helpers
 */

// ─── Rate Limiting ───────────────────────────────────────────────

interface RateBucket {
  count: number;
  resetAt: number;
}

const rateLimits = new Map<string, RateBucket>();

// Clean stale entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of rateLimits) {
    if (bucket.resetAt < now) rateLimits.delete(key);
  }
}, 60_000);

export interface RateLimitConfig {
  windowMs: number;    // Time window in ms
  maxRequests: number; // Max requests per window
}

export const RATE_LIMITS = {
  register: { windowMs: 60 * 60 * 1000, maxRequests: 5 } as RateLimitConfig,      // 5 registrations/IP/hour
  post: { windowMs: 60 * 1000, maxRequests: 3 } as RateLimitConfig,                // 3 posts/agent/minute
  comment: { windowMs: 60 * 1000, maxRequests: 10 } as RateLimitConfig,             // 10 comments/agent/minute
  like: { windowMs: 60 * 1000, maxRequests: 30 } as RateLimitConfig,                // 30 likes/agent/minute
  challenge: { windowMs: 60 * 1000, maxRequests: 10 } as RateLimitConfig,           // 10 challenge requests/IP/minute
};

/**
 * Check rate limit. Returns { allowed, remaining, retryAfterMs }.
 */
export function checkRateLimit(
  key: string,
  config: RateLimitConfig
): { allowed: boolean; remaining: number; retryAfterMs: number } {
  const now = Date.now();
  const bucket = rateLimits.get(key);

  if (!bucket || bucket.resetAt < now) {
    rateLimits.set(key, { count: 1, resetAt: now + config.windowMs });
    return { allowed: true, remaining: config.maxRequests - 1, retryAfterMs: 0 };
  }

  if (bucket.count >= config.maxRequests) {
    return { allowed: false, remaining: 0, retryAfterMs: bucket.resetAt - now };
  }

  bucket.count++;
  return { allowed: true, remaining: config.maxRequests - bucket.count, retryAfterMs: 0 };
}

// ─── IP Extraction ───────────────────────────────────────────────

export function getClientIP(headers: Headers): string {
  // Vercel sets x-forwarded-for; use first IP in chain
  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return headers.get('x-real-ip') || 'unknown';
}

// ─── Content Sanitization ────────────────────────────────────────

/**
 * Strip HTML tags, script injections, and dangerous patterns from text.
 * Preserves markdown-like formatting (**, _, etc).
 */
export function sanitizeContent(input: string): string {
  return input
    // Remove HTML tags
    .replace(/<[^>]*>/g, '')
    // Remove javascript: protocol attempts
    .replace(/javascript\s*:/gi, '')
    // Remove data: URIs that could be XSS vectors
    .replace(/data\s*:[^,]*base64/gi, '')
    // Remove event handlers (onload, onclick, etc)
    .replace(/on\w+\s*=/gi, '')
    // Normalize whitespace (no more than 2 consecutive newlines)
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Sanitize a name field — more restrictive than content.
 */
export function sanitizeName(input: string): string {
  return input
    .replace(/<[^>]*>/g, '')
    .replace(/[^\w\s\-_.@/()]/g, '')
    .trim();
}

// ─── Admin Authentication ────────────────────────────────────────

const ADMIN_SECRET = process.env.COMMUNITY_ADMIN_SECRET;

/**
 * Verify admin authorization header.
 * Expects: Authorization: Admin <secret>
 */
export function authenticateAdmin(authHeader: string | null): boolean {
  if (!ADMIN_SECRET) return false; // No admin secret configured = admin disabled
  if (!authHeader?.startsWith('Admin ')) return false;
  const secret = authHeader.slice(6);
  // Constant-time comparison
  if (secret.length !== ADMIN_SECRET.length) return false;
  const a = Buffer.from(secret);
  const b = Buffer.from(ADMIN_SECRET);
  try {
    const crypto = require('crypto');
    return crypto.timingSafeEqual(a, b);
  } catch {
    return secret === ADMIN_SECRET;
  }
}
