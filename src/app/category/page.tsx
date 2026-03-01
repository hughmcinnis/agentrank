import { Metadata } from 'next';
import Link from 'next/link';
import { categories } from '@/lib/categories';
import { filterAgentsByCategory } from '@/lib/search';
import GradientBackground from '@/components/GradientBackground';

export const metadata: Metadata = {
    title: 'AI Agent Categories — Browse All Types of AI Agents | AgentRank',
    description: 'Explore 20 categories of AI agents including coding, writing, sales, marketing, data analysis, and more. Find the perfect AI agent for your needs.',
    alternates: {
        canonical: 'https://www.agentrank.tech/category',
    },
    openGraph: {
        title: 'AI Agent Categories — Browse All Types of AI Agents | AgentRank',
        description: 'Explore 20 categories of AI agents including coding, writing, sales, marketing, data analysis, and more.',
        url: 'https://www.agentrank.tech/category',
        type: 'website',
    },
};

export default function CategoriesPage() {
    return (
        <GradientBackground theme="light">
            <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent sm:text-5xl mb-6">
                        AI Agent Categories
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Browse {categories.length} categories of AI agents to find the perfect tool for your workflow. Each category features curated reviews, comparisons, and recommendations.
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {categories.map((category) => {
                        const agentCount = filterAgentsByCategory(category.id).length;
                        return (
                            <Link
                                key={category.id}
                                href={`/category/${category.id}`}
                                className="group bg-gray-800/30 backdrop-blur-xl rounded-xl border border-white/10 p-6 hover:border-cyan-500/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(34,211,238,0.1)]"
                            >
                                <div className="text-4xl mb-4">{category.icon}</div>
                                <h2 className="text-lg font-semibold text-white group-hover:text-cyan-300 transition-colors mb-2">
                                    {category.name}
                                </h2>
                                <p className="text-gray-400 text-sm mb-3">{category.description}</p>
                                <span className="text-cyan-400/70 text-xs font-medium">
                                    {agentCount} agent{agentCount !== 1 ? 's' : ''} →
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </GradientBackground>
    );
}
