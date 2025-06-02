import { notFound } from 'next/navigation';
import { getCategoryById } from '@/lib/categories';
import CategoryPageClient from './CategoryPageClient';
import { AgentCategory } from '@/lib/search';

interface Props {
    params: Promise<{
        category: string;
    }>;
}

export default async function CategoryPage({ params }: Props) {
    const resolvedParams = await params;
    const categoryId = resolvedParams?.category;
    const category = getCategoryById(categoryId as AgentCategory);

    if (!category) {
        notFound();
    }

    return <CategoryPageClient category={category} />;
} 