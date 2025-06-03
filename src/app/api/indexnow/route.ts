import { NextResponse } from 'next/server';

const INDEXNOW_KEY = '80cd11cf3a544e6593c65a4c3e9c4a68';
const SEARCH_ENGINES = [
    'https://www.bing.com/indexnow',
    'https://api.indexnow.org/indexnow',
];

async function submitUrl(url: string) {
    const baseUrl = process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    const payload = {
        host: new URL(baseUrl).host,
        key: INDEXNOW_KEY,
        urlList: [url],
        keyLocation: `${baseUrl}/${INDEXNOW_KEY}.txt`,
    };

    const results = await Promise.all(
        SEARCH_ENGINES.map((endpoint) =>
            fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            })
        )
    );

    return results.every((res) => res.ok);
}

export async function POST(request: Request) {
    try {
        const { url } = await request.json();

        if (!url) {
            return NextResponse.json(
                { error: 'URL is required' },
                { status: 400 }
            );
        }

        const success = await submitUrl(url);

        if (success) {
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json(
                { error: 'Failed to submit to IndexNow' },
                { status: 500 }
            );
        }
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Internal server error';
        console.error('Error in IndexNow API:', errorMessage);
        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
} 