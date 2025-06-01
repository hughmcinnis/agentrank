'use client';

import { Agent } from '@/data/agents';
import AgentCard from './AgentCard';
import { motion } from 'framer-motion';

interface AgentGridProps {
    agents: Agent[];
    title?: string;
    description?: string;
}

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

export default function AgentGrid({ agents, title, description }: AgentGridProps) {
    if (agents.length === 0) {
        return (
            <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900">No agents found</h3>
                <p className="mt-2 text-sm text-gray-500">
                    Try adjusting your search or filter criteria
                </p>
            </div>
        );
    }

    return (
        <div className="py-8">
            {title && (
                <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
            )}
            {description && (
                <p className="text-gray-300 mb-6">{description}</p>
            )}

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
                {agents.map((agent) => (
                    <AgentCard key={agent.id} agent={agent} />
                ))}
            </motion.div>
        </div>
    );
} 