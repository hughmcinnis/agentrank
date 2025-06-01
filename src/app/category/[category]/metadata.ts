import { getCategoryById } from '@/lib/categories';
import { Metadata } from 'next';

interface Props {
    params: {
        category: string;
    };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const categoryId = params?.category;
    const category = getCategoryById(categoryId);
    if (!category) return {};

    return {
        title: `${category.name} AI Agents | Agent Rank`,
        description: `Discover the best ${category.name.toLowerCase()} AI agents. ${category.description}`,
        openGraph: {
            title: `${category.name} AI Agents | Agent Rank`,
            description: `Discover the best ${category.name.toLowerCase()} AI agents. ${category.description}`,
            type: 'website'
        },
        twitter: {
            card: 'summary_large_image',
            title: `${category.name} AI Agents | Agent Rank`,
            description: `Discover the best ${category.name.toLowerCase()} AI agents. ${category.description}`
        }
    };
} 