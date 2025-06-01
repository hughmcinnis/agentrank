'use client';

import { useState } from 'react';
import { filterAgentsByCategory } from '@/lib/search';
import AgentGrid from '@/components/AgentGrid';
import { Category } from '@/lib/categories';
import GradientBackground from '@/components/GradientBackground';

interface Props {
    category: Category;
}

export default function CategoryPageClient({ category }: Props) {
    const [filterOption, setFilterOption] = useState<'all' | 'freeTier' | 'freeTrial'>('all');
    const allAgents = filterAgentsByCategory(category.id);
    const agents = filterOption === 'all'
        ? allAgents
        : allAgents.filter(agent =>
            filterOption === 'freeTier'
                ? !agent.paymentOptions.isPaid || agent.paymentOptions.hasFreeStarterPlan
                : agent.paymentOptions.hasFreeTrialPeriod
        );

    return (
        <GradientBackground theme="light">
            <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24">
                <div className="text-center mb-16">
                    <div className="flex justify-center mb-6">
                        <span className="text-6xl opacity-90">{category.icon}</span>
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent sm:text-5xl mb-6">
                        {category.name} AI Agents
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12">
                        {category.description}
                    </p>

                    {/* Filter Toggle */}
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

                <div className="relative">
                    {/* Decorative elements */}
                    <div className="absolute -top-10 left-10 w-32 h-32 bg-cyan-500/20 rounded-full blur-3xl" />
                    <div className="absolute -bottom-8 right-10 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl" />

                    {/* Content */}
                    <div className="relative">
                        <AgentGrid
                            agents={agents}
                            description={`Showing ${agents.length} ${filterOption !== 'all' ? (filterOption === 'freeTier' ? 'free tier ' : 'free trial ') : ''}${category.name.toLowerCase()} AI agents`}
                        />
                    </div>
                </div>
            </div>
        </GradientBackground>
    );
} 