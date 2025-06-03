export async function submitToIndexNow(url: string) {
    const baseUrl = process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    try {
        const response = await fetch(`${baseUrl}/api/indexnow`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url }),
        });

        if (!response.ok) {
            console.error('Failed to submit URL to IndexNow:', await response.text());
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error submitting URL to IndexNow:', error);
        return false;
    }
} 