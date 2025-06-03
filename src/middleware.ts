import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { submitToIndexNow } from './lib/indexnow';

// Keep track of recently submitted URLs to avoid duplicate submissions
const submittedUrls = new Set<string>();
const SUBMISSION_COOLDOWN = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export async function middleware(request: NextRequest) {
    // Only process GET requests
    if (request.method !== 'GET') {
        return NextResponse.next();
    }

    const url = request.url;

    // Skip API routes, static files, and non-HTML requests
    if (
        url.includes('/api/') ||
        url.includes('/_next/') ||
        url.includes('/favicon.ico') ||
        url.includes('.txt') ||
        url.includes('.xml') ||
        url.includes('.json')
    ) {
        return NextResponse.next();
    }

    // Submit URL in the background without affecting the response time
    if (!submittedUrls.has(url)) {
        submittedUrls.add(url);

        // Remove URL from set after cooldown period
        setTimeout(() => {
            submittedUrls.delete(url);
        }, SUBMISSION_COOLDOWN);

        // Submit URL in the background
        submitToIndexNow(url).catch((error) => {
            console.error('Failed to submit URL to IndexNow:', error);
        });
    }

    return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * 1. /api/ (API routes)
         * 2. /_next/ (Next.js internals)
         * 3. /_static (static files)
         * 4. /_vercel (Vercel internals)
         * 5. /favicon.ico, /sitemap.xml (static files)
         */
        '/((?!api|_next|_static|_vercel|favicon.ico|sitemap.xml).*)',
    ],
}; 