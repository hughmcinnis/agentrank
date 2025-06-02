import { getCategoryById } from '@/lib/categories';
import { Metadata } from 'next';
import { AgentCategory } from '@/lib/search';

interface Props {
    params: Promise<{
        category: string;
    }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const resolvedParams = await params;
    const categoryId = resolvedParams?.category;
    const category = getCategoryById(categoryId as AgentCategory);
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