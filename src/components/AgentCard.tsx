'use client';

import Link from 'next/link';
import { Agent } from '@/data/agents';
import { getCategoryById } from '@/lib/categories';

interface Props {
    agent: Agent;
}

export default function AgentCard({ agent }: Props) {
    const getPaymentBadge = () => {
        if (!agent.paymentOptions.isPaid) {
            return {
                text: 'Free',
                classes: 'bg-green-500/20 text-green-300'
            };
        }
        if (agent.paymentOptions.hasFreeStarterPlan) {
            return {
                text: 'Free Tier',
                classes: 'bg-green-500/20 text-green-300'
            };
        }
        if (agent.paymentOptions.hasFreeTrialPeriod) {
            return {
                text: 'Free Trial',
                classes: 'bg-yellow-500/20 text-yellow-300'
            };
        }
        return {
            text: 'Paid',
            classes: 'bg-purple-500/20 text-purple-300'
        };
    };

    const paymentBadge = getPaymentBadge();

    return (
        <Link href={`/agents/${agent.slug}`}>
            <div className="group relative rounded-2xl border border-white/10 bg-gray-900/50 backdrop-blur-xl p-6 transition-all duration-300 hover:bg-gray-800/50 min-h-[240px]">
                <div className="flex items-start space-x-4">
                    {agent.logo && (
                        <div className="flex-shrink-0">
                            <img
                                src={agent.logo}
                                alt={`${agent.name} logo`}
                                className="h-12 w-12 rounded-lg object-contain"
                            />
                        </div>
                    )}
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent group-hover:from-cyan-200 group-hover:to-white transition-all duration-300">
                            {agent.name}
                        </h3>
                        <p className="mt-1 text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300 line-clamp-1 h-5">
                            {agent.tagline}
                        </p>
                    </div>
                </div>

                <p className="text-sm text-gray-500 line-clamp-3 group-hover:text-gray-400 transition-colors duration-300 mt-4">
                    {agent.description}
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${paymentBadge.classes}`}>
                        {paymentBadge.text}
                    </span>
                    {agent.categories.map(categoryId => {
                        const category = getCategoryById(categoryId);
                        return category && (
                            <span key={categoryId} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300">
                                <span className="mr-1">{category.icon}</span>
                                {category.name}
                            </span>
                        );
                    })}
                    <div className="ml-auto text-cyan-400 text-sm font-medium group-hover:translate-x-1 transition-transform duration-300">
                        Learn more →
                    </div>
                </div>
            </div>
        </Link>
    );
} 