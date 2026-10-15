import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { randomUUID } from 'crypto';
import { authenticateAdmin } from '@/lib/community/security';

const MAX_PER_IP_PER_DAY = 5;

const LIMITS = {
    name: 200,
    url: 2000,
    description: 500,
    otherCategory: 100,
    pricing: 200,
    email: 320,
    notes: 5000,
};

// Creates the table on first use so no manual migration is required.
// Same schema as scripts/migrate-add-submissions.sql.
let tableReady: Promise<void> | null = null;
function ensureTable(): Promise<void> {
    if (!tableReady) {
        tableReady = (async () => {
            await sql`
                CREATE TABLE IF NOT EXISTS submissions (
                    id TEXT PRIMARY KEY,
                    name TEXT NOT NULL,
                    url TEXT NOT NULL,
                    description TEXT NOT NULL,
                    categories JSONB NOT NULL DEFAULT '[]',
                    other_category TEXT NOT NULL DEFAULT '',
                    pricing TEXT NOT NULL DEFAULT '',
                    email TEXT NOT NULL,
                    notes TEXT NOT NULL DEFAULT '',
                    ip TEXT NOT NULL DEFAULT 'unknown',
                    status TEXT NOT NULL DEFAULT 'pending',
                    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
                )
            `;
            await sql`CREATE INDEX IF NOT EXISTS submissions_ip_created_idx ON submissions (ip, created_at)`;
        })().catch(err => {
            tableReady = null; // retry on next request
            throw err;
        });
    }
    return tableReady;
}

function clean(value: unknown, max: number): string {
    return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function getIp(request: NextRequest): string {
    return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
        request.headers.get('x-real-ip') || 'unknown';
}

export async function POST(request: NextRequest) {
    let body: Record<string, unknown>;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 });
    }

    const name = clean(body.name, LIMITS.name);
    const url = clean(body.url, LIMITS.url);
    const description = clean(body.description, LIMITS.description);
    const email = clean(body.email, LIMITS.email);
    const otherCategory = clean(body.otherCategory, LIMITS.otherCategory);
    const pricing = clean(body.pricing, LIMITS.pricing);
    const notes = clean(body.notes, LIMITS.notes);
    const categories = Array.isArray(body.categories)
        ? body.categories.filter((c): c is string => typeof c === 'string').slice(0, 20)
        : [];

    if (!name || !url || !description || !email) {
        return NextResponse.json(
            { error: 'Name, URL, description, and email are required.' },
            { status: 400 }
        );
    }

    const ip = getIp(request);

    try {
        await ensureTable();

        // Rate limit stored in the database, so it holds across serverless instances.
        const { rows } = await sql`
            SELECT COUNT(*)::int AS count FROM submissions
            WHERE ip = ${ip} AND created_at > NOW() - INTERVAL '1 day'
        `;
        if (ip !== 'unknown' && rows[0].count >= MAX_PER_IP_PER_DAY) {
            return NextResponse.json(
                { error: 'Too many submissions. Please try again tomorrow.' },
                { status: 429 }
            );
        }

        const id = randomUUID();
        await sql`
            INSERT INTO submissions
                (id, name, url, description, categories, other_category, pricing, email, notes, ip, status)
            VALUES
                (${id}, ${name}, ${url}, ${description}, ${JSON.stringify(categories)},
                 ${otherCategory}, ${pricing}, ${email}, ${notes}, ${ip}, 'awaiting_payment')
        `;

        return NextResponse.json({ success: true, id });
    } catch (err) {
        console.error('Failed to save submission', err);
        return NextResponse.json(
            { error: 'Could not save your submission. Please try again later.' },
            { status: 500 }
        );
    }
}

// List submissions (newest first). Requires header:
//   Authorization: Admin <COMMUNITY_ADMIN_SECRET>
// Optional query: ?status=awaiting_payment
// Paid submissions are matched in Stripe by the Checkout session's client_reference_id (= submission id).
export async function GET(request: NextRequest) {
    if (!authenticateAdmin(request.headers.get('authorization'))) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await ensureTable();
    const status = request.nextUrl.searchParams.get('status');
    const { rows } = status
        ? await sql`SELECT * FROM submissions WHERE status = ${status} ORDER BY created_at DESC`
        : await sql`SELECT * FROM submissions ORDER BY created_at DESC`;

    return NextResponse.json({ count: rows.length, submissions: rows });
}
