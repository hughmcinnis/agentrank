import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { randomUUID } from 'crypto';
import path from 'path';

const SUBMISSIONS_DIR = path.join(process.cwd(), 'data');
const SUBMISSIONS_FILE = path.join(SUBMISSIONS_DIR, 'submissions.json');

// Simple in-memory rate limiting: max 5 per IP per day
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const entry = rateLimitMap.get(ip);

    if (!entry || now > entry.resetAt) {
        rateLimitMap.set(ip, { count: 1, resetAt: now + 24 * 60 * 60 * 1000 });
        return false;
    }

    if (entry.count >= 5) return true;

    entry.count++;
    return false;
}

function getSubmissions(): unknown[] {
    if (!existsSync(SUBMISSIONS_FILE)) return [];
    try {
        const raw = readFileSync(SUBMISSIONS_FILE, 'utf-8');
        return JSON.parse(raw);
    } catch {
        return [];
    }
}

function saveSubmissions(submissions: unknown[]) {
    if (!existsSync(SUBMISSIONS_DIR)) {
        mkdirSync(SUBMISSIONS_DIR, { recursive: true });
    }
    writeFileSync(SUBMISSIONS_FILE, JSON.stringify(submissions, null, 2));
}

export async function POST(request: NextRequest) {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
        request.headers.get('x-real-ip') || 'unknown';

    if (isRateLimited(ip)) {
        return NextResponse.json(
            { error: 'Too many submissions. Please try again tomorrow.' },
            { status: 429 }
        );
    }

    let body: Record<string, unknown>;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 });
    }

    const { name, url, description, categories, pricing, email, notes } = body as {
        name?: string; url?: string; description?: string; categories?: string[];
        pricing?: string; email?: string; notes?: string;
    };

    // Validate required fields
    if (!name?.trim() || !url?.trim() || !description?.trim() || !email?.trim()) {
        return NextResponse.json(
            { error: 'Name, URL, description, and email are required.' },
            { status: 400 }
        );
    }

    const submission = {
        id: randomUUID(),
        name: name.trim(),
        url: url.trim(),
        description: description.trim(),
        categories: Array.isArray(categories) ? categories : [],
        pricing: (pricing as string)?.trim() || '',
        email: email.trim(),
        notes: (notes as string)?.trim() || '',
        ip,
        timestamp: new Date().toISOString(),
        status: 'pending',
    };

    const submissions = getSubmissions();
    submissions.push(submission);
    saveSubmissions(submissions);

    return NextResponse.json({ success: true, id: submission.id });
}
