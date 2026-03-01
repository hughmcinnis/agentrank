import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getCategoryById, categories } from '@/lib/categories';
import CategoryPageClient from './CategoryPageClient';
import { AgentCategory } from '@/lib/search';

interface Props {
    params: Promise<{
        category: string;
    }>;
}

export async function generateStaticParams() {
    return categories.map((category) => ({
        category: category.id,
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const resolvedParams = await params;
    const category = getCategoryById(resolvedParams.category as AgentCategory);

    if (!category) {
        return { title: 'Category Not Found' };
    }

    return {
        title: category.metaTitle,
        description: category.metaDescription,
        alternates: {
            canonical: `https://www.agentrank.tech/category/${category.id}`,
        },
        openGraph: {
            title: category.metaTitle,
            description: category.metaDescription,
            url: `https://www.agentrank.tech/category/${category.id}`,
            type: 'website',
        },
    };
}

export default async function CategoryPage({ params }: Props) {
    const resolvedParams = await params;
    const categoryId = resolvedParams?.category;
    const category = getCategoryById(categoryId as AgentCategory);

    if (!category) {
        notFound();
    }

    // JSON-LD FAQPage structured data
    const faqJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: category.faq.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer,
            },
        })),
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
            />
            <CategoryPageClient category={category} />
        </>
    );
}
