import { useCallback } from 'react';
import { submitToIndexNow } from '@/lib/indexnow';

export function useIndexNow() {
    const submitUrl = useCallback(async (path: string) => {
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ||
            (typeof window !== 'undefined' ? window.location.origin : '');

        // Convert path to full URL if it's not already
        const fullUrl = path.startsWith('http')
            ? path
            : `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;

        try {
            const success = await submitToIndexNow(fullUrl);
            if (!success) {
                console.error('Failed to submit URL to IndexNow:', fullUrl);
            }
            return success;
        } catch (error) {
            console.error('Error submitting URL to IndexNow:', error);
            return false;
        }
    }, []);

    return { submitUrl };
} 