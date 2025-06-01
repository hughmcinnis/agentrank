import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

export function truncate(str: string, length: number): string {
    if (str.length <= length) return str;
    return str.slice(0, length) + '...';
}

export function generateMetadata(title: string, description: string) {
    return {
        title: title ? `${title} | Agent Rank` : 'Agent Rank - Discover the Best AI Agents',
        description: description || 'Find and compare the best AI agents for your business needs. A curated directory of AI-powered tools and assistants.',
        openGraph: {
            title: title ? `${title} | Agent Rank` : 'Agent Rank - Discover the Best AI Agents',
            description: description || 'Find and compare the best AI agents for your business needs. A curated directory of AI-powered tools and assistants.',
            type: 'website',
            locale: 'en_US',
            siteName: 'Agent Rank'
        },
        twitter: {
            card: 'summary_large_image',
            title: title ? `${title} | Agent Rank` : 'Agent Rank - Discover the Best AI Agents',
            description: description || 'Find and compare the best AI agents for your business needs. A curated directory of AI-powered tools and assistants.'
        }
    };
} 