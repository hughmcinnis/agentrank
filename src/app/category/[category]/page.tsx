import { notFound } from 'next/navigation';
import { getCategoryById } from '@/lib/categories';
import CategoryPageClient from './CategoryPageClient';

interface Props {
    params: {
        category: string;
    };
}

export default function CategoryPage({ params }: Props) {
    const categoryId = params?.category;
    const category = getCategoryById(categoryId);

    if (!category) {
        notFound();
    }

    return <CategoryPageClient category={category} />;
} 