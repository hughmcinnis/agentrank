'use client';

import Link from 'next/link';
import { Agent } from '@/data/agents';
import { getCategoryById } from '@/lib/categories';
import Image from 'next/image';

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

    const truncateDescription = (text: string, maxLength: number = 150) => {
        if (text.length <= maxLength) return text;
        return text.slice(0, maxLength).trim() + '...';
    };

    const paymentBadge = getPaymentBadge();

    return (
        <Link href={`/agents/${agent.slug}`}>
            <div className="group relative rounded-2xl border border-white/10 bg-gray-900/50 backdrop-blur-xl p-4 transition-all duration-300 hover:bg-gray-800/50 min-h-[160px] sm:min-h-[240px] flex flex-col justify-center items-center">
                <div className="w-full max-w-[90%] flex items-start space-x-3">
                    {agent.logo && (
                        <div className="flex-shrink-0">
                            <Image
                                src={agent.logo}
                                alt={`${agent.name} logo`}
                                width={48}
                                height={48}
                                className="w-12 h-12 rounded-lg object-contain"
                            />
                        </div>
                    )}
                    <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent group-hover:from-cyan-200 group-hover:to-white transition-all duration-300 truncate">
                            {agent.name}
                        </h3>
                        <p className="mt-1 text-xs sm:text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300 line-clamp-1">
                            {agent.tagline}
                        </p>
                    </div>
                    <div className="flex-shrink-0 ml-2">
                        <div className="w-6 h-6 rounded-full bg-gray-800/50 flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-gray-400 group-hover:text-cyan-400 transition-colors duration-300">
                                <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                </div>

                <p className="mt-3 text-sm text-gray-500 line-clamp-3 group-hover:text-gray-400 transition-colors duration-300 hidden sm:block w-full max-w-[90%] text-center">
                    {truncateDescription(agent.description)}
                </p>

                <div className="mt-2 flex flex-wrap items-center justify-center gap-1.5 w-full max-w-[90%]">
                    {agent.categories.map(categoryId => {
                        const category = getCategoryById(categoryId);
                        return category && (
                            <span key={categoryId} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300">
                                <span className="mr-1">{category.icon}</span>
                                <span className="hidden sm:inline">{category.name}</span>
                            </span>
                        );
                    })}
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${paymentBadge.classes}`}>
                        {paymentBadge.text}
                    </span>
                </div>
            </div>
        </Link>
    );
} 