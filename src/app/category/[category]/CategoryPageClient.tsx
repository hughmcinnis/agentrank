'use client';

import { useState } from 'react';
import { filterAgentsByCategory } from '@/lib/search';
import AgentGrid from '@/components/AgentGrid';
import { Category } from '@/lib/categories';
import GradientBackground from '@/components/GradientBackground';
import Link from 'next/link';
import { agents as allAgentsData } from '@/data/agents';

interface Props {
    category: Category;
}

export default function CategoryPageClient({ category }: Props) {
    const [filterOption, setFilterOption] = useState<'all' | 'freeTier' | 'freeTrial'>('all');
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const allAgents = filterAgentsByCategory(category.id);
    const agents = filterOption === 'all'
        ? allAgents
        : allAgents.filter(agent =>
            filterOption === 'freeTier'
                ? !agent.paymentOptions.isPaid || agent.paymentOptions.hasFreeStarterPlan
                : agent.paymentOptions.hasFreeTrialPeriod
        );

    // Get top pick agents
    const topPickAgents = category.topPicks
        .map(slug => allAgentsData.find(a => a.slug === slug))
        .filter(Boolean);

    return (
        <GradientBackground theme="light">
            <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <div className="flex justify-center mb-6">
                        <span className="text-6xl opacity-90">{category.icon}</span>
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent sm:text-5xl mb-6">
                        Best {category.name} AI Agents in 2026
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        {category.description}
                    </p>
                </div>

                {/* Long Description Section */}
                <div className="mb-16 max-w-4xl mx-auto">
                    <div className="bg-gray-800/30 backdrop-blur-xl rounded-2xl border border-white/10 p-8 lg:p-10">
                        <div className="prose prose-invert prose-lg max-w-none">
                            {category.longDescription.split('\n\n').map((paragraph, i) => (
                                <p key={i} className="text-gray-300 leading-relaxed mb-4 last:mb-0">
                                    {paragraph.trim()}
                                </p>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Key Features Section */}
                <div className="mb-16 max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold text-white mb-8 text-center">
                        Key Features to Look For in {category.name} AI Agents
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                        {category.keyFeatures.map((feature, i) => (
                            <div
                                key={i}
                                className="flex items-start gap-3 bg-gray-800/30 backdrop-blur-xl rounded-xl border border-white/10 p-4"
                            >
                                <span className="text-cyan-400 mt-0.5 shrink-0">✓</span>
                                <span className="text-gray-300">{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Picks Section */}
                {topPickAgents.length > 0 && (
                    <div className="mb-16 max-w-4xl mx-auto">
                        <h2 className="text-2xl font-bold text-white mb-8 text-center">
                            Our Top {category.name} AI Agent Picks
                        </h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            {topPickAgents.map((agent, i) => agent && (
                                <Link
                                    key={agent.slug}
                                    href={`/agents/${agent.slug}`}
                                    className="group bg-gray-800/40 backdrop-blur-xl rounded-xl border border-white/10 p-6 hover:border-cyan-500/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(34,211,238,0.1)]"
                                >
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="text-cyan-400 text-sm font-bold">#{i + 1}</span>
                                        {agent.logo && (
                                            <img
                                                src={agent.logo}
                                                alt={agent.name}
                                                className="w-8 h-8 rounded-lg object-contain"
                                            />
                                        )}
                                        <h3 className="text-white font-semibold group-hover:text-cyan-300 transition-colors">
                                            {agent.name}
                                        </h3>
                                    </div>
                                    <p className="text-gray-400 text-sm mb-3">{agent.tagline}</p>
                                    <p className="text-gray-500 text-xs">{agent.pricing.split(',')[0]}</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Filter Toggle + Agent Grid */}
                <div className="mb-8 text-center">
                    <h2 className="text-2xl font-bold text-white mb-8">
                        All {category.name} AI Agents
                    </h2>
                    <div className="inline-flex items-center bg-gray-800/50 rounded-full p-1 backdrop-blur-xl border border-white/10">
                        <button
                            onClick={() => setFilterOption('all')}
                            className={`px-6 py-2 text-sm font-medium rounded-full transition-all duration-300 ${filterOption === 'all'
                                    ? 'bg-cyan-500/20 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.1)]'
                                    : 'text-gray-400 hover:text-gray-300'
                                }`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setFilterOption('freeTier')}
                            className={`px-6 py-2 text-sm font-medium rounded-full transition-all duration-300 ${filterOption === 'freeTier'
                                    ? 'bg-cyan-500/20 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.1)]'
                                    : 'text-gray-400 hover:text-gray-300'
                                }`}
                        >
                            Free Tier
                        </button>
                        <button
                            onClick={() => setFilterOption('freeTrial')}
                            className={`px-6 py-2 text-sm font-medium rounded-full transition-all duration-300 ${filterOption === 'freeTrial'
                                    ? 'bg-cyan-500/20 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.1)]'
                                    : 'text-gray-400 hover:text-gray-300'
                                }`}
                        >
                            Free Trial
                        </button>
                    </div>
                </div>

                <div className="relative mb-16">
                    <div className="absolute -top-10 left-10 w-32 h-32 bg-cyan-500/20 rounded-full blur-3xl" />
                    <div className="absolute -bottom-8 right-10 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl" />
                    <div className="relative">
                        <AgentGrid
                            agents={agents}
                            description={`Showing ${agents.length} ${filterOption !== 'all' ? (filterOption === 'freeTier' ? 'free tier ' : 'free trial ') : ''}${category.name.toLowerCase()} AI agents`}
                        />
                    </div>
                </div>

                {/* FAQ Section */}
                {category.faq.length > 0 && (
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-2xl font-bold text-white mb-8 text-center">
                            Frequently Asked Questions About {category.name} AI Agents
                        </h2>
                        <div className="space-y-3">
                            {category.faq.map((item, i) => (
                                <div
                                    key={i}
                                    className="bg-gray-800/30 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden"
                                >
                                    <button
                                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                        className="w-full text-left px-6 py-4 flex items-center justify-between gap-4 hover:bg-gray-800/50 transition-colors"
                                    >
                                        <h3 className="text-white font-medium">{item.question}</h3>
                                        <span className={`text-cyan-400 shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`}>
                                            ▼
                                        </span>
                                    </button>
                                    {openFaq === i && (
                                        <div className="px-6 pb-4">
                                            <p className="text-gray-400 leading-relaxed">{item.answer}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </GradientBackground>
    );
}
